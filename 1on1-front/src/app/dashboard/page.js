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

  return (
    <>
      <NavBar toggleSidebar={toggleSidebar} />
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'left', marginTop: '5vh'}}>
        <SideBar isSidebarOpen={isSidebarOpen} />
        <div style={{ marginLeft: '300px', marginTop: '10vh'}}>
          <a href="/calendar/main_calendar" className="create-calendar-btn" style={{ display: 'inline-flex', alignItems: 'center', color: 'white', textDecoration: 'none' }}>
              <span style={{ display: 'inline-flex', alignItems: 'flex-start' }}>
                  <Image src="/assets/plus-512.png" width={20} height={20} alt="Plus Icon" />
                  <span style={{ margin: '1rem' }}>Create a new calendar</span>
              </span>
          </a>
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
          
        </div>
        <div className={styles.calendarView}>
          <CalendarView id={selectedCalendarId} />
        </div>

        <div class="col-md-6" style={{margin: '10vh'}}>
        <div class="card">
            <button class="create-meeting-btn">
                <Image src="/assets/plus-512.png" width={20} height={20} alt="Plus Icon"/>
                Create a new meeting
            </button>
            <ul class="list-group list-group-flush">
                <li class="list-group-item">
                    <span class="status-item">
                        <h5>Approved</h5>
                        <h6 class="badge">23</h6>
                    </span>
                </li>
                <li class="list-group-item">
                    <span class="status-item">
                        <h5>Pending</h5>
                        <h5 class="badge">19</h5>
                    </span>
                </li>
                <li class="list-group-item">
                    <span class="status-item">
                        <h5>Reschedule</h5>
                        <h5 class="badge">2</h5>
                    </span>
                </li>
                <li class="list-group-item">
                    <span class="status-item">
                        <h5>Cancelled</h5>
                        <h5 class="badge">8</h5>
                    </span>
                </li>
            </ul>
        </div>
        </div>
      </div>
    </>
  );
}

export default DashboardLayout;
