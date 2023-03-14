import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./ChattingList.module.css";
import _ from "lodash";

const ChattingList = (props) => {
  const scrollRef = useRef();
  const boxRef = useRef(null);

  const [scrollState, setScrollState] = useState(true);

  const scrollEvent = _.debounce(() => {
    const scrollTop = boxRef.current.scrollTop; // 스크롤 위치
    const clientHeight = boxRef.current.clientHeight; // 요소의 높이(메세지 박스 창의 높이)
    const scrollHeight = boxRef.current.scrollHeight; // 스크롤의 높이

    // 스크롤이 맨 아래에 있을때
    setScrollState(
      scrollTop + clientHeight >= scrollHeight - 100 ? true : false
    );
  }, 100);

  const scroll = useCallback(() => {
    scrollEvent();
  }, []);

  useEffect(() => {
    if (scrollState) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [props.messageList]);

  useEffect(() => {
    boxRef.current.addEventListener("scroll", scroll);
  });

  return (
    <div ref={boxRef} className={styles.chattinglist}>
      <div>
        {props.messageList.map((msg, i) => (
          <div key={i}>
            <div className={styles.chat}>
              <div className={styles.profile}>
                <img
                  src={msg.split(":")[1]}
                  className={styles.profileimg}
                  alt="img"
                />
              </div>
              <div className={styles.chatcontent}>
                <div className={styles.sender}>{msg.split(":")[2]}</div>
                <div className={styles.content}>{msg.split(":")[3]}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div ref={scrollRef}></div>
    </div>
  );
};

export default ChattingList;
