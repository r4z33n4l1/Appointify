'use client';
import { useState, useEffect } from 'react';
import styles from './styles.module.css'; 
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { useAuth } from "@/utils/authContext";
import NavBar from "@/components/navbar.js";
import SideBar from "@/components/sidebar.js";
import Image from 'next/image';

function ContactsPage() {
    const router = useRouter();
    const [contacts, setContacts] = useState([]);
    const [contactDetails, setContactDetails] = useState({ fname: '', lname: '', email: '', id: null });
    const [isEditing, setIsEditing] = useState(false);
    const { accessToken } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedContacts, setSelectedContacts] = useState([]); // selected contacts
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    }
    //const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEyNzA2MjkyLCJpYXQiOjE3MTIyNzQyOTIsImp0aSI6IjJiNjE1M2I4NzMxZjQ1NmM5ZmZlMGY3ZWM4NDM5NTkxIiwidXNlcl9pZCI6MX0.SiEeIR1G0_DBeb23PIbeGAunNFkmw5qTW8t_MWQm6yM';

    useEffect(() => {
        async function fetchContacts() {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}contacts/all/`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${accessToken}` },
            });
            if (!response.ok) {
                console.error("Failed to fetch contacts");
                return;
            }
            const data = await response.json();
            setContacts(data.results);
            console.log("contacts inside useeffect", contacts);
        }

        fetchContacts();
    }, []);

    const toggleSelectContact = (contactId) => {
        if (selectedContacts.includes(contactId)) {
            setSelectedContacts(selectedContacts.filter(id => id !== contactId));
        } else {
            setSelectedContacts([...selectedContacts, contactId]);
        }
    };

    // Function to handle deleting selected contacts
    const deleteSelectedContacts = async () => {
        try {
            await Promise.all(selectedContacts.map(async contactId => {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}contacts/view/${contactId}/`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to delete contact");
                }
            }));

            // Remove selected contacts from the state to update the UI
            setContacts(contacts.filter(contact => !selectedContacts.includes(contact.id)));
            setSelectedContacts([]);
        } catch (error) {
            console.error("Failed to delete contacts", error);
        }
    };

    
    const handleChange = (e, field) => {
        setContactDetails({ ...contactDetails, [field]: e.target.value });
    };

    async function addContact(contactDetails, accessToken) {
        console.log("add contact", contactDetails, accessToken)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}contacts/add/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(contactDetails),
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to save contact");
            }
    
            return await response.json();
        } catch (error) {
            console.error("Failed to add contact", error);
            throw error;
        }
    }

    async function deleteContact(contactId) {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}contacts/view/${contactId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete contact");
            }

            // remove the deleted contact from the state to update the UI
            setContacts(contacts.filter(contact => contact.id !== contactId));
        } catch (error) {
            console.error("Failed to delete contact", error);
        }
    }
    
    // Helper function to update an existing contact
    async function updateContact(contactId, contactDetails, accessToken) {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}contacts/view/${contactId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(contactDetails),
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to update contact");
            }
    
            return await response.json();
        } catch (error) {
            console.error("Failed to update contact", error);
            throw error;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let result;
            if (isEditing) {
                result = await updateContact(contactDetails.id, contactDetails, accessToken);
            } else {
                result = await addContact(contactDetails, accessToken);
            }
            console.log(result);
            setContacts(isEditing ? contacts.map(contact => contact.id === contactDetails.id ? result : contact) : [...contacts, result]);
            setContactDetails({ fname: '', lname: '', email: '', id: null });
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to process contact", error);
        }
    };
    

    const startEdit = (contact) => {
        setContactDetails(contact);
        setIsEditing(true);
    };

    const cancelEdit = () => {
        setContactDetails({ fname: '', lname: '', email: '', id: null });
        setIsEditing(false);
    };

//     return (
//         <>
//          <Head>
//                  <title>Contacts</title>
//              </Head>
//         <NavBar />

//         <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'left', marginTop: '4vh' }}>
//             <SideBar />
            
//         </div>
//         </>
//     )
// }

//     return (
//         <>
//             <Head>
//                 <title>Contacts</title>
//             </Head>


//             <div className="container mx-auto p-4">
//                 <h1 className="text-2xl font-semibold mb-4">{isEditing ? 'Edit Contact' : 'Add New Contact'}</h1>
//                 <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6">
//                     <input
//                         className="border p-2 rounded"
//                         type="text"
//                         placeholder="First Name"
//                         value={contactDetails.fname}
//                         onChange={(e) => handleChange(e, 'fname')}
//                         required
//                     />
//                     <input
//                         className="border p-2 rounded"
//                         type="text"
//                         placeholder="Last Name"
//                         value={contactDetails.lname}
//                         onChange={(e) => handleChange(e, 'lname')}
//                         required
//                     />
//                     <input
//                         className="border p-2 rounded"
//                         type="email"
//                         placeholder="Email"
//                         value={contactDetails.email}
//                         onChange={(e) => handleChange(e, 'email')}
//                         required
//                     />
//                     <div className="flex gap-2">
//                         <button type="submit" className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">{isEditing ? 'Update Contact' : 'Add Contact'}</button>
//                         {isEditing && <button type="button" onClick={cancelEdit} className="flex-1 bg-gray-300 p-2 rounded hover:bg-gray-400">Cancel</button>}
//                     </div>
//                 </form>
//                 <div className="space-y-4">
//                     {contacts.map(contact => (
//                         <div key={contact.id} className="bg-white shadow p-4 rounded flex justify-between items-center">
//                             <div>
//                                 <p>{contact.fname} {contact.lname}</p>
//                                 <p className="text-sm text-gray-600">{contact.email}</p>
//                             </div>
//                             <button onClick={() => startEdit(contact)} className="bg-green-500 hover:bg-green-600 text-white p-2 rounded">Edit</button>
//                             <button onClick={() => deleteContact(contact.id)}>Delete</button>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </>
//     );
// }

return (
    <>
        <Head>
            <title>Contacts</title>
        </Head>
        <NavBar toggleSidebar={toggleSidebar} />
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'left', marginTop: '5vh'}}>
        <SideBar isSidebarOpen={isSidebarOpen} />
        
            <div className="container mx-auto p-4" style={{marginTop: '10vh'}}>
            <h1 style={{ 
                color: '#136f68', 
                textAlign: 'center', 
                fontSize: '2rem',
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                marginBottom: '1rem', 
                fontFamily: '"Segoe UI", Arial, sans-serif' 
            }}>{isEditing ? 'Edit Contact' : 'Add New Contact'}</h1>

                <form onSubmit={handleSubmit} novalidate="novalidate" className="flex flex-col gap-3 mb-6">
                    <input
                        className="border p-2 rounded"
                        type="text"
                        placeholder="First Name"
                        value={contactDetails.fname}
                        onChange={(e) => handleChange(e, 'fname')}
                        required
                    />
                    <input
                        className="border p-2 rounded"
                        type="text"
                        placeholder="Last Name"
                        value={contactDetails.lname}
                        onChange={(e) => handleChange(e, 'lname')}
                        required
                    />
                    <input
                        className="border p-2 rounded"
                        type="email"
                        placeholder="Email"
                        value={contactDetails.email}
                        onChange={(e) => handleChange(e, 'email')}
                        required
                    />
                    <div className="flex gap-2">
                        <button style={{ backgroundColor: '#ba0a51bb'}}type="submit" className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">{isEditing ? 'Update Contact' : 'Add Contact'}</button>
                        {isEditing && <button type="button" onClick={cancelEdit} className="flex-1 bg-red-300 p-2 rounded hover:bg-red-400 text-white	">Cancel</button>}
                        <button style={{ backgroundColor: '#ba0a51bb'}}type="submit" className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600" onClick={deleteSelectedContacts}>Delete Selected</button>
                    </div>

                </form>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {contacts.map(contact => (
                            <div key={contact.id} className={`bg-white shadow p-4 rounded ${selectedContacts.includes(contact.id) ? 'border-4 border-blue-500' : ''}`} onClick={() => toggleSelectContact(contact.id)}>
                            <div>
                                    <p>{contact.fname} {contact.lname}</p>
                                    <p className="text-sm text-gray-600">{contact.email}</p>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button style={{ backgroundColor: '#398d86' }} onClick={() => startEdit(contact)} className="text-white p-2 rounded">Edit</button>
                                    <button style={{ backgroundColor: '#ba0a51bb' }} onClick={() => deleteContact(contact.id)} className="text-white p-2 rounded">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>

                {/* <div className="space-y-4">
                    {contacts.map(contact => (
                        <div key={contact.id} className="bg-white shadow p-4 rounded flex justify-between items-center">
                            <div>
                                <p>{contact.fname} {contact.lname}</p>
                                <p className="text-sm text-gray-600">{contact.email}</p>
                            </div>
                            <button style={{backgroundColor: '#398d86'}} onClick={() => startEdit(contact)} className="bg-green-500 hover:bg-green-600 text-white p-2 rounded">Edit</button>
                            <button style={{backgroundColor: '#ba0a51bb'}} onClick={() => deleteContact(contact.id)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded">Delete</button>
                        </div>
                    ))}
                </div> */}
            </div>
        </div>
    </>
);
}


export default ContactsPage;
