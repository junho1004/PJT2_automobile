import React, { useEffect, useState } from "react";
import styles from "./LiveStart.module.css";

export default function LiveStart({ product, clickLive }) {
  return (
    <div className={styles.box}>
      <div
        className={styles.image}
        style={{
          backgroundImage:
          "url("+`${product.thumbnail}`+")",
        }}
      >
        <p className={styles.title}>{product.title}</p>
        <button
          className={styles.btn}
          onClick={() => {
            clickLive(product.productId);
          }}
        >
          라이브 시작하기
        </button>
      </div>
    </div>
  );
}
