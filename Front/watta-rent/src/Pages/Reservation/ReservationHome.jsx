import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ReservationHome.module.css";
import spot from "../../assets/images/spot.png";
import Calendar from "../../Components/Reservation/Calendar";
import TimePickerStart from "../../Components/Reservation/TimePickerStart";
import TimePickerEnd from "../../Components/Reservation/TimePickerEnd";
import previous from "../../assets/images/previous.png";
import { db } from "../../firebase-config"
import { doc, onSnapshot } from "firebase/firestore";

export default function ReservationHome() {
  const navigate = useNavigate();
  const address = window.localStorage.getItem("address");
  const nickname = window.localStorage.getItem("loginNickname")
  const [ startdate, setStartdate ] = useState("")
  const [ enddate, setEnddate ] = useState("")
  const [ starttime, setStarttime ] = useState("")
  const [ endtime, setEndtime ] = useState("")

  const firebaseDate = onSnapshot(doc(db, "Reservation", "reservation_date"), (doc) => {
    setStartdate(doc.data().start_date)
    setEnddate(doc.data().end_date)
  })
  const firebaseTime = onSnapshot(doc(db, "Reservation", "reservation_time"), (doc) => {
    setStarttime(doc.data().start_time)
    setEndtime(doc.data().end_time)
  })
  useEffect(()=> {
    firebaseDate()
    firebaseTime()
  })

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
            <img src={spot} alt="go" style={{width:"40px",height:"30px"}} />
            <div>
            <div className={styles.text1}>현재위치</div>
            <div className={styles.text1} style={{fontSize:"0.7em"}}>{address}</div>
            </div>
        </div>

      <div style={{width:"100%", height:"50%"}}>
      <div className={styles.next1}  style={{height:"17%", justifyContent:"center", margin:"auto", fontWeight:"800", fontSize:"1.7em"}}>
        <p className={styles.text1} style={{textAlign:"center"}}>날짜&시간 선택</p>
        </div>
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
      <div style={{width:"100%", height:"50%"}}>
        <div className={styles.next1}  style={{height:"17%", marginTop:"50px", justifyContent:"center", fontWeight:"800", fontSize:"1.7em"}}>
          <p className={styles.text1} style={{textAlign:"center"}}>예약 확인</p>
        </div>
        <div>
          <p className={styles.text2}>
              {nickname}님
          </p>
          <p className={styles.text2}>
              {startdate}일자 {starttime}부터
          </p>
          <p>
              {enddate}일자 {endtime}까지
          </p>
          <p>
              예약하실래요?
          </p>
        </div>
      </div>

      <div className={styles.next3}>
        <button
          className={styles.next3}
                onClick={() => {
                  // updateDateFirebase()
                  // updateTimeFirebase()
                  { navigate("/SelectCar")};
                  // window.location.reload();
                }}
              >
              <div className={styles.text3}>다음</div>
        </button>
      </div>
    </div>
  );
}
