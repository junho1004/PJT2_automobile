import React, { useState } from "react";
import styles from "./AddProduct.module.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// heroicons
import { ChevronLeftIcon, CameraIcon } from "@heroicons/react/24/solid";
import axios from "axios";

export default function AddProduct() {
  const navigate = useNavigate();

  // redux
  const userId = useSelector((state) => {
    return state.user.userCode;
  });

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [availableTime, setAvailableTime] = useState("");
  const [fileLen, setFileLen] = useState(0);

  const content = {
    title,
    price,
    description,
    availableTime,
    userId,
  };

  // 상품등록 axios
  const handleSubmit = async (e) => {
    e.preventDefault();
    let files = e.target.imgurls.files;

    if (files.length === 0) {
      alert("상품 사진 등록은 필수입니다.");
    }
    if (files.length > 5) {
      alert("상품 사진은 최대 5장 까지만 등록 가능합니다.");
    }
    if (title === "") {
      alert("제목을 입력하세요.");
      return;
    }
    if (price === "") {
      alert("가격을 입력하세요.");
      return;
    }
    if (description === "") {
      alert("상품 설명을 입력하세요.");
      return;
    }
    if (availableTime === "") {
      alert("라이브 가능한 시간대를 입력하세요.");
      return;
    }
    if (!userId) {
      alert("로그인이 필요한 서비스 입니다.");
      navigate("/login");
      return;
    }

    let formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("imgUrl", files[i]);
    }

    // content를 문자열로 변환
    formData.append(
      "content",
      new Blob([JSON.stringify(content)], { type: "application/json" })
    );

    await axios
      .post(`${process.env.REACT_APP_API_URL}/product`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setTitle("")
        setPrice("")
        setDescription("")
        setAvailableTime("")
        setFileLen(0)

        navigate(`/`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  const handleAvailableTimeChange = (e) => {
    setAvailableTime(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleFileChange = (e) => {
    setFileLen(e.target.files.length);
  };

  return (
    <form className={styles.body} onSubmit={handleSubmit}>
      <div className={styles.nav}>
        <ChevronLeftIcon
          className="w-6 h-6 text-black-100"
          onClick={() => {
            navigate(-1);
          }}
        />
        <div className={styles.title}>상품 등록하기</div>
      </div>
      <div className={styles.container}>
        <div className={styles.button}>
          <CameraIcon className={styles.camera} />
          <div className={styles.num}>{fileLen}/5</div>
        </div>

        <input
          className={styles.file}
          type="file" // 파일로 입력 받음
          accept="image/*" // 이미지 유형의 파일만 받기
          name="imgurls" // 담긴 파일을 참조할 때 사용할 이름
          multiple // 다중 업로드
          onChange={handleFileChange}
        />

        <input
          className={`${styles.input} ${styles.titleinput}`}
          onChange={handleTitleChange}
          type="text"
          placeholder="제목"
        />
        <input
          className={styles.input}
          onChange={handlePriceChange}
          type="number"
          placeholder="$ 가격 (0원 가능)"
        />
        <textarea
          className={styles.textarea}
          onChange={handleAvailableTimeChange}
          placeholder="라이브 가능 시간 &#13;(ex - 10:00~12:00, 18:00~19:00)"
        ></textarea>
        <textarea
          className={`${styles.textarea} ${styles.descinput}`}
          onChange={handleDescriptionChange}
          placeholder="상품 설명(300자 이내)"
        ></textarea>
        <button type="submit" className={styles.addbtn}>
          <span>등록하기</span>
        </button>
      </div>
    </form>
  );
}
