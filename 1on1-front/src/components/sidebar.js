'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const links = [
  { name: 'Dashboard', url: '/dashboard', icon: 'home' },
  { name: 'Calendar', url: '/calendar', icon: 'calendar_today' },
  { name: 'Contacts', url: '/contacts', icon: 'contacts' },
];

function Sidebar({ activePage }) {
  const router = useRouter();
  const [isToggled, setIsToggled] = useState(false);

  const handleLinkClick = (url) => {
    router.push(url);
  };

  return (
    <div className={`fixed top-0 left-0 h-screen w-64 overflow-y-auto transition-transform duration-300 ease-out bg-gray-100 border-r border-gray-300 z-10 ${isToggled ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Toggle Button */}
      <button
        id="menu-toggle"
        onClick={() => setIsToggled(!isToggled)}
        className="absolute top-4 right-[-3.75rem] p-2 rounded-full bg-white border border-gray-300 cursor-pointer shadow-md"
      >
        <span className="material-icons">
          {isToggled ? 'close' : 'menu'}
        </span>
      </button>

      <div className="list-group">
        {links.map(({ name, url, icon }) => (
          <button
            key={url}
            onClick={() => handleLinkClick(url)}
            data-url={url}
            className={`block px-4 py-2 flex items-center hover:bg-gray-200 hover:text-blue-500 transition duration-150 w-full text-left ${
              activePage === url ? 'bg-blue-500 text-white' : 'text-gray-700'
            }`}
          >
            <span className="material-icons mr-2">{icon}</span>
            <span>{name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
