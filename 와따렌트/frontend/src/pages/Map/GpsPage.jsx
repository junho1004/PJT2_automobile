/*global kakao*/
import React from "react";
import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom";
import styles from "./GpsPage.module.css";

const { kakao } = window

function GpsPage() {
  const navigate = useNavigate();
  const [ sendLat , setSendLat ] = useState(0)
  const [ sendLng , setSendLng ] = useState(0)
  const [ markerLat , setMarkerLat ] = useState(0)
  const [ markerLng , setMarkerLng ] = useState(0)

  useEffect(() => {
    let container = document.getElementById('map')
    let options = {
      center: new kakao.maps.LatLng(37.242751, 126.773852),
      level: 3,
    }
    let map = new kakao.maps.Map(container, options)
    let markerPosition = new kakao.maps.LatLng(37.536172, 126.976978)
    let marker = new kakao.maps.Marker({
        position: map.getCenter()
    })
    marker.setMap(map)
    kakao.maps.event.addListener(map, "click", (mouseEvent) => {
      // 원하는 액션 넣기
      let latlng = mouseEvent.latLng

      setSendLat(latlng.getLat())
      setSendLng(latlng.getLng())
      
      marker.setPosition(latlng)
      
    })

  }, [])
  useEffect(() => {
    console.log(sendLat);
    console.log(sendLng);
  }, [sendLat, sendLng]);

  return (
    <div className = {styles.background}>
        <div style = {{padding:"50px"}}>
          <div 
            id = "map"
            className = {styles.texta} 
            style = {{
              width: "240px",
              height: "400px"
            }}>ㅇㅇㅇ</div>
          </div>
    </div>
  );
}

export default GpsPage;
