'use client';
import React from 'react';
import { useAuth } from '@/utils/authContext';
import Image from 'next/image';
function NavBar({ toggleSidebar }) {
  const { tokenName, accessToken } = useAuth();

  return (
    <>
     <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" />
    <div id="page-content-wrapper">
  <nav
    className="navbar navbar-expand-lg navbar-light bg-light border-bottom fixed-top"
    style={{
      background: "linear-gradient(135deg, #528582, #2E475C) 50% 50% no-repeat"
    }}
  >
    <a className="navbar-brand" href="#">
      <button
        className="btn btn-primary"
        id="menu-toggle"
        onClick={toggleSidebar}
        style={{ backgroundColor: "#136f68" }}
      >
        ☰
      </button>
      
    </a>
    <Image src="/assets/logo_white.png" width={160} height={40} alt="" />
    <div className="ml-auto">
      <a className="navbar-brand" href="#">
        <button type="submit" className="btn btn-primary" style={{ backgroundColor: "#398d86" }}>
          <Image src="/assets/user.png" width={30} height={30} style={{display: 'inline'}} alt="username" /> {tokenName}
        </button>
      </a>
    </div>
  </nav>
</div>

    </>
  );
}

export default NavBar;
