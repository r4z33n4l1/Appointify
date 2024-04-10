'use client';
import { useState } from 'react';
import styles from './styles.module.css'
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

function DeleteCalendarForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const id = `${searchParams.get('id')}`
    console.log(id);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEyMzk1ODYwLCJpYXQiOjE3MTE5NjM4NjAsImp0aSI6IjA3YjM4NDgwNGFiNTQwZDU5NzkzYjQxYmZlNjA3MzM2IiwidXNlcl9pZCI6MX0.RK8s4QvjZYcjuecZHwqs3Yzz51x5s71nWlzbuiVwRc8';
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}calendars/user-calendars/${id}/delete/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`, // Include the authorization token in the headers
            },
        });

        router.push(`/main_calendar`);
    };

    return (
        <><button className={styles.updateButton}><a href="main_calendar" className={styles.subLink}>Main Calendar Menu</a></button>
            
            <form className={styles.formContainer} onSubmit={handleSubmit}>
                <h1>Delete Calendar</h1>
                <button className={styles.formButton} type="submit">Delete Calendar</button>
            </form>
        </>
    );
}

export default DeleteCalendarForm;
