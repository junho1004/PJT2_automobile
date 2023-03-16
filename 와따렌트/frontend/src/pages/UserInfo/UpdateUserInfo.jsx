import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import axios from "axios";

import styles from "./UpdateUserInfo.module.css";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

export default function UpdateUserInfo() {
  const param = useParams();
  const navigate = useNavigate();
  const userId = param.userId;
  const me = useSelector((state) => {
    return state.user;
  });

  const [nickname, setNickname] = useState(me.kakaoNickname);

  const content = {
    nickname,
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    let formData = new FormData();
    let files = e.target.imgurl.files;

    if (files[0]) {
      formData.append("imgUrl", files[0]);
    }

    formData.append(
      "content",
      new Blob([JSON.stringify(content)], { type: "application/json" })
    );

    await axios
      .patch(`${process.env.REACT_APP_API_USER}/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        navigate(`/userinfo/${userId}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };

  return (
    <>
      <form className={styles.body} onSubmit={handleUpdate}>
        <div className={styles.nav}>
          <div className={styles.navleft}>
            <ChevronLeftIcon
              className="w-6 h-6 text-black-100"
              onClick={() => {
                navigate(`/userinfo/${userId}`);
              }}
            />
            <div className={styles.title}>프로필 수정</div>
          </div>
          <button type="submit" className={styles.navright}>
            <p className={styles.save}>저장</p>
          </button>
        </div>

        <div className={styles.userimg}>
          <img
            src={me.kakaoProfileImg}
            alt=""
            style={{ borderRadius: "100px" }}
          />

          <input
            className={styles.file}
            type="file" // 파일로 입력 받음
            accept="image/*" // 이미지 유형의 파일만 받기
            name="imgurl" // 담긴 파일을 참조할 때 사용할 이름
          />
        </div>

        <div className={styles.udtnickname}>
          <div className={styles.nickname}>별명</div>
          <textarea
            className={styles.content}
            cols="30"
            rows="3"
            value={nickname}
            placeholder="닉네임을 입력해주세요."
            onChange={handleNicknameChange}
          ></textarea>
        </div>
      </form>
    </>
  );
}
