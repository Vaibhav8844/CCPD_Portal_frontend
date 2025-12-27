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
              <ProtectedRoute>
                <RoleRoute allowedRoles={["SPOC"]}>
                  <Spoc />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["CALENDAR_TEAM"]}>
                  <Calendar />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/calendar-dashboard"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["CALENDAR_TEAM"]}>
                  <CalendarDashboard />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/completed-approvals"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["CALENDAR_TEAM"]}>
                  <CompletedApprovals />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/assign-spoc"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["CALENDAR_TEAM"]}>
                  <AssignSpoc />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-calendar"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["CALENDAR_TEAM"]}>
                  <ViewCalendar />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
