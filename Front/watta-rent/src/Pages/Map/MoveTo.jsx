/*global kakao*/
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SelectedCar.module.css";
import { markerdata } from "./Markerdata";
import spot from "../../assets/images/spot.png";
import minicar from "../../assets/images/mapcar.png";
import spot1 from "../../assets/images/spot1.png";
import car2 from "../../assets/images/car2.png";
import { onSnapshot, doc } from "firebase/firestore"
import { db } from "../../firebase-config"

const { kakao } = window;
// const address = window.localStorage.getItem("address");
const destination = window.localStorage.getItem("destination");
const carlat = window.sessionStorage.getItem("carlat");
const carlon = window.sessionStorage.getItem("carlon");
const deslat = window.localStorage.getItem("destinationLat");
const deslon = window.localStorage.getItem("destinationLng");

function MoveTo() {
  const [ cardis, setCatdis ] = useState(0)
  const [ carmin, setCatmin ] = useState(0)
  const [ address,Setaddress ] = useState("")


  let sessionStorage = window.sessionStorage;
  const min = Math.floor(cardis / 170)
  const dist = Math.floor(sessionStorage.getItem("cardis"))
  const carnumber = window.localStorage.getItem("carnumber");

  // 목적지와 거리 구하는 공식
//   const getDistanceFromLatLonInKm = (lat1,lng1,lat2,lng2) => {
//     function deg2rad(deg) {
//         return deg * (Math.PI/180)
//     }
//     var R = 6371; // Radius of the earth in km
//     var dLat = deg2rad(lat2-lat1);  // deg2rad below
//     var dLon = deg2rad(lng2-lng1);
//     var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
//     var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//     var d = R * c ; // Distance in km
//     setCatmin(Math.floor(d / 1000))
//     if (Math.floor(d) > 1000) {
//       setDesDis(Math.floor(d * 0.001) + " km")
//     } else {
//       setDesDis(Math.floor(d) + " m")
//     }
//     return d;
// }

  const unsub = onSnapshot(doc(db, "Ego", "current_gps"), (doc) => {
    sessionStorage.setItem("carlat", doc.data().lat)
    sessionStorage.setItem("carlon", doc.data().lon)
    console.log(sessionStorage.getItem("carlat"))
    console.log(sessionStorage.getItem("carlon"))
  });

  const getDis = onSnapshot(doc(db, "Ego", "total_distance"), (doc) => {
      sessionStorage.setItem("cardis", doc.data().dist)
      console.log(doc.data().dist)
      setCatdis(Math.floor(doc.data().dist))
    }
  )

  useEffect(() => {
    unsub()
    const interval = setInterval(()=> {
      getDis()
      // getDistanceFromLatLonInKm(sessionStorage.getItem("carlat"), sessionStorage.getItem("carlon"), sessionStorage.getItem("deslat"), sessionStorage.getItem("deslon"))
      mapscript();
    }, 1000)
    return  () => {
      clearInterval(interval)
    }
  }, 1000);

  const navigate = useNavigate();

  // 도착지 마커
  var imageSrc =
      "https://cdn.pixabay.com/photo/2014/04/02/10/45/location-304467_1280.png", // 마커이미지의 주소입니다
    imageSize = new kakao.maps.Size(25, 40), // 마커이미지의 크기입니다
    imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
    
    // 본인 마커
    const myImageSrc = minicar;
    const myImageSize = new kakao.maps.Size(35, 35);
    const myImageOption = { offset: new kakao.maps.Point(5, 5) };
    const markerImage = new kakao.maps.MarkerImage(
      myImageSrc,
      myImageSize,
      myImageOption
      );
  
    const myMarkerImage = new kakao.maps.MarkerImage(
      imageSrc,
      imageSize,
      imageOption
    );
      
  const mapscript = () => {
    let container = document.getElementById("map");
    let options = {
      ///여기 현재위치를 나타내는 것 실시간으로 바뀌어야함,,///
      center: new kakao.maps.LatLng(window.sessionStorage.getItem("carlat"), window.sessionStorage.getItem("carlon")),
      level: 3,
    };
    //map
    const map = new kakao.maps.Map(container, options);

    const myMarker = new kakao.maps.Marker({
      map: map,
      image: myMarkerImage,
      position: new kakao.maps.LatLng(deslat, deslon),
    });
    myMarker.setMap(map);

   const carMarker = new kakao.maps.Marker({
      map : map,
      position : new kakao.maps.LatLng(window.sessionStorage.getItem("carlat"), window.sessionStorage.getItem("carlon")),
      image: markerImage,
    })

    carMarker.setMap(map)
    let geocoder = new kakao.maps.services.Geocoder();
    Gpspage(carlat, carlon);
    function Gpspage(lat, lng) {
      let coord = new kakao.maps.LatLng(lat, lng);
      let callback = function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
          Setaddress(result[0].address.address_name);
        }
      };
      geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
    }
    
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
                <div className={styles.text12} style={{ fontSize: "1em",fontWeight:"600" }}>{address}</div>
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
                  <span style={{ fontSize: "1em" }}>약 <span style={{ fontSize: "1em", fontWeight: "600" }}>{min}</span>분</span>
                  <span> 입니다</span>
                </div>
                <div>
                  <span>내 위치에서 </span>
                  <span style={{ fontSize: "1em" }}>약 <span style={{ fontSize: "1em", fontWeight: "600" }}>{cardis}m</span></span>
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