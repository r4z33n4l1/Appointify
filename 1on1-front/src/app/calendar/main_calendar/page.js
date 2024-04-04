'use client';
import { useState } from 'react';
import styles from './styles.module.css';

function MainCalendar() {
    return (
        <div className={styles.container}>
            <h1 className={styles.header}>Calendar Dashboard</h1>
            <div className={styles.buttonsContainer}>
                <a href="create_calendar" className={styles.button}>Create New Calendar</a>
                <a href="view_calendar_preference" className={styles.button}>View All Calendars</a>
            </div>
        </div>
    );
}

export default MainCalendar;
