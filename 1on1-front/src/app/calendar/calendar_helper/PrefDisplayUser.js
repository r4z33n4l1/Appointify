'use client';
import React, { useState, useEffect } from 'react';
import { fetchAndOrganizeCalendarPreferences } from '@/components/my_calendar'; // Adjust the import path
import { useAuth } from '@/utils/authContext'; // Make sure to adjust the import path

const CalendarPreferencesDisplay = ({ calendarId }) => {
    const [preferences, setPreferences] = useState({});
    const { accessToken } = useAuth();

    useEffect(() => {
        const fetchPreferences = async () => {
            try {
                const organizedPreferences = await fetchAndOrganizeCalendarPreferences(calendarId, accessToken);
                setPreferences(organizedPreferences);
            } catch (error) {
                console.log('Failed to fetch and organize preferences:', error);
            }
        };

        fetchPreferences();
    }, [calendarId, accessToken]);

    // Function to assign colors based on preference
    const preferenceColor = (pref) => {
        switch (pref) {
            case 'high':
                return 'bg-red-400';
            case 'medium':
                return 'bg-yellow-400';
            case 'low':
                return 'bg-green-400';
            default:
                return 'bg-gray-200';
        }
    };

    return (
        <div className="max-w-2xl mx-auto my-8">
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">Calendar Preferences</h2>
            <ul className="space-y-4">
                {Object.entries(preferences).map(([date, prefs]) => (
                    <li key={date} className="bg-white shadow rounded-md p-4">
                        <h3 className="text-lg font-medium text-gray-700 mb-2">{date}</h3>
                        <ul>
                            {prefs.map((pref, index) => (
                                <li
                                    key={index}
                                    className={`px-3 py-1 inline-flex items-center text-sm rounded-full font-medium ${preferenceColor(pref.preference)} text-white mr-2 mb-2`}
                                >
                                    {pref.time} - {pref.preference.charAt(0).toUpperCase() + pref.preference.slice(1)}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CalendarPreferencesDisplay;
