#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import sys
import rospy
import rospkg
from math import cos,sin,pi,sqrt,pow,atan2
from geometry_msgs.msg import Point,PoseWithCovarianceStamped
from nav_msgs.msg import Odometry,Path
from morai_msgs.msg import CtrlCmd,EgoVehicleStatus,ObjectStatusList, GetTrafficLightStatus
import numpy as np
import tf
from tf.transformations import euler_from_quaternion,quaternion_from_euler
from morai_msgs.msg import global_data
from lib.mgeo.class_defs import *

class pure_pursuit :
    def __init__(self):
        rospy.init_node('pure_pursuit', anonymous=True)

        # 1. 링크셋, 노드셋 
        current_path = os.path.dirname(os.path.realpath(__file__))
        sys.path.append(current_path)
        load_path = os.path.normpath(os.path.join(current_path, 'lib/mgeo_data/R_KR_PG_K-City'))
        mgeo_planner_map = MGeo.create_instance_from_json(load_path)
        node_set = mgeo_planner_map.node_set
        link_set = mgeo_planner_map.link_set
        self.nodes=node_set.nodes
        self.links=link_set.lines
                

        self.ctrl_cmd_pub = rospy.Publisher("/ctrl_cmd", CtrlCmd, queue_size=1)


        self.ctrl_cmd_msg = CtrlCmd()
        self.ctrl_cmd_msg.longlCmdType = 1

        self.is_path = False
        self.is_odom = False
        self.is_status = False
        self.is_global_path = False

        self.is_look_forward_point = False

        self.forward_point = Point()
        self.possible_link_direction = [] # 지금 지나갈 수 있는 링크 속성 (직진, 좌회전, 우회전)


        self.vehicle_length = 2.6
        self.lfd = 12
        self.min_lfd = 8
        self.max_lfd = 30
        self.lfd_gain = 0.78 # 0.78
        self.target_velocity = 60

        self.current_postion = Point()

        rospy.Subscriber("/global_path", Path, self.global_path_callback)
        rospy.Subscriber("/local_path", Path, self.path_callback)
        rospy.Subscriber("/odom", Odometry, self.odom_callback)
        rospy.Subscriber("/Ego_topic", EgoVehicleStatus, self.status_callback)
        rospy.Subscriber("/Object_topic", ObjectStatusList, self.object_info_callback)

        # 글로벌 데이터 받기
        rospy.Subscriber("/global_data", global_data, self.global_data_callback)

        # 현재 신호등 정보 받기
        rospy.Subscriber("/GetTrafficLightStatus", GetTrafficLightStatus, self.traffic_light_callback)

        
        

        # pid, acc, 곡률주행 클래스 생성 및 초기화
        self.pid = pidControl()
        self.adaptive_cruise_control = AdaptiveCruiseControl(velocity_gain = 0.5, distance_gain = 1, time_gap = 0.8, vehicle_length = 2.7, current_postion = self.current_postion)
        self.vel_planning = velocityPlanning(self.target_velocity/3.6, 0.15)

        while True:
            if self.is_global_path == True:
                # 전체 주행을 살펴봐서 곡률이 있는 경로가 있다면 속도를 낮춘 
                self.velocity_list = self.vel_planning.curvedBaseVelocity(self.global_path, 50)
                break
            else:
                rospy.loginfo('Waiting global path data')


        rate = rospy.Rate(30) # 30hz
        while not rospy.is_shutdown():
            # print(self.is_path, self.is_odom, self.is_status)
            if self.is_path == True and self.is_odom == True and self.is_status == True:
                # global_obj,local_obj
                #print(self.object_data)
                result = self.calc_vaild_obj([self.current_postion.x, self.current_postion.y, self.vehicle_yaw], self.object_data)
                
                global_npc_info = result[0] 
                local_npc_info = result[1] 
                global_ped_info = result[2] 
                local_ped_info = result[3] 
                global_obs_info = result[4]
                local_obs_info = result[5]
                #--------------------------------------------------------------------------------
                local_traffic_info = []
                self.traffic_flag = 0
                #--------------------------------------------------------------------------------
                # 1. 차량 전방, 가장 가까운 노드 찾기
                # 차가 있는 현재 링크 찾기
                current_link = None
                dis = float('inf')

                flag = 0
                for link_idx in self.global_data.links_idx:
                    for x, y, _ in self.links[link_idx].points:
                        temp = ((self.current_postion.x - x)**2 + (self.current_postion.y - y)**2)**0.5
                        
                        if temp < dis:
                            dis = temp
                            current_link = link_idx
                        if temp < 5: # 특정 링크의 한 point와 거리가 5 미만으로 가까우면, 그 링크위에 차가 있다고 봄
                            flag = 1
                            break
                    if flag:
                        break
                forward_shortest_node = self.links[current_link].get_to_node() # 차량 전방, 가장 가까운 노드
                #print(forward_shortest_node.is_on_stop_line())
                # 2. 1번에서 찾은 노드가 정지선 == ture 이면 현재 신호와 차량의 향후 진행 링크 비교한다.
                if forward_shortest_node.is_on_stop_line() == True:
                    #print("Stop_line_exists")
                    # 차의 다음 진행 링크가 직진, 좌회전, 우회전인지 찾기
                    next_link_direction = None
                    for link_idx in self.global_data.links_idx:
                        if self.links[link_idx].get_from_node() == forward_shortest_node:
                            next_link_direction = self.links[link_idx].related_signal
                            break
                    
                    # 2-1. 맞는 신호라서 통과 가능 >> obs 에 장애물 추가하지 않고 그냥 패스
                    #print(next_link_direction, self.possible_link_direction)
                    if next_link_direction in self.possible_link_direction:
                        print("you can go now!!!")
                        self.traffic_flag = 0
                        pass
                    # 2-2. 다른 신호라서 통과 불가 >> local_traffic_info 에 추가
                    else:

                        temp = forward_shortest_node.get_to_links()[0]
                        local_traffic_info = [temp.points[0][0], temp.points[0][1], 0]
                        self.traffic_flag = 1

                        ego_pose_x = self.current_postion.x
                        ego_pose_y = self.current_postion.y
                        ego_heading = self.vehicle_yaw
                        
                        #translation
                        tmp_theta=ego_heading
                        tmp_translation=[ego_pose_x, ego_pose_y]
                        tmp_t=np.array([[cos(tmp_theta), -sin(tmp_theta), tmp_translation[0]],
                                        [sin(tmp_theta),  cos(tmp_theta), tmp_translation[1]],
                                        [0             ,               0,                  1]])
                        tmp_det_t=np.array([[tmp_t[0][0], tmp_t[1][0], -(tmp_t[0][0] * tmp_translation[0] + tmp_t[1][0]*tmp_translation[1])],
                                            [tmp_t[0][1], tmp_t[1][1], -(tmp_t[0][1] * tmp_translation[0] + tmp_t[1][1]*tmp_translation[1])],
                                            [0,0,1]])
                        global_result=np.array([[local_traffic_info[0]], [local_traffic_info[1]], [1]])
                        
                        local_result=tmp_det_t.dot(global_result)
                                
                        local_traffic_info = [local_result[0][0], local_result[1][0], local_traffic_info[2]]

                          


                self.current_waypoint = self.get_current_waypoint([self.current_postion.x,self.current_postion.y], self.global_path)
                self.target_velocity = self.velocity_list[self.current_waypoint]*3.6

                steering = self.calc_pure_pursuit()
                if self.is_look_forward_point :
                    self.ctrl_cmd_msg.steering = steering
                else : 
                    # rospy.loginfo("no found forward point")
                    self.ctrl_cmd_msg.steering = 0.0

                self.adaptive_cruise_control.check_object(self.path ,global_npc_info, local_npc_info
                                                                    ,global_ped_info, local_ped_info
                                                                    ,global_obs_info, local_obs_info)
                self.target_velocity = self.adaptive_cruise_control.get_target_velocity(local_npc_info, local_ped_info, local_obs_info,
                                                                                        self.status_msg.velocity.x, self.target_velocity/3.6,
                                                                                        local_traffic_info, self.traffic_flag)

                
                output = self.pid.pid(self.target_velocity, self.status_msg.velocity.x*3.6)

                if output > 0.0:
                    self.ctrl_cmd_msg.accel = output
                    self.ctrl_cmd_msg.brake = 0.0
                else:
                    self.ctrl_cmd_msg.accel = 0.0
                    self.ctrl_cmd_msg.brake = -output

                self.ctrl_cmd_pub.publish(self.ctrl_cmd_msg)


            rate.sleep()



    def path_callback(self,msg):
        self.is_path=True
        self.path=msg  

    def odom_callback(self,msg):
        self.is_odom=True
        odom_quaternion=(msg.pose.pose.orientation.x,msg.pose.pose.orientation.y,msg.pose.pose.orientation.z,msg.pose.pose.orientation.w)
        _,_,self.vehicle_yaw=euler_from_quaternion(odom_quaternion)
        self.current_postion.x = msg.pose.pose.position.x
        self.current_postion.y = msg.pose.pose.position.y

    def status_callback(self,msg): 
        self.is_status=True
        self.status_msg=msg    
        
    def global_path_callback(self,msg):
        self.global_path = msg
        self.is_global_path = True

    def object_info_callback(self,data):
        self.is_object_info = True
        self.object_data = data

    def global_data_callback(self, msg):
        self.global_data = msg
        
    def traffic_light_callback(self, data):
        status = data.trafficLightStatus
        #print(status)
        if status == 1: # Red
            self.possible_link_direction = []
        elif status == 4: # Yellow
            self.possible_link_direction = []
        elif status == 5: # Red, Yellow
            self.possible_link_direction = []
        elif status == 16: # Straight Green
            self.possible_link_direction = ['straight', 'right_unprotected']
        elif status == 20: # Yellow, Green
            self.possible_link_direction = ['straight']
        elif status == 32: # LeftGreen
            self.possible_link_direction = ['left', 'right_unprotected']
        elif status == 33: # Red, LeftGreen
            self.possible_link_direction = ['left']
        elif status == 36: # Yellow, LeftGreen
            self.possible_link_direction = []
        elif status == 48: # StraightGreen, LeftGreen
            self.possible_link_direction = ['straight', 'left', 'right_unprotected']
        elif status == 64: # RightGreen
            self.possible_link_direction = ['right_unprotected']

    def get_current_waypoint(self,ego_status,global_path):
        min_dist = float('inf')        
        currnet_waypoint = -1     

        ego_pose_x = ego_status[0]
        ego_pose_y = ego_status[1]

        for i,pose in enumerate(global_path.poses):
            dx = ego_pose_x - pose.pose.position.x
            dy = ego_pose_y - pose.pose.position.y

            dist = sqrt(pow(dx,2)+pow(dy,2))
            if min_dist > dist :
                min_dist = dist
                currnet_waypoint = i
        return currnet_waypoint
    
    def calc_vaild_obj(self, status_msg, object_data):
        
        self.all_object = object_data        
        ego_pose_x = status_msg[0]
        ego_pose_y = status_msg[1]
        ego_heading = status_msg[2]
        
        global_npc_info = []
        local_npc_info  = []
        global_ped_info = []
        local_ped_info  = []
        global_obs_info = []
        local_obs_info  = []
        num_of_object = self.all_object.num_of_npcs + self.all_object.num_of_obstacle + self.all_object.num_of_pedestrian

        if num_of_object > 0:

            #translation
            tmp_theta=ego_heading
            tmp_translation=[ego_pose_x, ego_pose_y]
            tmp_t=np.array([[cos(tmp_theta), -sin(tmp_theta), tmp_translation[0]],
                            [sin(tmp_theta),  cos(tmp_theta), tmp_translation[1]],
                            [0             ,               0,                  1]])
            tmp_det_t=np.array([[tmp_t[0][0], tmp_t[1][0], -(tmp_t[0][0] * tmp_translation[0] + tmp_t[1][0]*tmp_translation[1])],
                                [tmp_t[0][1], tmp_t[1][1], -(tmp_t[0][1] * tmp_translation[0] + tmp_t[1][1]*tmp_translation[1])],
                                [0,0,1]])

            #npc vehicle translation        
            for npc_list in self.all_object.npc_list:
                global_result=np.array([[npc_list.position.x],[npc_list.position.y],[1]])
                local_result=tmp_det_t.dot(global_result)
                if local_result[0][0]> 0 :        
                    global_npc_info.append([npc_list.type,npc_list.position.x,npc_list.position.y,npc_list.velocity.x])
                    local_npc_info.append([npc_list.type,local_result[0][0],local_result[1][0],npc_list.velocity.x])

            #ped translation
            for ped_list in self.all_object.pedestrian_list:
                global_result=np.array([[ped_list.position.x],[ped_list.position.y],[1]])
                local_result=tmp_det_t.dot(global_result)
                if local_result[0][0]> 0 :
                    global_ped_info.append([ped_list.type,ped_list.position.x,ped_list.position.y,ped_list.velocity.x])
                    local_ped_info.append([ped_list.type,local_result[0][0],local_result[1][0],ped_list.velocity.x])

            #obs translation
            for obs_list in self.all_object.obstacle_list:
                global_result=np.array([[obs_list.position.x],[obs_list.position.y],[1]])
                local_result=tmp_det_t.dot(global_result)
                if local_result[0][0]> 0 :
                    global_obs_info.append([obs_list.type,obs_list.position.x,obs_list.position.y,obs_list.velocity.x])
                    local_obs_info.append([obs_list.type,local_result[0][0],local_result[1][0],obs_list.velocity.x])




        return global_npc_info, local_npc_info, global_ped_info, local_ped_info, global_obs_info, local_obs_info

    def calc_pure_pursuit(self,):


        self.lfd = self.lfd_gain * min(self.max_lfd, max(self.min_lfd, self.status_msg.velocity.x))

        #rospy.loginfo(self.lfd)
        
        
        vehicle_position=self.current_postion
        self.is_look_forward_point= False

        translation = [vehicle_position.x, vehicle_position.y]


        t=np.array([
                    [cos(self.vehicle_yaw), -sin(self.vehicle_yaw),translation[0]],
                    [sin(self.vehicle_yaw),cos(self.vehicle_yaw),translation[1]],
                    [0                    ,0                    ,1            ]])

        det_t=np.array([
                [t[0][0],t[1][0],-(t[0][0]*translation[0]+t[1][0]*translation[1])],
                [t[0][1],t[1][1],-(t[0][1]*translation[0]+t[1][1]*translation[1])],
                [0      ,0      ,1                                               ]])

        for num,i in enumerate(self.path.poses) :
            path_point=i.pose.position

            global_path_point=[path_point.x,path_point.y,1]
            local_path_point=det_t.dot(global_path_point)           
            if local_path_point[0]>0 :
                dis=sqrt(pow(local_path_point[0],2)+pow(local_path_point[1],2))
                if dis>= self.lfd :
                    self.forward_point=path_point
                    self.is_look_forward_point=True
                    break

        steering=0.0
        if self.is_look_forward_point :
            theta=atan2(local_path_point[1],local_path_point[0])
            steering=atan2(2*self.vehicle_length*sin(theta),self.lfd)


        return steering

