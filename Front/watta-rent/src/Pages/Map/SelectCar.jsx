/*global kakao*/
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SelectCar.module.css";
import { markerdata } from "./Markerdata";
import previous from "../../assets/images/previous.png";
import minicar from "../../assets/images/mapcar.png";
import spot from "../../assets/images/spot.png";
import car from "../../assets/images/car.png";
import { db } from "../../firebase-config"
import { doc, updateDoc } from "firebase/firestore";

const { kakao } = window;

const address = window.localStorage.getItem("address");
function SelectCar() {
  const lat = window.sessionStorage.getItem("user_lat");
  const lng = window.sessionStorage.getItem("user_lon");
  let [caraddress, Setcaraddress] = useState("");
  let [modal, setModal] = useState(false);
  let [carNumber, SetCarnumber] = useState("");
  let [carType, SetCartype] = useState("");
  let [carFee, SetCarfee] = useState("");
  let [carlat, SetCarlat] = useState("");
  let [carlng, SetCarlng] = useState("");

  const firebaseUpdate = () => {
    async function updateFirebase() {
      const result = await updateDoc(doc(db, "Reservation", "choice_btn"), {
        choice_btn: true
      });
      return result;
      }
      updateFirebase()
    }

  const changeReservationBtn = () => {
    async function updateBtn() {
      const result = await updateDoc(doc(db, "Reservation", "reservation_btn"), {
        reservation_btn: true
      });
      return result;
      }
      updateBtn()
  }

  const getcartype = window.localStorage.getItem("cartype");
  const closeModal = () => {
    setModal(false);
  };

  useEffect(() => {
    mapscript();
  }, []);

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
      center: new kakao.maps.LatLng(lat, lng),
      level: 3,
    };

    //map
    const map = new kakao.maps.Map(container, options);

    const myMarker = new kakao.maps.Marker({
      map: map,
      position: new kakao.maps.LatLng(lat, lng),
    });
    myMarker.setMap(map);

    markerdata.forEach((el) => {
      const position = new kakao.maps.LatLng(el.lat, el.lng);
      const marker = new kakao.maps.Marker({
        //마커가 표시 될 지도
        map: map,
        //마커가 표시 될 위치
        position: position,
        image: markerimage,
        clickable: true,
      });

      marker.setMap(map);

      let carnumber = el.number;
      let cartype = el.type;
      let carfee = el.fee;

      kakao.maps.event.addListener(marker, "click", function () {
        setModal(true);

        let lat = el.lat;
        let lng = el.lng;

        let geocoder = new kakao.maps.services.Geocoder();
        Gpspage(lat, lng);
        function Gpspage(lat, lng) {
          let coord = new kakao.maps.LatLng(lat, lng);
          let callback = function (result, status) {
            if (status === kakao.maps.services.Status.OK) {
              Setcaraddress(result[0].address.address_name);
              SetCarnumber(carnumber);
              SetCartype(cartype);
              SetCarfee(carfee);
              SetCarlat(lat);
              SetCarlng(lng);
            }
          };
          geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
        }
      });
    });
  };

  return (
    <div className={styles.background}>
      <div className={styles.back1}>
        <div className={styles.next}>
          <div className={styles.text}>예약하기</div>
          <div>
            <button
              onClick={() => {
                {
                  navigate("/ReservationHome");
                }
              }}
            >
              <img src={previous} alt="go" className={styles.mini} />
            </button>
          </div>
        </div>
      </div>
      <div className={styles.next1}>
        <div className={styles.text1}>주변 이용가능한 차량입니다</div>
      </div>

      {modal && (
        <div className={styles.container}>
          <div className={styles.modal}>
            <div onClick={closeModal} className={styles.x}>
              <div>x</div>
            </div>
            <div className={styles.modalcontents1}>
              <div className={styles.modaltext}>
                <div style={{ fontSize: "1em", fontWeight: "800" }}>
                  상세정보
                </div>
              </div>
              <div className={styles.modaltext1}>
                <div className={styles.size}>
                  <img src={car} alt="go" />
                </div>
                <div className={styles.contenttext}>
                  <div className={styles.name}>차번호</div>
                  <div className={styles.texts}>: {carNumber}</div>
                  <div className={styles.name}>차기종</div>
                  <div className={styles.texts}>: {carType}</div>
                  <div className={styles.name}>주행요금</div>
                  <div className={styles.texts}>: {carFee}원/km</div>
                </div>
              </div>
              <div className={styles.modaltext}>
                <button
                  className={styles.button}
                  onClick={() => {
                    firebaseUpdate()
                    localStorage.setItem("carnumber", carNumber);
                    localStorage.setItem("cartype", carType);
                    localStorage.setItem("carfee", carFee);
                    localStorage.setItem("carlng", carlng);
                    localStorage.setItem("carlat", carlat);
                    closeModal();
                  }}
                >
                  선택하기
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
                  paddingBottom: "5px",
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                }}
              >
                <span style={{ fontSize: "1em" }}>이 차량의 현재 위치 : </span>
                <span> {caraddress}</span>
              </div>
            </div>
          </div>
          <div className={styles.next5}>
            <div className={styles.in}>
              <img src={car} alt="go" className={styles.size1} />
              <div className={styles.box}>
                <div>
                  <div> 고객님이 선택하신 차량은 </div>
                  <div style={{ fontSize: "1.2em" }}>{getcartype}</div>
                  <div> 입니다</div>
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
              changeReservationBtn()
              localStorage.setItem("caraddress", caraddress);
              navigate("/SelectedCar");
            }
          }}
        >
          <div className={styles.text3}>예약 확인</div>
        </button>
      </div>
    </div>
  );
}

export default SelectCar;
