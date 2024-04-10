'use client'
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/utils/authContext'; // Assumed path
import {useRouter} from 'next/navigation';

const ContactsSearchAndInvite = ({ calendarId }) => {
    const [contacts, setContacts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredContacts, setFilteredContacts] = useState([]); 
    const { accessToken } = useAuth();
    const [shouldUpdate, setShouldUpdate] = useState(false);
    const [showInvited, setShowInvited] = useState(true);
    const [clicked, setClicked] = useState(false);

    const router = useRouter();

    const handleGoToContactPage = () => {
        router.push('/contacts');
    };

    useEffect(() => {
        fetchContacts();
    }, [calendarId, shouldUpdate, accessToken, clicked]);

    // create useeffect for when search term changes 
    useEffect(() => {
        const results = contacts.filter(contact =>
            contact.fname.toLowerCase().includes(searchTerm) || contact.lname.toLowerCase().includes(searchTerm) || contact.email.toLowerCase().includes(searchTerm) 
        );
        if (showInvited) {
            setFilteredContacts(results.filter(contact => !contact.is_invited));
        } else {

            setFilteredContacts(results);
        }
    }, [searchTerm, showInvited, contacts, clicked]);


    const fetchContacts = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}notify/invited_contacts?calendar_id=${calendarId}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setContacts(data);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    const handleInvite = async (contactId) => {
        try {
            console.log('calendarId:', calendarId, 'contactId:', contactId, 'accessToken:', accessToken)
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}notify/calendars/invite/`, {
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
                throw new Error('Failed to invite contact');
            }
    
            const data = await response.json();
            console.log('Invite sent successfully:', data);

            // Handle success response
        } catch (error) {
            console.error('Error inviting contact:', error.message);
            // Handle error
        }
    };
    

    return (
        <div className="max-w-md mx-auto p-4">
            <div className="mb-4 flex justify-between items-center">
                <input
                    type="search"
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Search contacts..."
                    onChange={(e) => setSearchTerm(e.target.value)} 
                />
                <label className="ml-4 flex items-center">
                    <input
                        type="checkbox"
                        checked={showInvited}
                        onChange={() => setShowInvited(!showInvited)}
                        className="form-checkbox"
                    />
                    <span className="ml-2">Show Not Invited</span>
                </label>
            </div>
            <button
                onClick={() => {
                    handleGoToContactPage();
                }}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
            >
                Edit Contacts
            </button>
            <ul className="space-y-2">
                {filteredContacts.map((contact) => (
                    <li key={contact.id} className="flex justify-between items-center bg-white p-3 rounded shadow">
                        <div>
                            <h4 className="text-lg font-semibold">{contact.fname} {contact.lname}</h4>
                            <p className="text-sm text-gray-600">{contact.email}</p>
                        </div>
                        {!contact.is_invited ? (
                            <button
                            style={{backgroundColor: '#ba0a51bb'}}
                                onClick={() => {
                                    setClicked(!clicked);
                                    handleInvite(contact.id)}}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
                            >
                                Invite
                            </button>
                        ) : (
                            <span className="text-green-500">Invited</span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ContactsSearchAndInvite;
