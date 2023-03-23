import React from "react";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import kakaoBtn from "../../assets/images/kakao_login_medium_wide.png";
import car from "../../assets/images/car.png";


export default function Login() {
  const navigate = useNavigate();

  const KAKAO_AUTH_URI = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_REST_API_KEY}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=code`;

  return (
    <div className={styles.body}>
      <div className={styles.nav}>
        <ChevronLeftIcon className="w-6 h-6 text-gray-100" onClick={() => {navigate(-1)}} />
        <div className={styles.title}>로그인 하기</div>
      </div>
      <div className={styles.logo}><img src={car} alt="go" ></img></div>
      
      {/* 로그인 버튼을 누르면 인가코드를 발급 받기 */}
      <a href={KAKAO_AUTH_URI}>
        <img className={styles.kakaoBtn} src={kakaoBtn} />
      </a>
    </div>
  );
}
