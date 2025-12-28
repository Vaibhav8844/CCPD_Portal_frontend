import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";

import Login from "./pages/Login";
import Spoc from "./pages/Spoc";
import Calendar from "./pages/Calendar";
import AssignSpoc from "./pages/AssignSpoc";
import CalendarDashboard from "./pages/CalendarDashboard";
import CompletedApprovals from "./pages/CompletedApprovals";
import ViewCalendar from "./pages/ViewCalendar";
import DataTeamDashboard from "./pages/DataTeamDashboard";
import PlacementAnalytics from "./pages/Analytics/PlacementAnalytics";
import EnrollStudents from "./pages/EnrollStudents";
import Admin from "./pages/Admin";
import AdminAssociates from "./pages/AdminAssociates";

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
          <Route
            path="/data-dashboard"
            element={
              <ProtectedRoute role="DATA_TEAM">
                <DataTeamDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/data/enroll/students" element={<ProtectedRoute role="DATA_TEAM"><EnrollStudents /></ProtectedRoute>} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="ADMIN">
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/associates"
              element={
                <ProtectedRoute role="ADMIN">
                  <AdminAssociates />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <RoleRoute allowedRoles={["ADMIN", "CALENDAR_TEAM", "DATA_TEAM"]}>
                  <PlacementAnalytics />
                </RoleRoute>
              }
            />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
