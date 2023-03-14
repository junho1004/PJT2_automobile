import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HomeBanner1.module.css";
import car1 from "../../assets/images/car1.png";
import bubble from "../../assets/images/bubble.png";

export default function HomeBanner() {
  const navigate = useNavigate();
  let localStorage = window.localStorage;
  const token = window.localStorage.getItem("token");
  let [loginId, setLoginId] = useState("");
  let [loginPassword, setLoginPassword] = useState("");
  let [savedLoginId, setSavedLoginId] = useState("");
  // let [savedLoginPassword, setSavedLoginPassword] = useState("");

  return (
    <div className={styles.body}>
      <div className={styles.top}>
        <div className={styles.topleft}>
          <img src={car1} alt="go" style={{width:"500px",height:"300px"}} />
          
        </div>
        {/* <div className={styles.topright}></div> */}
      </div>
      <div className={styles.bottom}>
        <div>
          <span style={{color:"white"}}>아이디 :</span>{" "}
          <input
            type="text"
            size={24}
            onChange={(e) => {
              setLoginId(e.target.value);
            }}
          />
        </div>
        <div >
        <span style={{color:"white"}}>비밀번호 :</span>{" "}
          <input
            type="password"
            size={24}
            onChange={(e) => {
              setLoginPassword(e.target.value);
            }}
          />
        </div>

        <div
          className={styles.loginbtn}
          onClick={() => {
            navigate("/login");
          }}
          style={token ? { visibility: "hidden" } : { visibility: "visible" }}
        >
          <span>
            <img src={bubble} alt="go" className={styles.mini} />
          </span>
          <span>| 카카오톡으로 로그인</span>
        </div>
      </div>
      <div className={styles.bottom2}>
        <button
          onClick={() => {
            // localStorage.setItem("loginPassword", loginPassword);
            // setSavedLoginPassword(localStorage.getItem("loginPassword"));
            
            if (loginId.length === 0)  {
              alert("아이디를 입력해주세요!");
            } else if(loginPassword.length === 0) {
              alert("비밀번호를 입력해주세요!");
            } else {
              localStorage.setItem("loginId", loginId);
              // setSavedLoginId(localStorage.getItem("loginId"));
              navigate("/Maphome");
            }
          }}
        >
          <span style={{color:"white",fontWeight:"700"}}>Login</span>
        </button>
      </div>
      {/* <div>
                sessionStorage에 저장된 loginId는 {savedLoginId} 이고 loginPassword는 {savedLoginPassword} 이다. 
            </div>
            <div>
                { JSON.stringify(localStorage) }
            </div> */}
    </div>
  );
}
