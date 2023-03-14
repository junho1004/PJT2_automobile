import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./GpsPage.module.css";

export default function GpsPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.background}>
        <div style={{padding:"50px"}}>
          <div className={styles.texta}>하이요</div>
          </div>
    </div>
  );
}
