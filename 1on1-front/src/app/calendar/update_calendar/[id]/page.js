'use client';
import { useState, useEffect } from 'react';
import styles from './styles.module.css'
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/utils/authContext';
import { isValidCalendarId } from '@/components/my_calendar.js';
import NavBar from "@/components/navbar.js";
import SideBar from "@/components/sidebar.js";
function CalendarForm({params}) {
    const {accessToken} = useAuth(); 
    const router = useRouter();
    const searchParams = useSearchParams()
    const id = params.id;
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        async function checkCalendarId() {
          const valid = await isValidCalendarId(id, accessToken);
          console.log('valid', valid)
          if (!valid) {
            
            router.push('/calendar/main_calendar');
          }
        }
        checkCalendarId();
      }, [id, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const authToken = accessToken;
        const response = await fetch(`http://127.0.0.1:8000/calendars/update/${id}/`, { 
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`, // Include the authorization token in the headers
            },
            body: JSON.stringify({ name, description, start_date: startDate, end_date: endDate }),
        });
        const data = await response.json();
        console.log(data);

        router.push(`/calendar/calendar_information/${id}`);
    };

    return (
        <>
            <NavBar />

            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'left', marginTop: '4vh' }}>
                <SideBar />
                    
                        <form className={styles.formContainer} onSubmit={handleSubmit}>
                        <h1 className={styles.wowHeader}>Update Your Calendar!</h1>
                            <input className={styles.formInput} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                            <textarea className={styles.formTextarea} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
                            <input className={styles.formInput} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                            <input className={styles.formInput} type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                            <a href='calendar_information'><button className={styles.formButton} type="submit">Update Calendar</button></a>
                        </form>
                        </div>

        </>
    );
}

export default CalendarForm;
