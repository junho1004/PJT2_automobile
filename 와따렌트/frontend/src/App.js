import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import {useDispatch} from 'react-redux'
import {login} from './store/userSlice'
import axios from 'axios';
import {useEffect} from 'react'
import Root from "./pages/Root";
// 로그인
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
// 유저 관리
// 상품관리
// 라이브
// Lists
// 검색
// 리뷰
// Not Found
import NotFound from "./pages/NotFound/NotFound";
//Maphome
import MapHome from "./pages/Map/MapHome"
//gpspage
import GpsPage from "./pages/Map/GpsPage"
//reservation
import ReservationHome from "./pages/Map/ReservationHome"
import Reservation from "./pages/Map/Reservation"
import SelectCar from "./pages/Map/SelectCar"
import CarMoving from "./pages/Map/CarMoving"
import Test from "./pages/Map/test"


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/MapHome", element: <MapHome /> },
      { path: "/Gpspage", element: <GpsPage /> },
      { path: "/ReservationHome", element: <ReservationHome /> },
      { path: "/Reservation", element: <Reservation /> },
      { path: "/SelectCar", element: <SelectCar/> },
      { path: "/CarMoving", element: <CarMoving/> },
      { path: "/Test", element: <Test/> },
    ],
  },
]);

function App() {
  const dispatch = useDispatch()
  const token = localStorage.getItem("token"); // 로그인 정보를 로컬스토리지에서 가져옵니다.


  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

