import React from "react";
import styles from "./ProductItem.module.css";
import zImg from "../../assets/images/z.png";
import { HeartIcon } from "@heroicons/react/24/solid";

export default function ProductItem({ product, clickProduct }) {
  
  return (
    <div
      className={styles.body}
      onClick={() => {
        clickProduct(product.productId);
      }}
    >
      <div className={styles.productimg}>
        <img src={product.thumbnail} alt="" />
      </div>
      <div className={styles.product}>
        <div className={styles.title}>{product.title}</div>
        <div className={styles.price}>{product.price}원</div>
        <div className={styles.bottom}>
          <div
            className={styles.status}
            style={
              product.status === "ONSALE"
                ? { backgroundColor: "black", color: "white" }
                : { backgroundColor: "#d9d9d9" }
            }
          >
            {product.status === 'ONSALE' && '판매중'}
            {product.status === 'BOOKING' && '예약중'}
            {product.status === 'SOLDOUT' && '거래완료'}
          </div>
          <div className={styles.icons}>
            <div className={styles.icon}>
              {product.wishCheck ? (
                <HeartIcon class="fill-black" />
              ) : (
                <HeartIcon />
              )}
              <div className={styles.count}>{product.wishSize}</div>
            </div>
            <div className={styles.icon}>
              <div className={styles.zimg}>
                <img src={zImg} alt="" />
              </div>
              <div className={styles.zcount}>{product.liveReqSize}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
