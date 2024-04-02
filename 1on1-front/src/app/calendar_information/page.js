'use client';
import { useState } from 'react';
import styles from './styles.module.css';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import CalendarView from '../../components/my_calendar.js';

function CalendarInformation() {

    const router = useRouter();
    const currentPage = usePathname();
    const searchParams = useSearchParams()
    const id = `${searchParams.get('id')}`

    const handleUpdateCalendar = () => {
        router.push(`/update_calendar?id=${id}`);
    };

    const handleUpdateCalendarPreference = () => {
        router.push(`/update_calendar_preference?id=${id}`);
    };

    const handleDeleteCalendar = () => {
        router.push(`/delete_calendar?id=${id}`);
    };

     return (
        <div className={styles.calendarContainer}>
            <button className={styles.updateButton}><a href="main_calendar" className={styles.subLink}>Main Calendar Menu</a></button>
                
            <h1 className={styles.header}>Your Calendar</h1>

            <CalendarView id={id}/>
           
            <div className={styles.subContainer}>
                <div className={styles.buttonWrapper}>
                    <button className={styles.updateButton} style={{cursor: 'pointer'}} onClick={handleUpdateCalendar}><a className={styles.subLink}>Update Calendar Information</a></button>
                </div>
                <div className={styles.buttonWrapper}>
                    <button className={styles.updateButton} style={{cursor: 'pointer'}} onClick={handleUpdateCalendarPreference}><a className={styles.subLink}>Update Calendar Preferences</a></button>
                </div>
                <div className={styles.buttonWrapper}>
                    <button className={styles.deleteButton} style={{cursor: 'pointer'}} onClick={handleDeleteCalendar}><a className={styles.subLink}>Delete Calendar</a></button>
                </div>
            </div>
        </div>
    );
}

export default CalendarInformation;


