import React, { useState, useEffect } from "react";
import styles from "./ChatRoom.module.css";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router";
import * as StompJs from "@stomp/stompjs";
import axios from "axios";

// heroicons
import { ChevronLeftIcon, MegaphoneIcon } from "@heroicons/react/24/outline";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";

export default function ChatRoom() {
  // 현재 로그인된 사용자
  const user = useSelector((state) => {
    return state.user;
  });

  let navigate = useNavigate();
  const location = useLocation();
  const seller = location.state.seller;
  const buyer = location.state.buyer;
  const type = location.state?.type;
  const title = location.state?.title;

  const me = user.userCode === seller.userCode ? seller : buyer;
  const other = user.userCode === seller.userCode ? buyer : seller;

  const param = useParams(); // 채널을 구분하는 식별자c
  const chatroomId = param.chatroomId;

  let [client, changeClient] = useState(null);
  const [chat, setChat] = useState(""); // 입력된 chat을 받을 변수
  const [chatList, setChatList] = useState([]); // 채팅 기록
  const history = location.state?.chats;

  const onChangeChat = (e) => {
    setChat(e.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const preMsgBox = history?.map((item, idx) => {
    const date = new Date(item.chat_date);
    var hour = ("0" + date.getHours()).slice(-2); //시 2자리 (00, 01 ... 23)
    var minute = ("0" + date.getMinutes()).slice(-2); //분 2자리 (00, 01 ... 59)

    if (item.chatterId !== me.userCode) {
      return (
        <div key={idx} className={styles.otherchat}>
          <div className={styles.otherimg}>
            <img src={other.kakaoProfileImg} alt="" />
          </div>
          <div className={styles.othermsg}>
            <div className={styles.msgdata}>{item.chat_content}</div>
          </div>
          <span className={styles.otherdate}>
            {hour}:{minute}
          </span>
        </div>
      );
    } else {
      return (
        <div key={idx} className={styles.mychat}>
          <div className={styles.mymsg}>
            <div className={styles.msgdata}>{item.chat_content}</div>
          </div>
          <span className={styles.otherdate}>
            {hour}:{minute}
          </span>
        </div>
      );
    }
  });

  const msgBox = chatList?.map((item, idx) => {
    const date = new Date();
    var hour = ("0" + date.getHours()).slice(-2); //시 2자리 (00, 01 ... 23)
    var minute = ("0" + date.getMinutes()).slice(-2); //분 2자리 (00, 01 ... 59)

    if (item.sender !== me.userCode) {
      return (
        <div key={idx} className={styles.otherchat}>
          <div className={styles.otherimg}>
            <img src={other.kakaoProfileImg} alt="" />
          </div>
          <div className={styles.othermsg}>
            <div className={styles.msgdata}>{item.data}</div>
          </div>
          <span className={styles.otherdate}>
            {hour}:{minute}
          </span>
        </div>
      );
    } else {
      return (
        <div key={idx} className={styles.mychat}>
          <div className={styles.mymsg}>
            <div className={styles.msgdata}>{item.data}</div>
          </div>
          <span className={styles.mydate}>
            {hour}:{minute}
          </span>
        </div>
      );
    }
  });

  // // 스크롤 위치 제어하기
  // const scrollRef = useRef();
  // const chatDiv = document.getElementsById("ChatRoom");
  // const nowScrollY = chatDiv.scrollTop;
  // const scrollHeight = chatDiv.scrollHeight;
  // chatDiv.scrollTop = chat.scrollHeight;

  // websocket
  // websocket
  // websocket
  // websocket
  // websocket
  // websocket
  // websocket

  const connect = () => {
    // 소켓 연결
    try {
      const clientdata = new StompJs.Client({
        brokerURL: "wss://i8c110.p.ssafy.io/chat",
        connectHeaders: {
          login: "",
          passcode: "password",
        },
        debug: function (str) {
          console.log(str);
        },
        reconnectDelay: 5000, // 자동 재 연결
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      // 구독
      clientdata.onConnect = async () => {
        clientdata.subscribe("/sub/channels/" + chatroomId, callback);
        if (type === "live") {
          clientdata.publish({
            destination: "/pub/chat/" + chatroomId,
            body: JSON.stringify({
              type: "",
              sender: user.userCode,
              channelId: chatroomId,
              data: `${title} 상품의 라이브를 요청합니다!`,
            }),
            headers: { priority: 9 },
          });
        }
      };

      clientdata.activate(); // 클라이언트 활성화
      changeClient(clientdata); // 클라이언트 갱신
    } catch (err) {
      console.log(err);
    }
  };

  const disConnect = () => {
    // 연결 끊기
    if (client === null) {
      return;
    }
    client.deactivate();
  };

  // 콜백함수 => ChatList 저장하기
  const callback = function (message) {
    if (message.body) {
      let msg = JSON.parse(message.body);
      setChatList((chats) => [...chats, msg]);
    }
  };

  useEffect(() => {});

  // 메시지 보내기
  const sendChat = () => {
    if (chat === "") {
      return;
    }

    client.publish({
      destination: "/pub/chat/" + chatroomId,
      body: JSON.stringify({
        type: "",
        sender: user.userCode,
        channelId: chatroomId,
        data: chat,
      }),
      headers: { priority: 9 },
    });

    setChat("");
  };

  // 채팅방 삭제하기
  const exitChatRoom = () => {
    if (window.confirm("대화 정보가 함께 삭제됩니다")) {
      alert("삭제되었습니다");

      axios
        .delete(`${process.env.REACT_APP_API_URL}/socket/exit?id=${chatroomId}`)
        .then((res) => {
          disConnect();
          navigate("/chatlist");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const onKeypress = (e) => {
    if (e.keyCode==13) {
      sendChat();
    } 
  }

  useEffect(() => {
    // 최초 렌더링 시 , 웹소켓에 연결
    connect();
    // 스크롤 위치 조작
    // scrollRef.current.scrollTop = scrollRef.current.scrollHeight;

    return () => disConnect();
  }, []);

  return (
    <>
      <div className={styles.container}>
        {/* 상단 네비게이션 */}
        <div className={styles.topbar}>
          <ChevronLeftIcon
            onClick={() => {
              disConnect();
              navigate("/chatlist");
            }}
          />
          <span>{other.kakaoNickname}</span>
          <div className={styles.delete} onClick={exitChatRoom}>
            나가기
          </div>
        </div>

        {/* 채팅 리스트 */}
        <div className={styles.chatbox}>
          {preMsgBox}
          {msgBox}
        </div>

        {/* 하단 입력폼 */}
        <form className={styles.sendzone} onSubmit={handleSubmit}>
          <MegaphoneIcon
            onClick={() => navigate(`/report/${other.userCode}`, {state : {
              kakaoNickname : other.kakaoNickname,
            }})}
          />
          <div className={styles.inputbar}>
            <div>
              <input
                type="text"
                id="msg"
                value={chat}
                placeholder="메시지 보내기"
                className={styles.input}
                onChange={onChangeChat}
                onKeypress={onKeypress}
              />
            </div>
            <ArrowUpCircleIcon
              value="전송"
              className={styles.sendbtn}
              onClick={sendChat}
            />
          </div>
        </form>
      </div>
    </>
  );
}