class pidControl:
    def __init__(self):
        self.p_gain = 0.03 # 현재 속도가 빠르면 제동을 느리면 엑셀을 밟으려는 정도가 강해진다.
        # 신호등 같은 곳에서 오래 기다렸다가 이동하면 풀엑셀 밟을지도 모르니 0으로 한다.
        self.i_gain = 0.00 # 설정한 속도에 비례하여 이동거리가 짧으면 엑셀을, 길면 제동을 한다.
        # 참고로 p와 i 둘중 하나를 사용해야 적용된다. 이유는 속도 변화를 만드는 것이 p와 i이기 때문
        self.d_gain = 0.05 # 엑셀이 강할수록 제동을 제동이 강할수록 엑셀을.. 속도 변화량이 커지는 것을 방지한다.
        self.prev_error = 0
        self.i_control = 0
        self.controlTime = 0.03

    def pid(self,target_vel, current_vel):
        error = target_vel - current_vel


        p_control = self.p_gain*error
        self.i_control += error*self.controlTime
        d_control = self.d_gain*(error-self.prev_error)/self.controlTime

        output = p_control + self.i_gain*self.i_control + d_control
        self.prev_error = error

        return output

class velocityPlanning:
    def __init__ (self, car_max_speed, road_friciton):
        self.car_max_speed = car_max_speed
        self.road_friction = road_friciton

    def curvedBaseVelocity(self, gloabl_path, point_num):
        out_vel_plan = []

        for i in range(0,point_num):
            out_vel_plan.append(self.car_max_speed)

        for i in range(point_num, len(gloabl_path.poses) - point_num):
            x_list = []
            y_list = []
            for box in range(-point_num, point_num):
                x = gloabl_path.poses[i+box].pose.position.x
                y = gloabl_path.poses[i+box].pose.position.y
                x_list.append([-2*x, -2*y ,1])
                y_list.append((-x*x) - (y*y))

            #TODO: (6) 도로의 곡률 계산

            A = np.array(x_list)
            B = np.array(y_list)
            a, b, c = np.dot(np.linalg.pinv(A), B)
            
            r = (a**2 + b**2 - c)**0.5


            #TODO: (7) 곡률 기반 속도 계획
            
            v_max = (r * 9.8 * self.road_friction) ** 0.5


            if v_max > self.car_max_speed:
                v_max = self.car_max_speed
            out_vel_plan.append(v_max)

        for i in range(len(gloabl_path.poses) - point_num, len(gloabl_path.poses)-10):
            out_vel_plan.append(30)

        for i in range(len(gloabl_path.poses) - 10, len(gloabl_path.poses)):
            out_vel_plan.append(0)

        return out_vel_plan

