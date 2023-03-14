import axios from "axios";
import React from "react";
import styles from "./SellerLoading.module.css";
import sellergo from "../../assets/images/sellergo.png";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function SellerLoading({ joinSession, roomId, title }) {
  const token = window.localStorage.getItem("token");
  const navigate = useNavigate();

  const onairSession = () => {
    axios
      .patch(`https://i8c110.p.ssafy.io/api/v1/talk/start/${roomId}`)
      .then((res) => console.log(res, "😀"))
      .catch((err) => console.log(err));

    //   .catch((err) => console.log(err));
    // const body = JSON.stringify({
    //   productId: roomId,
    //   liveStartTime: new Date(),
    //   liveStatus: "ONAIR",
    // });

    // axios
    //   .patch(`https://i8c110.p.ssafy.io/api/v1/live/${roomId}`, body, {
    //     headers: {
    //       Authorization: token,
    //       "Content-Type": "application/json",
    //     },
    //   })
    //   .then((res) => console.log(res))
    //   .catch((err) => console.log(err));
  };

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
        <div
          className={styles.live}
          onClick={() => {
            onairSession();
            joinSession();
          }}
        >
          라이브 시작하기
        </div>
      </div>

      <div className={styles.tutorial}>
        <div className={styles.p1}>
          <div className={styles.p11}>
            1. 구매자들에게 상품 설명을 마친 후에,
          </div>
          <div className={styles.p11}>
            <img src={sellergo} alt="go" className={styles.goicon} />
            <span className={styles.span}> 버튼을 눌러</span>
          </div>
          <div>30초 동안 구매 의사를 확인하세요!</div>
        </div>

        <div className={styles.p1}>
          <div className={styles.p11}>
            2. 구매하고 싶은 사람이 2명 이상이면,
          </div>
          <div>줌고만의 미니 경매가 시작됩니다!</div>
        </div>
        <div>경매를 통해 물건을 팔아보세요😉</div>
      </div>
    </div>
  );
}
