
'use client';
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useRouter } from 'next/navigation';
import styles from './styles.module.css';
import { useAuth } from '@/utils/authContext';
import NavBar from "@/components/navbar.js";
import SideBar from "@/components/sidebar.js";
import Image from 'next/image';

function CalendarView() {
    const { accessToken } = useAuth();
    const router = useRouter();
    const [calendarData, setCalendarData] = useState([]);
    const [calendarPreferences, setCalendarPreferences] = useState([]);
    const [value, onChange] = useState(new Date());
    const [showFinalized, setShowFinalized] = useState(true); 
    const [showUnfinalized, setShowUnfinalized] = useState(true); 

    useEffect(() => {
        const fetchData = async (url, setData) => {
            try {
                const authToken = accessToken;
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
            <NavBar />
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'left', marginTop: '4vh' }}>
                <SideBar />
                <a href="create_calendar" className="create-calendar-btn" style={{ display: 'inline-flex', alignItems: 'center', color: 'white', textDecoration: 'none' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'flex-start' }}>
                        <Image src="/assets/plus-512.png" width={20} height={20} alt="Plus Icon" />
                        <span style={{ marginLeft: '1rem' }}>Create a new calendar</span>
                    </span>
                </a>

        < div style={{marginTop: '15vh'}}>
        <div className={styles.filterOptions}>
                    <label className={styles.finalBtn}>
                        <input
                            type="checkbox"
                            checked={showFinalized}
                            onChange={() => setShowFinalized(!showFinalized)}
                        />
                        Show Finalized
                    </label>
                    <label className={styles.unfinalBtn}>
                        <input
                            type="checkbox"
                            checked={showUnfinalized}
                            onChange={() => setShowUnfinalized(!showUnfinalized)}
                        />
                        Show Unfinalized
                    </label>
                </div>
            <div className={styles.calendarContainer}>

                {filteredData && filteredData.map((item) => (
                    <div key={item.id} className={styles.calendarItem} style={{ cursor: 'pointer' }} onClick={() => router.push(`/calendar/calendar_information/${item.id}`)}>
                        <Calendar
                            onChange={onChange}
                            value={value}
                            minDate={new Date(new Date(item.start_date).getTime() + 86400000)} 
                            maxDate={new Date(new Date(item.end_date).getTime() + 86400000)} 
                            className={styles.customCalendar}
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

                    <p className={styles.itemName}>{item.name}</p>

                    </div>
                ))}
                </div>
            </div>
            </div>
        </>
    );
}
export default CalendarView;

