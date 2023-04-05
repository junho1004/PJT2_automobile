import React, { useState } from 'react';
import { TimePicker } from 'react-ios-time-picker';
import { db } from "../../firebase-config"
import { doc, updateDoc } from "firebase/firestore";

 const  TimePickerEnd = () => {
   const [value, setValue] = useState('00:00');

   const onChange = (timeValue) => {
       setValue(timeValue);
       sessionStorage.setItem("reservation_end_time", timeValue)
       //    console.log(value)
       updateFirebase()
   }

  async function updateFirebase() {
      const result = await updateDoc(doc(db, "Reservation", "reservation_time"), {
        end_time: sessionStorage.getItem("reservation_end_time"),
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

export default TimePickerEnd
