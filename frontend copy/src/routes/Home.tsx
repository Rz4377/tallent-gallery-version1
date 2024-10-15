// Home.tsx
import { useNavigate } from "react-router-dom";
import SlideShow from "../components/SlideShow";
import { useDarkMode } from "../components/theme-provider";

export default function Home() {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();

  return (
    <div
      className={`flex flex-col items-center justify-center  ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      {/* Navbar Placeholder */}
      <div className="fixed top-0 left-0 w-full">
        {/* Include your Navbar component here */}
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row items-center justify-center w-full mt-20 px-4 md:px-8">
        {/* Text and Buttons Section */}
        <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
          <h1
            className={`text-4xl md:text-6xl font-bold mb-6 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            <span className="text-green-500">Create</span> Teams, Implement
            Projects, and <span className="text-blue-500">Share</span> with the World
          </h1>
          <p
            className={`mb-8 text-lg ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Collaborate with others, bring your ideas to life, and showcase your work to a global audience.
          </p>
          <div className="flex flex-col md:flex-row md:space-x-4">
            <button
              onClick={() => navigate("/feed")}
              className="px-6 py-3 mb-4 md:mb-0 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              See Posts
            </button>
            <button
              onClick={() => navigate("/createPosts")}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Create Posts
            </button>
          </div>
        </div>

        {/* Slideshow Section */}
        <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
          <div className="w-full max-w-md">
            {/* Adjust the size as needed */}
            <SlideShow />
          </div>
        </div>
      </div>

      {/* Footer Placeholder */}
      <div className="mt-16">
        {/* Include your Footer component here if you have one */}
      </div>
    </div>
  );
}