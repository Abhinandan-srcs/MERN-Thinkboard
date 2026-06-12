import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SignIn, SignUp, useAuth } from "@clerk/clerk-react";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import NoteDetailsPage from "./pages/NoteDetailsPage";

document.documentElement.setAttribute(
  "data-theme",
  localStorage.getItem("theme") || "dark"
);

const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="text-center text-primary py-10">
        Loading...
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" />;
  }

  return children;
};

const App = () => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background */}
  <div
  className={`absolute inset-0 -z-10 ${
    theme === "dark"
      ? "[background:radial-gradient(circle_at_top,#1e293b_0%,#020617_35%,#000000_100%)]"
      : "bg-white"
  }`}
/>
      <Routes>
        <Route
          path="/sign-in/*"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <SignIn routing="path" path="/sign-in" />
            </div>
          }
        />

        <Route
          path="/sign-up/*"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <SignUp routing="path" path="/sign-up" />
            </div>
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage
                theme={theme}
                toggleTheme={toggleTheme}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreatePage
                theme={theme}
                toggleTheme={toggleTheme}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/note/:id"
          element={
            <ProtectedRoute>
              <NoteDetailsPage
                theme={theme}
                toggleTheme={toggleTheme}
              />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;