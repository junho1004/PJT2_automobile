import React,{useState} from "react";
import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import styles from "./GpsPage.module.css";




const { kakao } = window


export default function GpsPage() {
  let localStorage = window.localStorage;
  let [address1, Setaddress] = useState("");
  useEffect(() => {
    mapscript();
  }, []);
  const navigate = useNavigate();
  const id = window.localStorage.getItem("loginId");
  // const address = window.localStorage.getItem("address");
  // // const imageSrc = minicar;
  // // const imageSize = new kakao.maps.Size(30, 30);
  // // const imageOption = { offset: new kakao.maps.Point(5, 5) };
  // // const markerimage = new kakao.maps.MarkerImage(
    // //   // imageSrc,
    // //   imageSize,
    // //   imageOption
    // // );
    const mapscript = () => {

      let container = document.getElementById("map");
      let options = {
        center: new kakao.maps.LatLng(37.239406, 126.773281),
        level: 3,
      };
      

    //map
    const map = new kakao.maps.Map(container, options);

    const myMarker = new kakao.maps.Marker({
      map: map,
      position: map.getCenter() ,
    });
    myMarker.setMap(map);

    // markerdata.forEach((el) => {
    //   const position = new kakao.maps.LatLng(el.lat, el.lng);
    // //   // let customOverlay = new kakao.maps.CustomOverlay({
    // //   //     map:map,
    // //   //     position: position,
    // //   //     content: content,
    // //   //     yAnchor: 1,
    // //   // })

    //   const marker = new kakao.maps.Marker({
    //     //마커가 표시 될 지도
    //     map: map,
    //     //마커가 표시 될 위치
    //     position: position,
    //     image: markerimage,
    //     clickable: true,
    //   });

    //   marker.setMap(map);

      // const infowindow = new kakao.maps.InfoWindow({
      //   content: `<div style="padding:5px;">${el.title}차량이 선택되었습니다.</div>`,
      //   // removable : true,
      // });

      // kakao.maps.event.addListener(marker, "click", function () {
      //   infowindow.open(map, marker);
      // });
    // });
  kakao.maps.event.addListener(map, 'click', function(mouseEvent) {        
    
      // 클릭한 위도, 경도 정보를 가져옵니다 
      var latlng = mouseEvent.latLng; 
      
      // 마커 위치를 클릭한 위치로 옮깁니다
      myMarker.setPosition(latlng);
      
      // var message = '클릭한 위치의 위도는 ' + latlng.getLat() + ' 이고, ';
      // message += '경도는 ' + latlng.getLng() + ' 입니다';
      
      // var resultDiv = document.getElementById('clickLatlng'); 
      // resultDiv.innerHTML = message;})

      let lat = latlng.getLat()
      let lng = latlng.getLng()

      let geocoder = new kakao.maps.services.Geocoder();
      Gpspage(lat,lng);
      function Gpspage(lat,lng) {
        let coord = new kakao.maps.LatLng(lat, lng);
        let callback = function(result, status) {
          if (status === kakao.maps.services.Status.OK) {
            Setaddress(result[0].address.address_name)
            localStorage.setItem("address", result[0].address.address_name);
            console.log(lat)
            localStorage.setItem("lat", lat);
            console.log(lng)
            localStorage.setItem("lng", lng);
          }
        }
        geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);};
        // console.log(address1)
        // localStorage.setItem("address", address1);
        // window.localStorage.removeItem("address");

  })};
  return (
    <div className = {styles.background}>
        {/* <div style = {{padding:"50px"}}> */}
        <div className={styles.texta}>{id} 님의 현재위치</div>
        <div className={styles.mapwrap}>

          <div 
            id = "map"
            className = {styles.map}
            ></div>
            </div>
        <div className={styles.textb}>"{address1}" 로 차를 부를까요?</div>
        
            
      </div>
    // </div>
  );
}
