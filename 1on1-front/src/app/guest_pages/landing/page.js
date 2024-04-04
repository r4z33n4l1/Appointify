/* import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function SchedulePage() {
	const router = useRouter();
	const { uuid } = router.query;
	const [selectedDate, setSelectedDate] = useState(null);
	const [ownerPreferences, setOwnerPreferences] = useState([]);

	useEffect(() => {
		if (uuid) {
			const fetchData = async () => {
				try {
					const response = await fetch(`/notify/invited_user_landing/${uuid}`);
					const data = await response.json();
					setOwnerPreferences(data.owner_preferences);
				} catch (error) {
					console.error("Invalid link");
				}
			};

			fetchData();
		}
	}, [uuid]);

	const handleDateClick = (date) => {
		setSelectedDate(date);
	};

	const handleTimeSelection = (date, time) => {
		// Handle time selection
	};

	const handleNextButtonClick = () => {
		// Handle next button click
	};

	return (
		<div className="container">
			<div className="row">
				<div className="col-md-6">
					<div className="h4 mb-2 mt-2">Please select your available dates:</div>
					<Calendar
						onClickDay={handleDateClick}
						tileDisabled={({ date }) => {
							const dateString = date.toISOString().split('T')[0];
							return !ownerPreferences.some(pref => pref.date === dateString);
						}}
					/>
				</div>
				<div className="col-md-6">
					{selectedDate && (
						<div>
							<div className="h4 mb-2 mt-2">Times for {selectedDate.toDateString()}:</div>
							<ul>
								{ownerPreferences
									.find(pref => pref.date === selectedDate.toISOString().split('T')[0])
									?.non_busy_times.map(time => (
										<li key={time.id}>{time.time} ({time.preference})</li>
									))}
							</ul>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default SchedulePage;
 */