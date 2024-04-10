'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './styles.module.css'
import { useAuth } from '@/utils/authContext';
import NavBar from "@/components/navbar.js";
import SideBar from "@/components/sidebar.js";
import Image from 'next/image';

function CalendarForm() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const { isAuthenticated, accessToken } = useAuth(); // Use the useAuth hook
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const authToken = accessToken;
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}calendars/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`, 
            },
            body: JSON.stringify({ name, description, start_date: startDate, end_date: endDate }),
        });
        const data = await response.json();
        console.log(data);

        const newCalendarId = data.id;
        router.push(`/calendar/calendar_information?id=${newCalendarId}`);
    };

    return (
        <>

<NavBar toggleSidebar={toggleSidebar} />
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'left', marginTop: '5vh'}}>
        <SideBar isSidebarOpen={isSidebarOpen} />
        
            <form className={styles.formContainer} onSubmit={handleSubmit}>
             <h1 className={styles.wowHeader}>Create Your Calendar!</h1>
                <input className={styles.formInput} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                <textarea className={styles.formTextarea} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
                <input className={styles.formInput} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <input className={styles.formInput} type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                <button className={styles.formButton} type="submit">
                    Create Calendar
                </button>
            </form>
            </div>
        </>
    );
}

export default CalendarForm;
