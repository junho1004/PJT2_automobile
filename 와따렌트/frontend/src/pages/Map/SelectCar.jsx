/*global kakao*/
import React from "react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SelectCar.module.css";
import { markerdata } from "./Markerdata";
import previous from "../../assets/images/previous.png";
import minicar from "../../assets/images/minicar.png";
import spot from "../../assets/images/spot.png";
import car from "../../assets/images/car.png";

const { kakao } = window;

function SelectCar() {
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
      center: new kakao.maps.LatLng(37.242751, 126.773852),
      level: 3,
    };

    //map
    const map = new kakao.maps.Map(container, options);

    const myMarker = new kakao.maps.Marker({
      map: map,
      position: new kakao.maps.LatLng(37.242751, 126.773852),
    });
    myMarker.setMap(map);

    markerdata.forEach((el) => {
      const markerPosition = new kakao.maps.LatLng(el.lat, el.lng);
      // 마커를 생성합니다
      // let imageSize = new kakao.maps.Size(24, 35)
      // // let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize)
      // const content = '<div class="customoverlay">' +
      // `    <span class="title">${el.title}</span>` +
      // '  </a>' +
      // '</div>'
      const position = new kakao.maps.LatLng(el.lat, el.lng);
      // let customOverlay = new kakao.maps.CustomOverlay({
      //     map:map,
      //     position: position,
      //     content: content,
      //     yAnchor: 1,
      // })

      const marker = new kakao.maps.Marker({
        //마커가 표시 될 지도
        map: map,
        //마커가 표시 될 위치
        position: position,
        image: markerimage,
        // clickable: true,
      });

      marker.setMap(map);

      const infowindow = new kakao.maps.InfoWindow({
        content: `<div style="padding:5px;">${el.title}차량이 선택되었습니다.</div>`,

        removable : true,
      });

      kakao.maps.event.addListener(marker, "click", function () {
        infowindow.open(map, marker);

      });
    });
  };

  return (
    <div className={styles.background}>
      <div className={styles.next}>
        <div className={styles.text}>예약하기</div>
        <button
          onClick={() => {
            {
              navigate("/reservationHome");
            }
          }}
        >
          <img src={previous} alt="go" className={styles.mini} />
        </button>
      </div>
      <div className={styles.next1}>
        <div className={styles.text1}>주변 이용가능한 차량입니다</div>
      </div>
      <div
        id="map"
        className={styles.text2}
        style={{
          width: "100vw",
          height: "60vh",
        }}
      ></div>
      <div className={styles.next2}>
        <img
          src={spot}
          alt="go"
          style={{ width: "30px", height: "40px", margin: "20px" }}
        />
        <div>
          <div className={styles.text1}>서울 성북구</div>
        </div>
      </div>
      <div className={styles.next4}>
        <div className={styles.text1}>
          <div style={{ paddingBottom: "5px" }}>
            <span style={{ fontSize: "20px" }}>이 차량의 현재 위치 : </span>
            <span>서울 용산구 이태원로</span>
          </div>
          <div style={{ display: "flex" }}>
            <img src={car} alt="go" className={styles.size} />
            <div className={styles.box}>
            <div style={{ padding: "0px" }}>
              <span>예상 도착 시간은 </span>
              <span style={{ fontSize: "20px" }}>약 10분</span>
              <span> 입니다</span>
            </div>
            <div style={{ padding: "0px" }}>
              <span>내 위치에서 </span>
              <span style={{ fontSize: "20px" }}>약 500m</span>
              <span> 떨어져있습니다</span>
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
          <div className={styles.text3}>다음</div>
        </button>
      </div>
    </div>
  );
}

export default SelectCar;
