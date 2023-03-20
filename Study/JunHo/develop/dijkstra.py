#!/usr/bin/env python
# -*- coding: utf-8 -*-

import rospy
import rospkg
import sys
import os
import copy
import numpy as np
import json
import tf
# For find end_node
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from pyproj import Proj

from math import cos,sin,sqrt,pow,atan2,pi
from geometry_msgs.msg import Point32,PoseStamped
from nav_msgs.msg import Odometry,Path

current_path = os.path.dirname(os.path.realpath(__file__))
sys.path.append(current_path)
from lib.mgeo.class_defs import *


class dijkstra_path_pub :
    def __init__(self):
        rospy.init_node('dijkstra_path_pub', anonymous=True)

        rospy.Subscriber("odom", Odometry, self.odom_callback)
        
        self.global_path_pub = rospy.Publisher('/global_path',Path, queue_size = 1)

        #TODO: (1) Mgeo data 읽어온 후 데이터 확인
        load_path = os.path.normpath(os.path.join(current_path, 'lib/mgeo_data/R_KR_PG_K-City'))
        mgeo_planner_map = MGeo.create_instance_from_json(load_path)

        node_set = mgeo_planner_map.node_set
        link_set = mgeo_planner_map.link_set

        self.nodes=node_set.nodes
        self.links=link_set.lines

        self.global_planner=Dijkstra(self.nodes,self.links)

        # 시작 Node 와 종료 Node 정의
        
        # Find start_node
        start_min_dis=float('inf')
        self.init_x = self.x
        self.init_y = self.y
        
        for node_idx in self.nodes:
            node_pose_x=self.nodes[node_idx].point[0]
            node_pose_y=self.nodes[node_idx].point[1]
            start_dis = sqrt(pow(self.init_x - node_pose_x, 2) + pow(self.init_y - node_pose_y, 2))
            if start_dis < start_min_dis :
                start_min_dis=start_dis
                self.start_node = node_idx

        #print(self.start_node)
        
        # Find end_node

        # Use the application default credentials
        cred = credentials.Certificate('/home/ssafy/mobility-autodriving-skeleton/ssafy_ad/src/ssafy_2/key/mykey.json')
        firebase_admin.initialize_app(cred, {
            'projectID' : 'ssafy-seo8-44f08',
        })

        db = firestore.client()

        users_ref = db.collection(u'test')
        docs = users_ref.stream()
        
        
        #print(type(docs))
        #print(len(docs))
        for doc in docs:
            #print(doc.to_dict()["lat"])
            #print(doc.to_dict()["lng"])
            #print(type(doc.to_dict()["lat"]))
            #print(type(doc.to_dict()["lng"]))
            self.gps_lat = doc.to_dict()["lat"]
            self.gps_lng = doc.to_dict()["lng"]
            break
        
        #print(self.gps_lat)
        #print(self.gps_lng)
        

        self.proj_UTM = Proj(proj = 'utm', zone = 52, ellps = 'WGS84', preserve_units = False)
        xy_zone = self.proj_UTM(self.gps_lng, self.gps_lat)
        self.e_o = 302459.942
        self.n_o = 4122635.537

        if self.gps_lng == 0 and self.gps_lat == 0:
            self.goal_utm_x = 0.0
            self.goal_utm_y = 0.0
        else:
            self.goal_utm_x = xy_zone[0] - self.e_o
            self.goal_utm_y = xy_zone[1] - self.n_o
        
        # print(self.goal_utm_x)
        # print(self.goal_utm_y)

        goal_min_dis=float('inf')
        self.goal_x = self.goal_utm_x
        self.goal_y = self.goal_utm_y
        
        for node_idx in self.nodes:
            node_pose_x=self.nodes[node_idx].point[0]
            node_pose_y=self.nodes[node_idx].point[1]
            goal_dis = sqrt(pow(self.goal_x - node_pose_x, 2) + pow(self.goal_y - node_pose_y, 2))

            if goal_dis < goal_min_dis :
                goal_min_dis=goal_dis
                self.end_node = node_idx

        #print(self.end_node)
        #self.end_node = "A119BS010247"


        self.global_path_msg = Path()
        self.global_path_msg.header.frame_id = '/map'

        self.global_path_msg = self.calc_dijkstra_path_node(self.start_node, self.end_node)
        #print(self.global_path_msg)


        rate = rospy.Rate(10) # 10hz
        while not rospy.is_shutdown():
            #TODO: (11) dijkstra 이용해 만든 Global Path 정보 Publish
            # dijkstra 이용해 만든 Global Path 메세지 를 전송하는 publisher 를 만든다.
            self.global_path_pub.publish(self.global_path_msg)
            rate.sleep()


    # For find start_node
    def odom_callback(self, msg):
        self.is_odom = True
        
        # gpsimu_parser.py 예제에서 Publish 해주는 Odometry 메세지 데이터를 Subscribe 한다.
        # Odometry 메세지 에 담긴 물체의 위치 와 자세 데이터를 아래 변수에 넣어준다.
        self.x = msg.pose.pose.position.x
        self.y = msg.pose.pose.position.y

        self.orientation_x = msg.pose.pose.orientation.x 
        self.orientation_y = msg.pose.pose.orientation.y
        self.orientation_z = msg.pose.pose.orientation.z
        self.orientation_w = msg.pose.pose.orientation.w
    
    def calc_dijkstra_path_node(self, start_node, end_node):

        result, path = self.global_planner.find_shortest_path(start_node, end_node)

        #TODO: (10) dijkstra 경로 데이터를 ROS Path 메세지 형식에 맞춰 정의
        out_path = Path()
        out_path.header.frame_id = '/map'
        '''
        # dijkstra 경로 데이터 중 Point 정보를 이용하여 Path 데이터를 만들어 줍니다.

        '''
        for waypoint in path["point_path"] :
            path_x = waypoint[0]
            path_y = waypoint[1]
            read_pose = PoseStamped()
            read_pose.pose.position.x = path_x
            read_pose.pose.position.y = path_y
            read_pose.pose.orientation.w = 1
            
            out_path.poses.append(read_pose)
            

        return out_path

