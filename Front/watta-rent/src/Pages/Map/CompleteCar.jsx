/*global kakao*/
import React from "react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CompleteCar.module.css";
import { markerdata } from "./Markerdata";
import previous from "../../assets/images/previous.png";
import minicar from "../../assets/images/minicar.png";
import spot from "../../assets/images/spot.png";
import car from "../../assets/images/car.png";
// import DestinationMap from "./DestinationMap";

const address = window.localStorage.getItem("address");
const lat = window.localStorage.getItem("lat");
const lng = window.localStorage.getItem("lng");



const carnumber = window.localStorage.getItem("carnumber");
const cartype = window.localStorage.getItem("cartype");
const { kakao } = window;

function CompleteCar() {
  let [modal, setModal] = useState(false);
  
  const [visible,setVisible]=useState(false);

  const navigate = useNavigate();
  const [InputText, setInputText] = useState("");
  const [Place, setPlace] = useState("");

  const onChange = (e) => {
    setInputText(e.target.value);
  };
  const closeModal = () => {
    setModal(false);
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    setPlace(InputText);
    setInputText("");
  };



  return (
    <div className={styles.background}>
      <div className={styles.back1}>
        <div className={styles.next}>
          <div className={styles.text}>예약완료</div>
          <div>
            <button
              onClick={() => {
                {
                  navigate("/SelectedCar");
                }
              }}
            >
              <img src={previous} alt="go" className={styles.mini} />
            </button>
          </div>
        </div>
      </div>
      <div className={styles.next2}>
        <img
          src={spot}
          alt="go"
          style={{ width: "35px", height: "30px", margin: "10px" }}
        />
        <div>
          <div className={styles.text1}>{address}</div>
        </div>
      </div>

      <div className={styles.searchbox}>
        <div className={styles.search}>
          <div className={styles.font1}>이제 어디로 갈까요?</div>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputField}>
              <input  
                placeholder="목적지를 입력해주세요"
                onChange={onChange}
                value={InputText}
              />
              <button type="submit" className={styles.btn}
              onClick={() => {
                { 
                  navigate("/DestinationMap");
                }
              }}>
                📍
              </button>
            </div>
          </form>
          {/* <DestinationMap searchPlace={Place} /> */}
          <button
            className={styles.endbtn}
            onClick={() => {
              {
                setModal(true)
              }
            }}
          >
            운행종료
          </button>
        </div>
      </div>


      {modal && (
        <div className={styles.container}>
          <div className={styles.modal}>
            <div onClick={closeModal} className={styles.x}>
              <div>x</div>
            </div>
            <div>
              <div className={styles.modaltext}>
                <div style={{ fontSize: "1em", fontWeight: "800" }}>
                  운행종료
                </div>
              </div>
              <div className={styles.modaltext1}>
                렌트카를 반납하시겠습니까?
              </div>
            </div>
            <div className={styles.buttons}>
              <button className={styles.button1} 
              onClick={()=>{
                setVisible(!visible);
              }}>확인</button>
              {visible && 
                <div className={styles.containerM}>
          <div className={styles.modalM}>
              <div className={styles.modaltext}>
              
                <div style={{ fontSize: "1em", fontWeight: "800" }}>
                  와따렌트를<div>이용해주셔서 감사합니다!</div>
                </div></div>
                <button className={styles.button1M} 
                onClick={() => {
            { setVisible(false);
              navigate("/");
            }
          }}>확인</button></div></div>
                }
              <button className={styles.button1} onClick={
                  closeModal}>취소</button>
            </div>
          </div>
          <div className={styles.back}></div>
        </div>
      )}

      <div className={styles.next6}>
        <div>
          <div className={styles.next5}>
            <div className={styles.in}>
              {/* <div style={{ margin:"auto" }}> */}
              <img src={car} alt="go" className={styles.size1} />
              {/* </div> */}
              <div className={styles.box}>
            
                  <div style={{ fontSize: "1.2em",fontWeight:"800",marginBottom:"2%"}}>현재 사용중인 차량</div>
               
                <div>
                  차량번호: <span style={{ fontWeight:"800" }}>{carnumber}</span>
                </div>
                <div>
                  차량기종: <span style={{ fontWeight:"800" }}>{cartype}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.next3}>
        <button
          className={styles.next3}
          onClick={() => {
            {
              navigate("/SelectCar");
            }
          }}
        >
          <div className={styles.text3}>완료</div>
        </button>
      </div>
    </div>
  );
}

export default CompleteCar;
