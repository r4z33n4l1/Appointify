"use client";
import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { CalendarView, isValidCalendarId } from "@/components/my_calendar.js";
import { useAuth } from "@/utils/authContext";
import CalendarDeleteConfirmation from "./deletePopup";
import CalendarPreferencesDisplay from "../../calendar_helper/PrefDisplayUser";

export default function CalendarInformation({ params }) {
  const router = useRouter();
  const { id } = params;
  const currentPage = usePathname();
  const searchParams = useSearchParams();
  const { accessToken } = useAuth();

  useEffect(() => {
    async function checkCalendarId() {
      const valid = await isValidCalendarId(id, accessToken);
      console.log("valid", valid);
      if (!valid) {
        router.push("/calendar/main_calendar");
      }
    }
    checkCalendarId();
  }, [id, router]);

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
