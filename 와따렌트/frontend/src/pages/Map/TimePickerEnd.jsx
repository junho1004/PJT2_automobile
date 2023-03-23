import React, { useState } from 'react';
import { TimePicker } from 'react-ios-time-picker';

 const  TimePickerEnd = () => {
   const [value, setValue] = useState('00:00');

   const onChange = (timeValue) => {
       setValue(timeValue);
    //    console.log(value)
   }
   console.log(value)
   return (
      <div>
         <TimePicker onChange={onChange} value={value}/>
      </div>
   );
}

export default TimePickerEnd