import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ReservationHome.module.css";
import { useLocation } from "react-router";
import spot from "../../assets/images/spot.png";

import Calendar from "./Calendar.jsx";
import TimePicker from "./TimePicker";

import Reservation from "./Reservation";
import previous from "../../assets/images/previous.png";


export default function ReservationHome() {
  const id = window.localStorage.getItem("loginId");
  const navigate = useNavigate();
  const location = useLocation();
  const address = window.localStorage.getItem("address");

  return (
    <div className={styles.background}>
        <div className={styles.next}>
          <div className={styles.text}>예약하기</div>
          <button
              onClick={() => {
                { navigate("/MapHome")}
              }}
            ><img src={previous} alt="go" className={styles.mini}/></button>
        </div>
        <div className={styles.next1}>
            <img src={spot} alt="go" style={{width:"60px",height:"50px"}} />
            <div>
            <div className={styles.text1}>현재위치</div>
            <div className={styles.text2}>{address}</div>
            </div>
        </div>
      {/* <div><p className={styles.text3}>대여일</p></div> */}
      <div style={{ marginTop : "15px", marginLeft: "10px"}}>
        <Calendar />
        <br />
      </div>
      <div>
        <TimePicker/>
      </div>

      <div className={styles.next2}>
        <button
        className={styles.next2}
              onClick={() => {
                { navigate("/SelectCar")};
                window.location.reload();
              }}
            >
              <div className={styles.text1}>다음</div>
            </button>
        </div>
    </div>
  );
}
