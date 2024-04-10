'use client';
import { useState, useEffect } from 'react';
import styles from './styles.module.css';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/authContext';
import NavBar from "@/components/navbar.js";
import SideBar from "@/components/sidebar.js";
import Head from 'next/head';


export default function SuggestedSchedules({ params }) {
    const { accessToken } = useAuth();
    const router = useRouter();
    const { id } = params;
    const [suggestedSchedules, setSuggestedSchedules] = useState([]);
    const [error, setError] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

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

    const handleBack = () => {
        router.push(`/calendar/calendar_information/${id}`);
    };

    return (
        <>
            <Head>
                <title>Schedules</title>
            </Head>
            <NavBar toggleSidebar={toggleSidebar} />
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'left', marginTop: '5vh' }}>
                <SideBar isSidebarOpen={isSidebarOpen} />
                <div className="container mx-auto p-4" style={{ marginTop: '10vh' }}>
                    <button onClick={handleBack} className={styles.backButton}>Back</button>
                    <div className={styles.suggestedSchedules}>
                        {error && <p>Error: {error}</p>}
                        {suggestedSchedules.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {suggestedSchedules.map(group => (
                                    <div key={group.schedule_group_id} className="bg-white shadow p-4 rounded">
                                        <h3>Schedule Group {group.schedule_group_id}</h3>
                                        {group.schedules.map(schedule => (
                                            <div key={schedule.schedule_id} className="flex justify-end space-x-2">
                                                <p>{schedule.date} at {schedule.time} with {schedule.contact}</p>
                                                <button style={{ backgroundColor: '#ba0a51bb' }} onClick={() => finalizeSchedule(id, group.schedule_group_id)} className="text-white p-2 rounded">Confirm</button>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>)}
                    </div>
                </div>
            </div>
        </>

    );
}
