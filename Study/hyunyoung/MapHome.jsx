import React from "react";
// import { useNavigate } from "react-router-dom";
import styles from "./MapHome.module.css"

export default function MapHome() {
    const id = window.localStorage.getItem("loginId");

  return (
    <div className={styles.background}>
    <div className={styles.body}>
      <div className={styles.top}>
        <div className={styles.topleft}>
          <div className={styles.alla}>
          <div className={styles.font}><div className={styles.fontchild}>{id}님 안녕하세요</div></div>
          {/* <div className={styles.font}><div className={styles.fontchild}>RENTCAR</div></div> */}
          </div>
        </div>
        {/* <div className={styles.topright}></div> */}
      </div>
      <div className={styles.bottom}>
       
      </div>
    </div>
    </div>
  );
}
