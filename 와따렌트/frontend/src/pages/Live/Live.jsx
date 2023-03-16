import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import BottomNavDark from "../../components/Nav/BottomNavDark.jsx";
import styles from "./Live.module.css";
import cn from "classnames";
import SellLive from "./SellLive";
import BuyLive from "./BuyLive.jsx";

export default function Live() {
  const [sellLiveRequestList, setSellLiveRequestList] = useState();
  const [onairList, setOnairList] = useState();
  const [waitList, setWaitList] = useState();
  const userId = useSelector((state) => {
    return state.user.userCode;
  });

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/live/main?userCode=${userId}`)
      .then((res) => {
        setSellLiveRequestList(res.data.sellLiveRequestList);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`${process.env.REACT_APP_API_URL}/live/request/start/${userId}`)
      .then((res) => {
        setOnairList(res.data.myLiveRoomList);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`${process.env.REACT_APP_API_URL}/live/request/wait/${userId}`)
      .then((res) => {
        setWaitList(res.data.myLiveRoomList);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userId]);

  //toggle 상태 표시
  const [toggle, settoggle] = useState(true);
  // toggle을 클릭하면 toggle 바꿔주기
  const toggleMode = () => {
    settoggle(!toggle);
  };

  return (
    <div className={styles.body}>
      <div className={styles.logo}>LIVE</div>
      {toggle ? (
        <SellLive sellLiveRequestList={sellLiveRequestList} userId={userId} />
      ) : (
        <BuyLive onairList={onairList} waitList={waitList} />
      )}

      <div className={styles.togglebtn}>
        <div className={cn(styles.button, styles.cover, styles.toggle)}>
          <div className={cn(styles.button, styles.cover)}>
            <div className={cn(styles.button, styles.r)}>
              <input
                type="checkbox"
                className={styles.checkbox}
                onClick={toggleMode}
              />
              <div className={styles.knobs}></div>
              <div className={styles.layer}></div>
            </div>
          </div>
        </div>
      </div>
      <BottomNavDark />
    </div>
  );
}
