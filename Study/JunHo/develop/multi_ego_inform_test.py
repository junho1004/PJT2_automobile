#!/usr/bin/env python
# -*- coding: utf-8 -*-

import rospy
import os
from morai_msgs.msg import ObjectStatusList
from nav_msgs.msg import Odometry
from pyproj import Proj, transform
from math import pi


class getInform:
    def __init__(self):
        rospy.init_node('EGO_parser', anonymous=True)

        # utm -> gps
        self.utm_proj = Proj(proj='utm', zone=52, ellps='WGS84', datum='WGS84', south=False)
        self.lonlat_proj = Proj(proj='latlong', ellps='WGS84', datum='WGS84')
        self.e_o = 302459.942
        self.n_o = 4122635.537

        # 초기화
        self.is_ego = False
        self.ego_list = []

        self.ego_0_sub = rospy.Subscriber("/Object_topic", ObjectStatusList, self.ego_0_callback)
        self.ego_2_sub = rospy.Subscriber("/ego_2/Object_topic", ObjectStatusList, self.ego_2_callback)
        # print("------------------------------------------")
        # print(self.ego_list)
        # print("------------------------------------------")
        
        while not rospy.is_shutdown():
            if self.is_ego == True:
                print("------------------------------------------")
                # os.system('clear')
                for i in range(len(self.ego_list)):
                    print(self.ego_list[i]["name"])
                print("------------------------------------------")
                break
                

    def ego_0_callback(self, obj_0_list):

        for i in range(obj_0_list.num_of_npcs):
            
            self.name = obj_0_list.npc_list[i].name
            self.utm_x = obj_0_list.npc_list[i].position.x + self.e_o
            self.utm_y = obj_0_list.npc_list[i].position.y + self.n_o
            
            longitude, latitude = transform(self.utm_proj, self.lonlat_proj, self.utm_x, self.utm_y)
            
            temp = {"name" : self.name, "lat" : latitude, "lon" : longitude}
            
            self.ego_list.append(temp)

        self.is_ego = True
        
    def ego_2_callback(self, obj_2_list):

        for i in range(obj_2_list.num_of_npcs):

            self.name = obj_2_list.npc_list[i].name
            self.utm_x = obj_2_list.npc_list[i].position.x + self.e_o
            self.utm_y = obj_2_list.npc_list[i].position.y + self.n_o

            longitude, latitude = transform(self.utm_proj, self.lonlat_proj, self.utm_x, self.utm_y)
            
            temp = {"name" : self.name, "lat" : latitude, "lon" : longitude}

            self.ego_list.append(temp)
                  
        self.is_ego = True


if __name__ == '__main__':
    try:
        EGO_parser = getInform()
    except rospy.ROSInterruptException:
        pass
