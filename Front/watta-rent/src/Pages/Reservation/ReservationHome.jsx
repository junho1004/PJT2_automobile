import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ReservationHome.module.css";
import spot from "../../assets/images/spot.png";
import Calendar from "../../Components/Reservation/Calendar";
import TimePickerStart from "../../Components/Reservation/TimePickerStart";
import TimePickerEnd from "../../Components/Reservation/TimePickerEnd";
import previous from "../../assets/images/previous.png";
import { db } from "../../firebase-config"
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export default function ReservationHome() {
  const navigate = useNavigate();
  const todayDate = new Date()
  const year = todayDate.getFullYear()
  const month = todayDate.getMonth() + 1
  const date = todayDate.getDate()
  const address = window.localStorage.getItem("address");
  const nickname = window.localStorage.getItem("loginNickname")
  const [ startdate, setStartdate ] = useState(year + "-" + month + "-" + date)
  const [ enddate, setEnddate ] = useState(year + "-" + month + "-" + date)
  const [ starttime, setStarttime ] = useState("00:00")
  const [ endtime, setEndtime ] = useState("00:00")

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

  const getDateDiff = (d1, d2, t1, t2) => {
    const date1 = new Date(d1 + " " + t1);
    const date2 = new Date(d2 + " " + t2);
    const diffDate = date2.getTime() - date1.getTime();
    console.log(diffDate / 1000)

    // firebase 출발 시간 업데이트
    async function updateFirebase() {
      const result = await updateDoc(
        doc(db, "Reservation", "start_waiting_time"),
        {
          start_wait: diffDate / 1000,
        }
      );
      return result;
    }
    updateFirebase();
    return Math.abs(diffDate / 1000); // 밀리세컨 * 초 * 분 * 시 = 일
  };

   return (
    <div className={styles.background}>
      <div className={styles.back1}>
        <div className={styles.next}>
          <div className={styles.text} style={{ backgroundColor: "black" }}>
            예약하기
          </div>
          <button
            onClick={() => {
              {
                navigate("/MapHome");
              }
            }}
          >
            <img src={previous} alt="go" className={styles.mini} />
          </button>
        </div>
      </div>
      <div className={styles.next1}>
        <img src={spot} alt="go" style={{ width: "40px", height: "30px" }} />
        <div>
          <div className={styles.text1}>현재위치</div>
          <div className={styles.text1} style={{ fontSize: "0.7em" }}>
            {address}
          </div>
        </div>
      </div>

      <div style={{ width: "100%", height: "80%" }}>
        <div
          className={styles.next11}
          style={{
            height: "10%",
            justifyContent: "center",
            margin: "auto",
            fontWeight: "600",
            fontSize: "1.7em",
          }}
        >
          <p className={styles.text1} style={{ textAlign: "center" }}>
            날짜&시간 선택
          </p>
        </div>



        <div style={{ margin: "5%" }}> {/* 달력전체 감싸는 div */}
          <div>
            <Calendar />
            <br />
          </div>

          <div className={styles.text4}>
            <h2>대여 시간 : </h2>
            <hr style={{ marginBottom: "10px" }} />
            <TimePickerStart />
          </div>
          <br />

          <div className={styles.text4}>
            <h2>반납 시간 : </h2>
            <hr style={{ marginBottom: "10px" }} />
            <TimePickerEnd />
          </div>
        </div>
        {/* <div style={{ width: "100%", height: "40%" }}> */}
          <div
            className={styles.next11}
            style={{
              height: "10%",
              justifyContent: "center",
              fontWeight: "600",
              fontSize: "1.7em",
            }}
          >
            <p className={styles.text1} style={{ textAlign: "center" }}>
              예약 확인
            </p>
          </div>
        {/* </div> */}

        {/* 예약 확인 카드 */}
        <div>
          <Card
            style={{
              width: 330,
              height: "150px",
              margin: "auto",
              marginTop: "3%",
            }}
          >
            <CardContent style={{ margin: "15px" }}>
              <Typography
                variant="h6"
                style={{ textAlign: "center", fontSize: "0.9em" }}
              >
                🚕{nickname}님이 선택하신 📆⌚는
              </Typography>
              <Typography
                variant="h"
                component="div"
                style={{ textAlign: "center", fontSize: "1.1em" }}
              >
                {startdate}일자 {starttime}부터
              </Typography>
              <Typography
                variant="h"
                component="div"
                style={{ textAlign: "center", fontSize: "1.1em" }}
              >
                {enddate}일자 {endtime}입니다.
              </Typography>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className={styles.next3}>
        <button
          className={styles.next3}
          onClick={() => {
            getDateDiff(startdate, enddate, starttime, endtime);
            {
              window.location.replace("/SelectCar");
            }
          }}
        >
          <div className={styles.text3}>다음</div>
        </button>
      </div>
    </div>
  );
}
