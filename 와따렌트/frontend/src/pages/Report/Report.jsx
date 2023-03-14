import React, { useEffect, useState } from "react";
import styles from "./Report.module.css";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useLocation, useNavigate } from "react-router";
import { useSelector } from "react-redux";

export default function Report() {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // 신고하는 사람
  const reporter = useSelector((state) => {return state.user.userCode;});
  const [reported, setReported] = useState();
  const [content, setContents] = useState("");

  useEffect(() => {
    // 신고 당하는 사람
    axios.get(`${process.env.REACT_APP_API_USER}/${params.userId}`)
    .then((res) => {setReported(res.data)})
    .catch((err) => {console.log(err)})
  }, [])

  const handleReport = () => {
    axios
      .post(`${process.env.REACT_APP_API_USER}/report/${params.userCode}`, {
        reporter,
        content,
      })
      .then((res) => {console.log(res)})
      .catch((err) => {console.log(err)});
  };

  const handleChange = (e) => {
    setContents(e.target.value);
  };

  return (
    <div className={styles.body}>
      <div className={styles.nav}>
        <ChevronLeftIcon className="w-6 h-6 text-black-100" onClick={()=>{navigate(-1)}}/>
        <div className={styles.title}>신고하기</div>
      </div>
      <div className={styles.reportform}>
        <div className={styles.title}>
          {location?.state.kakaoNickname} 님을 신고하는 이유를 작성해주세요.
        </div>
        <textarea
          className={styles.contents}
          cols="30"
          rows="10"
          placeholder="신고 하는 이유를 상세히 기재해 주세요."
          onChange={handleChange}
        ></textarea>
      </div>
      <div className={styles.button} onClick={handleReport}>
        작성완료
      </div>
    </div>
  );
}
