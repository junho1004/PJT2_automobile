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

def callback(data):
    #rospy.loginfo('%s', data.data)
    if data.data == "sflag: True":
        rospy.loginfo("ready to go!!")

# init api_key to connect with firebase
cred = credentials.Certificate('/home/ssafy/catkin_ws/src/chapter8/online_web/firebase_key.json')
firebase_admin.initialize_app(cred, {
    'projectID' : 'ssafy-seo8-9e74c',
})
print('Initializing Firestore connection...')

# Get access to Firestore
db = firestore.client()
print('Connection initialized')


class end_driving_flag_listener:
    def __init__(self):
        rospy.init_node("end_driving_flag_listener", anonymous=True)
    
    def run(self):
        rospy.Subscriber('start_driving_flag', String, callback)
        # you can set a specific location like this...
        doc_ref = db.collection(u'Reservation').document(u'end_driving')
        # start realtime listener at doc_Ref  
        doc_ref.on_snapshot(on_snapshot)

        rate = rospy.Rate(1) # (x) times / 1 sec
        while not rospy.is_shutdown():
            time.sleep(1)
            driving_flag = doc_ref.get().to_dict()["driving"]
            print("eflag: " + str(driving_flag))
            rate.sleep()


if __name__ == "__main__":
    try:
        # ed = end_driving_flag_listener().run()
        ed = end_driving_flag_listener()
        t = threading.Thread(target=ed.run)
        t.start()
    except rospy.ROSInterruptException:
        pass
