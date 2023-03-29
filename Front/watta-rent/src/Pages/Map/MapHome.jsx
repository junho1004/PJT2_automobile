import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MapHome.module.css";
import GpsPage from "../../Components/Map/GpsPage";
import { useLocation } from "react-router";


export default function MapHome() {
  const id = window.localStorage.getItem("loginNickname");
  const navigate = useNavigate();
  const location = useLocation();


  return (
    <div className={styles.background}>
      <div className={styles.body1}>
        <div className={styles.topleft}>
          <div className={styles.text}>
            <button
              onClick={() => {
                { navigate("/");}
              }}
            >
              🏠HOME
            </button>
          </div>
          <div className={styles.texta}><span className={styles.textc}>{id}</span> 님 안녕하세요</div>
        </div>
        <div className={styles.textb}>어디로 모시러 갈까요?</div>
          <div className={styles.body2}>
            <GpsPage />
          </div>
        </div>
        <div className={styles.next}>
          <button
          // className={styles.next}
                onClick={() => {
                  { navigate("/ReservationHome")}
                }}
              >
              <div className={styles.text1}>예약하기</div>
          </button>
        </div>
    </div>
  );
}
