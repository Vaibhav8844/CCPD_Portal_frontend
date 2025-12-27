import { hasAccess } from "../auth/role";
import { useAuth } from "../auth/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ role, children }) {
  const { auth } = useAuth();

  if (!auth) {
    return <Navigate to="/" replace />;
  }

  if (!hasAccess(auth.role, role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}
