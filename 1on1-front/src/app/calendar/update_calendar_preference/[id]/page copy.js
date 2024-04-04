// 'use client';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import styles from './styles.module.css'; // Import the CSS module
// import { useAuth } from '@/utils/authContext'; 
// import { isValidCalendarId } from '@/components/my_calendar'; 


// function CalendarForm({params}) {
//     // Hook into the router and auth context
//     const router = useRouter();
//     const id = params.id;
//     const { accessToken } = useAuth(); // Assuming your auth hook provides accessToken

//     // State for form fields and error message
//     const [date, setDate] = useState('');
//     const [time, setTime] = useState('');
//     const [preference, setPreference] = useState('low');
//     const [error, setError] = useState('');

//     // Validate the calendar ID when the component mounts or when the ID changes
//     useEffect(() => {
//         async function fetchAndValidateCalendarId() {
//             const isValid = await isValidCalendarId(id, accessToken);
//             if (!isValid) {
//                 // Redirect to the main calendar page if the ID is not valid
//                 router.push('/calendar/main_calendar');
//             }
//         }

//         if (id) fetchAndValidateCalendarId();
//     }, [id, accessToken, router]);

//     // Handle form submission
//         const handleSubmit = async (e) => {
//             e.preventDefault();
//             const authToken = accessToken;
//             try {
//                 const response = await fetch(`http://127.0.0.1:8000/calendars/user-calendars/${id}/update/`, { 
//                     method: 'PUT', 
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Authorization': `Bearer ${authToken}`,
//                     },
//                     body: JSON.stringify({
//                         non_busy_dates: [
//                             {
//                                 date: date, 
//                                 non_busy_times: [
//                                     {
//                                         time: time,
//                                         preference: preference,
//                                     },
//                                 ],
//                             },
//                         ],
//                     }),
//                 });
//                 if (!response.ok) {
//                     throw new Error('Error updating preferences');
//                 }
//                 const data = await response.json();
//                 console.log(data);
    
//                 router.push(`/calendar_information?id=${id}`);
//             } catch (error) {
//                 console.error(error.message);
//                 setError('Invalid Dates');
//             }
//         router.push(`/calendar/calendar_information/${id}`);
//     };

//     // Render the form
//     return (
//         <>
//             <button className={styles.updateButton}><a href="main_calendar" className={styles.subLink}>Main Calendar Menu</a></button>

//             {error && <p>{error}</p>}
            
//             <form className={styles.formContainer} onSubmit={handleSubmit}>
//                 <h1>Update Your Time Preferences!</h1>
//                 <input className={styles.formInput} type="date" value={date} onChange={(e) => setDate(e.target.value)} placeholder="Date" />
//                 <input className={styles.formInput} type="time" value={time} onChange={(e) => setTime(e.target.value)} placeholder="Time" />
//                 <select className={styles.formSelect} value={preference} onChange={(e) => setPreference(e.target.value)}>
//                     <option value="low">Low</option>
//                     <option value="medium">Medium</option>
//                     <option value="high">High</option>
//                 </select>
//                 <div className={styles.updatePreferenceButton}>
//                 <a href='calendar_information'><button className={styles.formButton} type="submit">Update Preferences</button></a>
//                 </div>
//             </form>
//         </>
//     );
// }

// export default CalendarForm;
