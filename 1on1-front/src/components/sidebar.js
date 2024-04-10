'use client';
// import { useRouter } from 'next/navigation';

// const links = [
//   { name: 'Dashboard', url: '/dashboard', icon: 'dashboard' },
//   { name: 'Calendar', url: '/calendar', icon: 'calendar_today' },
//   { name: 'Contacts', url: '/contacts', icon: 'contacts' },
//   { name: 'Schedule', url: '/schedule', icon: 'schedule' },
//   { name: 'Logout', url: '/logout', icon: 'logout' },
// ];

// function Sidebar({ activePage }) {
//   const router = useRouter();
//   const [isToggled, setIsToggled] = useState(false);

//   const handleLinkClick = (url, event) => {
//     event.preventDefault();
//     router.push(url);
//   };

//   return (
//     <div className={`${styles.sidebarContainer} ${isToggled ? styles.toggled : ''}`}>
//       <button
//         id="menu-toggle"
//         onClick={() => setIsToggled(!isToggled)}
//         className={styles.menuToggle}
//       >
//         <span className="material-icons">
//           {isToggled ? 'close' : 'menu'}
//         </span>
//       </button>

//       <div className={styles.listGroup}>
//         {links.map(({ name, url, icon }) => (
//           <a
//             key={url}
//             href={url}
//             onClick={(event) => handleLinkClick(url, event)}
//             className={`${styles.listItem} ${activePage === url ? styles.active : ''}`}
//           >
//             <span className={`material-icons ${styles.icon}`}>{icon}</span>
//             <span>{name}</span>
//           </a>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Sidebar;



// import React, { useEffect } from 'react';
// import { useAuth } from '@/utils/authContext'; // Import the useAuth hook

// function SideBar() {

//     const { isAuthenticated, logout } = useAuth(); // Use the useAuth hook
//   const router = useRouter();

//   useEffect(() => {
//     // Redirect to login if not authenticated
//     if (!isAuthenticated) {
//       router.push('/login');
//     }
//   }, [isAuthenticated, router]);

//   const handleLogout = () => {
//     logout(); // This will call the logout method from the context
//     // The logout method from context should handle the redirect
//   };

//   return (
//     <>
//       <meta charSet="UTF-8" />
//       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//       <link rel="stylesheet" href="/assets/dashboard.css" />
//       <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans%3A700" />
//       <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto%3A400%2C500%2C700" />
//       <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro%3A400%2C500%2C700" />
//       <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" />
//     <div className="bg-light border-right" id="sidebar-wrapper" style={{ background: "linear-gradient(135deg, #528582, #2E475C) 50% 50% no-repeat" }}>
//       <div className="list-group list-group-flush">
//         <a href="/dashboard" style={{ display: "flex", alignItems: "center", backgroundColor: "#136f68" }}>
//           <img src="/assets/home.png" width="20px" height="20px" />
//           <span>Dashboard</span>
//         </a>
//         <a href="/main_calendar" style={{ display: "flex", alignItems: "center" }}>
//           <img src="/assets/calendar-7-256.png" width="20px" height="20px" />
//           <span>Calendar</span>
//         </a>
//         <a href="/contacts" style={{ display: "flex", alignItems: "center" }}>
//           <img src="/assets/contacts-256.png" width="20px" height="20px" />
//           <span>Contacts</span>
//         </a>
//         <a href="/schedule" style={{ display: "flex", alignItems: "center" }}>
//           <img src="/assets/clock-5-256.png" width="20px" height="20px" />
//           <span>Schedule</span>
//         </a>
//         <a style={{ display: "flex", alignItems: "center" }}>
//           <img src="/assets/account-logout-256.png" width="20px" height="20px" />
//           <button onClick={handleLogout}><span>Logout</span></button>
        
//         </a>
//       </div>
//     </div>
//     </>
//   );
// }

// export default SideBar;

import React, { useEffect, useState } from 'react';
import { useRouter,  usePathname } from 'next/navigation'; // Import useRouter
import { useAuth } from '@/utils/authContext'; // Import the useAuth hook
import styles from './styles.module.css'

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
  const isActive = (path) =>  usePathname() === path;

  const sidebarClass = isSidebarOpen ? 'sidebar-open' : 'sidebar-closed';
  console.log(sidebarClass);


  return (
    <>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dashboard</title>
  <link rel="stylesheet" href="assets/dashboard.css" />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Roboto%3A400%2C500%2C700"
  />
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
          <a href="/dashboard" style={{ display: "flex", alignItems: "center", backgroundColor: isActive('/dashboard') ? '#136f68' : '' }}>
            <img src="/assets/home.png" width="20px" height="20px" />
            <span>Dashboard</span>
          </a>
          <a href="/calendar/main_calendar" style={{ display: "flex", alignItems: "center", backgroundColor: isActive('/calendar/main_calendar') ? '#136f68' : '' }}>
            <img src="/assets/calendar-7-256.png" width="20px" height="20px" />
            <span>Calendar</span>
          </a>
          <a href="/contacts" style={{ display: "flex", alignItems: "center", backgroundColor: isActive('/contacts') ? '#136f68' : '' }}>
            <img src="/assets/home.png" width="20px" height="20px" />
            <span>Contacts</span>
          </a>
{/*           <a href="/schedule" style={{ display: "flex", alignItems: "center", backgroundColor: isActive('/schedule') ? '#136f68' : '' }}>
            <img src="/assets/calendar-7-256.png" width="20px" height="20px" />
            <span>Schedule</span>
          </a> */}
          <a style={{ display: "flex", alignItems: "center" }}>
            <img src="/assets/account-logout-256.png" width="20px" height="20px" />
            <button onClick={handleLogout}><span>Logout</span></button>
          </a>
        </div>
      </div>
    </>
  );
}

export default SideBar;


