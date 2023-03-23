import firebase_admin
import google.cloud
from firebase_admin import credentials, firestore
import time

print('Initializing Firestore connection...')
# Credentials and Firebase App initialization. Always required
firCredentials = credentials.Certificate('/home/ssafy/mobility-autodriving-skeleton/ssafy_ad/src/ssafy_2/key/mykey.json')
firApp = firebase_admin.initialize_app (firCredentials)

# Get access to Firestore
db = firestore.client()
print('Connection initialized')

def on_snapshot(doc_snapshot, changes, read_time):
    for doc in doc_snapshot:
        print(u'Received document snapshot: {}'.format(doc.id))

doc_ref = db.collection(u'Userlatlng').document(u'x9q7RJyum0sYNTzH6cYv')
doc_watch = doc_ref.on_snapshot(on_snapshot)

# Keep the app running
while True:
    pass
    # time.sleep(1)
    # print('processing...')