class Dijkstra:
    def __init__(self, nodes, links):
        self.nodes = nodes
        self.links = links
        #TODO: (3) weight 값 계산
        self.weight = self.get_weight_matrix()
        self.lane_change_link_idx = []

    def get_weight_matrix(self):
        #TODO: (3) weight 값 계산
        '''
        # weight 값 계산은 각 Node 에서 인접 한 다른 Node 까지의 비용을 계산합니다.
        # 계산된 weight 값 은 각 노드간 이동시 발생하는 비용(거리)을 가지고 있기 때문에
        # Dijkstra 탐색에서 중요하게 사용 됩니다.
        # weight 값은 딕셔너리 형태로 사용 합니다.
        # 이중 중첩된 딕셔너리 형태로 사용하며 
        # Key 값으로 Node의 Idx, Value 값으로 다른 노드 까지의 비용을 가지도록 합니다.
        # 아래 코드 중 self.find_shortest_link_leading_to_node 를 완성하여 
        # Dijkstra 알고리즘 계산을 위한 Node와 Node 사이의 최단 거리를 계산합니다.

        '''
        # 초기 설정
        weight = dict() 
        for from_node_id, from_node in self.nodes.items():
            # 현재 노드에서 다른 노드로 진행하는 모든 weight
            
            weight_from_this_node = dict()
            
            for to_node_id, to_node in self.nodes.items():
                weight_from_this_node[to_node_id] = float('inf')
            # 전체 weight matrix에 추가
            weight[from_node_id] = weight_from_this_node
        for from_node_id, from_node in self.nodes.items():
            # 현재 노드에서 현재 노드로는 cost = 0
            weight[from_node_id][from_node_id] = 0

            for to_node in from_node.get_to_nodes():
                # 현재 노드에서 to_node로 연결되어 있는 링크를 찾고, 그 중에서 가장 빠른 링크를 찾아준다
                shortest_link, min_cost = self.find_shortest_link_leading_to_node(from_node,to_node)
                weight[from_node_id][to_node.idx] = min_cost           

        return weight

    def find_shortest_link_leading_to_node(self, from_node,to_node):
        """현재 노드에서 to_node로 연결되어 있는 링크를 찾고, 그 중에서 가장 빠른 링크를 찾아준다"""
        #TODO: (3) weight 값 계산
        '''
        # 최단거리 Link 인 shortest_link 변수와
        # shortest_link 의 min_cost 를 계산 합니다.

        '''
        to_links = []
        for link in from_node.get_to_links():
            if link.to_node is to_node:
                to_links.append(link)

        if len(to_links) == 0:
            raise BaseException('[ERROR] Error @ Dijkstra.find_shortest_path : Internal data error. There is no link from node (id={}) to node (id={})'.format(self.idx, to_node.idx))

        shortest_link = None
        min_cost = float('inf')
        for link in to_links:
            if link.cost < min_cost:
                min_cost = link.cost
                shortest_link = link

        return shortest_link, min_cost
        
    def find_nearest_node_idx(self, distance, s):        
        idx_list = self.nodes.keys()
        min_value = float('inf')
        min_idx = idx_list[-1]

        for idx in idx_list:
            if distance[idx] < min_value and s[idx] == False :
                min_value = distance[idx]
                min_idx = idx
        return min_idx

    def find_shortest_path(self, start_node_idx, end_node_idx): 
        #TODO: (4) Dijkstra Path 초기화 로직
        # s 초기화         >> s = [False] * len(self.nodes)
        # from_node 초기화 >> from_node = [start_node_idx] * len(self.nodes)
        '''
        # Dijkstra 경로 탐색을 위한 초기화 로직 입니다.
        # 변수 s와 from_node 는 딕셔너리 형태로 크기를 MGeo의 Node 의 개수로 설정합니다. 
        # Dijkstra 알고리즘으로 탐색 한 Node 는 변수 s 에 True 로 탐색하지 않은 변수는 False 로 합니다.
        # from_node 의 Key 값은 Node 의 Idx로
        # from_node 의 Value 값은 Key 값의 Node Idx 에서 가장 비용이 작은(가장 가까운) Node Idx로 합니다.
        # from_node 통해 각 Node 에서 가장 가까운 Node 찾고
        # 이를 연결해 시작 노드부터 도착 노드 까지의 최단 경로를 탐색합니다. 

        '''
        s = dict()
        from_node = dict() 
        for node_id in self.nodes.keys():
            s[node_id] = False
            from_node[node_id] = start_node_idx

        s[start_node_idx] = True
        distance =copy.deepcopy(self.weight[start_node_idx])

        #TODO: (5) Dijkstra 핵심 코드
        for i in range(len(self.nodes.keys()) - 1):
            selected_node_idx = self.find_nearest_node_idx(distance, s)
            s[selected_node_idx] = True            
            for j, to_node_idx in enumerate(self.nodes.keys()):
                if s[to_node_idx] == False:
                    distance_candidate = distance[selected_node_idx] + self.weight[selected_node_idx][to_node_idx]
                    if distance_candidate < distance[to_node_idx]:
                        distance[to_node_idx] = distance_candidate
                        from_node[to_node_idx] = selected_node_idx

        #TODO: (6) node path 생성
        tracking_idx = end_node_idx
        node_path = [end_node_idx]
        
        while start_node_idx != tracking_idx:
            tracking_idx = from_node[tracking_idx]
            node_path.append(tracking_idx)     

        node_path.reverse()

        #TODO: (7) link path 생성
        link_path = []
        for i in range(len(node_path) - 1):
            from_node_idx = node_path[i]
            to_node_idx = node_path[i + 1]

            from_node = self.nodes[from_node_idx]
            to_node = self.nodes[to_node_idx]

            shortest_link, min_cost = self.find_shortest_link_leading_to_node(from_node,to_node)
            link_path.append(shortest_link.idx)

        #TODO: (8) Result 판별
        if len(link_path) == 0:
            return False, {'node_path': node_path, 'link_path':link_path, 'point_path':[]}

        #TODO: (9) point path 생성
        point_path = []        
        for link_id in link_path:
            link = self.links[link_id]
            for point in link.points:
                point_path.append([point[0], point[1], 0])

        return True, {'node_path': node_path, 'link_path':link_path, 'point_path':point_path}

if __name__ == '__main__':
    
    dijkstra_path_pub = dijkstra_path_pub()