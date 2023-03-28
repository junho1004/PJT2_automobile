#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import rospy
from morai_msgs.msg import GetTrafficLightStatus

# traffic_listener 는 시뮬레이터에서 송신하는 Traffic Light 정보를 Subscriber 하는 예제 입니다.
# 시뮬레이터 내 traffic Light 정보인 /GetTrafficLightStatus 라는 메세지를 Subscribe 합니다.

# 노드 실행 순서 
# 1. ROS 노드 이름 선언
# 2. Subscriber 생성
# 3. Callback 함수 생성 및 데이터 출력

#TODO: (3) Callback 함수 생성 및 데이터 출력
def traffic_light_callback(data):
    status = data.trafficLightStatus
    os.system('clear')
    # Red
    if status == 1:
        print('Red Light')
    # Yellow
    elif status == 4:
        print('Yellow Light')
    # Green
    elif status == 16:
        print('Green Light')
    # Red + Yellow
    elif status == 5:
        print('Red & Yellow Light')
    # Yellow + Green
    elif status == 20:
        print('Yellow Light')
    # Green + left
    elif status == 48 or status == 31:
        print('Green Light')



def listener():
    #TODO: (1) ROS 노드 이름 선언
    rospy.init_node('traffic_listener', anonymous=True)

    #TODO: (2) Subscriber 생성
    rospy.Subscriber("/GetTrafficLightStatus", GetTrafficLightStatus, traffic_light_callback)

    rospy.spin()

if __name__ == '__main__':
    listener()