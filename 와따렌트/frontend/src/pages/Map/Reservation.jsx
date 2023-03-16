import React from 'react';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import styles from "./Reservation.module.css";
import useState from "react";
import { Datepicker, Page, getJson, setOptions, localeEs } from '@mobiscroll/react';

setOptions({
    theme: 'ios',
    themeVariant: 'light'
});

function Reservation() {
    let now = new Date()
    let todayMonth = now.getMonth() + 1
    let todayDate = now.getDate()
    let hours = now.getHours()
    // console.log(todayMonth)
    // console.log(todayDate)
    // console.log(hours)
    const min = `2023-${todayMonth}-${todayDate}T00:00`;
    const max = `2023-12-${todayDate}T00:00`;
    // const min = `2023-03-15T00:00`;
    // const max = `2023-06-20T00:00`;
    // const [datetimeLabels, setDatetimeLabels] = React.useState([]);
    // const [datetimeInvalid, setDatetimeInvalid] = React.useState([]);

    
    // const onPageLoadingDatetime = React.useCallback((event, inst) => {
    //     getDatetimes(event.firstDay, (bookings) => {
    //         setDatetimeLabels(bookings.labels);
    //         setDatetimeInvalid(bookings.invalid);
    //     });
    // }, []);

    
    // const getDatetimes = (d, callback) => {
    //     let invalid = [];
    //     let labels = [];

    //     getJson('https://trial.mobiscroll.com/getbookingtime/?year=' + d.getFullYear() + '&month=' + d.getMonth(), (bookings) => {
    //         for (let i = 0; i < bookings.length; ++i) {
    //             const booking = bookings[i];
    //             const bDate = new Date(booking.d);

    //             if (booking.nr > 0) {
    //                 labels.push({
    //                     start: bDate,
    //                     title: booking.nr + ' SPOTS',
    //                     textColor: '#e1528f'
    //                 });
    //                 invalid = [...invalid, ...booking.invalid];
    //             } else {
    //                 invalid.push(d);
    //             }
    //         }
    //         callback({ labels: labels, invalid: invalid });
    //     }, 'jsonp');
    // }
    

    return (
        <Page className="md-calendar-booking">
            <div classname={styles.text3}>대여일/반납일</div>
            <div>
                <div className="mbsc-form-group-title">날짜와 시간을 선택해주세요</div>
                <Datepicker 
                    select="range"
                    rangeHighlight={true}
                    showRangeLabels={false}
                    minRange={1}
                    maxRange={10}
                    display="inline"
                    controls={['calendar']}
                    min={min}
                    max={max}
                    
                    // minTime="08:00"
                    // maxTime="19:59"
                    // stepMinute={60}
                    // width={null}
                    // labels={datetimeLabels}
                    // invalid={datetimeInvalid}
                    // onPageLoading={onPageLoadingDatetime}
                    cssClass="booking-datetime"
                />
                <Datepicker 
                    display="inline"
                    controls={['time']}
                    // min={min}
                    // max={max}
                    minTime="08:00"
                    maxTime="19:59"
                    stepMinute={60}
                    width={null}
                    // labels={datetimeLabels}
                    // invalid={datetimeInvalid}
                    // onPageLoading={onPageLoadingDatetime}
                    cssClass="booking-datetime"
                />
                <Datepicker 
                    display="inline"
                    controls={['time']}
                    // min={min}
                    // max={max}
                    minTime="08:00"
                    maxTime="19:59"
                    stepMinute={60}
                    width={null}
                    // labels={datetimeLabels}
                    // invalid={datetimeInvalid}
                    // onPageLoading={onPageLoadingDatetime}
                    cssClass="booking-datetime"
                />
            </div>
        </Page>
    );
}

export default Reservation;
