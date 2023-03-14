import React from "react";
import styles from "./BuyerLoading.module.css";
import buyergo from "../../assets/images/buyer.png";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function BuyerLoading({ joinSession, title }) {
  const navigate = useNavigate();

  return (
    <div className={styles.back}>
      <div className={styles.navleft}>
        <ChevronLeftIcon
          className="w-6 h-6 text-white"
          onClick={() => {
            navigate("/live");
          }}
        />
      </div>
      <div className={styles.body}>
        <div className={styles.title}>"{title}"</div>
        <div className={styles.live} onClick={joinSession}>
          라이브 입장하기
        </div>
      </div>

      <div className={styles.tutorial}>
        <div className={styles.p1}>
          <div className={styles.p11}>1. 판매자에게 상품 설명을 들은 후에,</div>
          <div className={styles.p11}>
            <span className={styles.span}>30초 안에</span>
            <img src={buyergo} alt="go" className={styles.goicon} />
            <span className={styles.span}> 버튼을 눌러</span>
          </div>
          <div>구매 의사를 표시하세요!</div>
        </div>

        <div className={styles.p1}>
          <div className={styles.p11}>
            2. 구매하고 싶은 사람이 2명 이상이면,
          </div>
          <div>줌고만의 미니 경매가 시작됩니다!</div>
        </div>

        <div className={styles.p1}>
          <div className={styles.p11}>3. 화면에 뜬 가격 버튼을 누르면,</div>
          <div>자동 입찰됩니다.</div>
        </div>

        <div className={styles.p1}>
          <div className={styles.p11}>
            4. 입찰된 후 10초 안에 입찰하지 않으면,
          </div>
          <div>상품이 낙찰됩니다.</div>
        </div>
      </div>
    </div>
  );
}
