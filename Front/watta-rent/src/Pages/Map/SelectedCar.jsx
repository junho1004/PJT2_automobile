/*global kakao*/
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SelectedCar.module.css";
import previous from "../../assets/images/previous.png";
import minicar from "../../assets/images/mapcar.png";
import spot from "../../assets/images/spot.png";
import car from "../../assets/images/car.png";
import { onSnapshot, doc } from "firebase/firestore"
import { db } from "../../firebase-config"

const { kakao } = window;
function SelectedCar() {
  const address = window.localStorage.getItem("address");
  const lat = window.sessionStorage.getItem("user_lat");
  const lng = window.sessionStorage.getItem("user_lon");
  const [ modal, setModal ] = useState(false);
  const [ cardis, setCatdis ] = useState(0)
  const [ carmin, setCatmin ] = useState(0)
  
  let sessionStorage = window.sessionStorage;
  const caraddress1 = window.localStorage.getItem("caraddress");
  const dist = Math.floor(sessionStorage.getItem("cardis"))


  // const closeModal = () => {
  //   setModal(false)
  // }

  const carnumber = window.localStorage.getItem("carnumber");
  
//  onSnapshot(doc(db, "Ego", "current_gps"), (doc) => {
//     sessionStorage.setItem("carlat", doc.data().lat)
//     sessionStorage.setItem("carlon", doc.data().lon)
//     console.log(sessionStorage.getItem("carlat"))
//     console.log(sessionStorage.getItem("carlon"))
//   });
  

  useEffect(() => {

    onSnapshot(doc(db, "Ego", "current_gps"), (doc) => {
      sessionStorage.setItem("carlat", doc.data().lat)
      sessionStorage.setItem("carlon", doc.data().lon)
      console.log(sessionStorage.getItem("carlat"))
      console.log(sessionStorage.getItem("carlon"))
    });

    onSnapshot(doc(db, "Ego", "total_distance"), (doc) => {
        setCatdis(Math.floor(doc.data().dist))
        setCatmin(Math.floor(doc.data().dist / 170))
        if (doc.data().dist < 100) {
          setModal(true)
        } else {
          setModal(false)
        }
    })

    const interval = setInterval(()=> {
      mapscript();
    },1000)
    return  () => {
      clearInterval(interval)
    }
  }, 1000);

  const navigate = useNavigate();
  const imageSrc = minicar;
  const imageSize = new kakao.maps.Size(30, 30);
  const imageOption = { offset: new kakao.maps.Point(5, 5) };
  const markerimage = new kakao.maps.MarkerImage(
    imageSrc,
    imageSize,
    imageOption
  );


  const mapscript = () => {
    let container = document.getElementById("map");
    let options = {
      center: new kakao.maps.LatLng(sessionStorage.getItem("carlat"), sessionStorage.getItem("carlon")),
      level: 4,
    };

    //map
    const map = new kakao.maps.Map(container, options);

    const myMarker = new kakao.maps.Marker({
      map: map,
      position: new kakao.maps.LatLng(lat, lng),
    });
    myMarker.setMap(map);

    const carMarker = new kakao.maps.Marker({
      map : map,
      position : new kakao.maps.LatLng(sessionStorage.getItem("carlat"), sessionStorage.getItem("carlon")),
      image: markerimage,
    })

    carMarker.setMap(map)
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
                  navigate("/SelectCar");
                }
              }}
              >
              <img src={previous} alt="go" className={styles.mini} />
            </button>
          </div>
              </div>
        </div>
      <div className={styles.next1}>
        <div className={styles.text11}>선택하신 " <span className={styles.memo} style={{ fontWeight: "800" }}>{carnumber}</span> " (이)가 달려가고있어요!</div>
      </div>

      { modal && (
        <div className={styles.container}>
          <div className={styles.modal}>
            <div className={styles.modalcontents1}>
              <div className={styles.modaltext}>
                <div style={{ fontSize: "1em", fontWeight: "800",marginBottom:"6%" }}>
                  차량이 곧 도착합니다. 
                  <br></br>
                  탑승 준비해주세요!!
                </div>
              </div>
              <div className={styles.modaltext1}>
                <div className={styles.contenttext}>
                </div>
              </div>
              <div className={styles.modaltext}>
                <button
                  className={styles.button}
                  onClick={() => {
                    navigate("/completeCar");
                  }}
                >
                  목적지 선택 화면으로
                </button>
              </div>
            </div>
          </div>
          <div className={styles.back}></div>
        </div>
      )}

      <div
        id="map"
        className={styles.map}
        style={{
          width: "100vw",
          height: "60vh",
        }}
      ></div>
  
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
      <div className={styles.next6}>
        <div>
      <div className={styles.next4}>
        <div className={styles.text1}>
          <div
            style={{
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
            }}
            >
            <span style={{ fontSize: "1em", fontWeight:"100"}}>이 차량의 현재 위치 : </span>
            <span> {caraddress1}</span>
          </div>
        </div>
      </div>
      { cardis > 100 ?
        (<div className={styles.next5}>
            <div className={styles.in}>
                <img src={car} alt="go" className={styles.size1} />
              <div className={styles.box}>
                <div>
                  <span>예상 도착 시간은 </span>
                  <span style={{ fontSize: "1em" }}>약 <span style={{ fontSize: "1em", fontWeight: "700" }}>{carmin}</span>분</span>
                  <span> 입니다</span>
                </div>
                <div>
                  <span>내 위치에서 </span>
                  <span style={{ fontSize: "1em" }}>약 <span style={{ fontSize: "1em", fontWeight: "700" }}>{cardis}</span>M</span>
                  <span> 떨어져있습니다</span>
                </div>
              </div>
            </div>
          </div>)
         : (<div className={styles.next5}>
            <div className={styles.in}>
                <img src={car} alt="go" className={styles.size1} />
              <div className={styles.box}>
                <div>
                  <span>차량이 곧  </span>
                  <span style={{ fontSize: "1em" }}>도착</span>
                  <span>합니다!</span>
                </div>
                <div>
                  <span>차량 번호</span>
                  <span style={{ fontSize: "1em" }}>와 위치를 </span>
                  <span>확인 해주세요!</span>
                </div>
              </div>
            </div>
          </div>)
        }
        </div>
       </div>
      {/* <div className={styles.next3}>
        <button
          className={styles.next3}
          onClick={() => {
            {
             {window.location.replace("/completeCar")}
            }
          }}
        >
          <div className={styles.text3}>목적지 선택 화면으로</div>
        </button>
      </div> */}
    </div>
  );
}

export default SelectedCar;