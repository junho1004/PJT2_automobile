import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth , createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FB_API_KEY,
  authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FB_PROJECT_ID,
  databaseURL: process.env.REACT_APP_FB_DATA_BASE_URL,
  storageBucket: process.env.REACT_APP_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FB_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FB_API_ID
  };

// firebaseConfig 정보로 firebase 시작
const app = initializeApp(firebaseConfig)
const firebaseAuth = getAuth(app);
const db = getFirestore(app)
export default app;
// firebase의 firestore 인스턴스를 변수에 저장
export { db, firebaseAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword }