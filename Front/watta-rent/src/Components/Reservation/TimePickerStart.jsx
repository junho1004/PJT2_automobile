import React, { useState } from 'react';
import { TimePicker } from 'react-ios-time-picker';

 const  TimePickerStart = () => {
   const [value, setValue] = useState('00:00');
   

   const onChange = (timeValue) => {
       console.log(timeValue)
       setValue(timeValue);
       sessionStorage.setItem("reservation_start_time", timeValue)
   }
   // console.log(value)
   return (
      <div>
         <TimePicker onChange={onChange} value={value}/>
      </div>
   );
}

export default TimePickerStart
