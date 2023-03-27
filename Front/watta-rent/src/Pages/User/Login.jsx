import React from "react";
import LoginComponent from "../../Components/Login/LoginComponent";
import styles from "./Login.module.css";

export default function Home() {
  return (
    <div className={styles.background}>
          <LoginComponent />
    </div>
  );
}
