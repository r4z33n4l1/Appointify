'use client';


import React, { useEffect, useState } from 'react';
import { useRouter,  usePathname } from 'next/navigation'; // Import useRouter
import { useAuth } from '@/utils/authContext'; // Import the useAuth hook
import styles from './styles.module.css'
import Image from 'next/image';

function SideBar({ isSidebarOpen }) {
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
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

  // Function to determine if the link is the active page
  const IsActive = (path) =>  usePathname() === path;

  const sidebarClass = isSidebarOpen ? 'sidebar-open' : 'sidebar-closed';
  console.log(sidebarClass);


  return (
    <>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dashboard</title>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
  />
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css"
    integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
    crossOrigin="anonymous"
  />

      <div className={styles[sidebarClass]} id="sidebar-wrapper" style={{background: "linear-gradient(135deg, #528582, #2E475C) 50% 50% no-repeat"}}>
        <div className="list-group list-group-flush">
          <a href="/dashboard" style={{ display: "flex", alignItems: "center", backgroundColor: IsActive('/dashboard') ? '#136f68' : '' }}>
            <Image src="/assets/home.png" width={20} height={20} alt="Home icon"/>
            <span>Dashboard</span>
          </a>
          <a href="/calendar/main_calendar" style={{ display: "flex", alignItems: "center", backgroundColor: IsActive('/calendar/main_calendar') ? '#136f68' : '' }}>
            <Image src="/assets/calendar-7-256.png" width={20} height={20} alt="calendar icon"/>
            <span>Calendar</span>
          </a>
          <a href="/contacts" style={{ display: "flex", alignItems: "center", backgroundColor: IsActive('/contacts') ? '#136f68' : '' }}>
            <Image src="/assets/home.png" width={20} height={20} alt="home"/>
            <span>Contacts</span>
          </a>
          <a style={{ display: "flex", alignItems: "center" }}>
            <Image src="/assets/account-logout-256.png" width={20} height={20} alt="account"/>
            <button onClick={handleLogout}><span>Logout</span></button>
          </a>
        </div>
      </div>
    </>
  );
}

export default SideBar;


