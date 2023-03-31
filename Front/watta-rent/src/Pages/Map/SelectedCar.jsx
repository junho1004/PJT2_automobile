/*global kakao*/
import React from "react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SelectedCar.module.css";
import { markerdata } from "./Markerdata";
import previous from "../../assets/images/previous.png";
import minicar from "../../assets/images/minicar.png";
import spot from "../../assets/images/spot.png";
import car from "../../assets/images/car.png";


const { kakao } = window;
const address = window.localStorage.getItem("address");
const lat = window.localStorage.getItem("lat");
const lng = window.localStorage.getItem("lng");

function SelectedCar() {
  let localStorage = window.localStorage;
  const caraddress1 = window.localStorage.getItem("caraddress");

  const carnumber = window.localStorage.getItem("carnumber");
  

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
      level: 8,
    };

    //map
    const map = new kakao.maps.Map(container, options);

    const myMarker = new kakao.maps.Marker({
      map: map,
      position: new kakao.maps.LatLng(lat, lng),
    });
    myMarker.setMap(map);


    markerdata.forEach(() => {
      let carlat = window.localStorage.getItem("carlat");
      let carlng = window.localStorage.getItem("carlng");
    
      const position = new kakao.maps.LatLng(carlat, carlng);

      const marker = new kakao.maps.Marker({
        //마커가 표시 될 지도
        map: map,
        //마커가 표시 될 위치
        position: position,
        image: markerimage,
        clickable: true,
      });


      marker.setMap(map);
      

      // kakao.maps.event.addListener(marker, "click", function () {
      //   // infowindow.open(map, marker);
        
      //   let lat = el.lat;
      //   let lng = el.lng;
        

      //   let geocoder = new kakao.maps.services.Geocoder();
      //   Gpspage(lat, lng);
      //   function Gpspage(lat, lng) {
      //     let coord = new kakao.maps.LatLng(lat, lng);
      //     let callback = function (result, status) {
      //       if (status === kakao.maps.services.Status.OK) {
      //       }
      //     };
      //     geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
      //   }
      // });
    });
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
        <div className={styles.text11}>선택하신 "<span style={{ fontWeight: "800" }}>{carnumber}</span>" (이)가 달려가고있어요!</div>
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
          <div className={styles.text1}>{address}</div>
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
              // display: "flex",
            }}
            >
            <span style={{ fontSize: "1em" }}>이 차량의 현재 위치 : </span>
            <span> {caraddress1}</span>
          </div>
        </div>
      </div>
        <div className={styles.next5}>
          <div className={styles.in}>
            {/* <div style={{ margin:"auto" }}> */}
              <img src={car} alt="go" className={styles.size1} />
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
              {window.location.replace("/CompleteCar")}
            }
          }}
        >
          <div className={styles.text3}>완료</div>
        </button>
      </div>
    </div>
  );
}

export default SelectedCar;
