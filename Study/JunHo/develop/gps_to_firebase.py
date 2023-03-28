#!/usr/bin/env python
# -*- coding: utf-8 -*-

# firebase connect
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# message import 
import rospy
import os
from morai_msgs.msg import GPSMessage

# init api_key to connect with firebase
cred = credentials.Certificate('/home/ssafy/mobility-autodriving-skeleton/ssafy_ad/src/ssafy_2/key/mykey.json')
firebase_admin.initialize_app(cred, {
    'projectID' : 'ssafy-seo8-9e74c',
})

db = firestore.client()
doc_ref = db.collection(u'test').document(u'gps')


class GPS:
    def __init__(self):
        rospy.init_node("gps_to_firebase", anonymous=True)
        self.GPS_data_callback = rospy.Subscriber("/gps", GPSMessage, self.gps_callback)
        self.current_lat = 0
        self.current_lon = 0
        self.is_GPS_data_received = False

        rate = rospy.Rate(1) # 1 times / 1 sec
        while not rospy.is_shutdown():
            if self.is_GPS_data_received == True:
                print("GPS_data was just written to Firebase_storage")
                doc_ref.set({
                    u'lat': self.current_lat,
                    u'lon': self.current_lon
                })
            else:
                print("waiting for GPS data...")
                
            rate.sleep()

    def gps_callback(self, gps_msg):
        self.is_GPS_data_received = True
        self.current_lat = gps_msg.latitude
        self.current_lon = gps_msg.longitude

if __name__ == "__main__":
    try:
        GPS()
    except rospy.ROSInterruptException:
        pass