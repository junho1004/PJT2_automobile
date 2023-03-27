import React from "react";
import styles from "./NotFound.module.css";
import { useNavigate } from "react-router-dom";
import logoImg from '../../assets/images/logo.png'

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className={styles.body}>
      <div className={styles.top}>
        <div className={styles.notfound}>Not Found</div>
        <div className={styles.errcode}>404</div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.logo}>
            <img src={logoImg} alt="" />
        </div>
        <div
          onClick={() => {
            navigate("/");
          }}
          className={styles.gohome}
        >
         홈으로 돌아가기
        </div>
      </div>
    </div>
  );
}
