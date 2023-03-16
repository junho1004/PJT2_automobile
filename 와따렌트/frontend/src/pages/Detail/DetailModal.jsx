import React, { useState, useEffect } from "react";
import styles from "./DetailModal.module.css";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useSelector } from "react-redux";
import axios from "axios";

export default function DetailModal({ setModalOpen, productId }) {
  const [chats, setChats] = useState([]);

  const userId = useSelector((state) => {
    // 현재 로그인된 사용자 === 판매자
    return state.user.userCode;
  });

  const closeModal = () => {
    setModalOpen(false);
  };

  // 리뷰 만들어주기 -> 판매 목록에 추가
  const addBuyList = (buyerId) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/review/${productId}`, {
        sellerUserCode: userId,
        buyerUserCode: buyerId,
        review: "",
      })
      .then((res) => {
        alert("거래 완료 처리 되었습니다!");
        closeModal();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    axios // 채팅목록 불러오기
      .get(`${process.env.REACT_APP_API_URL}/socket/${userId}/all`)
      .then((res) => {
        setChats(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className={styles.body}>
      <div className={styles.icon}>
        <XMarkIcon className={styles.xicon} onClick={closeModal} />
      </div>
      <span className={styles.title}>누구와 거래하셨나요?</span>
      <div className={styles.scrollbox}>
        {chats?.map((chat) => (
          <div
            key={chat.roomId}
            className={styles.userbox}
            onClick={() => {
              addBuyList(
                userId === chat.buyer.userCode
                  ? chat.seller.userCode
                  : chat.buyer.userCode
              );
            }}
          >
            <img
              src={
                userId === chat.buyer.userCode
                  ? chat.seller.kakaoProfileImg
                  : chat.buyer.kakaoProfileImg
              }
              className={styles.userimg}
            />
            <span className={styles.username}>
              {userId === chat.buyer.userCode
                ? chat.seller.kakaoNickname
                : chat.buyer.kakaoNickname}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
