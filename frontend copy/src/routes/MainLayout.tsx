// MainLayout.tsx
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useDarkMode } from '../components/theme-provider';
import { useState, useEffect } from 'react';

export default function MainLayout() {
  const { isDarkMode } = useDarkMode();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const updateSidebarWidth = () => {
      const root = document.documentElement;
      if (window.innerWidth >= 768) {
        // md breakpoint and above
        root.style.setProperty('--sidebar-width', isSidebarOpen ? '16rem' : '0rem');
      } else if (window.innerWidth >= 640) {
        // sm to md breakpoint
        root.style.setProperty('--sidebar-width', isSidebarOpen ? '4rem' : '0rem');
      } else {
        // below sm breakpoint
        root.style.setProperty('--sidebar-width', '0rem');
      }
    };

    updateSidebarWidth(); // Set initial value
    window.addEventListener('resize', updateSidebarWidth);
    return () => window.removeEventListener('resize', updateSidebarWidth);
  }, [isSidebarOpen]);

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>

      <Navbar toggleSidebar={toggleSidebar} />


      <div className="flex min-h-screen overflow-x-hidden">
        {/* Sidebar */}
        {isSidebarOpen && <Sidebar />}


        <div
          className="flex-grow mt-20 transition-all duration-300"
          style={{ marginLeft: isSidebarOpen ? 'var(--sidebar-width)' : '0' }}
        >

          <Outlet />
        </div>
      </div>
    </div>
  );
}