import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if token exists in localStorage on initial load
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const user = localStorage.getItem("user");

    if (token && user) {
      setCurrentUser(JSON.parse(user));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    setLoading(false);
  }, []);

  // Function to handle user login
  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);

      // In a real implementation, this would be an API call to your backend
      // For now, we'll simulate a successful login
      const response = {
        data: {
          token: "sample_token",
          user: {
            id: "12345",
            name: credentials.username,
            role: "advisor",
            faceVerified: false,
          },
        },
      };

      const { token, user } = response.data;

      // Set token in axios headers
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Save to localStorage
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Update state
      setCurrentUser(user);
      return user;
    } catch (err) {
      setError(err.message || "An error occurred during login");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to handle user logout
  const logout = () => {
    // Remove from localStorage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");

    // Clear axios headers
    delete axios.defaults.headers.common["Authorization"];

    // Update state
    setCurrentUser(null);
  };

  // Function to handle user registration
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);

      // In a real implementation, this would be an API call to your backend
      // For now, we'll simulate a successful registration
      const response = {
        data: {
          token: "sample_token",
          user: {
            id: "12345",
            name: userData.name,
            role: "advisor",
            faceVerified: false,
          },
        },
      };

      const { token, user } = response.data;

      // Set token in axios headers
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Save to localStorage
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Update state
      setCurrentUser(user);
      return user;
    } catch (err) {
      setError(err.message || "An error occurred during registration");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to update user data
  const updateUserData = (userData) => {
    const updatedUser = { ...currentUser, ...userData };
    setCurrentUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    return updatedUser;
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    register,
    updateUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
