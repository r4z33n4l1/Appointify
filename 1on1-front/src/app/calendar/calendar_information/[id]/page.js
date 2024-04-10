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
// import InviteContactsPopup from "./invitePopup";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
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

  const InviteContactsPopup = ({ calendarId }) => {
    // Use state to control the open state of the popup
    const [open, setOpen] = useState(false);
    const closeModal = () => {
      setOpen(false);
      handleRefresh();
    }
    return (
      <div>
        <Popup
          open={open}
          closeOnDocumentClick  // Set closeOnDocumentClick to true
          onClose={closeModal}  // Handle onClose event
          modal
          nested
          trigger={<button className={styles.inviteButton}>Invite Contacts</button>}
          contentStyle={{ overflow: 'auto', maxHeight: '80vh' }} // Add this line
        >
          {close => (
            <div>
              <button className="close" onClick={close}>
                &times;
              </button>
              <div className="header"> Invite Contacts </div>
              <div className="content">
                <ContactsSearchAndInvite calendarId={calendarId} />
              </div>
              <div className="actions">
                <button
                  className="button"
                  onClick={() => {
                    console.log('Modal closed');
                    close();
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </Popup>
      </div>
    );
  };


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
    const acceptedDetails = await fetchCalendarStatusUsernamesAndIds(accessToken, id, 'accepted');
    if (userDetails.length === 0 && acceptedDetails.length > 0) {
      // before setting ready to true, check suggested schedules
      setReady(true);
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

  const handleBack = () => {
    router.push(`/calendar/main_calendar`);
  };

  return (
    <>
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
          <div className={styles.calendarContainer}>

            <h1 className={styles.header}>Calendar Options</h1>
			      <CalendarView id={id}/>
            <div className={styles.subContainer}>
              <button style={{ backgroundColor: ready ? '#398d86' : 'gray' }} className={`text-white py-2 px-4 rounded`} disabled={!ready} onClick={handleScheduleMeeting}>
                Schedule
              </button>
              <div className={styles.buttonWrapper}>
                <CalendarDeleteConfirmation id={id} calendarName="Calendar" onDeleteConfirm={handleDeleteConfirm} className={styles.updateButton} style={{ cursor: "pointer" }} />
              </div>
            </div>
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
            </div>
            <div style={{ marginTop: '20px' }}><InviteContactsPopup calendarId={id} /></div>
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">Filter Invites</h2>
            <div style={{ maxWidth: '370px' }}><ContactsFilter key={refreshKey} calendarId={id} /></div>
            <CalendarPreferencesDisplay calendarId={id} />
          </div>
        </div>
      </div>
    </>
  );

}
