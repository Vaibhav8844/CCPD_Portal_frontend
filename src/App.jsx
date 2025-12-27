import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";

import Login from "./pages/Login";
import Spoc from "./pages/Spoc";
import Calendar from "./pages/Calendar";
import AssignSpoc from "./pages/AssignSpoc";
import CalendarDashboard from "./pages/CalendarDashboard";
import CompletedApprovals from "./pages/CompletedApprovals";
import ViewCalendar from "./pages/ViewCalendar";

import ProtectedRoute from "./guards/ProtectedRoute";
import RoleRoute from "./guards/RoleRoute";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route
            path="/spoc/*"
            element={
              <ProtectedRoute role="SPOC">
                <Spoc />
              </ProtectedRoute>
            }
          />

          <Route
            path="/calendar"
            element={
              <ProtectedRoute role="CALENDAR_TEAM">
                <Calendar />
              </ProtectedRoute>
            }
          />

          <Route
            path="/calendar-dashboard"
            element={
              <ProtectedRoute role="CALENDAR_TEAM">
                <CalendarDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/completed-approvals"
            element={
              <ProtectedRoute role="CALENDAR_TEAM">
                <CompletedApprovals />
              </ProtectedRoute>
            }
          />

          <Route
            path="/assign-spoc"
            element={
              <ProtectedRoute role="CALENDAR_TEAM">
                <AssignSpoc />
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-calendar"
            element={
              <ProtectedRoute role="CALENDAR_TEAM">
                <ViewCalendar />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
