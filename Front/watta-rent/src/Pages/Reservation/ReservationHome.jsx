import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ReservationHome.module.css";
import spot from "../../assets/images/spot.png";
import Calendar from "../../Components/Reservation/Calendar";
import TimePickerStart from "../../Components/Reservation/TimePickerStart";
import TimePickerEnd from "../../Components/Reservation/TimePickerEnd";
import previous from "../../assets/images/previous.png";
import { db } from "../../firebase-config"
import { collection, updateDoc, doc, setDoc } from "firebase/firestore";

export default function ReservationHome() {
  const navigate = useNavigate();
  const address = window.localStorage.getItem("address");

  // firebase와 통신
  async function updateDateFirebase() {
    const dateResult = await setDoc(doc(db, "Reservation", "reservation_date"), {
      start_date: sessionStorage.getItem("reservation_start_date"),
      end_date: sessionStorage.getItem("reservation_end_date"),
    });
    return dateResult;
  }

  async function updateTimeFirebase() {
    const timeResult = await setDoc(doc(db, "Reservation", "reservation_time"), {
      start_time: sessionStorage.getItem("reservation_start_time"),
      end_time: sessionStorage.getItem("reservation_end_time")
    });
    return timeResult;
  }


  return (
    <div className={styles.background}>
      <div className={styles.back1}>
         <div className={styles.next}>
          <div className={styles.text} style={{backgroundColor:"black"}}>예약하기</div>
          <button
              onClick={() => {
                { navigate("/MapHome")}
              }}
            ><img src={previous} alt="go" className={styles.mini}/></button>
        </div>
        </div>
        <div className={styles.next1}>
            <img src={spot} alt="go" style={{width:"60px",height:"50px"}} />
            <div>
            <div className={styles.text1}>현재위치</div>
            <div className={styles.text2}>{address}</div>
            </div>
        </div>

      <div style={{width:"100%", height:"100%"}}>
        <div style={{ marginTop : "30px", marginLeft: "10px"}}>
          <Calendar />
          <br />
        </div>
        <div className={styles.text4}>
          <h2 >대여 시간 : </h2>
          <hr style={{marginBottom:"10px",}}/>
          <TimePickerStart/>
        </div>
        <br />

        <div className={styles.text4}>
          <h2 >반납 시간 : </h2>
          <hr style={{marginBottom:"10px",}}/>
          <TimePickerEnd/>
        </div>
      </div>

      <div className={styles.next3}>
        <button
          className={styles.next3}
                onClick={() => {
                  updateDateFirebase()
                  updateTimeFirebase()
                  { navigate("/SelectCar")};
                  window.location.reload();
                }}
              >
              <div className={styles.text3}>다음</div>
        </button>
      </div>
    </div>
  );
}
