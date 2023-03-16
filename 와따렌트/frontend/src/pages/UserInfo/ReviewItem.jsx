import React from "react";
import styles from "./ReviewItem.module.css";

export default function ReviewItem({ review }) {
  return (
    <div className={styles.body}>
      <div className={styles.review}>
        <div className={styles.userimg}>
          <img src={review.buyer.kakaoProfileImg}/>
        </div>
        <div className={styles.userinfo}>
          <div className={styles.writer}>{review.buyer.kakaoNickname}</div>
          <div className={styles.comment}>{review.review}</div>
        </div>
      </div>
    </div>
  );
}