# 
class AdaptiveCruiseControl:
    def __init__(self, velocity_gain, distance_gain, time_gap, vehicle_length, current_postion):
        self.npc_vehicle=[False,0]
        self.object=[False,0]
        self.Person=[False,0]
        self.velocity_gain = velocity_gain
        self.distance_gain = distance_gain
        self.time_gap = time_gap
        self.vehicle_length = vehicle_length
        self.current_postion = current_postion

        self.object_type = None
        self.object_distance = 0
        self.object_velocity = 0

    def check_object(self,ref_path, global_npc_info, local_npc_info, 
                                    global_ped_info, local_ped_info, 
                                    global_obs_info, local_obs_info):


        # 주행 경로 상 보행자 유무 파악
        min_rel_distance=float('inf')
        if len(global_ped_info) > 0 :        
            for i in range(len(global_ped_info)):
                for path in ref_path.poses :      
                    if global_ped_info[i][0] == 0 : # type=0 [pedestrian]                    
                        dis = sqrt((path.pose.position.x - global_ped_info[i][1])**2 + (path.pose.position.y - global_ped_info[i][2])**2)
                        if dis<2.35: 
                            rel_distance = sqrt((self.current_postion.x - global_ped_info[i][1])**2 + (self.current_postion.y - global_ped_info[i][2])**2)
                            if rel_distance < min_rel_distance:
                                min_rel_distance = rel_distance
                                self.Person=[True,i]


        # 주행 경로 상 NPC 차량 유무 파악
        if len(global_npc_info) > 0 :            
            for i in range(len(global_npc_info)):
                for path in ref_path.poses :      
                    if global_npc_info[i][0] == 1 : # type=1 [npc_vehicle] 
                        dis = sqrt((path.pose.position.x - global_npc_info[i][1])**2 + (path.pose.position.y - global_npc_info[i][2])**2)
                        if dis<2.35:
                            rel_distance = sqrt((self.current_postion.x - global_npc_info[i][1])**2 + (self.current_postion.y - global_npc_info[i][2])**2)
                            if rel_distance < min_rel_distance:
                                min_rel_distance = rel_distance
                                self.npc_vehicle=[True,i]
        

        # 주행 경로 상 Obstacle 유무 파악
        if len(global_obs_info) > 0 :            
            for i in range(len(global_obs_info)):
                for path in ref_path.poses :      
                    if global_obs_info[i][0] == 2 : # type=2 [obstacle] 
                        dis = sqrt((path.pose.position.x - global_obs_info[i][1])**2 + (path.pose.position.y - global_obs_info[i][2])**2)
                        if dis<2.35:
                            rel_distance = sqrt((self.current_postion.x - global_obs_info[i][1])**2 + (self.current_postion.y - global_obs_info[i][2])**2)
                            if rel_distance < min_rel_distance:
                                min_rel_distance = rel_distance
                                self.object=[True,i] 
                                

    def get_target_velocity(self, local_npc_info, local_ped_info, local_obs_info, ego_vel, target_vel, local_traffic_info, traffic_flag): 
        #TODO: (9) 장애물과의 속도와 거리 차이를 이용하여 ACC 를 진행 목표 속도를 설정
        out_vel =  target_vel
        default_space = 10
        time_gap = self.time_gap
        v_gain = self.velocity_gain
        x_errgain = self.distance_gain
        
        if self.npc_vehicle[0] and len(local_npc_info) != 0: #ACC ON_vehicle   
            print("ACC ON NPC_Vehicle")         
            front_vehicle = [local_npc_info[self.npc_vehicle[1]][1], local_npc_info[self.npc_vehicle[1]][2], local_npc_info[self.npc_vehicle[1]][3]]
            dis_safe = ego_vel * time_gap + default_space
            dis_rel = sqrt(pow(front_vehicle[0],2) + pow(front_vehicle[1],2))            
            vel_rel=((front_vehicle[2] / 3.6) - ego_vel)                        
            acceleration = vel_rel * v_gain - x_errgain * (dis_safe - dis_rel)

            out_vel = ego_vel + acceleration      

        if self.Person[0] and len(local_ped_info) != 0: #ACC ON_Pedestrian
            print("ACC ON Pedestrian")
            Pedestrian = [local_ped_info[self.Person[1]][1], local_ped_info[self.Person[1]][2], local_ped_info[self.Person[1]][3]]
            
            dis_safe = ego_vel* time_gap + default_space
            dis_rel = sqrt(pow(Pedestrian[0],2) + pow(Pedestrian[1],2))            
            vel_rel = (Pedestrian[2] - ego_vel)              
            acceleration = vel_rel * v_gain - x_errgain * (dis_safe - dis_rel)    

            out_vel = ego_vel + acceleration
   
        if self.object[0] and len(local_obs_info) != 0: #ACC ON_obstacle     
            print("ACC ON Obstacle")                    
            Obstacle = [local_obs_info[self.object[1]][1], local_obs_info[self.object[1]][2], local_obs_info[self.object[1]][3]]
            dis_safe = ego_vel* time_gap + default_space
            dis_rel = sqrt(pow(Obstacle[0],2) + pow(Obstacle[1],2))            
            vel_rel = (Obstacle[2] - ego_vel)
            acceleration = vel_rel * v_gain - x_errgain * (dis_safe - dis_rel)    

            out_vel = ego_vel + acceleration           

        if traffic_flag == 1:
            print("ACC ON Traffic")
            traffic = [local_traffic_info[0], local_traffic_info[1], local_traffic_info[2]]
            dis_safe = ego_vel* time_gap + default_space
            dis_rel = sqrt(pow(traffic[0],2) + pow(traffic[1],2))            
            vel_rel = (traffic[2] - ego_vel)
            acceleration = vel_rel * v_gain - x_errgain * (dis_safe - dis_rel)    

            out_vel = ego_vel + acceleration
            #print(out_vel)

        return out_vel * 3.6


if __name__ == '__main__':
    try:
        test_track=pure_pursuit()
    except rospy.ROSInterruptException:
        pass
