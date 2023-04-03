#!/usr/bin/env python
# -*- coding: utf-8 -*-
 
import rospy
import tf
import os
from std_msgs.msg import Float32MultiArray
from sensor_msgs.msg import Imu
from morai_msgs.msg import GPSMessage
from nav_msgs.msg import Odometry
from pyproj import Proj
from math import pi

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate('/home/ssafy/watta_ws/src/watta_dir/key/mykey.json')
firebase_admin.initialize_app(cred, {'projectID' : 'ssafy-seo8-9e74c'})
db = firestore.client()
doc_ref = db.collection(u'Ego').document(u'current_gps')

class GPSIMUParser:
    def __init__(self):
        rospy.init_node('GPS_IMU_parser', anonymous=True)
        self.gps_sub = rospy.Subscriber("/gps", GPSMessage, self.navsat_callback)
        self.imu_sub = rospy.Subscriber("/imu", Imu, self.imu_callback)
        self.odom_pub = rospy.Publisher('/odom',Odometry, queue_size=1)

        # 초기화
        self.x, self.y = None, None
        self.is_imu = False
        self.is_gps = False
        self.proj_UTM = Proj(proj = 'utm', zone = 52, ellps = 'WGS84', preserve_units = False)

        self.odom_msg = Odometry()
        self.odom_msg.header.frame_id = '/odom'
        self.odom_msg.child_frame_id = '/base_link'

        cnt = 0
        rate = rospy.Rate(30) # 30hz
        while not rospy.is_shutdown():
            if self.is_imu == True and self.is_gps == True:
                self.convertLL2UTM()

                self.odom_pub.publish(self.odom_msg)
                
                cnt += 1
                if cnt % 30 == 0:
                    doc_ref.set({
                        u'lat': self.lat,
                        u'lon': self.lon
                    })
            
                os.system('clear')
                print(" ROS Odometry Msgs Pose ")
                print(self.odom_msg.pose.pose.position)
                

                rate.sleep()

    def navsat_callback(self, gps_msg):

        self.lat = gps_msg.latitude
        self.lon = gps_msg.longitude
        self.e_o = gps_msg.eastOffset
        self.n_o = gps_msg.northOffset

        self.is_gps=True

    def convertLL2UTM(self):
        xy_zone = self.proj_UTM(self.lon, self.lat)

        if self.lon == 0 and self.lat == 0:
            self.x = 0.0
            self.y = 0.0
        else:
            self.x = xy_zone[0] - self.e_o
            self.y = xy_zone[1] - self.n_o

        self.odom_msg.header.stamp = rospy.get_rostime()
        self.odom_msg.pose.pose.position.x = self.x
        self.odom_msg.pose.pose.position.y = self.y
        self.odom_msg.pose.pose.position.z = 0

        

    def imu_callback(self, data):
        if data.orientation.w == 0:
            self.odom_msg.pose.pose.orientation.x = 0.0
            self.odom_msg.pose.pose.orientation.y = 0.0
            self.odom_msg.pose.pose.orientation.z = 0.0
            self.odom_msg.pose.pose.orientation.w = 1.0
        else:
            self.odom_msg.pose.pose.orientation.x = data.orientation.x
            self.odom_msg.pose.pose.orientation.y = data.orientation.y
            self.odom_msg.pose.pose.orientation.z = data.orientation.z
            self.odom_msg.pose.pose.orientation.w = data.orientation.w

        
        self.is_imu=True

if __name__ == '__main__':
    try:
        GPS_IMU_parser = GPSIMUParser()
    except rospy.ROSInterruptException:
        pass
