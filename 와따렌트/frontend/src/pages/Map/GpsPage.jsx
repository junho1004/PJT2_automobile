import React from "react";
import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import styles from "./GpsPage.module.css";

const { kakao } = window

export default function GpsPage() {
  const navigate = useNavigate();
  useEffect (() => {
    let container = document.getElementById('map')
    let options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3
    }
    let map = new kakao.maps.Map(container, options)
  })

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
