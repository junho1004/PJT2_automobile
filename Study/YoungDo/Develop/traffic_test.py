#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import rospy
from morai_msgs.msg import GetTrafficLightStatus
from morai_msgs.msg import CtrlCmd,EgoVehicleStatus,ObjectStatusList

# traffic_listener 는 시뮬레이터에서 송신하는 Traffic Light 정보를 Subscriber 하는 예제 입니다.
# 시뮬레이터 내 traffic Light 정보인 /GetTrafficLightStatus 라는 메세지를 Subscribe 합니다.

# 노드 실행 순서 
# 1. ROS 노드 이름 선언
# 2. Subscriber 생성
# 3. Callback 함수 생성 및 데이터 출력

#TODO: (3) Callback 함수 생성 및 데이터 출력

class TrafficLight:

    def __init__(self):
        #TODO: (1) ROS 노드 이름 선언
        rospy.init_node('traffic_listener', anonymous=True)

        #TODO: (2) Subscriber 생성
        rospy.Subscriber("/GetTrafficLightStatus", GetTrafficLightStatus, self.traffic_light_callback)
        rospy.Subscriber("Ego_topic", EgoVehicleStatus, self.status_callback)
        # ctrl_cmd control
        self.ctrl_cmd_pub = rospy.Publisher("/ctrl_cmd", CtrlCmd, queue_size=1)
        self.ctrl_cmd_msg = CtrlCmd()

        #rospy.spin()
        
        rate = rospy.Rate(30) # 30hz
        while not rospy.is_shutdown():

                self.ctrl_cmd_pub.publish(self.ctrl_cmd_msg)
                

                rate.sleep()

        

    def traffic_light_callback(self, data):
        status = data.trafficLightStatus
        os.system('clear')
        # Red
        if status == 1:
            print('Red Light')
            self.ctrl_cmd_msg.longlCmdType = 1
            #self.ctrl_cmd_msg.velocity = self.status_msg.velocity.x
            self.ctrl_cmd_msg.brake += 000.1
        # Yellow
        elif status == 4:
            print('Yellow Light')
        # Green
        elif status == 16:
            print('Green Light')
            self.ctrl_cmd_msg.longlCmdType = 1
            self.ctrl_cmd_msg.velocity = 20
        # Red + Yellow
        elif status == 5:
            print('Red & Yellow Light')
        # Yellow + Green
        elif status == 20:
            print('Yellow & Green Light')
        # Green + left
        elif status == 48 or status == 31:
            print('Green & Left Light')

    def status_callback(self,msg): ## Vehicl Status Subscriber 
        self.is_status=True
        self.status_msg = msg

if __name__ == '__main__':
    try:
        Traffic_Light = TrafficLight()
    except rospy.ROSInterruptException:
        pass