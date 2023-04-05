#!/usr/bin/env python
# -*- coding: utf-8 -*-

# firebase connect
import rospy
import firebase_admin
from firebase_admin import credentials, firestore
import time 
from std_msgs.msg import String

def on_snapshot(doc_snapshot, changes, read_time):
    for doc in doc_snapshot:
        print(u'Received document snapshot: {}'.format(doc.id))

cred = credentials.Certificate('/home/ssafy/mobility-autodriving-skeleton/ssafy_ad/src/ssafy_2/key/mykey.json')
firebase_admin.initialize_app(cred, {
    'projectID' : 'ssafy-seo8-9e74c',
})
db = firestore.client()

class start_driving_flag_listener:
    def __init__(self):
        rospy.init_node("start_driving_flag_listener", anonymous=True)
    
    def run(self):
        publisher = rospy.Publisher('start_driving_flag', String, queue_size=10)
        # you can set a specific location like this...
        doc_ref = db.collection(u'Reservation').document(u'start_driving')
        # start realtime listener at doc_Ref
        doc_ref.on_snapshot(on_snapshot)

        rate = rospy.Rate(1) # (x) times / 1 sec
        while not rospy.is_shutdown():
            time.sleep(1)
            driving_flag = doc_ref.get().to_dict()["driving"]
            publisher.publish(driving_flag)
            rate.sleep()

if __name__ == "__main__":
    try:
        start = start_driving_flag_listener().run()
    except rospy.ROSInterruptException:
        pass