"use client";
import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { CalendarView, isValidCalendarId } from "@/components/my_calendar.js";
import { useAuth } from "@/utils/authContext";
import CalendarDeleteConfirmation from "./deletePopup";
import CalendarPreferencesDisplay from "../../calendar_helper/PrefDisplayUser";
import ContactList from "./contactList";
import ContactsFilter from "./contactList";
import ContactsSearchAndInvite from "./inviteModel";
import InviteContactsPopup from "./invitePopup";
import { fetchCalendarStatusUsernamesAndIds } from "@/utils/getContacts";
import NavBar from "@/components/navbar.js";
import SideBar from "@/components/sidebar.js";

export default function CalendarInformation({ params }) {
  const router = useRouter();
  const { id } = params;
  const { accessToken } = useAuth();
  const [ready, setReady] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }

  async function fetchSuggestedSchedules() {
    try {
      const response = await fetch(`http://127.0.0.1:8000/events/create_event?calendar_id=${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Error fetching suggested schedules');
      }
      // ok response set ready to true
      setReady(true);
    } catch (error) {
      console.error(error);
      // error - set ready to false
      setReady(false);
    }
  }

  async function checkPending() {
    const userDetails = await fetchCalendarStatusUsernamesAndIds(accessToken, id, 'pending');
    if (userDetails.length === 0) {
      // before setting ready to true, check suggested schedules
      await fetchSuggestedSchedules();
    } else {
      setReady(false);
    }
  }
  
  useEffect(() => {
    checkPending();
  }, [id, accessToken]);
  
  const handleRefresh = () => {
    checkPending();
    setRefreshKey((prev) => prev + 1);
  };

  const handleScheduleMeeting = () => {
    router.push(`/calendar/suggested_schedules/${id}`);
  };

  const handleUpdateCalendar = () => {
    router.push(`/calendar/update_calendar/${id}`);
  };

  const handleUpdateCalendarPreference = () => {
    router.push(`/calendar/update_calendar_preference/${id}`);
  };
  const handleBack = () => {
    router.push(`/calendar/main_calendar`);
  };

  const handleDeleteConfirm = async (calendarId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/calendars/user-calendars/${calendarId}/delete/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete calendar");
      }
      console.log("Calendar deleted successfully");
      router.push("/calendar/main_calendar");
    } catch (error) {
      console.error("Failed to delete calendar:", error);
    }
  };

return (
  <>
    <NavBar toggleSidebar={toggleSidebar} />
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'left', marginTop: '5vh' }}>
      <SideBar isSidebarOpen={isSidebarOpen} />
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginTop: '5rem', marginLeft: '300px' }}>
        <div className={styles.calendarContainer}>
          <div className="buttonReady">
            <button style={{ backgroundColor: ready ? '#398d86' : 'gray' }} className={`text-white py-2 px-4 rounded`} disabled={!ready} onClick={handleScheduleMeeting}>
              Schedule
            </button>
            <button style={{ backgroundColor: '#ba0a51bb' }} className="bg-blue-500 text-white py-2 px-4 rounded ml-2" onClick={handleRefresh}>
              Refresh
            </button>
            <button style={{ backgroundColor: '#ba0a51bb' }} className="bg-blue-500 text-white py-2 px-4 rounded ml-2" onClick={handleBack}>
              All Calendars
            </button>
          </div>
          <h1 className={styles.header}>Your Calendar</h1>
          <CalendarPreferencesDisplay calendarId={id} />
          <InviteContactsPopup calendarId={id} />
          <ContactsFilter key={refreshKey} calendarId={id} />
          <CalendarView id={id} />
          <div className={styles.subContainer}>
            <div className={styles.buttonWrapper}>
              <button className={styles.updateButton} style={{ cursor: "pointer" }} onClick={handleUpdateCalendar}>
                <a className={styles.subLink}>Update Calendar Information</a>
              </button>
            </div>
            <div className={styles.buttonWrapper}>
              <button className={styles.updateButton} style={{ cursor: "pointer" }} onClick={handleUpdateCalendarPreference}>
                <a className={styles.subLink}>Update Calendar Preferences</a>
              </button>
            </div>
            <div className={styles.buttonWrapper}>
              <CalendarDeleteConfirmation id={id} calendarName="Calendar" onDeleteConfirm={handleDeleteConfirm} className={styles.updateButton} style={{ cursor: "pointer" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

}
