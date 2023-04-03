#!/usr/bin/env python
# -*- coding: utf-8 -*-

# firebase connect
import rospy
import firebase_admin
from firebase_admin import credentials, firestore
import time 
import threading
from std_msgs.msg import String

def on_snapshot(doc_snapshot, changes, read_time):
    for doc in doc_snapshot:
        print(u'Received document snapshot: {}'.format(doc.id))

# init api_key to connect with firebase
cred = credentials.Certificate('/home/ssafy/catkin_ws/src/chapter8/online_web/firebase_key.json')
firebase_admin.initialize_app(cred, {
    'projectID' : 'ssafy-seo8-9e74c',
})
print('Initializing Firestore connection...')

# Get access to Firestore
db = firestore.client()
print('Connection initialized')


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
            driving_flag = "sflag: " + str(doc_ref.get().to_dict()["driving"])
            rospy.loginfo(driving_flag)
            publisher.publish(driving_flag)

            rate.sleep()


if __name__ == "__main__":
    try:
        # sd = start_driving_flag_listener().run()
        sd = start_driving_flag_listener()
        t = threading.Thread(target=sd.run)
        t.start()
    except rospy.ROSInterruptException:
        pass