import React, { useEffect, useState } from "react";
import styles from "./UserInfo.module.css";
import BottomNav from "../../components/Nav/BottomNav";
import Reviews from "./Reviews";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { persistor } from "../../index";
import { useLocation } from "react-router";

import {
  ChevronLeftIcon,
  HeartIcon,
  ShoppingBagIcon,
  ListBulletIcon,
  CircleStackIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

export default function UserInfo() {
  const location = useLocation();
  const curLocation = location.pathname;
  const [userInfo, setUserInfo] = useState({});

  // 마이 페이지 인지 확인하기
  const param = useParams();
  const navigate = useNavigate();
  const userId = param.userId;

  const me = useSelector((state) => {
    return state.user;
  });

  // 해당 페이지의 사용자와 로그인 된 사용자가 동일한 인물인지 확인
  const isMe = Number(userId) === me.userCode ? true : false;

  // 로그아웃
  const KAKAO_AUTH_URI = `https://kauth.kakao.com/oauth/logout?client_id=${process.env.REACT_APP_REST_API_KEY}&logout_redirect_uri=${process.env.REACT_APP_LOGOUT_REDIRECT_URI}`;

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("recents");
      persistor.purge();
    }
  };

  //   사용자 정보를 불러오는 api
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_USER}/${userId}`).then((res) => {
      setUserInfo(res.data.user);
    });
  }, [userId]);

  return (
    <div className={styles.body}>
      <div className={styles.nav}>
        <div className={styles.navleft}>
          <ChevronLeftIcon
            className="w-6 h-6 text-black-100"
            onClick={() => {
              navigate(-1);
            }}
          />
          <div className={styles.title}>프로필</div>
        </div>
        {isMe ? (
          <div className={styles.navright} onClick={handleLogout}>
            <a href={KAKAO_AUTH_URI} className={styles.logout}>
              로그아웃
            </a>
          </div>
        ) : (
          <div
            className={styles.navright}
            onClick={() => {
              navigate(`/report/${userInfo?.userCode}`, {
                state: {
                  kakaoNickname: userInfo.kakaoNickname,
                },
              });
            }}
          >
            <div className={styles.logout}>신고하기</div>
          </div>
        )}
      </div>

      <div className={styles.userinfo}>
        <div className={styles.userimg}>
          <img src={userInfo.kakaoProfileImg} alt="" />
        </div>
        <div className={styles.userdiv}>
          <div className={styles.username}>{userInfo.kakaoNickname}</div>
          {isMe ? (
            <PencilSquareIcon
              className={styles.updateicon}
              onClick={() => {
                navigate(`/userinfo/${userId}/update`);
              }}
            />
          ) : null}
        </div>
        {isMe ? (
          <div className={styles.mypoint}>
            <div className={styles.myptblack}>내 포인트</div>
            <div className={styles.myptgreen}>{userInfo.point}pt</div>
          </div>
        ) : null}
      </div>
      {/* 목록 리스트 */}
      <div className={styles.menus}>
        <div className={styles.menustitle}>거래 내역</div>
        <div className={styles.menu}>
          <CircleStackIcon className={styles.menuicon} />
          <div
            className={styles.menutitle}
            onClick={() => {
              navigate(`/selllist/${userId}`);
            }}
          >
            판매목록
          </div>
        </div>
        {isMe ? (
          <>
            <div className={styles.menu}>
              <HeartIcon className={styles.menuicon} />
              <div
                className={styles.menutitle}
                onClick={() => {
                  navigate(`/wishlist`);
                }}
              >
                관심목록
              </div>
            </div>
            <div className={styles.menu}>
              <ShoppingBagIcon className={styles.menuicon} />
              <div
                className={styles.menutitle}
                onClick={() => {
                  navigate(`/buylist`);
                }}
              >
                구매목록
              </div>
            </div>
            <div className={styles.menu}>
              <ListBulletIcon className={styles.menuicon} />
              <div
                className={styles.menutitle}
                onClick={() => {
                  navigate("/myreviewlist", {
                    state: {
                      userId,
                    },
                  });
                }}
              >
                내가 쓴 리뷰
              </div>
            </div>
          </>
        ) : null}
      </div>
      {/* 사용자에게 달린 리뷰 */}
      <Reviews userInfo={userInfo} />

      {/* <UserInfoDetail/> */}
      <BottomNav curLocation={curLocation} />
    </div>
  );
}
