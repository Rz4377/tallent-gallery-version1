// AuthLayout.tsx
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useDarkMode } from "../components/theme-provider";
import { useState } from "react";

export default function AuthLayout() {
  const { isDarkMode } = useDarkMode();
  const [isSidebarOpen , setIsSidebarOpen] = useState(true);

  return (
    <div className={`${isDarkMode ? "dark" : ""}`}>
      {/* Navbar */}
      <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}/>

      {/* Main Content */}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        {/* Adjust padding to account for the Navbar height */}
        <Outlet />
      </div>
    </div>
  );
}