'use client';
import React from 'react';
import { useAuth } from '@/utils/authContext';

function NavBar({ toggleSidebar }) {
  const {token_username} = useAuth();
  return (
    <>
     <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="stylesheet" href="/assets/dashboard.css" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans%3A700" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto%3A400%2C500%2C700" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro%3A400%2C500%2C700" />
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
    <img src="/assets/logo_white.png" width={160} height={40} alt="" />
    <div className="ml-auto">
      <a className="navbar-brand" href="#">
        <button
          type="submit"
          className="btn btn-primary"
          style={{ backgroundColor: "#398d86" }}
        >
          <img src="/assets/user.png" width="30px" height="30px" /> {token_username}
        </button>
      </a>
    </div>
  </nav>
</div>

    </>
  );
}

export default NavBar;
