'use client';
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function CalendarView() {
    const [calendarData, setCalendarData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEyMzQ2NTQ0LCJpYXQiOjE3MTE5MTQ1NDQsImp0aSI6ImQ4MWMxMDg4MWQ5MzRmNzA5MTdiYzFlMWUzODFjYmVjIiwidXNlcl9pZCI6MX0.Ex9VuA8JnwPBhygOw0BX2oePa18o78eDNp2Ayb5B26c';
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}calendars/all/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                });
                const responseData = await response.json();
                const { results } = responseData;
                console.log(results);
                setCalendarData(results);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData(); 
    }, []); 

    const [value, onChange] = useState(new Date());

    return (
        <div>
            <div>
                {calendarData.map((item) => (
                    <div key={item.id}>
                        <Calendar
                            onChange={onChange}
                            value={value}
                            minDate={new Date(new Date(item.start_date).getTime() + 86400000)} 
                            maxDate={new Date(new Date(item.end_date).getTime() + 86400000)} 
                        />
                        <p>ID: {item.id}</p>
                        <p>Name: {item.name}</p>
                        <p>Description: {item.description}</p>
                        <p>Start Date: {item.start_date}</p>
                        <p>End Date: {item.end_date}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CalendarView;
