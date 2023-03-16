import React from "react";
import styles from './Price.module.css';

export default function Price({
  handleBidPrice,
  myUserName,
  myProfileImg,
  myUserCode,
  tenCount,
}) {
  return (
    <div className={styles.prices}>
      <button
        onClick={() => {
          // setBidCount(1);
          tenCount();
          handleBidPrice(100, myUserName, myProfileImg, 1, myUserCode);
        }}
      >
        +100
      </button>
      <button
        onClick={() => {
          // setBidCount(1);
          tenCount();
          handleBidPrice(500, myUserName, myProfileImg, 1, myUserCode);
        }}
      >
        +500
      </button>
      <button
        onClick={() => {
          // setBidCount(1);
          tenCount();
          handleBidPrice(1000, myUserName, myProfileImg, 1, myUserCode);
        }}
      >
        +1000
      </button>
    </div>
  );
}
