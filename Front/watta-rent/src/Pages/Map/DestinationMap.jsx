import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./DestinationMap.module.css";
import previous from "../../assets/images/previous.png";
import driver from "../../assets/images/driver.png";
import spot from "../../assets/images/spot.png";
import car2 from "../../assets/images/car2.png";
import { useNavigate } from "react-router-dom";

const lat = window.localStorage.getItem("lat");
const lng = window.localStorage.getItem("lng");
////나의 현재위치
const address = window.localStorage.getItem("address");
////
const { kakao } = window;
const nickname = window.localStorage.getItem("loginPassword");

// const reload = window.location.reload()
const DestinationMap = ({ searchPlace }) => {
  const [ready, SetReady] = useState("");
  const location = useLocation();
  const [under, setunder] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let searchPlace = location.state;
    // console.log(searchPlace)

    const container = document.getElementById("myMap");
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };
    var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

    const map = new kakao.maps.Map(container, options);

    const ps = new kakao.maps.services.Places();

    ps.keywordSearch(searchPlace, placesSearchCB);

    function placesSearchCB(data, status) {
      if (status === kakao.maps.services.Status.OK) {
        let bounds = new kakao.maps.LatLngBounds();
        for (let i = 0; i < data.length; i++) {
          displayMarker(data[i]);
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }
        map.setBounds(bounds);
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert("검색하신 장소가 존재하지 않습니다.");
        navigate("/CompleteCar");
        return;
      } else if (status === kakao.maps.services.Status.ERROR) {
        alert("검색 결과 중 오류가 발생했습니다.");
        return;
      }
    }

    // 내 위치 마커///////////////////////////////////////////////////////////////////////////////////

    var imageSrc =
        "https://cdn.pixabay.com/photo/2014/04/02/10/45/location-304467_1280.png", // 마커이미지의 주소입니다
      imageSize = new kakao.maps.Size(25, 40), // 마커이미지의 크기입니다
      imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

    // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
    var markerImage = new kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption
      ),
      markerPosition = new kakao.maps.LatLng(lat, lng); // 마커가 표시될 위치입니다

    // 마커를 생성합니다
    var mymarker = new kakao.maps.Marker({
      position: markerPosition,
      image: markerImage, // 마커이미지 설정
    });

    // 마커가 지도 위에 표시되도록 설정합니다
    mymarker.setMap(map);
    // 커스텀 오버레이에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
    var content =
      '<div style="background-color:rgba( 255, 255, 255, 0.8 );height:20%;width:100%;border-radius: 10px;padding: 5px;">' +
      '    <div style="font-size:0.5em;">나의 현재위치</div>' +
      "</div>";

    // 커스텀 오버레이가 표시될 위치입니다
    var position = new kakao.maps.LatLng(lat, lng);

    // 커스텀 오버레이를 생성합니다
    var customOverlay = new kakao.maps.CustomOverlay({
      map: map,
      position: position,
      content: content,
      yAnchor: 1,
    });

    ///////////////////////////////////////////////////////////////////////
    function displayMarker(place) {
      let marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(place.y, place.x),
      });

      // 마커에 클릭이벤트를 등록합니다
      kakao.maps.event.addListener(marker, "click", function () {
        // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다

        infowindow.setContent(
          '<div style="padding:4px;font-size:12px;display:flex;width:150px;justify-content:space-between;align-content:center;align-items:center">' +
            '<div style ="width:80%">' +
            place.place_name +
            "</div>" +
            // '<br>'+
            '<div style="color:red; font-Size:0.5em;">' +
            '<button onClick={window.location.replace("/DestinationMap")}>' +
            '<span style="font-weight:700;">선택<br>취소</span>' +
            "</button>" +
            "</div>" +
            // '</br>' +
            "</div>"
        );

        const container = document.getElementById("myMap");
        const options = {
          center: new kakao.maps.LatLng(place.y, place.x),
          level: 3,
        };

        const map = new kakao.maps.Map(container, options);

        infowindow.open(map, marker);

        // 내가 클릭한 주소좌표가 나옴
        // console.log(place.y);
        let y = place.y;
        let x = place.x;
        getAddr(y, x);
        function getAddr(y, x) {
          let geocoder = new kakao.maps.services.Geocoder();

          let coord = new kakao.maps.LatLng(y, x);
          let callback = function (result, status) {
            if (status === kakao.maps.services.Status.OK) {
              SetReady(result[0].road_address.address_name);
              setunder(true);
              localStorage.setItem("destination", result[0].address.address_name);
              localStorage.setItem("destinationLat", y);
              localStorage.setItem("destinationLng", x);
            }
          };
          geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
        }
      });
    }
  }, [searchPlace]);

  return (
    <div className={styles.background}>
      <div className={styles.back1}>
        <div className={styles.next}>
          <div className={styles.text}>목적지선택</div>
          <div>
            <button
              onClick={() => {
                {
                  navigate("/CompleteCar");
                }
              }}
            >
              <img src={previous} alt="go" className={styles.mini} />
            </button>
          </div>
        </div>
      </div>
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

        <div
          id="myMap"
          style={{
            width: "100vw",
            height: "100%",
          }}
          ></div>
          {!under && (
      <div className={styles.next6}>
        <div>
          <div className={styles.next5}>
            <div className={styles.in}>
              {/* <div style={{ margin:"auto" }}> */}
              <img src={driver} alt="go" className={styles.size1} />
              {/* </div> */}
              <div className={styles.box}>
                <div
                  style={{
                    fontSize: "1.2em",
                    marginBottom: "2%",
                  }}
                  ><div><span style={{fontWeight: "800"}}>{nickname}</span> 님</div>
                  목적지를 선택해주세요!
                </div>
                <div>{ready}</div>
              </div>
            </div>
          </div>
        </div>
        </div>
          )}

          {under && (
      <div className={styles.next6}>
        <div>
          <div className={styles.next5}>
            <div className={styles.in}>
              {/* <div style={{ margin:"auto" }}> */}
              <img src={car2} alt="go" className={styles.size2} />
              {/* </div> */}
              <div className={styles.box}>
                <div
                  style={{
                    fontSize: "1.2em",
                    fontWeight: "800",
                    marginBottom: "2%",
                  }}
                  >
                  목적지 위치
                </div>
                <div>{ready}</div>
              </div>
            </div>
          </div>
        </div>
        </div>
        )}
  {under && (
        <div className={styles.next3}>
          <button
    
            onClick={() => {
              {
                {window.location.replace("/MoveTo")}
              }
            }}
          >
            <div className={styles.text3}>선택완료
            </div>
          </button>
        </div>
        )}
    </div>
  );
};

export default DestinationMap;
