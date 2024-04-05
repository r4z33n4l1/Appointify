'use client'
import React, { useState, useEffect } from 'react';
import { fetchCalendarStatusUsernamesAndIds } from '@/utils/getContacts';
import { useAuth } from '@/utils/authContext';


export function ContactList({ contacts }) {
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
            <ContactList contacts={contacts} />
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