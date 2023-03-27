import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginComponent.module.css";
import car1 from "../../assets/images/car1.png";
import { firebaseAuth , signInWithEmailAndPassword } from "../../firebase-config";

export default function HomeBanner() {
  const navigate = useNavigate();
  let localStorage = window.localStorage;
  const token = window.localStorage.getItem("token");
  let [loginId, setLoginId] = useState("");
  let [loginPassword, setLoginPassword] = useState("");
  let [appropriate, setIsAppropriate] = useState(false);
  let [user, setUser] = useState();

  // login onClick function
  const login = async () => {
      // localStorage.setItem("loginPassword", loginPassword);
      // setSavedLoginPassword(localStorage.getItem("loginPassword"));
      
      if (loginId.length === 0)  {
        alert("아이디를 입력해주세요");
      } else if(loginPassword.length === 0) {
        alert("비밀번호를 입력해주세요");
      } else {
        try {
          const curUserInfo = await signInWithEmailAndPassword(firebaseAuth, loginId, loginPassword)
          setUser(curUserInfo.user)
          console.log(curUserInfo.user.displayName)
          console.log(curUserInfo.user.email)
          localStorage.setItem("loginEmail", user.email);
          localStorage.setItem("loginNickname", user.displayName);
          navigate("/Maphome");
        } catch(err) {
          setIsAppropriate(false)
          console.log(appropriate)
          alert("아이디와 비밀번호를 확인해주세요!")
        }
        // localStorage.setItem("loginId", loginId);
        // setSavedLoginId(localStorage.getItem("loginId"));
      }
  }

  return (
    <div className={styles.body}>
        <div className={styles.topleft}>
          <img src={car1} alt="go" style={{width:"90%",height:"250%"}} />
      </div>
      <div className={styles.bottom}>
          <span style={{color:"white",fontSize:"1em"}}>아이디 :</span>{" "}
          <input
            type="text"
            style={{width:"100%", padding:"2%", marginBottom:"3%"}}
            onChange={(e) => {
              setLoginId(e.target.value);
            }}
          />
        <div >
        <span style={{color:"white",fontSize:"1em"}}>비밀번호 :</span>{" "}
          <input
            type="password"
            style={{width:"100%", padding:"2%", marginBottom:"3%"}}
            onChange={(e) => {
              setLoginPassword(e.target.value);
            }}
          />
        </div>

      </div>
      <div className={styles.bottom2}>
        <button
          onClick={login}
        >
          <span style={{color:"black",fontWeight:"700",fontSize:"1em"}}>Login</span>
        </button>
      </div>
    </div>
  );
};