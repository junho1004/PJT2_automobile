import React, { useState } from "react";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import styles from "./ChattingForm.module.css";

const ChattingForm = (props) => {
  const [message, setMessage] = useState("");

  // 메세지를 보내는 함수
  const sendMessage = (event) => {
    event.preventDefault();
    if (message.trim() !== "") {
      props.onMessage(
        `${props.myProfileImg}:` + `${props.myUserName}: ` + message.trim(),
        props.currentSession
      ); // 공백을 제거하여 전달
    }
    setMessage("");
  };

  // 입력 데이터 변경
  const inputChangeHandler = (event) => {
    setMessage(event.target.value);
  };

  return (
    <form onSubmit={sendMessage} className={styles.chatform}>
      <input
        placeholder="메세지를 입력하세요"
        id="chat-input"
        value={message}
        onChange={inputChangeHandler}
        className={styles.input}
      ></input>
      <ArrowUpCircleIcon className={styles.submitbtn} onClick={sendMessage} />
    </form>
  );
};

export default ChattingForm;
