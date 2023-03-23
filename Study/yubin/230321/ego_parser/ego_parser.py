#!/usr/bin/env python2.7
# -*- coding: utf-8 -*-

import rospy
import os
from morai_msgs.msg import ObjectStatusList
from nav_msgs.msg import Odometry
from pyproj import Proj
from math import pi

class EGOParser:
    def __init__(self):
        rospy.init_node('EGO_parser', anonymous=True)
        self.ego_sub = rospy.Subscriber("/Object_topic", ObjectStatusList, self.ego_callback)
        
        # 초기화
        self.x, self.y = None, None
        self.is_ego = False

        rate = rospy.Rate(30) # 30hz
        while not rospy.is_shutdown():
            if self.is_ego == True:

                os.system('clear')
                print("# ego name ")
                print(self.name)
                print("\n# ego x position ")
                print(self.x)
                print("\n# ego y position ")
                print(self.y)

                rate.sleep()

    def ego_callback(self, obj_list):

        self.obj = obj_list.npc_list[0]
        self.name = obj_list.npc_list[0].name
        self.x = obj_list.npc_list[0].position.x
        self.y = obj_list.npc_list[0].position.y
        
        self.is_ego = True
        # for idx in self.objs :
        #     tmp_point = Point32()

        # for moon na modae
        # ni ga hae

if __name__ == '__main__':
    try:
        EGO_parser = EGOParser()
    except rospy.ROSInterruptException:
        pass
