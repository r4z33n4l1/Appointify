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

export default function CalendarInformation({ params }) {
  const router = useRouter();
  const { id } = params;
  const { accessToken } = useAuth();
  const [ready, setReady] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);


  async function checkPending() {
    const userDetails = await fetchCalendarStatusUsernamesAndIds(accessToken, id, 'pending');
    console.log('userDetailsin Check pending', userDetails);
    if (userDetails.length === 0) {
      setReady(true); // Set ready to true when no pending users
    } else {
      setReady(false); // Ensure ready is set to false when there are pending users
    }
  }
  useEffect(() => {
    checkPending();
  }, [id, accessToken]);

  const handleScheduleMeeting = () => {
    alert("ready to schedule!");
  };
  
  const handleRefresh = () => {
    checkPending();
    setRefreshKey((prev) => prev + 1);
  };


  const handleUpdateCalendar = () => {
    router.push(`/calendar/update_calendar/${id}`);
  };

  const handleUpdateCalendarPreference = () => {
    router.push(`/calendar/update_calendar_preference/${id}`);
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
    <div className={styles.container}>
      <div className={styles.calendarContainer}>
        <div className={styles.calendarView}></div>
        <h1 className={styles.header}>Your Calendar</h1>
        <CalendarPreferencesDisplay calendarId={id} />
        <InviteContactsPopup calendarId={id} />
        <ContactsFilter key={refreshKey} calendarId={id}/>
        <div className="buttonReady">
          <button
            className={`${
              ready ? "bg-green-500" : "bg-gray-500"
            } text-white py-2 px-4 rounded`}
            disabled={!ready}
            onClick={handleScheduleMeeting} 
          >
            Schedule Meeting
          </button>
          <button
    className="bg-blue-500 text-white py-2 px-4 rounded ml-2"
    onClick={() => handleRefresh()}
  >
    Refresh
  </button>
        </div>
        <CalendarView id={id} />
        

        <div className={styles.subContainer}>
          <div className={styles.buttonWrapper}>
            <button
              className={styles.updateButton}
              style={{ cursor: "pointer" }}
              onClick={handleUpdateCalendar}
            >
              <a className={styles.subLink}>Update Calendar Information</a>
            </button>
          </div>
          <div className={styles.buttonWrapper}>
            <button
              className={styles.updateButton}
              style={{ cursor: "pointer" }}
              onClick={handleUpdateCalendarPreference}
            >
              <a className={styles.subLink}>Update Calendar Preferences</a>
            </button>
          </div>
          <div className={styles.buttonWrapper}>
            <CalendarDeleteConfirmation
              id={id}
              calendarName="Calendar"
              onDeleteConfirm={handleDeleteConfirm}
              className={styles.updateButton}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
