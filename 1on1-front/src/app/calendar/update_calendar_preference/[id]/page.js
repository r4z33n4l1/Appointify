'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAndOrganizeCalendarPreferences, updateCalendarPreferences } from '@/components/my_calendar';
import { useAuth } from '@/utils/authContext';

const CalendarPreferencesForm = ({ params }) => {
  const { id } = params;
  const calendarId = id;
  const [preferences, setPreferences] = useState([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [preferenceLevel, setPreferenceLevel] = useState('low');
  const [error, setError] = useState('');
  const router = useRouter();
  const { accessToken } = useAuth();

  useEffect(() => {
    const fetchPreferences = async () => {
      const organizedPreferences = await fetchAndOrganizeCalendarPreferences(calendarId, accessToken);
      setPreferences(organizedPreferences);
      console.log("organized", organizedPreferences);
    };
    fetchPreferences();
  }, [calendarId, accessToken]);

  const handleDeletePreference = (date, time) => {
    setPreferences((prevPreferences) => {
      const updatedPreferences = { ...prevPreferences };
      updatedPreferences[date] = updatedPreferences[date].filter((t) => t.time !== time);
      if (updatedPreferences[date].length === 0) {
        delete updatedPreferences[date];
      }
      return updatedPreferences;
    });
  };

  const handleAddPreference = (e) => {
    e.preventDefault();
    setPreferences((prevPreferences) => {
      // Check if the date already exists in preferences
      const existingPreferencesForDate = prevPreferences[date] || [];
      const newTimePreference = { time, preference: preferenceLevel };
  
      // Add the new time preference to the existing preferences for the date
      const updatedPreferencesForDate = [...existingPreferencesForDate, newTimePreference];
  
      // Return updated preferences with the new time preference added
      return { ...prevPreferences, [date]: updatedPreferencesForDate };
    });
  };
  

  const handleSavePreferences = async () => {
    const saveSuccessful = await updateCalendarPreferences(calendarId, preferences, accessToken);
    if (saveSuccessful) {
      router.push('/calendar/calendar_information/${id}');
    } else {
      setError('Unable to save preferences. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Calendar Preferences</h2>
      <div className="space-y-6">
        {Object.keys(preferences).map((date) => (
          <div key={date} className="p-4 bg-white rounded shadow">
            <h3 className="text-lg font-medium mb-2">{date}</h3>
            {preferences[date].map(({ time, preference }, index) => (
              <div key={index} className="flex items-center justify-between mb-1">
                <span className="text-sm">{time} - {preference}</span>
                <button
                  onClick={() => handleDeletePreference(date, time)}
                  className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
      <form onSubmit={handleAddPreference} className="mt-6">
        <div className="flex gap-3 mb-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <select
            value={preferenceLevel}
            onChange={(e) => setPreferenceLevel(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Preference
        </button>
      </form>
      <button
        onClick={handleSavePreferences}
        className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Save
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default CalendarPreferencesForm;
