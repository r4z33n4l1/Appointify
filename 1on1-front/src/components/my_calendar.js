import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './styles.module.css';
import { useAuth } from '@/utils/authContext';



export async function isValidCalendarId(calendarId, access) {
    try {

      const authToken = access;
      const response = await fetch('http://127.0.0.1:8000/calendars/all/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      return  data.results.some(calendar => calendar.id.toString() === calendarId);
  
    } catch (error) {
      console.error('Error fetching calendars:', error);
      throw error;
    }
  }

export function CalendarView({ id }) {

    console.log('component id', id);
    const [calendarData, setCalendarData] = useState([]);
    const [calendarPreferences, setCalendarPreferences] = useState([]);
    const [value, onChange] = useState(new Date());
    const { accessToken } = useAuth();

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
                const { results } = responseData;
                setData(results);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData('http://127.0.0.1:8000/calendars/all/', setCalendarData);
        fetchData('http://127.0.0.1:8000/calendars/user-calendars/', setCalendarPreferences);
    }, []);

    console.log(calendarData);
    let id_data = ''
    let id_preference = ''

    calendarData.map((dataItem, index) => {

        if(dataItem.id == id)
        {
            id_data = dataItem;
            id_preference = calendarPreferences[index];
        }

    }
    )

    console.log(id_data, id_preference);
    const combinedData = { ...id_data, ...id_preference };


    const sortPreferences = (preferences) => {
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        return preferences.sort((a, b) => priorityOrder[a.preference] - priorityOrder[b.preference]);
    };


    return (
        <div className={styles.calendarContainer}>
            {combinedData? ( 
                <CalendarItem key={combinedData.id} item={combinedData} onChange={onChange} value={value} sortPreferences={sortPreferences} />
            ) : (
                <p>No calendar data available.</p>
            )}
        </div>
    );
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

                    <p>ID: {item.id}</p>
                    <p>Name: {item.name}</p>
                    <p>Description: {item.description}</p>
                    <p>Start Date: {item.start_date}</p>
                    <p>End Date: {item.end_date}</p>
        </div>
    );
}

export async function fetchAndOrganizeCalendarPreferences(calendarId, accessToken) {
    try {
        // Fetch user calendars along with their preferences
        const response = await fetch('http://127.0.0.1:8000/calendars/user-calendars/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user calendars');
        }

        const { results: userCalendars } = await response.json();
        // Find the specific calendar by ID
        const calendar = userCalendars.find(calendar => calendar.calendar.toString() === calendarId);

        if (!calendar) {
            // If no matching calendar is found, return an empty object
            return {};
        }

        // Process the non_busy_dates from the found calendar
        const organizedPreferences = calendar.non_busy_dates.reduce((acc, { date, non_busy_times }) => {
            acc[date] = non_busy_times.map(({ time, preference }) => ({ time, preference }));
            return acc;
        }, {});

        return organizedPreferences;
    } catch (error) {
        console.error('Error organizing calendar preferences:', error);
        throw error;
    }
}



export default CalendarView;


