import React,{useState} from "react";
import { useEffect } from "react"
import styles from "./GpsPage.module.css";
import { db } from "../../firebase-config"
import { doc, setDoc } from "firebase/firestore";

const { kakao } = window

export default function GpsPage() {
  const localStorage = window.localStorage;
  const sessionStorage = window.sessionStorage;
  const [address1, Setaddress] = useState("");

  // firebase와 통신
  async function updateFirebase() {
    const result = await setDoc(doc(db, "Reservation", "destination"), {
      des_lat: sessionStorage.getItem("user_lat"),
      des_lon: sessionStorage.getItem("user_lon")
    });
    return result;
  }

  const id = window.localStorage.getItem("loginNickname");
    const mapscript = () => {

      let container = document.getElementById("map");
      let options = {
        center: new kakao.maps.LatLng(37.239406, 126.773281),
        level: 5,
      };
      
      //map
      const map = new kakao.maps.Map(container, options);

      const myMarker = new kakao.maps.Marker({
        map: map,
        position: map.getCenter() ,
      });
      myMarker.setMap(map);

  kakao.maps.event.addListener(map, 'click', function(mouseEvent) {        
    
      // 클릭한 위도, 경도 정보를 가져옵니다 
      var latlng = mouseEvent.latLng; 
      
      // 마커 위치를 클릭한 위치로 옮깁니다
      myMarker.setPosition(latlng);

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
            sessionStorage.setItem("user_lat", lat);
            console.log(lng)
            sessionStorage.setItem("user_lon", lng);
            updateFirebase()
          }
        }
        geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);};
    })
  };

  useEffect(() => {
    mapscript();
  }, []);

  return (
    <div className = {styles.background}>
      <div className={styles.texta}>{id} <span className={styles.textd}>님의 현재위치</span></div>
      <div className={styles.mapwrap}>
        <div 
          id = "map"
          className = {styles.map}
          ></div>
        </div>
      <div className={styles.textb}>"{address1}" <span className={styles.textd} >(으)로</span></div>
      <div className={styles.textc}> 차를 부를까요?</div>
    </div>
  );
}
