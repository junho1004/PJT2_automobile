#!/usr/bin/env python
# -*- coding: utf-8 -*-

import subprocess
import time

import sys
sys.path.append('/home/ssafy/watta_ws/src/watta_dir/scripts')
from firebase_C109 import Reservation

Reservation = Reservation()

print('Connection initialized')

def on_snapshot_choice(doc_snapshot, changes, read_time):
    for doc in doc_snapshot:
        choice_flag = Reservation.choice_btn.get().to_dict()["choice_btn"]
        if choice_flag == True:
            print("choice_btn True!!")
            subprocess.Popen(['gnome-terminal', '--tab', '-e', 'bash -c "roslaunch watta_dir watta.launch"'])

def on_snapshot_reservation(doc_snapshot, changes, read_time):
    for doc in doc_snapshot:
        reservation_flag = Reservation.reservation_btn.get().to_dict()["reservation_btn"]
        if reservation_flag == True:
            print("reservation_btn True!!")
            subprocess.Popen(['gnome-terminal', '--tab', '-e', 'bash -c "rosrun watta_dir autodriving.py"'])

def on_snapshot_return(doc_snapshot, changes, read_time):
    for doc in doc_snapshot:
        return_flag = Reservation.return_btn.get().to_dict()["return_btn"]
        if return_flag == True:
            print("return_btn True!!")
            subprocess.Popen(['gnome-terminal', '--tab', '-e', 'bash -c "roslaunch watta_dir watta.launch"'])
            time.sleep(3) # delay 3sec
            subprocess.Popen(['gnome-terminal', '--tab', '-e', 'bash -c "rosrun watta_dir autodriving.py"'])

watch_choice_btn = Reservation.choice_btn.on_snapshot(on_snapshot_choice)
watch_reservation_btn = Reservation.reservation_btn.on_snapshot(on_snapshot_reservation)
watch_return_btn = Reservation.return_btn.on_snapshot(on_snapshot_return)

# Keep the app running
while True:
    time.sleep(1)
    print('processing...')
