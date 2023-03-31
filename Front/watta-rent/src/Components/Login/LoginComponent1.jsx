import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginComponent1.module.css";
import car12 from "../../assets/images/car12.png";
// import front from "../../assets/images/front.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  firebaseAuth,
  signInWithEmailAndPassword,
} from "../../firebase-config";
//////

// Import Swiper React components

export default function HomeBanner() {
  const navigate = useNavigate();
  let localStorage = window.localStorage;
  let sessionStorage = window.sessionStorage;
  let [loginId, setLoginId] = useState("");
  let [loginPassword, setLoginPassword] = useState("");
  let [appropriate, setIsAppropriate] = useState(false);
  let [user, setUser] = useState();
  const [modal, setModal] = useState(true);

  useEffect(() => {
    console.log(sessionStorage.getItem("success_signup"));
    if (sessionStorage.getItem("success_signup") == "true") {
      sessionStorage.setItem("success_signup", false);
      toast.success("회원가입 성공!");
    }
  }, []);
  const login = async () => {
    if (loginId.length == 0) {
      toast.error("이메일을 입력해주세요!");
    } else if (loginPassword.length === 0) {
      toast.error("비밀번호를 입력해주세요!");
    } else {
      try {
        const curUserInfo = await signInWithEmailAndPassword(
          firebaseAuth,
          loginId,
          loginPassword
        );
        setUser(curUserInfo.user);
        console.log(curUserInfo.user.displayName);
        console.log(curUserInfo.user.email);
        localStorage.setItem("loginEmail", user.email);
        localStorage.setItem("loginNickname", user.displayName);
        navigate("/Maphome");
      } catch (err) {
        setIsAppropriate(false);
        console.log(appropriate);
        toast.error("이메일과 비밀번호를 확인해주세요!");
      }
    }
  };

  const signup = () => {
    navigate("/signup");
  };
  const closeModal = () => {
    setModal(false);
  };

  const onButtonClick = () => {
    setTimeout(() => setModal(false), 2000);

    // setModal(false);
  };

  return (
    <div className={styles.background}>
    <div className={styles.body}>
      <div className={styles.topleft}>
        <img
          src={car12}
          alt="go"
          style={{ width: "150%", height: "350%", marginBottom: "20px" }}
        />
      </div>
      <div className={styles.bottom} style={{ marginTop: "10px" }}>
        <span style={{ color: "white", fontSize: "1em" }}>이메일 :</span>{" "}
        <input
          type="text"
          style={{
            width: "100%",
            padding: "2%",
            marginBottom: "3%",
            backgroundColor: "white",
          }}
          onChange={(e) => {
            setLoginId(e.target.value);
          }}
        />
        <div>
          <span style={{ color: "white", fontSize: "1em" }}>비밀번호 :</span>{" "}
          <input
            type="password"
            style={{
              width: "100%",
              padding: "2%",
              marginBottom: "3%",
              backgroundColor: "white",
            }}
            onChange={(e) => {
              setLoginPassword(e.target.value);
            }}
          />
        </div>
      </div>
      <div className={styles.bottom2} style={{ marginTop: "10px" }}>
        <button onClick={login}>
          <span style={{ color: "white", fontWeight: "700", fontSize: "1em" }}>
            Login
          </span>
        </button>
      </div>
      <div className={styles.bottom2} style={{ marginTop: "10px" }}>
        <button onClick={signup}>
          <span style={{ color: "white", fontWeight: "700", fontSize: "1em" }}>
            SignUp
          </span>
        </button>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          limit={1}
          hideProgressBar={true}
        />
      </div>
    </div>
    </div>
  );
  // }
}
