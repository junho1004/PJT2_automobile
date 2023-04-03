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

# init api_key to connect with firebase
cred = credentials.Certificate('/home/ssafy/mobility-autodriving-skeleton/ssafy_ad/src/ssafy_2/key/mykey.json')
firebase_admin.initialize_app(cred, {
    'projectID' : 'ssafy-seo8-44f08',
})

print('Initializing Firestore connection...')

# Get access to Firestore
db = firestore.client()
print('Connection initialized')

def on_snapshot(doc_snapshot, changes, read_time):
    for doc in doc_snapshot:
        print(u'Received document snapshot: {}'.format(doc.id))

doc_ref = db.collection(u'Reservation').document(u'1')


doc_watch = doc_ref.on_snapshot(on_snapshot)


print(doc_ref.get().to_dict())


# Keep the app running
while True:
    time.sleep(1)
    print('processing...')