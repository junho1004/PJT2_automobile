import React from "react";
import BarLoader from "react-spinners/BarLoader";
import styles from './Loading.module.css';

export default function Loading() {
  return (
    <div className={styles.body}>
        <BarLoader className={styles.spinner}/>
    </div>
  );
}
