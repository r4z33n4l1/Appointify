"use client";
import React, { useEffect } from 'react';
import { logout, isLoggedIn } from '@/utils/authHelper';
import { useRouter } from 'next/navigation'; 

function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const checkLoggedIn = async () => {
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
        router.push('/login');
      }
    };

    checkLoggedIn();
  }, [router])

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div>
      Dashboard <br></br>
      <button onClick={() => handleLogout()}>Logout</button>
    </div>
  );
}

export default Dashboard;
