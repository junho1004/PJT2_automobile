/*global kakao*/
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CompleteCar.module.css";
import previous from "../../assets/images/previous.png";
import spot from "../../assets/images/spot.png";
import car from "../../assets/images/car.png";
import { db } from "../../firebase-config"
import { doc, updateDoc } from "firebase/firestore";

const address = window.localStorage.getItem("address");
const carnumber = window.localStorage.getItem("carnumber");
const cartype = window.localStorage.getItem("cartype");
const { kakao } = window;

function CompleteCar() {
  const navigate = useNavigate();
  let [modal, setModal] = useState(false);
  const [visible, setVisible] = useState(false);
  const [InputText, setInputText] = useState("");

  const closeModal = () => {
    setModal(false);
  };
  const close = () => {
    setVisible(false);
  };
  // 검색어 입력
  const onChange = (e) => {
    setInputText(e.target.value);
  };

  // 검색 버튼 눌렀을 때
  const handleSubmit = (e) => {
    if (InputText.length == 0) {
      alert("목적지를 입력해주세요!");
    } else {
      e.preventDefault();
      setInputText("");
      navigate("/DestinationMap", { state: InputText });
    }
  };

  const firebaseUpdate = () => {
    async function updateFirebase() {
      const result = await updateDoc(doc(db, "Reservation", "return_btn"), {
        return_btn: true
      });
      return result;
      }
      updateFirebase()
    }

  return (
    // 상단 네비게이션
    <div className={styles.background}>
      <div className={styles.back1}>
        <div className={styles.next}>
          <div className={styles.text}>출발하기</div>
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

      {/* contents */}
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
              <button type="submit">📍</button>
            </div>
          </form>
          <button onClick={handleSubmit} className={styles.endbtn}>
            확인
          </button>
        </div>
      </div>

      <div className={styles.next6}>
        <div>
          <div className={styles.next5}>
            <div className={styles.in}>
              {/* <div style={{ margin:"auto" }}> */}
              <img src={car} alt="go" className={styles.size1} />
              {/* </div> */}
              <div className={styles.box}>
                <div
                  style={{
                    fontSize: "1.2em",
                    fontWeight: "800",
                    marginBottom: "2%",
                  }}
                >
                  현재 사용중인 차량
                </div>

                <div>
                  차량번호:{" "}
                  <span style={{ fontWeight: "800" }}>{carnumber}</span>
                </div>
                <div>
                  차량기종: <span style={{ fontWeight: "800" }}>{cartype}</span>
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
              setModal(true);
            }
          }}
        >
          <div className={styles.text3}>운행종료</div>
        </button>
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
              <button
                className={styles.button1}
                onClick={() => {
                  setVisible(!visible);
                }}
              >
                확인
              </button>

              {visible && (
                <div className={styles.containerM}>
                  <div className={styles.modalM}>
                    <div onClick={close} className={styles.x}>
                      <div>x</div>
                    </div>
                    <div className={styles.modaltextm}>
                      <div style={{ fontSize: "1em", fontWeight: "800" }}>
                        <div style={{alignContent:"center",justifyContent:"center",alignItems:"center",display:"flex"}}><div><span style={{fontSize:"1.2em"}}>와따렌트</span>를</div></div>
                        <div style={{alignContent:"center",justifyContent:"center",alignItems:"center",display:"flex"}}>이용해주셔서 감사합니다!</div>
                        <div style={{fontSize:"0.7em",paddingTop:"4%",alignContent:"center",justifyContent:"center",alignItems:"center",display:"flex", fontWeight:"100"}}>15분 뒤, 차가 알아서 차고지로 복귀합니다!</div>
                        <div style={{fontSize:"0.7em",alignContent:"center",justifyContent:"center",alignItems:"center",display:"flex",fontWeight:"100"}}>두고 내린 소지품은 없는지 확인해 주세요!</div>
                      </div>
                    </div>
                    <button
                      className={styles.button1M}
                      onClick={() => {
                        {
                          setVisible(false);
                          navigate("/");
                        }
                      }}
                    >
                      확인
                    </button>
                  </div>
                </div>
              )}
              <button className={styles.button1} onClick={closeModal}>
                취소
              </button>
            </div>
          </div>
          <div className={styles.back}></div>
        </div>
      )}
    </div>
  );
}

export default CompleteCar;
