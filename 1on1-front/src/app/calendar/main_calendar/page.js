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
import { CalendarView} from "@/components/my_calendar.js";


function ViewCalendar() {
    const { accessToken } = useAuth();
    const router = useRouter();
    const [calendarData, setCalendarData] = useState([]);
    const [calendarPreferences, setCalendarPreferences] = useState([]);
    const [value, onChange] = useState(new Date());
    const [showFinalized, setShowFinalized] = useState(true);
    const [showUnfinalized, setShowUnfinalized] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    const handleCreateCalendar = () => {
        router.push('/calendar/create_calendar');
    };

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
            return item.isfinalized; // Show only finalized calendars
        } else if (!showFinalized && showUnfinalized) {
            return !item.isfinalized;// Show only unfinalized calendars
        }
        return false;
    });

    return (
        <>
            <NavBar toggleSidebar={toggleSidebar} />
            <div style={{ display: 'd-flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: '5vh' }}>
                <SideBar isSidebarOpen={isSidebarOpen} />
                <div>
                    <div className={styles.container}>
                        <button className={styles.createCalendarBtn} onClick={handleCreateCalendar}>
                            <div className={styles.plusIcon}>
                                <Image src="/assets/plus-512.png" width={20} height={20} alt="Plus Icon" />
                            </div>
                            Create a new calendar
                        </button>

                        <div className={styles.checkboxContainer}>
                            <label className={`${styles.checkboxLabel} ${styles.finalBtn}`}>
                                <input
                                    type="checkbox"
                                    checked={showFinalized}
                                    onChange={() => setShowFinalized(!showFinalized)}
                                />
                                <span className={styles.checkboxText}>Show Finalized</span>
                            </label>
                            <label className={`${styles.checkboxLabel} ${styles.unfinalBtn}`}>
                                <input
                                    type="checkbox"
                                    checked={showUnfinalized}
                                    onChange={() => setShowUnfinalized(!showUnfinalized)}
                                />
                                <span className={styles.checkboxText}>Show Unfinalized</span>
                            </label>
                        </div>
                    </div>
                    <div className={styles.calendarContainer} style={{ justifyContent: 'center' }}>

                        {filteredData && filteredData.map((item) => (
                            <div key={item.id} className={styles.calendarContainer}>
{/*                                 <Calendar
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
                                /> */}

                                {/* <p className={styles.itemName}>{item.name}</p> */}
                                <CalendarView id={item.id} showPreferences = {false} />

                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
export default ViewCalendar;

