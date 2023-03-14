import React from "react";
import styles from "./LiveCard.module.css";

export default function LiveCard({ product, clickLive }) {
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
          라이브 입장하기
        </button>
      </div>
    </div>
  );
}
