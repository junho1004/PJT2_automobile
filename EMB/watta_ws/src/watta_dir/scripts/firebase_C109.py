#!/usr/bin/env python
# -*- coding: utf-8 -*-
 
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate('/home/ssafy/watta_ws/src/watta_dir/key/mykey.json')
firebase_admin.initialize_app(cred, {'projectID' : 'ssafy-seo8-9e74c'})
db = firestore.client()


class Ego:
    def __init__(self):       
        ## Ego
        self.current_gps = db.collection(u'Ego').document(u'current_gps')

        self.return_gps = db.collection(u'Ego').document(u'return_gps')

        self.total_distance = db.collection(u'Ego').document(u'total_distance')
        

class Reservation:
    def __init__(self):     
        ## Reservation
        self.choice_btn = db.collection(u'Reservation').document(u'choice_btn')

        self.reservation_btn = db.collection(u'Reservation').document(u'reservation_btn')

        self.return_btn = db.collection(u'Reservation').document(u'return_btn')

        self.destination = db.collection(u'Reservation').document(u'destination')

        self.start_waiting_time = db.collection(u'Reservation').document(u'start_wait')