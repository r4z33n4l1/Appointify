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

    if (status === "pending") {
        return (
            <p>You have not yet submitted your preferences. Please visit <a>'http://localhost:3000/guest_pages/landing?uuid=${uuid}'</a></p>
        );
    }
	if (status !== "finalized") {
		return (<p>This calendar invite has not yet been finalized!</p>);
	}

    return (
        <div>
            <p>Your meeting with {owner} has been confirmed for.......</p>
			<p>Meeting Name: {calendar_name}</p>
            <p>Description: {calendar_desc}</p>
        </div>
    );
}

export default SubmitPage;