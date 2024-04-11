'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import getOwnerPreferences, { declineInvitation } from '../component.js';
import NavBar from "@/components/navbar_guest.js";
import styles from './styles.module.css'; 
import { Suspense } from 'react';

function FinalPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const uuid = `${searchParams.get('uuid')}`;

    const [status, setStatus] = useState([]);
    const [owner, setOwner] = useState('');
    const [calendar_name, setCalName] = useState('');
    const [calendar_desc, setCalDesc] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getOwnerPreferences({ uuid });
                setStatus(response.status);
                setOwner(response.owner_name);
                setCalName(response.calendar_name);
                setCalDesc(response.calendar_description);
            } catch (error) {
                console.error('Invalid uuid:', error);
            }
        };

        if (uuid) {
            fetchData();
        }
    }, [uuid]);

 
    return (

        <>
        <NavBar/>
        
        <div className={styles.container}>
            {status === "pending" && (
                <p className={styles.text}>You have not yet submitted your preferences. Please visit <a href={`http://localhost:3000/guest_pages/landing?uuid=${uuid}`}> this link</a> to submit them.</p>
            )}
    
            {status === 'accepted' && (
                <>
                    <p className={styles.text}>Your meeting with {owner} has been confirmed.{}</p>
                    <p className={styles.text}>Meeting Name: {calendar_name}</p>
                    <p className={styles.text}>Description: {calendar_desc}</p>
                </>
            )}
        </div>
    </>
    
    );
}



function FinalGuestPage(){
    return(
        <Suspense fallback={<div>Loading...</div>}>
            <FinalPage />
        </Suspense>
    );
}

export default FinalGuestPage;

