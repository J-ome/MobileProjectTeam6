import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../firebase/Config';

// Create the authentication context
export const AuthContext = createContext();

// Create the AuthProvider component to manage authentication state and provide authentication-related functions
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initialize user state

  // Effect to listen for changes in user authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // If user is authenticated, set the user state
        setUser(user);
      } else {
        // If user is not authenticated, set the user state to null
        setUser(null);
      }
    });

    // Clean up function to unsubscribe from the onAuthStateChanged listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // Function to handle user login
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  };

  // Function to handle user logout
  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  // Provide the authentication context value to its children
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
