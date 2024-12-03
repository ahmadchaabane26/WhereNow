import React, { useContext, useState, useEffect } from 'react';
import { auth } from "../firebase";

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);
    const [idToken, setIdToken] = useState(null); // Store the user's ID token

    // Signup function
    function signup(email, password) {
        return auth.createUserWithEmailAndPassword(email, password);
    }

    // Login function
    function login(email, password) {
        return auth.signInWithEmailAndPassword(email, password);
    }

    // Logout function
    function logout() {
        setIdToken(null); // Clear the ID token on logout
        return auth.signOut();
    }

    // Reset password function
    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email);
    }

    // Update email function
    function updateEmail(email) {
        return currentUser.updateEmail(email);
    }

    // Update password function
    function updatePassword(password) {
        return currentUser.updatePassword(password);
    }

    // Retrieve and update the ID token whenever the user changes
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            setCurrentUser(user);
            setLoading(false);

            if (user) {
                try {
                    const token = await user.getIdToken(); // Fetch the ID token
                    setIdToken(token);
                } catch (error) {
                    console.error("Failed to fetch ID token:", error);
                }
            } else {
                setIdToken(null);
            }
        });

        return unsubscribe;
    }, []);

    // Refresh the ID token periodically (optional)
    useEffect(() => {
        if (currentUser) {
            const interval = setInterval(async () => {
                try {
                    const token = await currentUser.getIdToken(true); // Force refresh token
                    setIdToken(token);
                } catch (error) {
                    console.error("Failed to refresh ID token:", error);
                }
            }, 60 * 60 * 1000); // Refresh every 1 hour

            return () => clearInterval(interval);
        }
    }, [currentUser]);

    const value = {
        currentUser,
        idToken, // Expose the ID token for API calls
        login,
        signup,
        logout,
        resetPassword,
        updateEmail,
        updatePassword,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
