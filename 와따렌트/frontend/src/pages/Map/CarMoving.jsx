/*global kakao*/
import React from "react";
import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom";
import styles from "./GpsPage.module.css";
import { markerdata } from "./Markerdata"

const { kakao } = window
function CarMoving() {

    useEffect(() => {
      mapscript();
    }, []);
    const imageSrc = "https://img.freepik.com/premium-vector/car-icon-design_24877-16617.jpg"
    const imageSize = new kakao.maps.Size(30, 30)
    const imageOption = {offset: new kakao.maps.Point(5, 5)}
    const markerimage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)
    const mapscript = () => {
        let container = document.getElementById("map");
        let options = {
            center: new kakao.maps.LatLng( 37.239389295978594, 126.77305344019414,),
            level: 3,
        };
        
        //map
        const map = new kakao.maps.Map(container, options);
        

        const myMarker = new kakao.maps.Marker({
            map: map,
            position: new kakao.maps.LatLng(37.242771, 126.773757),

        })
        myMarker.setMap(map)

        // 마커를 생성합니다
        // let imageSize = new kakao.maps.Size(24, 35)
        // // let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize)
        // const content = '<div class="customoverlay">' +
        // `    <span class="title">${el.title}</span>` +
        // '  </a>' +
        // '</div>'

        const position = new kakao.maps.LatLng(37.239389295978594, 126.77305344019414)
        // let customOverlay = new kakao.maps.CustomOverlay({
        //     map:map,
        //     position: position,
        //     content: content,
        //     yAnchor: 1,
        // })
        
        const carMarker = new kakao.maps.Marker({
        //마커가 표시 될 지도
            map: map,
            //마커가 표시 될 위치
            position: position,
            image: markerimage,
            clickable: true,

        });

        carMarker.setMap(map)

        const infowindow = new kakao.maps.InfoWindow({
            content : `<div style="padding:5px;">xx분 후에 도착</div>`,
        });

        infowindow.open(map, carMarker)

    };

  return (
    <div className = {styles.background}>
        <div style = {{padding:"50px"}}>
          <div 
            id = "map"
            className = {styles.texta} 
            style = {{
              width: "240px",
              height: "400px"
            }}></div>
          </div>
    </div>
  );
}

export default CarMoving;
