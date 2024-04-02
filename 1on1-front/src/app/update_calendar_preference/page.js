'use client';
import { useState } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import styles from './styles.module.css';

function CalendarForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = `${searchParams.get('id')}`;

    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [preference, setPreference] = useState('low'); 
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEyNDQyMTkzLCJpYXQiOjE3MTIwMTAxOTMsImp0aSI6ImNkMmUyNjVjNjYxZjRlNjlhOWQwMWQ1Yzc1MWI0ZWE1IiwidXNlcl9pZCI6MX0.te0b2XuiZIuldmv8FIjXe7_5Abl2QpTwJadFRTfDiG0';
        try {
            const response = await fetch(`http://127.0.0.1:8000/calendars/user-calendars/${id}/update/`, { 
                method: 'PATCH', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    non_busy_dates: [
                        {
                            date: date, 
                            non_busy_times: [
                                {
                                    time: time,
                                    preference: preference,
                                },
                            ],
                        },
                    ],
                }),
            });
            if (!response.ok) {
                throw new Error('Error updating preferences');
            }
            const data = await response.json();
            console.log(data);

            router.push(`/calendar_information?id=${id}`);
        } catch (error) {
            console.error(error.message);
            setError('Invalid Dates');
        }
    };

    return (
        <>
            <button className={styles.updateButton}><a href="main_calendar" className={styles.subLink}>Main Calendar Menu</a></button>

            {error && <p>{error}</p>}
            
            <form className={styles.formContainer} onSubmit={handleSubmit}>
                <h1>Update Your Time Preferences!</h1>
                <input className={styles.formInput} type="date" value={date} onChange={(e) => setDate(e.target.value)} placeholder="Date" />
                <input className={styles.formInput} type="time" value={time} onChange={(e) => setTime(e.target.value)} placeholder="Time" />
                <select className={styles.formSelect} value={preference} onChange={(e) => setPreference(e.target.value)}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                <div className={styles.updatePreferenceButton}>
                <a href='calendar_information'><button className={styles.formButton} type="submit">Update Preferences</button></a>
                </div>
            </form>
        </>
    );
}

export default CalendarForm;
