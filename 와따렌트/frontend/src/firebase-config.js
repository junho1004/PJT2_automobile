import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCGFl08DVsx8NAlvlc5dq3s8oOWBg3ICEI",
    authDomain: "ssafy-seo8-44f08.firebaseapp.com",
    databaseURL: "https://ssafy-seo8-44f08-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ssafy-seo8-44f08",
    storageBucket: "ssafy-seo8-44f08.appspot.com",
    messagingSenderId: "730602466444",
    appId: "1:730602466444:web:4cad52d6384b96b85f9fa9"
  };

// firebaseConfig 정보로 firebase 시작
const app = initializeApp(firebaseConfig)
export default app;
// firebase의 firestore 인스턴스를 변수에 저장
export const db = getFirestore(app)