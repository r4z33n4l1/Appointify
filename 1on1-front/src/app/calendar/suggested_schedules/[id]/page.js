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
    const [guestAvailabilities, setGuestAvailabilities] = useState({});

    const [availableTimes, setAvailableTimes] = useState([]);
    const [error, setError] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState({});
    const [isConfirmDisabled, setIsConfirmDisabled] = useState(true);


    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    useEffect(() => {
        if (id) {
            fetchSuggestedSchedules(id);
        }
        const times = new Set();
        let conflict = false;
        const allSelected = Object.values(selectedSchedule).every(selection => {
            if (selection.date && selection.time) {
                const dateTimeKey = `${selection.date} ${selection.time}`;
                if (times.has(dateTimeKey)) {
                    conflict = true;
                    return false;
                }
                times.add(dateTimeKey);
                return true;
            }
            return false;
        });

        setIsConfirmDisabled(!allSelected || conflict);
    }, [selectedSchedule, id, accessToken]);

    async function fetchSuggestedSchedules(calendarId) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/events/create_event?calendar_id=${calendarId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch suggested schedules');
            const data = await response.json();

            if (data.schedule_groups.length) {
                setSuggestedSchedules(data.schedule_groups);
                identifyMissingGuests(data.schedule_groups);
            } else {
                setSuggestedSchedules([]);
            }
            setError('');
        } catch (error) {
            setError(error.message);
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
                alert('You already have events scheduled for this calendar');
                return false;
            }
            const data = await response.json();
            alert(data.detail);
            return true;
        } catch (error) {
            console.log(error.message);
            return false;
        }
    };

    const handleConfirmClick = async (id, schedule_group_id) => {
        const first_success = await finalizeSchedule(id, schedule_group_id);
        if (first_success) await sendFinalizeEmail(id);
    };


    const sendFinalizeEmail = async (calendarId) => {
        try {
            console.log('sending email');
            const response2 = await fetch(`http://127.0.0.1:8000/notify/calendars/notify_finalized/`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ calendar_id: calendarId }),
            });
            if (!response2.ok) {
                throw new Error('Failed to send emails to participants');
            }
            const data2 = await response2.json();
            alert(data2.detail);
            router.push(`/dashboard`);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleSelectionChange = (guestName, field, value) => {
        setSelectedSchedule((prev) => ({
            ...prev,
            [guestName]: { ...prev[guestName], [field]: value },
        }));
    
        if (field === 'date') {
            const timesForDate = guestAvailabilities[guestName].find((avail) => avail.date === value)?.non_busy_times;
            if (timesForDate) {
                const uniqueTimes = [...new Set(timesForDate.map((t) => t.time))]; 
                setAvailableTimes(uniqueTimes);
            }
        }
    };

    const handleConfirmSchedule = async () => {
        const scheduleItems = Object.entries(selectedSchedule).map(([guestName, { date, time }]) => ({
            guest_name: guestName, 
            date,
            time,
        }));
    
        try {
            const response = await fetch(`http://127.0.0.1:8000/events/create_schedule_group/`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    calendar_id: id,
                    schedules: scheduleItems,
                }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add the schedules to the new group.');
            }
    
            const data = await response.json();
            const first_success = await finalizeSchedule(id, data.schedule_group_id);
            if (first_success) await sendFinalizeEmail(id);
    
        } catch (error) {
            alert('Failed to confirm custom schedules: ' + error.message);
        }
    };
    

    async function identifyMissingGuests(scheduleGroups) {
        const calendarInfo = await fetch(`http://127.0.0.1:8000/events/availability_data?calendar_id=${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }).then(response => response.json());

        let scheduledGuests = new Set();
        scheduleGroups.forEach(group => {
            group.schedules.forEach(schedule => {
                scheduledGuests.add(schedule.contact);
            });
        });

        let acceptedGuests = {};
        calendarInfo[1].accepted.forEach(guest => {
            acceptedGuests[guest.fname + " " + guest.lname] = guest.non_busy_dates;
        });

        let missingGuests = {};
        Object.keys(acceptedGuests).forEach(guestName => {
            if (!scheduledGuests.has(guestName)) {
                missingGuests[guestName] = acceptedGuests[guestName];
            }
        });

        setGuestAvailabilities(missingGuests);
    }

    const handleBack = () => router.push(`/calendar/calendar_information/${id}`);

    return (
        <>
            <Head>
                <title>Schedules</title>
            </Head>
            <NavBar toggleSidebar={toggleSidebar} />
            <div style={{ display: 'd-flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: '5vh' }}>
                <SideBar isSidebarOpen={isSidebarOpen} />
                <div style={{ marginTop: '5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', padding: '0 20px', boxSizing: 'border-box' }}>
                        <button
                            style={{ backgroundColor: '#ba0a51bb', color: 'white', padding: '10px 20px', borderRadius: '5px' }}
                            onClick={handleBack}
                        >
                            Back to all Calendars
                        </button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '0 20px', boxSizing: 'border-box' }}>
                        {error && <p className={styles.error}>Error: {error}</p>}
                        <div>
                            {suggestedSchedules.length > 0 ? (
                                suggestedSchedules.map(group => (
                                    <div key={group.schedule_group_id} className="bg-white shadow p-4 rounded">
                                        <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ textAlign: 'left' }}>Schedule Group {group.schedule_group_id}</span>
                                            <button style={{ backgroundColor: '#ba0a51bb' }} onClick={() => handleConfirmClick(id, group.schedule_group_id)} className="text-white p-2 rounded">
                                                Confirm
                                            </button>
                                        </h3>
                                        {group.schedules.map(schedule => (
                                            <div key={schedule.schedule_id} className="flex justify-center space-x-2">
                                                <p>{schedule.date} at {schedule.time} with {schedule.contact}</p>
                                            </div>
                                        ))}
                                    </div>
                                ))
                            ) : (
                                <p>No suggested schedules are available.</p>
                            )}
                            {Object.entries(guestAvailabilities).length > 0 && (
                                <div className={styles.customScheduleContainer}>
                                {Object.keys(guestAvailabilities).length > 0 && (
                                    Object.entries(guestAvailabilities).map(([guestName, availability]) => (
                                        <div key={guestName} className={styles.customScheduleSection}>
                                            <h4>Select a date and time for {guestName}:</h4>
                                            <select
                                                className={styles.customScheduleDropdown}
                                                onChange={(e) => handleSelectionChange(guestName, 'date', e.target.value)}
                                                value={selectedSchedule[guestName]?.date || ''}
                                            >
                                                <option value="">Select Date</option>
                                                {[...new Set(availability.map(a => a.date))].map(date => (
                                                    <option key={date} value={date}>{date}</option>
                                                ))}
                                            </select>
                                            {selectedSchedule[guestName]?.date && (
                                                <select
                                                    className={styles.customScheduleDropdown}
                                                    onChange={(e) => handleSelectionChange(guestName, 'time', e.target.value)}
                                                    value={selectedSchedule[guestName]?.time || ''}
                                                    disabled={!selectedSchedule[guestName]?.date}
                                                >
                                                    <option value="">Select Time</option>
                                                    {availableTimes.map((time, index) => (
                                                        <option key={index} value={time}>{time}</option>
                                                    ))}
                                                </select>
                                            )}
                                        </div>
                                    ))
                                )}
                                <button
                                    className={styles.customScheduleConfirm}
                                    onClick={handleConfirmSchedule}
                                    disabled={isConfirmDisabled}
                                    style={isConfirmDisabled ? { backgroundColor: '#ccc' } : { backgroundColor: '#ba0a51bb', color: 'white' }}
                                >
                                    Confirm Custom Schedule
                                </button>
                            </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}