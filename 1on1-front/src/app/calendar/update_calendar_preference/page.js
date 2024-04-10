'use client';
import { useEffect } from 'react'; // Import useEffect
import { useRouter } from 'next/navigation'; // Correct import of useRouter

function CalendarInformation() {
    const router = useRouter();
    
    useEffect(() => {
        router.push('/calendar/main_calendar'); // Use useEffect to redirect
    }, [router]); // Dependency array with router to re-run if router changes

    return null; // Return null since this component only redirects
}

export default CalendarInformation;
