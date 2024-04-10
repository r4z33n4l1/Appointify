'use client';
import React, { useState, useEffect } from 'react';
import NavBar from "@/components/navbar.js";
import SideBar from "@/components/sidebar.js";
import Image from 'next/image';
import { useAuth } from '@/utils/authContext'; // Make sure to import useAuth
import styles from './styles.module.css'; // Adjust the path as necessary
import { CalendarView} from "@/components/my_calendar.js";

function DashboardLayout() {
	const { accessToken } = useAuth();
	const [calendarData, setCalendarData] = useState([]);
	const [selectedCalendarId, setSelectedCalendarId] = useState('');
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	}

	useEffect(() => {
		const fetchData = async () => {
			try {
				const authToken = accessToken;
				const response = await fetch('http://127.0.0.1:8000/calendars/all/', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${authToken}`,
					},
				});
				const responseData = await response.json();
				setCalendarData(responseData.results);
				if (responseData.results.length > 0) {
					setSelectedCalendarId(responseData.results[0].id); // Set default selection to the first calendar
				}
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
	}, [accessToken]);

	const handleCalendarSelectionChange = (event) => {
		setSelectedCalendarId(event.target.value);
	};

	const [calendars, setCalendars] = useState([]);

	useEffect(() => {
		const fetchCalendars = async () => {
			const fetchedCalendars = await fetchFinalizedCalendars(accessToken);
			setCalendars(fetchedCalendars);
		};

		fetchCalendars();
	}, [accessToken]);

	console.log('calendars', calendars);

return (
	<>
	<NavBar toggleSidebar={toggleSidebar} />
	<div style={{ display: 'd-flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: '5vh' }}>
		<SideBar isSidebarOpen={isSidebarOpen} />
		<div style={{ marginTop: '10vh'}}></div>
		<div className={styles.calendarContainer}>
			<div className={styles.eventslist} style={{maxWidth: '400px', minWidth: '300px'}}>
			<p style={{color: 'white'}}>Scheduled Events</p>
				{calendars ? (calendars.length > 0 ? calendars.map(calendar => (
					<div key={calendar.calendar_id} className={styles.eventcard}>
						<p>Calendar: {calendar.calendar_name}</p>
						<p>Date: {calendar.start_time?.split(' ')[0]}</p>
						<p>Start Time: {calendar.start_time?.split(' ')[1]}</p>
						<p>End Time: {calendar.end_time?.split(' ')[1]}</p>
						<p>with {calendar.contact}</p>
					</div>
				)) : <p>nothing</p>) : <p>No events scheduled yet.</p>}
				
			</div>
			<div className={styles.dropdown}>
				<p>Select Your Calendar</p>
				<select className={styles.dropdownBtn}onChange={handleCalendarSelectionChange} value={selectedCalendarId}>
				{calendarData?.map(calendar => (
					<option key={calendar.id} value={calendar.id}>
					{calendar.name}
					</option>
				))}
				</select>

			</div>
			<CalendarView id={selectedCalendarId} />
		</div>

		<div class="col-md-6" style={{margin: '10vh'}}>

			
		</div>
	</div>
	</>
);
}


async function fetchFinalizedCalendars(accessToken) {
try {
	const response = await fetch('http://127.0.0.1:8000/events/finalized_events/', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${accessToken}`,
		},
	});
	const responseData = await response.json();
	return responseData.results;
} catch (error) {
	console.error('Error fetching finalized calendars:', error);
	return [];
}
}


export default DashboardLayout;
