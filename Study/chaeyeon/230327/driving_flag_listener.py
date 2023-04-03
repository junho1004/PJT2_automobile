#!/usr/bin/env python
# -*- coding: utf-8 -*-

# firebase connect
import firebase_admin
import google.cloud 
from firebase_admin import credentials, firestore
import time

# message import 
import rospy
import os
from morai_msgs.msg import GPSMessage

def on_snapshot(doc_snapshot, changes, read_time):
    for doc in doc_snapshot:
        print(u'Received document snapshot: {}'.format(doc.id))

# init api_key to connect with firebase
cred = credentials.Certificate('/home/ssafy/catkin_ws/src/chapter8/online_web/ROS_api_code/firebase_key.json')
firebase_admin.initialize_app(cred, {
    'projectID' : 'ssafy-seo8-44f08',
})
print('Initializing Firestore connection...')

# Get access to Firestore
db = firestore.client()
print('Connection initialized')

'''
doc_ref = db.collection(u'Reservation').document(u'end_driving')
doc_watch = doc_ref.on_snapshot(on_snapshot)
while True:
    time.sleep(1)
    driving_flag = doc_ref.get().to_dict()["driving"]
    print(driving_flag)
    print('processing...')
'''

class Driving_flag_listener:
    def __init__(self):
        rospy.init_node("driving_flag_listener", anonymous=True)
        
        # you can set a specific location like this...
        doc_ref = db.collection(u'Reservation').document(u'end_driving')
        # start realtime listener at doc_Ref
        doc_ref.on_snapshot(on_snapshot)

        rate = rospy.Rate(1) # (x) times / 1 sec
        while not rospy.is_shutdown():
            time.sleep(1)
            driving_flag = doc_ref.get().to_dict()["driving"]
            print(driving_flag)
            rate.sleep()

if __name__ == "__main__":
    try:
        start = Driving_flag_listener()
    except rospy.ROSInterruptException:
        pass