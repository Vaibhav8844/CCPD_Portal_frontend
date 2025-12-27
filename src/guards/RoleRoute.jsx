import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function RoleRoute({ allowedRoles, children }) {
  const { role } = useAuth();

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  return children;
}
