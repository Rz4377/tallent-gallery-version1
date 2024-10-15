// ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContextApi";

export default function ProtectedRoute() {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider.");
  }

  const { user, loading } = authContext;

  if (loading) {
    // You can render a loading spinner or placeholder here
    return <div>Loading...</div>;
  }

  if (!user) {
    // Redirect unauthenticated users to the sign-in page
    return <Navigate to="/signin" replace />;
  }


  return <Outlet />;
}