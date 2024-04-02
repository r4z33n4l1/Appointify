
'use client';
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useRouter } from 'next/navigation';
import styles from './styles.module.css';

function CalendarView() {
    const router = useRouter();
    const [calendarData, setCalendarData] = useState([]);
    const [calendarPreferences, setCalendarPreferences] = useState([]);
    const [value, onChange] = useState(new Date());
    const [showFinalized, setShowFinalized] = useState(true); 
    const [showUnfinalized, setShowUnfinalized] = useState(true); 

    useEffect(() => {
        const fetchData = async (url, setData) => {
            try {
                const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEyNDU0MzM2LCJpYXQiOjE3MTIwMjIzMzYsImp0aSI6ImM5NzZmNzAxMjQzMjRiZWE4NGM5M2IzODk3NzM3ZDExIiwidXNlcl9pZCI6MX0.w7XwU-Kzi3E2pSt7YfgFwwq4_GIy-oN83pnGAOMHd9Q'; // Use the actual auth token here
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                });
                const responseData = await response.json();
                console.log(responseData)
                const { results } = responseData;
                setData(results);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData('http://127.0.0.1:8000/calendars/all/', setCalendarData);
        fetchData('http://127.0.0.1:8000/calendars/user-calendars/', setCalendarPreferences);
    }, []);

    const combinedData = calendarData && calendarData.map((dataItem, index) => ({
        ...dataItem,
        ...calendarPreferences[index],
    }));

    console.log(combinedData);
    const sortPreferences = (preferences) => {
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        return preferences.sort((a, b) => priorityOrder[a.preference] - priorityOrder[b.preference]);
    };

    const filteredData = combinedData && combinedData.filter((item) => {
        if (showFinalized && showUnfinalized) {
            return true; // Show all calendars
        } else if (showFinalized && !showUnfinalized) {
            return item.finalized === 'finalized'; // Show only finalized calendars
        } else if (!showFinalized && showUnfinalized) {
            return item.finalized !== 'finalized'; // Show only unfinalized calendars
        }
        return false; 
    });

    return (
        <>
        <button className={styles.updateButton}><a href="main_calendar" className={styles.subLink}>Main Calendar Menu</a></button>
            
        <div className={styles.calendarContainer}>
             <div className={styles.filterOptions}>
                <label>
                    <input
                        type="checkbox"
                        checked={showFinalized}
                        onChange={() => setShowFinalized(!showFinalized)}
                    />
                    Show Finalized
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={showUnfinalized}
                        onChange={() => setShowUnfinalized(!showUnfinalized)}
                    />
                    Show Unfinalized
                </label>
            </div>

           
            {filteredData && filteredData.map((item) => (
                <div key={item.id} className={styles.calendarItem} style={{ cursor: 'pointer' }} onClick={(e) => router.push(`/calendar_information?id=${item.id}`)}>
                    <Calendar
                        onChange={onChange}
                        value={value}
                        minDate={new Date(new Date(item.start_date).getTime() + 86400000)} 
                        maxDate={new Date(new Date(item.end_date).getTime() + 86400000)} 
                        tileContent={({ date, view }) => {
                            if (view === 'month') {
                                const tileDate = date.toDateString();

                                if (!item.non_busy_dates) {
                                    return;
                                }
                                const shiftedNonBusyDates = item.non_busy_dates.map(nonBusyDate => ({
                                    ...nonBusyDate,
                                    date: new Date(new Date(nonBusyDate.date).getTime() + 86400000).toDateString()
                                }));

                                const nonBusyTimes = [];

                                shiftedNonBusyDates.forEach(nonBusyDate => {
                                    if (nonBusyDate.date === tileDate) {
                                        nonBusyTimes.push(...nonBusyDate.non_busy_times);
                                    }
                                });

                                const sortedTimes = sortPreferences(nonBusyTimes);

                                return (
                                    <div className={styles.scrollableTile}>
                                        {sortedTimes.map((time, index) => (
                                            <div key={index} className={`${styles.nonBusyTime} ${styles[time.preference]}`}>
                                                {time.time}
                                            </div>
                                        ))}
                                    </div>
                                );
                            }
                        }}
                    />

                    <p>ID: {item.id}</p>
                    <p>Name: {item.name}</p>
                    <p>Description: {item.description}</p>
                    <p>Start Date: {item.start_date}</p>
                    <p>End Date: {item.end_date}</p>
                </div>
            ))}
        </div>

        </>
    );
}

export default CalendarView;

