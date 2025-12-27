import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import AssignSpoc from "./pages/AssignSpoc";

import Login from "./pages/Login";
import Spoc from "./pages/Spoc";
import Calendar from "./pages/Calendar";
import CalendarDashboard from "./pages/CalendarDashboard";
import CompletedApprovals from "./pages/CompletedApprovals";

import ProtectedRoute from "./guards/ProtectedRoute";
import RoleRoute from "./guards/RoleRoute";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          {/* <Route
            path="/spoc"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["SPOC"]}>
                  <Spoc />
                </RoleRoute>
              </ProtectedRoute>
            }
          /> */}

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
          <Route path="/spoc/*" element={<Spoc />} />
          <Route path="/assign-spoc" element={<AssignSpoc />} />
          <Route path="/calendar-dashboard" element={<CalendarDashboard />} />
          <Route path="/completed-approvals" element={<CompletedApprovals />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
