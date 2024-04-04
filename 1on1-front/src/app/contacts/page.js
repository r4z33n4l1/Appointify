'use client';
import { useState, useEffect } from 'react';
import styles from './styles.module.css'; 
import { useRouter } from 'next/navigation';
import Head from 'next/head';

function ContactsPage() {
    const router = useRouter();
    const [contacts, setContacts] = useState([
        { id: 1, fname: 'Victor', lname: 'Ma', email: 'victor.ma@example.com' },
        { id: 2, fname: 'Neha', lname: 'Sohail', email: 'neha.sohail@example.com' },
        { id: 3, fname: 'Dev', lname: 'Singhvi', email: 'dev.singhvi@example.com' },
        { id: 4, fname: 'Razeen', lname: 'Ali', email: 'razeen.ali@example.com' },
    ]);
    const [contactDetails, setContactDetails] = useState({ fname: '', lname: '', email: '', id: null });
    const [isEditing, setIsEditing] = useState(false);

    const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEyNzA0MzUwLCJpYXQiOjE3MTIyNzIzNTAsImp0aSI6IjVjNjQzNmU3YzU2MDRlNWU5YTdkMjA5NDQxMjZmYWNhIiwidXNlcl9pZCI6MX0.bcmvkZcGUB2IyPL6Uy0YLLgpp_zVoKDgXjhVugkO2kI';

    useEffect(() => {
        async function fetchContacts() {
            const response = await fetch('http://127.0.0.1:8000/contacts/all/', {
                headers: { 'Authorization': `Bearer ${authToken}` },
            });
            if (!response.ok) {
                console.error("Failed to fetch contacts");
                return;
            }
            const data = await response.json();
            setContacts(data);
        }

        fetchContacts();
    }, []);

    const handleChange = (e, field) => {
        setContactDetails({ ...contactDetails, [field]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isEditing ? `http://127.0.0.1:8000/contacts/update/${contactDetails.id}/` : 'http://127.0.0.1:8000/contacts/add/';
        const method = isEditing ? 'PATCH' : 'POST';

        const response = await fetch(endpoint, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({
                fname: contactDetails.fname,
                lname: contactDetails.lname,
                email: contactDetails.email,
            }),
        });

        if (!response.ok) {
            console.error("Failed to save contact");
            return;
        }
        const result = await response.json();
        console.log(result)
        if (isEditing) {
            // setContacts(contacts.map(contact => contact.id === contactDetails.id ? result : contact));
        } else {
            setContacts([...contacts, result]);
        }
        setContactDetails({ fname: '', lname: '', email: '', id: null });
        setIsEditing(false);
    };

    const startEdit = (contact) => {
        setContactDetails(contact);
        setIsEditing(true);
    };

    const cancelEdit = () => {
        setContactDetails({ fname: '', lname: '', email: '', id: null });
        setIsEditing(false);
    };

    return (
        <>
            <Head>
                <title>Contacts</title>
            </Head>
            <div className={styles.container}>
                <h1>{isEditing ? 'Edit Contact' : 'Add New Contact'}</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="First Name"
                        value={contactDetails.fname}
                        onChange={(e) => handleChange(e, 'fname')}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={contactDetails.lname}
                        onChange={(e) => handleChange(e, 'lname')}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={contactDetails.email}
                        onChange={(e) => handleChange(e, 'email')}
                        required
                    />
                    <button type="submit">{isEditing ? 'Update Contact' : 'Add Contact'}</button>
                    {isEditing && <button type="button" onClick={cancelEdit}>Cancel</button>}
                </form>
                <div className={styles.contactsList}>
                    {/* {contacts.map(contact => (
                        <div key={contact.id} className={styles.contactCard}>
                            <p>{contact.fname} {contact.lname}</p>
                            <p>{contact.email}</p>
                            <button onClick={() => startEdit(contact)}>Edit</button>
                        </div>
                    ))} */}
                </div>
            </div>
        </>
    );
}

export default ContactsPage;
