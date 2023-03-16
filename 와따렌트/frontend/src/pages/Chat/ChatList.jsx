import React, { useEffect, useState } from "react";
import styles from "./ChatList.module.css";
import Bottomnav from "../../components/Nav/BottomNav.jsx";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import axios from "axios";

export default function ChatList() {
  const location = useLocation();
  const curLocation = location.pathname;
  const navigate = useNavigate();

  const userId = useSelector((state) => {
    return state.user.userCode;
  });

  const [chats, setChats] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/socket/${userId}/all`)
      .then((res) => {
        const sorted_list = res.data.sort(function (a, b) {
          return (
            new Date(b.lastChat.chat_date).getTime() -
            new Date(a.lastChat.chat_date).getTime()
          );
        });
        setChats(sorted_list);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // 일반채팅하기
  const getChatHistory = (sellerId, buyerId) => {
    // 판매자 정보, 구매자 정보 보내주기
    axios
      .post(`${process.env.REACT_APP_API_URL}/socket/room`, {
        buyerCode: buyerId,
        sellerCode: sellerId,
      })
      .then((res) => {
        console.log(res.data);
        navigate(`/chatroom/${res.data.chatRoomId}`, {
          state: {
            chats: res.data.chatList,
            seller: res.data.seller,
            buyer: res.data.buyer,
            type: "",
            title: "",
            productId: "",
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <div className={styles.title}>채팅</div>
      <div className={styles.chatlistbox}>
        {chats?.map((chat, idx) => {
          return (
            <div
              key={idx}
              className={styles.chat}
              onClick={() => {
                getChatHistory(chat.seller.userCode, chat.buyer.userCode);
              }}
            >
              <div className={styles.otherimg}>
                <img
                  src={
                    chat.seller.userCode === userId
                      ? chat.buyer.kakaoProfileImg
                      : chat.seller.kakaoProfileImg
                  }
                  alt=""
                />
              </div>
              <div className={styles.chatinfo}>
                <div className={styles.chatinfotop}>
                  <div className={styles.othername}>
                    {chat.seller.userCode === userId
                      ? chat.buyer.kakaoNickname
                      : chat.seller.kakaoNickname}
                  </div>
                  { chats &&
                    <div className={styles.time}>
                      {chat?.lastChat["chat_date"]?.slice(5, 7)}월{" "}
                      {chat?.lastChat["chat_date"]?.slice(8, 10)}일{" "}
                      {Number(chat?.lastChat["chat_date"]?.slice(11, 13)) + 9}:
                      {chat?.lastChat["chat_date"]?.slice(14, 16)}
                    </div>
                  }
                </div>
                <span className={styles.lastmsg}>
                  {chat.lastChat["chat_content"]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <Bottomnav curLocation={curLocation} />
    </div>
  );
}
