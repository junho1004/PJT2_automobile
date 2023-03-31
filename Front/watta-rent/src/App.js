import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
// User
import SignUp from "./Pages/User/SignUp";
import Home from "./Pages/User/Login";
import LoginComponent1 from "./Components/Login/LoginComponent1";
//Maphome
import MapHome from "./Pages/Map/MapHome"
//gpspage
import GpsPage from "./Components/Map/GpsPage"
// Not Found
import NotFound from "./Pages/NotFound/NotFound";
//reservation
import ReservationHome from "./Pages/Reservation/ReservationHome"
import Reservation from "./Components/Reservation/Reservation"
import SelectCar from "./Pages/Map/SelectCar"
import SelectedCar from "./Pages/Map/SelectedCar"
import CompleteCar from "./Pages/Map/CompleteCar"
import DestinationMap from "./Pages/Map/DestinationMap"
import MoveTo from "./Pages/Map/MoveTo"



const router = createBrowserRouter([
  {
    path: "/",
    // element: <Root />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "/SignUp", element: <SignUp /> },
      { path: "/MapHome", element: <MapHome /> },
      { path: "/Gpspage", element: <GpsPage /> },
      { path: "/ReservationHome", element: <ReservationHome /> },
      { path: "/Reservation", element: <Reservation /> },
      { path: "/SelectCar", element: <SelectCar/> },
      { path: "/SelectedCar", element: <SelectedCar/> },
      { path: "/CompleteCar", element: <CompleteCar/> },
      { path: "/DestinationMap", element: <DestinationMap/> },
      { path: "/MoveTo", element: <MoveTo/> },
      { path: "/LoginComponent1", element: <LoginComponent1/> },
      

    ],
  },
]);

function App() {

  ;

  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

