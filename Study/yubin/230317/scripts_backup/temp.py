import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use the application default credentials
cred = credentials.Certificate('mykey.json')
firebase_admin.initialize_app(cred, {
    'projectID' : 'ssafy-seo8-44f08',
})

db = firestore.client()

users_ref = db.collection(u'Userlatlng')
docs = users_ref.stream()

for doc in docs:
    print(u'{} => {}'.format(doc.id, doc.to_dict()))