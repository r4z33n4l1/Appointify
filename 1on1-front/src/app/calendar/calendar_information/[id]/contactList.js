'use client'
import React, { useState, useEffect } from 'react';
import { fetchCalendarStatusUsernamesAndIds } from '@/utils/getContacts';
import { useAuth } from '@/utils/authContext';


export function ContactList({ contacts, status, calendarId }) {
    const { accessToken } = useAuth();

    const handleRemind = async (contactId, calendarId) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/notify/calendars/reminder/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    calendar_id: calendarId,
                    contact_id: contactId
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send reminder');
            }

            // Show alert on successful reminder
            window.alert(`${contacts.find(contact => contact.id === contactId).name} was sent a reminder.`);

        } catch (error) {
            console.error('Error sending reminder:', error.message);
            // Handle error
            window.alert('Failed to send reminder. Please try again.');
        }
    };

    if (status !== 'pending') {
        return (
            <div>
                <ul className="list-disc space-y-2 mt-4 pl-5">
                    {contacts.map((contact, index) => (
                        <li key={index} className="text-lg">{contact.name}</li>
                    ))}
                </ul>
            </div>
        );
    }
    return (
        <div>
            <ul className="list-disc space-y-2 mt-4 pl-5">
                {contacts.map((contact, index) => (
                    <li key={index} className="text-lg">
                        {contact.name}
                        <button className="ml-2 bg-blue-500 text-white px-2 py-1 rounded" onClick={() => handleRemind(contact.id, calendarId)}>Remind</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}


const ContactsFilter = ({ calendarId }) => {
    const [status, setStatus] = useState('all');
    const [contacts, setContacts] = useState([]);
    const { accessToken } = useAuth();

    useEffect(() => {
        fetchContacts();
    }, [status]);

    const fetchContacts = async () => {
        const contactsFetched = await fetchCalendarStatusUsernamesAndIds(accessToken, calendarId, status);
        setContacts(contactsFetched);
    };

    return (
        <div>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="border p-2 rounded">
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="declined">Declined</option>
            </select>
            <ContactList contacts={contacts} status={status} calendarId={calendarId}/>
        </div>
    );
}

export default ContactsFilter;

// 'use client'
// import { useState, useEffect } from 'react';
// import React from 'react'
// import {fetchCalendarStatusUsernamesAndIds} from '@/utils/getContacts';
// import { useAuth } from '@/utils/authContext';

// function ContactList({ status, calendarId }) {
    
//     const [contacts, setContacts] = useState([]);
//     const { accessToken } = useAuth();

//     useEffect(() => {
//         const fetchContacts = async () => {
//             try {
//                 console.log('fetching contacts', accessToken, calendarId, status);
//                 const contacts = await fetchCalendarStatusUsernamesAndIds(accessToken, calendarId, status);
//                 setContacts(contacts);
//             } catch (error) {
//                 console.error('Error fetching contacts:', error);
//             }
//         };
//         fetchContacts();
//         console.log('contacts', contacts);
//     }, [status, calendarId, accessToken]);

//     return (
//         <div>
//             <h2>Status: {status}</h2>
//             <h2>Calendar ID: {calendarId}</h2>
//             <ul>
//                 {contacts.map(contact => (
//                     <li key={contact.id}>{contact.name}</li>
//                 ))}
//             </ul>
//         </div>
//     );
// }

// export default ContactList;