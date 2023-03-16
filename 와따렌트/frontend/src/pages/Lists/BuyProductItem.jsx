import React from "react";
import styles from "../../components/Product/ProductItem.module.css";
import zImg from "../../assets/images/z.png";
import { HeartIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

export default function BuyProductItem({ product, clickProduct }) {
  console.log(product)
  const navigate = useNavigate();
  return (
    <div className={styles.body}>
      <div className={styles.productimg}>
        <img src={product.thumbnail} alt="" />
      </div>
      <div className={styles.product}>
        <div className={styles.top}>
          <div
            className={styles.ttitle}
            onClick={() => {
              clickProduct(product.productId);
            }}
          >
            {product.title}
          </div>
          {!product.review && (
            <div
              className={styles.review}
              onClick={() => {
                navigate(`/review/${product.productId}/create`);
              }}
            >
              리뷰쓰고 +3pt
            </div>
          )}
        </div>
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
            {product.status === "ONSALE" && "판매중"}
            {product.status === "BOOKING" && "예약중"}
            {product.status === "SOLDOUT" && "거래완료"}
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
