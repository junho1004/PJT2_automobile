import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import {useDispatch} from 'react-redux'
import {login} from './store/userSlice'
import axios from 'axios';
import {useEffect} from 'react'
import Root from "./pages/Root";
// 로그인
import Oauth from "./pages/Login/Oauth";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
// 유저 관리
import Report from "./pages/Report/Report";
import UserInfo from "./pages/UserInfo/UserInfo";
import UpdateUserInfo from "./pages/UserInfo/UpdateUserInfo";
// 상품관리
import Detail from "./pages/Detail/Detail";
import AddProduct from "./pages/ProductManagement/AddProduct";
import UpdateProduct from "./pages/ProductManagement/UpdateProduct";
// 라이브
import Live from "./pages/Live/Live";
import VideoRoom from "./pages/LiveRoom/VideoRoom";
// 채팅
import ChatList from "./pages/Chat/ChatList";
import ChatRoom from "./pages/Chat/ChatRoom";
// Lists
import SellList from "./pages/Lists/SellList";
import BuyList from "./pages/Lists/BuyList";
import WishList from "./pages/Lists/WishList";
import MyReviewList from "./pages/Lists/MyReviewList";
// 검색
import Search from "./pages/Search/Search";
// 리뷰
import AddReview from "./pages/Review/AddReview";
// Not Found
import NotFound from "./pages/NotFound/NotFound";
//Maphome
import MapHome from "./pages/Map/MapHome"
//gpspage
import GpsPage from "./pages/Map/GpsPage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "/oauth", element: <Oauth /> },
      { path: "/live", element: <Live /> },
      { path: "/live/:productId", element: <VideoRoom /> },
      { path: "/detail/:productId", element: <Detail /> },
      { path: "/update/:productId", element: <UpdateProduct /> },
      { path: "/chatlist", element: <ChatList /> },
      { path: "/chatroom/:chatroomId", element: <ChatRoom /> },
      { path: "/addproduct", element: <AddProduct /> },
      { path: "/review/:productId/create", element: <AddReview /> },
      { path: "/userinfo/:userId", element: <UserInfo /> },
      { path: "/userinfo/:userId/update", element: <UpdateUserInfo /> },
      { path: "/search", element: <Search /> },
      { path: "/login", element: <Login /> },
      { path: "/buylist", element: <BuyList /> },
      { path: "/selllist/:userId", element: <SellList /> },
      { path: "/wishlist", element: <WishList /> },
      { path: "/myreviewlist", element: <MyReviewList /> },
      { path: "/report/:userId", element: <Report /> },
      { path: "/report/:userId", element: <Report /> },
      { path: "/MapHome", element: <MapHome /> },
      { path: "/Gpspage", element: <GpsPage /> },
    ],
  },
]);

function App() {
  const dispatch = useDispatch()
  const token = localStorage.getItem("token"); // 로그인 정보를 로컬스토리지에서 가져옵니다.
  
  useEffect(() => {
    if (!token) return; // 로그인 정보가 없다면 여기서 멈춥니다.
    axios
      .get("http://i8c110.p.ssafy.io/api/me", {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        dispatch(
          login({
            userCode: res.data.user.userCode,
            point: res.data.user.point,
            kakaoNickname: res.data.user.kakaoNickname,
            kakaoProfileImg: res.data.user.kakaoProfileImg,
          })
        );
      });
  });

  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
