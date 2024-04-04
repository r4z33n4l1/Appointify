'use client';
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function getOwnerPreferences({ uuid }) {
	const [selectedDate, setSelectedDate] = useState(null);
	const [ownerPreferences, setOwnerPreferences] = useState([]);

    useEffect(() => {
        const fetchData = async (url, setData) => {
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const responseData = await response.json();
                const { results } = responseData;
                console.log(results);
                setData(results);
            } catch (error) {
                console.error('Invalid uuid:', error);
            }
        };

        // fetchData(`http://127.0.0.1:8000/notify/invited_user_landing/${uuid}/`, setOwnerPreferences);
        fetchData(`http://127.0.0.1:8000/notify/invited_user_landing/1da86f10-2a9c-4093-b7ba-63c96e8f8156/`, setOwnerPreferences);
    }, []);
    const preferences = {};

    if (ownerPreferences) {
        ownerPreferences.forEach((item) => {
            const { date, non_busy_times } = item;
            preferences[date] = non_busy_times.map(({ time, preference }) => [time, preference]);
        });
    }

    console.log(preferences);
    return;
}

function CalendarItem({ item, onChange, value, sortPreferences }) {
    return (
        <div className={styles.calendarItem}>
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
        </div>
    );
}

export default getOwnerPreferences;