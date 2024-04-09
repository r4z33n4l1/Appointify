'use client';
import { useState, useEffect } from 'react';
import styles from './styles.module.css';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/authContext';

export default function SuggestedSchedules({ params }) {
    const { accessToken } = useAuth();
    const router = useRouter();
    const { id } = params;
    const [suggestedSchedules, setSuggestedSchedules] = useState([]);
    const [error, setError] = useState('');

    const fetchSuggestedSchedules = async (calendarId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/events/create_event?calendar_id=${calendarId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.error.startsWith('Pending invitations exist for:')) {
                    const username = errorData.error.split(': ')[1];
                    throw new Error(`Pending invitations exist. ${username} has not given their preferences.`);
                }
                throw new Error('Failed to fetch suggested schedules');
            }
            const data = await response.json();
            setSuggestedSchedules(data.schedule_groups);
            setError('');
        } catch (error) {
            setError(error.message);
            setSuggestedSchedules([]);
        }
    };

    const finalizeSchedule = async (calendarId, scheduleGroupId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/events/create_event/`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ calendar_id: calendarId, schedule_group_id: scheduleGroupId }),
            });
            if (!response.ok) {
                throw new Error('Failed to finalize schedule');
            }
            const data = await response.json();
            alert(data.detail);
            router.push(`/calendar/calendar_information/${calendarId}`);
        } catch (error) {
            alert(error.message);
        }
    };

    useEffect(() => {
        if (id) {
            fetchSuggestedSchedules(id);
        }
    }, [id, accessToken]);

    return (
        <div className={styles.container}>
            <div className={styles.suggestedSchedules}>
                {error && <p>Error: {error}</p>}
                {suggestedSchedules.length > 0 && suggestedSchedules.map(group => (
                    <div key={group.schedule_group_id}>
                        <h3>Schedule Group {group.schedule_group_id}</h3>
                        {group.schedules.map(schedule => (
                            <div key={schedule.schedule_id}>
                                <p>{schedule.date} at {schedule.time} with {schedule.contact}</p>
                                <button onClick={() => finalizeSchedule(id, group.schedule_group_id)}>Confirm</button>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
