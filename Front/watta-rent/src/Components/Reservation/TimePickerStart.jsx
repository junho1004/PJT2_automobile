import React, { useState } from 'react';
import { TimePicker } from 'react-ios-time-picker';
import { db } from "../../firebase-config"
import { doc, updateDoc } from "firebase/firestore";

 const  TimePickerStart = () => {
   const [value, setValue] = useState('00:00');
   

   const onChange = (timeValue) => {
       console.log(timeValue)
       setValue(timeValue);
       sessionStorage.setItem("reservation_start_time", timeValue)
       updateFirebase()
   }

  async function updateFirebase() {
   const result = await updateDoc(doc(db, "Reservation", "reservation_time"), {
     start_time: sessionStorage.getItem("reservation_start_time"),
   });
   return result;
 }
   // console.log(value)
   return (
      <div>
         <TimePicker onChange={onChange} value={value}/>
      </div>
   );
}

export default TimePickerStart
