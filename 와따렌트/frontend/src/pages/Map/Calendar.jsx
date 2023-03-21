// import React, { useState } from 'react' 
// import Calendar1 from 'react-calendar'
// import 'react-calendar/dist/Calendar.css'

// export default function Calendar() {
//     const [ value, onChange ] = useState(new Date())

//     return (
//         <div>
//             <Calendar1 onChange={onChange} value={value} />
//         </div>
//     )
// }

import React, { useState } from 'react'

import { DatePicker } from 'react-responsive-datepicker'
import 'react-responsive-datepicker/dist/index.css'

const Calendar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button
        onClick={() => {
          setIsOpen(true)
        }}
      >
        Open
      </button>
      <DatePicker
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        defaultValue={new Date(2023, 3, 21)}
        minDate={new Date(2023, 1, 1)}
        maxDate={new Date(2024, 1, 10)}
        headerFormat='DD, MM dd'
      />
    </div>
  )
}

export default Calendar