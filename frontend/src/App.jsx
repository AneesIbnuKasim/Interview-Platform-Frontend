import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Room from "@/pages/Room";
import NotFound from "@/pages/NotFound";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { fetchCurrentUser } from "@/features/auth/authSlice";
import { getAccessToken } from "@/lib/authStorage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function App() {
  const dispatch = useAppDispatch();
  const initialized = useAppSelector((state) => state.auth.initialized);

  useEffect(() => {
    if (!initialized && getAccessToken()) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, initialized]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="/room/:roomId" element={<Room />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
