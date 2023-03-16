import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ReservationHome.module.css";
import { useLocation } from "react-router";
import spot from "../../assets/images/spot.png";
import Reservation from "./Reservation";

export default function MapHome() {
  const id = window.localStorage.getItem("loginId");
  const navigate = useNavigate();
  const location = useLocation();


  return (
    <div className={styles.background}>
        <div className={styles.next}><div className={styles.text}>예약하기</div></div>
        <div className={styles.next1}>
            <img src={spot} alt="go" style={{width:"60px",height:"50px"}} />
            <div>
            <div className={styles.text1}>현재위치</div>
            <div className={styles.text2}>서울 성북동</div>
            </div>
        </div>
      <div>대여일</div>
      <div>
      <Reservation />
      </div>
    </div>
  );
}
