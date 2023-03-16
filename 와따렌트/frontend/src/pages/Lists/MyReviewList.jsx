import React, { useEffect, useState } from "react";
import styles from "./MyReviewList.module.css";
import {
  ChevronLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function MyReviewList() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const userId = useSelector((state) => {
    return state.user.userCode
  })

  useEffect(() => {
    // 내가 쓴 리뷰 불러오는 api
    axios
      .get(`${process.env.REACT_APP_API_URL}/review/buyer/${userId}`)
      .then((res) => {
        let tmpReviews = res.data.MyReview.filter((review) => { return review.review !== ''})
        setReviews(tmpReviews)
      });
  }, []);

  return (
    <div className={styles.body}>
      {/* 상단 네비게이션 */}
      <div className={styles.nav}>
        <div className={styles.navleft}>
          <ChevronLeftIcon
            className="w-6 h-6 text-black-100"
            onClick={() => {
              navigate(-1);
            }}
          />
        </div>
        <div className={styles.bigtitle}>
          내가 쓴 리뷰 목록 ({reviews?.length})
        </div>
      </div>
      {/* 타이틀 */}

      <div className={styles.reviews}>
        {reviews.length !== 0? reviews.map((review, idx) => {
          return (
            <div key={idx} className={styles.reviewbox}>
              <div className={styles.ninety}>
                <div className={styles.review}>
                  <div className={styles.top}>
                    <div className={styles.topleft}>
                      <img src={review.thumbnail} alt="" />
                    </div>
                    <div className={styles.topright}>
                      <div className={styles.title}>{review.product.title}</div>
                      <div className={styles.price}>{review.product.price}</div>
                    </div>
                  </div>
                  <div className={styles.bottom}>
                    <ArrowRightIcon />
                    <div className={styles.comment}>{review?.review}</div>
                  </div>
                </div>
              </div>
            </div>
          )
        }) : <div className={styles.alert}>작성한 리뷰가 없어요😥</div>}
      </div>
    </div>
  );
}
