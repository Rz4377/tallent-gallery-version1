// Navbar.tsx
import { useContext } from 'react';
import { SunIcon, MoonIcon, Bars3Icon } from '@heroicons/react/24/solid';
import { AuthContext } from '../context/AuthContextApi';
import Logout from '../components/Logout';
import SignupButton from '../components/SignupButton';
import SigninButton from '../components/SigninButton';
import { useDarkMode } from '../components/theme-provider';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider.');
  }

  const { user, loading } = authContext;
  const { isDarkMode, toggleTheme } = useDarkMode();
  const navigate = useNavigate();

  return (
    <nav
      className={`fixed top-0 left-0 w-full h-20 ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      } shadow-md z-20 border-b ${
        isDarkMode ? 'border-gray-700' : 'border-white/20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Left Side: Logo and Menu */}
          <div className="flex items-center gap-4">
            {/* Menu Button */}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md focus:outline-none"
            >
              <Bars3Icon
                className={`h-6 w-6 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}
              />
            </button>

            <span
              className="text-2xl font-semibold cursor-pointer text-gray-800 dark:text-white"
              onClick={() => navigate('/home')}
            >
              TalentGallery
            </span>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200/40 dark:bg-gray-700/40 hover:bg-gray-200/60 dark:hover:bg-gray-700/60 focus:outline-none transition"
            >
              {isDarkMode ? (
                <SunIcon className="h-6 w-6 text-yellow-500" />
              ) : (
                <MoonIcon className="h-6 w-6 text-gray-800 dark:text-gray-200" />
              )}
            </button>

            {!loading ? (
              <>
                {!user ? (
                  <>
                    <SignupButton />
                    <SigninButton />
                  </>
                ) : (
                  <Logout />
                )}
              </>
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;