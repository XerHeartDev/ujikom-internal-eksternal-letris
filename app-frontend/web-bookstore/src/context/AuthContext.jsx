import { createContext, useContext, useEffect, useState } from "react";
import {
  getToken,
  getUser,
  setToken,
  setUser as saveUser,
  removeToken,
  removeUser,
} from "../utils/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setAuthUser] = useState(null);
  const [token, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = getToken();
    const storedUser = getUser();

    if (storedToken && storedUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAuthToken(storedToken);
      setAuthUser(storedUser);
    }

    setLoading(false);
  }, []);

  const login = ({ token, user }) => {
    setToken(token);
    saveUser(user);
    setAuthToken(token);
    setAuthUser(user);
  };

  const logout = () => {
    removeToken();
    removeUser();
    setAuthToken(null);
    setAuthUser(null);
  };

  const updateUser = (newUser) => {
    saveUser(newUser);
    setAuthUser(newUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        login,
        logout,
        updateUser,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
