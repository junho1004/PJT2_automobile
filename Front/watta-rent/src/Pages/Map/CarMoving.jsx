/*global kakao*/
import React from "react";
import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom";
import styles from "./GpsPage.module.css";
import { getDocs, collection } from 'firebase/firestore/lite'
import useInterval from './CustomInterval.ts'
import { doc, onSnapshot } from "firebase/firestore";
import { db } from '../../firebase-config'

const { kakao } = window
function CarMoving() {
  const [lat, setLat] = useState(0)
  const [lng, setLng] = useState(0)
  
  // const unsub = onSnapshot(doc(db, "test", "SF"), (doc) => {
  //   console.log("Current data:", doc.data())
  // })
  // unsub()
  
  
  // useEffect(() => {
  //   const unsub = onSnapshot(doc(db, "test"), (doc) => {
  //       console.log("Current data: ", doc.data());
  //   });
  //   unsub()
  //   }, []);
  // unsub()
  const unsub = onSnapshot(doc(db, "Ego", "Ego_status"), (doc) => {
    // setLat(doc.data().current_position_x)
    // setLng(doc.data().current_position_y)
    setLat(doc.data().current_position_x)
    setLng(doc.data().current_position_y)
  });
  console.log(lat, lng)
  
  
  useEffect(() => {
    Mapscript();
    }, []);

  // useInterval(() => {
  //   const usersCollectionRef = collection(db, "Ego")
  //   const getData = async () => {
  //     const data = await getDocs(usersCollectionRef)
  //     console.log(data._docs[0]._document.data.value.mapValue.fields)
  //     const xData = data._docs[0]._document.data.value.mapValue.fields.current_position_x.stringValue
  //     const yData = data._docs[0]._document.data.value.mapValue.fields.current_position_y.stringValue
      // console.log(xData, yData)
      // const geocoder = new kakao.maps.services.Geocoder() // 좌표계 변환 객체를 생성합니다
      // const wtmX = xData // 변환할 WTM X 좌표 입니다
      // const wtmY = yData // 변환할 WTM Y 좌표 입니다

      // geocoder.transCoord(wtmX, wtmY, transCoordCB, {
      //   input_coord: kakao.maps.services.Coords.WTM, // 변환을 위해 입력한 좌표계 입니다
      //   output_coord: kakao.maps.services.Coords.WGS84 // 변환 결과로 받을 좌표계 입니다 
      // });

      // function transCoordCB(result) {
      //   setLat(result[0].y)
      //   setLng(result[0].x)
      //   console.log(lat)
      //   console.log(lng)
        // // 정상적으로 검색이 완료됐으면 
        // if (status === kakao.maps.services.Status.OK) {
    
        //     // 마커를 변환된 위치에 표시합니다
        //     var marker = new kakao.maps.Marker({
        //         position: new kakao.maps.LatLng(result[0].y, result[0].x), // 마커를 표시할 위치입니다
        //         map: map // 마커를 표시할 지도객체입니다
        //     })
        // }
      // }



  //   }
  //   getData()
    
  // }, 5000)

  // console.log(lat)
  // console.log(lng)


    const imageSrc = "https://img.freepik.com/premium-vector/car-icon-design_24877-16617.jpg"
    const imageSize = new kakao.maps.Size(30, 30)
    const imageOption = {offset: new kakao.maps.Point(5, 5)}
    const markerimage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)
    const Mapscript = () => {
        let container = document.getElementById("map");
        let options = {
            center: new kakao.maps.LatLng( 37.239389295978594, 126.77305344019414,),
            level: 3,
        };
        
        //map
        const map = new kakao.maps.Map(container, options);
        // map.setMap(map)

        const myMarker = new kakao.maps.Marker({
            map: map,
            position: new kakao.maps.LatLng(37.242771, 126.773757),

        })
        myMarker.setMap(map)

        const carPosition = new kakao.maps.LatLng(37.239389295978594, 126.77305344019414)
          // const carPosition = new kakao.maps.LatLng(lat, lng)
          const carMarker = new kakao.maps.Marker({
              map: map,
              position: carPosition,
              image: markerimage,
              clickable: true,
  
          });
          carMarker.setMap(map)
          const infowindow = new kakao.maps.InfoWindow({
              content : `<div style="padding:5px;"> xx분 후에 도착</div>`,
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
          {/* <div>{{lng}}</div> */}
    </div>
  );
}

export default CarMoving;
