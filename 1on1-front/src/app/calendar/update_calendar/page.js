'use client';
import { useState } from 'react';
import styles from './styles.module.css'
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

function CalendarForm() {
    const router = useRouter();
    const searchParams = useSearchParams()
    const id = `${searchParams.get('id')}`
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEyMzQ2NTQ0LCJpYXQiOjE3MTE5MTQ1NDQsImp0aSI6ImQ4MWMxMDg4MWQ5MzRmNzA5MTdiYzFlMWUzODFjYmVjIiwidXNlcl9pZCI6MX0.Ex9VuA8JnwPBhygOw0BX2oePa18o78eDNp2Ayb5B26c';
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

        router.push(`/calendar_information?id=${id}`);
    };

    return (
        <><button className={styles.updateButton}><a href="main_calendar" className={styles.subLink}>Main Calendar Menu</a></button>
            
            <form className={styles.formContainer} onSubmit={handleSubmit}>
                <h1>Update Your Calendar!</h1>
                <input className={styles.formInput} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                <textarea className={styles.formTextarea} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
                <input className={styles.formInput} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <input className={styles.formInput} type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                <a href='calendar_information'><button className={styles.formButton} type="submit">Update Calendar</button></a>
            </form>
        </>
    );
}

export default CalendarForm;
