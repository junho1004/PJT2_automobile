import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./ReservationModal.module.css";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/esm/locale";
import "react-datepicker/dist/react-datepicker.css";

import { XMarkIcon, ClockIcon } from "@heroicons/react/24/outline";
import axios from "axios";

export default function ReservationModal({ setModalOpen, productId }) {
  const [reserve, setReserve] = useState(new Date());
  const [product, setProduct] = useState({});
  const userId = useSelector((state) => {
    return state.user.userCode;
  });
  const token = window.localStorage.getItem("token");

  // 모달 끄기
  const closeModal = () => {
    setModalOpen(false);
  };

  // 상품정보 불러오기
  useEffect(() => {
    axios
      .get(
        `https://i8c110.p.ssafy.io/api/v1/product/${productId}?userCode=${userId}`
      )
      .then((res) => {
        setProduct(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSubmit = () => {
    setModalOpen(false);

    axios
      .post(`https://i8c110.p.ssafy.io/api/v1/talk/reserve/${productId}`, {
        ...product,
        reserve,
      })
      .then((res) => console.log(res, '😍'))
      .catch((err) => console.log(err));

    const body = JSON.stringify({
      productId: productId,
      liveStartTime: reserve,
      liveStatus: "WAIT",
    });

    axios
      .post(`https://i8c110.p.ssafy.io/api/v1/live/room`, body, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res.data)
        window.location.replace("/live")
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={styles.container}>
      <p className={styles.title}>
        <ClockIcon className={styles.icon} />
        라이브 예약하기
      </p>
      <XMarkIcon onClick={closeModal} className={styles.close} />
      <div className={styles.date}>
        <DatePicker
          locale={ko}
          selected={reserve}
          onChange={(date) => setReserve(date)}
          showTimeInput
          dateFormat="MM/dd aa h:mm"
          minDate={new Date()}
          popperModifiers={{
            // 모바일 web 환경에서 화면을 벗어나지 않도록 하는 설정
            preventOverflow: {
              enabled: true,
            },
          }}
          onFocus={(e) => e.target.blur()}
          className={styles.datepicker}
        />
        <button onClick={handleSubmit} className={styles.btn}>
          예약하기
        </button>
      </div>
    </div>
  );
}
