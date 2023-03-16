import axios from "axios";
import { OpenVidu } from "openvidu-browser";
import React, { useCallback, useEffect, useState } from "react";
import UserVideoComponent from "./UserVideoComponent";
import ChattingForm from "../../components/LiveRoom/ChattingForm";
import ChattingList from "../../components/LiveRoom/ChattingList";
import Timer from "../../components/Auction/Timer";
import { EyeIcon, XMarkIcon } from "@heroicons/react/24/outline";

import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./VideoRoom.module.css";

import Price from "../../components/Auction/Price";
import SellerLoading from "../../components/LiveRoom/SellerLoading";
import BuyerLoading from "../../components/LiveRoom/BuyerLoading";
import Celebrity from "../../components/Auction/Celebrity";

const OPENVIDU_SERVER_URL = "https://i8c110.p.ssafy.io:8443";
const OPENVIDU_SERVER_SECRET = "isf6";

const VideoRoom = () => {
  const navigate = useNavigate(); // 네비게이터(방 나갈 때 사용)
  const roomId = useParams().productId;
  const [product, setProduct] = useState({});
  const user = useSelector((state) => {
    return state.user;
  });
  const isHost = Number(product.userCode) === user.userCode ? true : false;
  const token = window.localStorage.getItem("token");

  useEffect(() => {
    setMyUserName(user.kakaoNickname);
    setMyProFileImg(user.kakaoProfileImg);
    setMyUserCode(user.userCode);

    (async () => {
      try {
        await axios
          .get(
            `${process.env.REACT_APP_API_URL}/product/${roomId}?userCode=${user.userCode}`
          )
          .then((res) => {
            setProduct(res.data);
            setBidPrice(res.data.price);
            const id = res.data.userCode;

            axios.get(`${process.env.REACT_APP_API_USER}/${id}`).then((res) => {
              setHostName(res.data.user.kakaoNickname);
              setHostImg(res.data.user.kakaoProfileImg);
            });
          });
      } catch (err) {
        console.error(err);
      }
    })();
  }, [user]);

  const [mySessionId, setMySessionId] = useState("SessionA");
  const [myUserName, setMyUserName] = useState(
    "Participant" + Math.floor(Math.random() * 100)
  );
  const [myUserCode, setMyUserCode] = useState(0);
  const [session, setSession] = useState(undefined);
  const [mainStreamManager, setMainStreamManager] = useState(undefined); // 페이지의 메인 비디오 화면(퍼블리셔 또는 참가자의 화면 중 하나)
  const [publisher, setPublisher] = useState(undefined); // 자기 자신의 캠
  const [subscribers, setSubscribers] = useState([]); // 다른 유저의 스트림 정보를 저장할 배열
  const [messageList, setMessageList] = useState([]); // 메세지 정보를 담을 배열
  const [seconds, setSeconds] = useState(0); //타이머 시작 시간
  const [totalUsers, setTotalUsers] = useState(0); // 총 유저수
  const [chatDisplay, setChatDisplay] = useState(true); // 채팅창 보이기(초깃값: true)
  const [myProfileImg, setMyProFileImg] = useState(undefined); // 프로필 이미지
  const [hostName, setHostName] = useState(undefined); // host 이름
  const [hostImg, setHostImg] = useState(undefined); // host 사진
  const [bidders, setBidders] = useState(0);
  const [priceOpen, setPriceOpen] = useState(false);
  const [timerOpen, setTimerOpen] = useState(false);
  const [bidPrice, setBidPrice] = useState(0);
  const [bidCount, setBidCount] = useState(0);
  const [bestBidder, setBestBidder] = useState("");
  const [bestBidderImg, setBestBidderImg] = useState(undefined);
  const [bestBidderCode, setBestBidderCode] = useState(0);
  const [celebrity, setCelebrity] = useState(false);
  const [noncelebrity, setNonCelebrity] = useState(false);
  const [sellerCheck, setSellerCheck] = useState(false); // go? 버튼 눌렀는지 확인
  const [buyerCheck, setBuyerCheck] = useState(false); // go! 버튼 눌렀는지 확인
  const [countBid, setCountBid] = useState(0);

  let OV = undefined;

  // 토큰 받아오기
  const getToken = () => {
    return createSession(mySessionId).then((sessionId) =>
      createToken(sessionId)
    );
  };

  // 세션 생성
  const createSession = (sessionId) => {
    return new Promise((resolve, reject) => {
      let data = JSON.stringify({ customSessionId: sessionId });
      axios
        .post(OPENVIDU_SERVER_URL + "/openvidu/api/sessions", data, {
          headers: {
            Authorization:
              "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          resolve(res.data.id);
        })
        .catch((res) => {
          var error = Object.assign({}, res);
          if (error?.response?.status === 409) {
            resolve(sessionId);
          } else {
            console.log(error);
          }
        });
    });
  };

  // 토큰 생성
  const createToken = (sessionId) => {
    let myRole = isHost ? "PUBLISHER" : "SUBSCRIBER";
    // console.log(myRole, "내 역할");
    return new Promise((resolve, reject) => {
      const data = { role: myRole };
      axios
        .post(
          OPENVIDU_SERVER_URL +
            "/openvidu/api/sessions/" +
            sessionId +
            "/connection",
          data,
          {
            headers: {
              Authorization:
                "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          resolve(response.data.token);
        })
        .catch((error) => reject(error));
    });
  };

  // 세션 아이디 설정
  useEffect(() => {
    setMySessionId(`Session${roomId}`);
  }, []);

  // 세션에 참여하기
  const joinSession = () => {
    OV = new OpenVidu();
    OV.enableProdMode();

    let mySession = OV.initSession();
    setSession(mySession);

    mySession.on("streamCreated", (event) => {
      // 스트림이 생길 때마다
      const subscriber = mySession.subscribe(event.stream, "subscriber");
      setSubscribers(subscriber);
    });

    mySession.on("streamDestroyed", (event) => {
      deleteSubscriber(event.stream.streamManager);
    });

    mySession.on("exception", (exception) => {
      console.warn(exception);
    });

    mySession.on("connectionCreated", ({ stream }) => {
      setTotalUsers((prevTotalUsers) => {
        return prevTotalUsers + 1;
      });
    });

    mySession.on("connectionDestroyed", ({ stream }) => {
      setTotalUsers((prevTotalUsers) => {
        return prevTotalUsers - 1;
      });
    });

    mySession.on("signal:chat", (event) => {
      // 채팅 신호 수신
      setMessageList((prevMessageList) => {
        return [...prevMessageList, event.data];
      });
    });

    mySession.on("signal:timer", (event) => {
      setTimerOpen(true);
      setSeconds(event.data); // 시간 세팅
    });

    mySession.on("signal:count", (event) => {
      const tmp = event.data.split(" : ");
      setBidders(Number(tmp[0]));
      setBestBidder(tmp[1]);
      setBestBidderImg(tmp[2]);
      setBestBidderCode(tmp[3]);
    });

    mySession.on("signal:bid", (event) => {
      const tmp = event.data.split(" : ");
      setBidPrice(tmp[0]);
      setBestBidder(tmp[1]);
      setBestBidderImg(tmp[2]);
      setBidCount(tmp[3]);
      setBestBidderCode(tmp[4]);
    });

    // 유효한 토큰으로 세션에 접속하기
    getToken().then((token) => {
      mySession
        .connect(token, { clientData: myUserName })
        .then(async () => {
          let devices = await OV.getDevices();
          let videoDevices = devices.filter(
            (device) => device.kind === "videoinput"
          );
          // Get your own camera stream ---(퍼블리셔)
          let publisher = OV.initPublisher(undefined, {
            audioSource: undefined, // The source of audio. If undefined default microphone
            videoSource: videoDevices.slice(-1)[0].deviceId, // 후면 카메라(갤럭시만,,)
            publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
            publishVideo: true, // Whether you want to start publishing with your video enabled or not
            resolution: "1280x720", // The resolution of your video
            frameRate: 30, // The frame rate of your video
            insertMode: "APPEND", // How the video is inserted in the target element 'video-container'
            mirror: true, // Whether to mirror your local video or not
          });
          mySession.publish(publisher); // 자신의 화면을 송출
          setPublisher(publisher); // 퍼블리셔(스트림 객체)를 담음
          setMainStreamManager(publisher); // 퍼블리셔(스트림 객체)를 담음
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  // 방 삭제 요청 api
  const deleteRoomRequest = () => {
    if (isHost) {
      // 내가 host이면,
      axios
        .delete(`https://i8c110.p.ssafy.io/api/v1/live/${roomId}`, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          // 판매자, 낙찰자 채팅방 연결
          if (bestBidder !== "") {
            axios
              .post("https://i8c110.p.ssafy.io/api/v1/socket/room", {
                buyerCode: bestBidderCode,
                sellerCode: product.userCode,
              })
              .then((res) => {
                console.log(res.data);
                navigate(`/chatroom/${res.data.chatRoomId}`, {
                  state: {
                    chats: res.data.chatList,
                    seller: res.data.seller,
                    buyer: res.data.buyer,
                    type: "",
                    title: product.title,
                    productId: product.productId,
                  },
                });
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // 메세지 보내기(Sender of the message (after 'session.connect'))
  const sendMsg = (msg, currentSession) => {
    currentSession
      .signal({
        data: msg, // .signal의 data는 문자열만 넘겨야한다
        to: [], // Array of Connection objects (optional. Broadcast to everyone if empty)
        type: "chat", // The type of message (optional)
      })
      .then(() => {})
      .catch((error) => {
        console.error(error);
      });
  };

  const thirtyCount = () => {
    session
      .signal({
        data: 30,
        type: "timer",
      })
      .then(() => {
        setSellerCheck(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const tenCount = () => {
    session
      .signal({
        data: 10,
        type: "timer",
      })
      .then(() => {})
      .catch((error) => {
        console.error(error);
      });
  };

  // go! 버튼 눌렀을 때 count
  const countBidder = () => {
    session
      .signal({
        data: `${
          Number(bidders) + 1
        } : ${myUserName} : ${myProfileImg} : ${myUserCode}`,
        type: "count",
      })
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  };

  // bidPrice가 갱신될 때마다 signal 보내서 동기화
  const bidding = (price, bidder, myProfileImg, bidCount, bidCode) => {
    session
      .signal({
        data: `${Number(bidPrice) + price} : ${bidder} : ${myProfileImg} : ${
          Number(countBid) + bidCount
        } : ${bidCode}`,
        type: "bid",
      })
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  };

  // price가 변경될 때마다 bidding 실행
  const handleBidPrice = (price, bidder, myProfileImg, bidCount, bidCode) => {
    bidding(price, bidder, myProfileImg, bidCount, bidCode);
  };

  // 세션 떠나기 --- disconnect함수를 호출하여 세션을 떠남
  const leaveSession = () => {
    const mySession = session;
    if (mySession) {
      mySession.disconnect();
      navigate("/live"); // live 탭으로 이동
    }
    // 속성 초기화
    OV = null;
    setSession(undefined);
    setSubscribers([]);
    setMySessionId("sessionA");
    setMyUserName("Participant" + Math.floor(Math.random() * 100));
    setMainStreamManager(undefined);
    setPublisher(undefined);
    setMessageList([]);
    setChatDisplay(true);
    setTotalUsers((prevTotalUsers) => {
      return 0;
    });
    setSeconds(0);
    deleteRoomRequest(); // 방 삭제 요청
  };

  useEffect(() => {
    if (bidPrice > product.price) {
      // product 가격으로 바꿔야 함
    }
  }, [bidPrice]);

  // 참가자를 배열에서 제거함
  const deleteSubscriber = useCallback(
    (streamManager) => {
      let tmp_subscribers = subscribers;
      let index = tmp_subscribers.indexOf(streamManager, 0);
      if (index > -1) {
        tmp_subscribers.splice(index, 1);
        setSubscribers(tmp_subscribers);
      }
    },
    [subscribers]
  );

  const changeBuyerCheck = () => {
    setBuyerCheck(true);
  };

  useEffect(() => {
    const onbeforeunload = (event) => {
      leaveSession();
    };
    window.addEventListener("beforeunload", onbeforeunload); // componentDidMount
    return () => {
      window.removeEventListener("beforeunload", onbeforeunload);
    };
  }, [leaveSession]);

  return (
    <div className={styles.container}>
      {/* 입장 전 보이는 화면 */}
      {session === undefined ? (
        <div>
          {isHost ? (
            <SellerLoading
              joinSession={joinSession}
              roomId={roomId}
              title={product.title}
            />
          ) : (
            <BuyerLoading joinSession={joinSession} title={product.title} />
          )}
        </div>
      ) : null}

      {/* 비디오 화면 뜨는 곳 */}
      {session !== undefined ? (
        <div className={styles.container}>
          {mainStreamManager !== undefined ? (
            <div className={styles.mainvideo}>
              {/* <UserVideoComponent streamManager={mainStreamManager} /> */}
              {isHost && <UserVideoComponent streamManager={publisher} />}
              {!isHost && <UserVideoComponent streamManager={subscribers} />}
            </div>
          ) : null}

          {/* 배경 그라데이션 */}
          <div className={styles.background}>
            <div className={styles.bgtop}></div>
          </div>
          <div className={styles.bottomgr}>
            <div className={styles.bgbottom}></div>
          </div>

          {/* 라이브 화면 */}
          <div className={styles.top}>
            <div className={styles.toptop}>
              <div className={styles.topleft}>
                <div className={styles.host}>
                  <div className={styles.sellerimg}>
                    <img src={hostImg} alt="" />
                  </div>
                  <div className={styles.sellername}>{hostName} 님</div>
                </div>
                <div className={styles.subtotal}>
                  <EyeIcon className={styles.eyeicon} />
                  {totalUsers}
                </div>
              </div>
              <div className={styles.topright}>
                <div className={styles.live}>LIVE</div>
                <XMarkIcon
                  className={styles.xicon}
                  onClick={() => {
                    leaveSession();
                  }}
                />
              </div>
            </div>
          </div>
          <div className={styles.bottom}>
            <div className={styles.bottomtop}>
              <ChattingList messageList={messageList} />
            </div>
            <div className={styles.bottombottom}>
              <ChattingForm
                myProfileImg={myProfileImg}
                myUserName={myUserName}
                onMessage={sendMsg}
                currentSession={session}
              />
              {isHost ? (
                !sellerCheck ? (
                  <button onClick={thirtyCount} className={styles.gobtn}>
                    go?
                  </button>
                ) : (
                  <button className={styles.nogobtn}>go?</button>
                )
              ) : !buyerCheck ? (
                <button
                  onClick={() => {
                    countBidder();
                    changeBuyerCheck();
                  }}
                  className={styles.gobtn}
                >
                  go!
                </button>
              ) : (
                <button className={styles.nogobtn}>go!</button>
              )}
            </div>
          </div>

          <div
            className={styles.timer}
            style={
              !timerOpen ? { visibility: "hidden" } : { visibility: "visible" }
            }
          >
            <Timer
              seconds={seconds}
              setSeconds={setSeconds}
              currentSession={session}
              bidders={bidders}
              setPriceOpen={setPriceOpen}
              bidCount={bidCount}
              bidPrice={bidPrice}
              bestBidder={bestBidder}
              setCelebrity={setCelebrity}
              setNonCelebrity={setNonCelebrity}
              setTimerOpen={setTimerOpen}
              timerOpen={timerOpen}
              sellerCheck={sellerCheck}
              buyerCheck={buyerCheck}
            />

            {priceOpen && !celebrity ? (
              <div className={styles.bidtext}>최고 {bidPrice}원!</div>
            ) : null}
            {!priceOpen ? (
              <div className={styles.gotext}>
                <div>GO! 버튼을 눌러</div>
                <div>경매에 참여하세요!</div>
              </div>
            ) : null}
          </div>

          <div className={styles.pricediv}>
            {buyerCheck && priceOpen && !celebrity ? (
              <div>
                <Price
                  handleBidPrice={handleBidPrice}
                  setBidCount={setBidCount}
                  myUserName={myUserName}
                  className={styles.price}
                  myProfileImg={myProfileImg}
                  myUserCode={myUserCode}
                  tenCount={tenCount}
                />
              </div>
            ) : null}
          </div>

          <div className={styles.celediv}>
            {celebrity ? (
              <Celebrity
                bestBidderImg={bestBidderImg}
                bestBidder={bestBidder}
                bidPrice={bidPrice}
              />
            ) : null}
          </div>

          {/* bidder가 0명일 때 */}
          <div>
            {noncelebrity ? (
              <div className={styles.modal}>
                <div className={styles.modaltext}>입찰자가 없어서</div>
                <div className={styles.modaltext}>
                  경매가 진행되지 않습니다.
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default VideoRoom;
