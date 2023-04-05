#!/usr/bin/env python
# -*- coding: utf-8 -*-

import subprocess

# firebase connect
import firebase_admin
import google.cloud 
from firebase_admin import credentials, firestore
import time

# message import 
import rospy
import os
from morai_msgs.msg import GPSMessage

# init api_key to connect with firebase
cred = credentials.Certificate('/home/ssafy/watta_ws/src/watta_dir/key/mykey.json')
firebase_admin.initialize_app(cred, {
    'projectID' : 'testpjt-653cf',
})

#print('Initializing Firestore connection...')

# Get access to Firestore
db = firestore.client()
print('Connection initialized')

def on_snapshot_choice(doc_snapshot, changes, read_time):
    for doc in doc_snapshot:
        choice = doc_ref_choice.get().to_dict()["choice_btn"]
        if choice == True:
            subprocess.Popen(['gnome-terminal', '--tab', '-e', 'bash -c "roslaunch watta_dir watta.launch"'])

def on_snapshot_reservation(doc_snapshot, changes, read_time):
    for doc in doc_snapshot:
        reservation = doc_ref_reservation.get().to_dict()["reservation_btn"]
        if reservation == True:
            subprocess.Popen(['gnome-terminal', '--tab', '-e', 'bash -c "rosrun watta_dir autodriving.py"'])

def on_snapshot_return(doc_snapshot, changes, read_time):
    for doc in doc_snapshot:
        return_btn = doc_ret3_ret_btn.get().to_dict()["return_btn"]
        if return_btn == True:
            subprocess.Popen(['gnome-terminal', '--tab', '-e', 'bash -c "roslaunch watta_dir watta.launch"'])
            time.sleep(3) # delay 2sec
            subprocess.Popen(['gnome-terminal', '--tab', '-e', 'bash -c "rosrun watta_dir autodriving.py"'])

doc_ref_choice = db.collection(u'Reservation').document(u'choice_btn')
doc_ref_reservation = db.collection(u'Reservation').document(u'reservation_btn')
doc_ret3_ret_btn = db.collection(u'Reservation').document(u'return_btn') # db connect + return btn

doc_watch_choice = doc_ref_choice.on_snapshot(on_snapshot_choice)
doc_watch_reservation = doc_ref_reservation.on_snapshot(on_snapshot_reservation)
doc_watch_return = doc_ret3_ret_btn.on_snapshot(on_snapshot_return) # return snapshot detecting


# Keep the app running
while True:
    time.sleep(1)
    print('processing...')
