'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import getOwnerPreferences, { declineInvitation } from '../component.js';
import styles from './styles.module.css'; 
import NavBar from "@/components/navbar.js";

function SubmitPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const uuid = `${searchParams.get('uuid')}`;

    const [status, setStatus] = useState([]);
    const [owner, setOwner] = useState('');
    const [calendar_name, setCalName] = useState('');
    const [calendar_desc, setCalDesc] = useState('');
	const [showDeclineConfirmation, setShowDeclineConfirmation] = useState(false);

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

    const handleRescheduleButtonClick = async () => {
        router.push(`/guest_pages/landing?uuid=${uuid}`);
    };

    const handleDeclineButtonClick = async () => {
        if (!showDeclineConfirmation) {
            setShowDeclineConfirmation(true);
        } else {
            try {
                const response = await declineInvitation({ uuid });
                console.log('Declined', response);
                setShowDeclineConfirmation(false);
            } catch (error) {
                console.error('Error declining:', error);
            }
        }
    };

    return (
        <>
        <NavBar/>
    
        <div className={styles.container}>
            {status === "pending" && (
                <p className={styles.text}>You have not yet submitted your preferences. Please visit <a href={`http://localhost:3000/guest_pages/landing?uuid=${uuid}`}>this link</a> to submit them.</p>
            )}
            {status === "declined" && (
                <p className={styles.text}>You have already declined this calendar invite!</p>
            )}
            {status === "finalized" && (
                <p className={styles.text}>This calendar invite has already been finalized!</p>
            )}
            {status !== "pending" && status !== "declined" && status !== "finalized" && (
                <>
                    <p className={styles.text}>Your date and time preferences have been sent to {owner}.</p>
                    <p className={styles.text}>Meeting Name: {calendar_name}</p>
                    <p className={styles.text}>Description: {calendar_desc}</p>
                    <button className={styles.button} onClick={handleRescheduleButtonClick}>Reschedule</button>
                    <button className={styles.button} onClick={handleDeclineButtonClick}>
                        {'Decline'}
                    </button>
                    {showDeclineConfirmation && (
                        <div className={styles.confirmationBox}>
                            <p className={styles.text}>Are you sure you want to decline?</p>
                            <button className={styles.button} onClick={() => setShowDeclineConfirmation(false)}>Back</button>
                            <button className={styles.button} onClick={handleDeclineButtonClick}>Decline</button>
                        </div>
                    )}
                </>
            )}
        </div>
    </>
    
    );
}

export default SubmitPage;