'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import getOwnerPreferences, { declineInvitation } from '../component.js';

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

    if (status === "pending") {
        return (
            <p>You have not yet submitted your preferences. Please visit <a>'http://localhost:3000/guest_pages/landing?uuid=${uuid}'</a></p>
        );
    }
	else if (status === "declined") {
		return (<p>You have already declined this calendar invite!</p>);
	}
	else if (status === "finalized") {
		return (<p>This calendar invite has already been finalized!</p>);
	}

    return (
        <div>
            <p>Your date and time preferences have been sent to {owner}.</p>
			<p>Meeting Name: {calendar_name}</p>
            <p>Description: {calendar_desc}</p>
			<button onClick={handleRescheduleButtonClick}>Reschedule</button>
			<button onClick={handleDeclineButtonClick}>
                {'Decline'}
            </button>
            {showDeclineConfirmation && (
                <div>
                    <p>Are you sure you want to decline?</p>
					<button onClick={() => setShowDeclineConfirmation(false)}>Back</button>
                    <button onClick={handleDeclineButtonClick}>Decline</button>
                </div>
            )}
        </div>
    );
}

export default SubmitPage;