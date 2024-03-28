"use client";
import React, { useEffect } from 'react';
import { useAuth } from '@/utils/authContext'; // Import the useAuth hook
import { useRouter } from 'next/navigation';

function Dashboard() {
  const { isAuthenticated, logout } = useAuth(); // Use the useAuth hook
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout(); // This will call the logout method from the context
    // The logout method from context should handle the redirect
  };

  // The component will only render if the user is authenticated
  return isAuthenticated ? (
    <div>
      Dashboard <br></br>
      <button onClick={handleLogout}>Logout</button>
    </div>
  ) : null; // or a loading spinner until the auth state is verified
}

export default Dashboard;
