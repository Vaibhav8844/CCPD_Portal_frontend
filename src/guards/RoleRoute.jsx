import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function RoleRoute({ allowedRoles, children }) {
  const { auth } = useAuth();

  if (!allowedRoles.includes(auth.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
