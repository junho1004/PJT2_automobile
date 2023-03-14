import React, { useEffect, useState } from "react";
import styles from "./AddReview.module.css";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AddReview() {
  const navigate = useNavigate();
  const buyerId = useSelector((state) => {
    return state.user.userCode;
  });

  const [review, setreview] = useState("");
  const [sellerId, setSellerId] = useState("");
  const [title, setTitle] = useState("");

  const param = useParams();
  const productId = param.productId;

  useEffect(() => {
    // 상품 정보 axios
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/product/${productId}?userCode=${buyerId}`
      )
      .then((res) => {
        setSellerId(res.data.userCode);
        setTitle(res.data.title)
      })
      .catch((err) => {
        console.log(err);
      });
  });

  const handleChange = (e) => {
    setreview(e.target.value);
  };

  const addReview = () => {
   // productId로 수정하기
   axios
   .patch(`${process.env.REACT_APP_API_URL}/review/${productId}`, {
     seller: sellerId,
     buyer: buyerId,
     review,
   })
   .then((res) => {
     navigate('/')
   })
   .catch((err) => {
     console.log(err);
   });
  };

  return (
    <div className={styles.body}>
      <div className={styles.nav}>
        <ChevronLeftIcon className="w-6 h-6 text-black-100" 
        onClick={() => {
          navigate(`/userinfo/${buyerId}`);
        }}
        />
        <div className={styles.title}>리뷰 작성</div>
      </div>
      <div className={styles.reviewform}>
        <div className={styles.trade}>"{title}" 거래 어떠셨나요?</div>
        <textarea
          className={styles.comments}
          cols="30"
          rows="10"
          placeholder="거래 후기를 최소 20자 이상 남겨주시면 다음 거래에 도움이 됩니다."
          value={review}
          onChange={handleChange}
        ></textarea>
      </div>
      <div className={styles.submit} onClick={addReview}>
        작성완료
      </div>
    </div>
  );
}
