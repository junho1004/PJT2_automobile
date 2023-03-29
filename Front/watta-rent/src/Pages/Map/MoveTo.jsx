/*global kakao*/
import React from "react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SelectedCar.module.css";
import { markerdata } from "./Markerdata";
import previous from "../../assets/images/previous.png";
import spot from "../../assets/images/spot.png";
import spot1 from "../../assets/images/spot1.png";
import car2 from "../../assets/images/car2.png";
import { buttonUnstyledClasses } from "@mui/base";

const { kakao } = window;
const address = window.localStorage.getItem("address");
const destination = window.localStorage.getItem("destination");
const lat = window.localStorage.getItem("lat");
const lng = window.localStorage.getItem("lng");
// const Dlat = window.localStorage.getItem("destinationLat");
// const Dlng = window.localStorage.getItem("destinationLng");

function MoveTo() {
  //   const caraddress1 = window.localStorage.getItem("caraddress");
  const carnumber = window.localStorage.getItem("carnumber");

  useEffect(() => {
    mapscript();
  }, []);
  const navigate = useNavigate();
  var imageSrc =
      "https://cdn.pixabay.com/photo/2014/04/02/10/45/location-304467_1280.png", // 마커이미지의 주소입니다
    imageSize = new kakao.maps.Size(25, 40), // 마커이미지의 크기입니다
    imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

  const markerimage = new kakao.maps.MarkerImage(
    imageSrc,
    imageSize,
    imageOption
  );

  const mapscript = () => {
    let container = document.getElementById("map");
    let options = {
      ///여기 현재위치를 나타내는 것 실시간으로 바뀌어야함,,///
      center: new kakao.maps.LatLng(lat, lng),
      level: 14,
    };
    //map
    const map = new kakao.maps.Map(container, options);

    const myMarker = new kakao.maps.Marker({
      map: map,
      position: new kakao.maps.LatLng(lat, lng),
    });
    myMarker.setMap(map);

    markerdata.forEach(() => {
      let Dlat = window.localStorage.getItem("destinationLat");
      let Dlng = window.localStorage.getItem("destinationLng");

      const position = new kakao.maps.LatLng(Dlat, Dlng);

      const marker = new kakao.maps.Marker({
        //마커가 표시 될 지도
        map: map,
        //마커가 표시 될 위치
        position: position,
        image: markerimage,
        clickable: true,
      });

      marker.setMap(map);
    });
  };

  return (
    <div className={styles.background}>
      <div className={styles.back1}>
        <div className={styles.next}>
          <div className={styles.text}>목적지로 이동중</div>
        </div>
      </div>
      <div className={styles.next1}>
        <div className={styles.text12}>
          선택하신 차량 " <span style={{ fontWeight: "800" }}>{carnumber}</span>{" "}
          " (이)가 자율주행중 입니다!
        </div>
      </div>

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
          <div className={styles.text1}>목적지 : {destination}</div>
        </div>
      </div>
      <div className={styles.next6}>
        <div>
          <div className={styles.next4}>
            <div className={styles.text1}>
              <div
                style={{
                  // paddingBottom: "5px",
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* 실시간 위치서비스 넣기!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
                <div
                  style={{
                    fontSize: "1em",
                    fontWeight: "500",
                    justifyContent: "center",
                    alignItems: "center",
                    alignContent: "center",
                    display: "flex",
                    //   flexDirection:"column"
                  }}
                >
                  <div style={{width:"60%"}}>
                    <span>내가 탄 차량의 실시간 위치 </span>
                    <span>
                      <img src={spot1} alt="go" className={styles.size3} />
                    </span><span>:</span>
                  </div>
                </div>
                <div style={{ fontSize: "1.1em" }}>{address}</div>
              </div>
            </div>
          </div>
          <div className={styles.next5}>
            <div className={styles.in}>
              {/* <div style={{ margin:"auto" }}> */}
              <img src={car2} alt="go" className={styles.size1} />
              {/* </div> */}
              <div className={styles.box}>
                <div>
                  <span>예상 도착 시간은 </span>
                  <span style={{ fontSize: "1em" }}>약 10분</span>
                  <span> 입니다</span>
                </div>
                <div>
                  <span>내 위치에서 </span>
                  <span style={{ fontSize: "1em" }}>약 500m</span>
                  <span> 떨어져있습니다</span>
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
              navigate("/CompleteCar");
            }
          }}
        >
          {/* 운행완료되면 보여야함 차 좌표랑 목적지 좌표랑 같아지면 */}
          <div className={styles.text3}>운행완료</div>
        </button>
      </div>
    </div>
  );
}

export default MoveTo;
