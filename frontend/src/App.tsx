import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Home from "./routes/Home";
import Signup from "./routes/Signup";
import Signin from "./routes/Signin";
import Posts from "./routes/Posts";
import CreatePosts from "./routes/CreatePosts";
import UserPost from "./routes/UserPost";
import MainLayout from "./routes/MainLayout";

import { useDarkMode } from "./components/theme-provider";
import ProtectedRoute from "./routes/ProtectedRoute";
import FriendMessage from "./routes/FriendMessage";
import AddFriend from "./routes/AddFriend";
import ConversationPage from "./routes/Conversation";

const App = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`${isDarkMode ? "dark" : ""}`}>
      <BrowserRouter>
        <Routes>

          <Route element={<MainLayout />}>

              <Route path="/" element={<Home />} />

              <Route path="/home" element={<Navigate to="/" />} />
              
              <Route path="/signup" element={<Signup />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/feed" element={<Posts />} />
              <Route 
              element={
                <ProtectedRoute>
                  <Outlet/>
                </ProtectedRoute> 
              }
            >
              <Route path="/createPosts" element={<CreatePosts />} />
              <Route path="/myposts" element={<UserPost />} />
              <Route path="/messages" element={<FriendMessage/>} />
              <Route path="/addFriends" element={<AddFriend/>} />
              <Route path="/conversation" element={<ConversationPage />} />
            </Route>

            <Route path="*" element={<h1>404: Page Not Found</h1>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;