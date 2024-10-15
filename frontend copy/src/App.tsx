// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./routes/Home";
import Signup from "./routes/Signup";
import Signin from "./routes/Signin";
import Posts from "./routes/Posts";
import CreatePosts from "./routes/CreatePosts";
import UserPost from "./routes/UserPost";
import MainLayout from "./routes/MainLayout";
import AuthLayout from "./routes/AuthLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useDarkMode } from "./components/theme-provider";

const App = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`${isDarkMode ? "dark" : ""}`}>
      <BrowserRouter>
        <Routes>

          <Route element={<AuthLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Navigate to="/" />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
          </Route>


          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/feed" element={<Posts />} />
              <Route path="/createPosts" element={<CreatePosts />} />
              <Route path="/myposts" element={<UserPost />} />
            </Route>
          </Route>

          <Route path="*" element={<h1>404: Page Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;