import React, {useState} from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { db } from "../../firebase-config"
import { doc, setDoc } from "firebase/firestore";

const Calendar = () => {
    const [value, setValue] = useState({
        startDate: "",
        endDate: ""
    });
    
    const handleValueChange = (newValue) => {
        setValue(newValue);
        // console.log(newValue);
        // console.log(value)
        sessionStorage.setItem("reservation_start_date", newValue.startDate)
        sessionStorage.setItem("reservation_end_date", newValue.endDate)
        updateFirebase()
    }
    async function updateFirebase() {
        const result = await setDoc(doc(db, "Reservation", "reservation_date"), {
          end_date: sessionStorage.getItem("reservation_end_date"),
          start_date: sessionStorage.getItem("reservation_start_date")
        });
        return result;
      }
    // console.log(value)
    return (
        <div>
          <h2 >시작 날짜와 종료 날짜를 선택해주세요</h2>
          <hr/>
            <Datepicker
                value={value}
                onChange={handleValueChange}
                separator={"~"} 
                // showFooter={true} 
                useRange={false} 
                minDate={new Date()} 
                maxDate={new Date("2023-12-31")} 
            />
        </div>
    );
};

export default Calendar;
