import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter, Router } from "next/router";
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(Cookies.get("enterKey") == "mySecretCode" ? true : false);
  const [loading, setLoading] = useState(false);

  const login = (enterKey, route) => {
    if (enterKey == "mySecretCode") {
      Cookies.set("enterKey", enterKey, { expires: 60 });
      setIsAuthenticated(true);
      route.push("/", undefined, { shallow: true });
    }
  };

  const logout = () => {
    Cookies.remove("enterKey");
    setIsAuthenticated(false);
    const router = useRouter();
    router.push("/early-access", undefined, { shallow: true });
  };

  return <AuthContext.Provider value={{ isAuthenticated, login, loading, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
