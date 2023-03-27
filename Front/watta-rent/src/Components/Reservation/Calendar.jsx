import React, {useState} from "react";
import Datepicker from "react-tailwindcss-datepicker";

const Calendar = () => {
    const [value, setValue] = useState({
        startDate: "",
        endDate: ""
    });
    
    const handleValueChange = (newValue) => {
        setValue(newValue);
        console.log(value);
        localStorage.setItem("reservation_start_date", value.startDate)
        localStorage.setItem("reservation_end_date", value.endDate)
    }
    
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
