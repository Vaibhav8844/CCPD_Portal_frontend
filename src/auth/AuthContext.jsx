import { createContext, useContext, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const saved =
      localStorage.getItem("auth") || sessionStorage.getItem("auth");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (username, password, rememberMe) => {
  const res = await api.post("/auth/login", { username, password,rememberMe });

  const authData = res.data;

  setAuth(authData);

  if (rememberMe) {
    localStorage.setItem("auth", JSON.stringify(authData));
  }

  return authData;   // ✅ THIS FIXES THE ERROR
};

  const logout = () => {
    setAuth(null);
    localStorage.removeItem("auth");
    sessionStorage.removeItem("auth");
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
