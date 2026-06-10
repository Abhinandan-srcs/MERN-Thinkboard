import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';  
import { SignIn, SignUp, useAuth } from "@clerk/clerk-react";  
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import NoteDetailsPage from "./pages/NoteDetailsPage";
import { toast } from 'react-hot-toast';

document.documentElement.setAttribute("data-theme", localStorage.getItem("theme") || "dark");

// 👇 add this — protects any route wrapped with it
const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) return <div className="text-center text-primary py-10">Loading...</div>;
  if (!isSignedIn) return <Navigate to="/sign-in" />;
  return children;
};

const App = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === "dark" ? "light" : "dark");

  return (
    <div className="relative h-full w-full">
      <div className={`absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 ${
        theme === "dark"
          ? "[background:radial-gradient(125%_125%_at_50%_10%,#000_60%,#00FF9D40_100%)]"
          : "[background:radial-gradient(125%_125%_at_50%_10%,#ffffff_60%,#00FF9D40_100%)]"
      }`}/>

      <Routes>
        {/* 👇 public routes — anyone can access */}
        <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
        <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" />} />

        {/* 👇 protected routes — must be logged in */}
        <Route path="/" element={
          <ProtectedRoute>
            <HomePage theme={theme} toggleTheme={toggleTheme} />
          </ProtectedRoute>
        }/>
        <Route path="/create" element={
          <ProtectedRoute>
            <CreatePage theme={theme} toggleTheme={toggleTheme} />
          </ProtectedRoute>
        }/>
        <Route path="/note/:id" element={
          <ProtectedRoute>
            <NoteDetailsPage theme={theme} toggleTheme={toggleTheme} />
          </ProtectedRoute>
        }/>
      </Routes>
    </div>
  );
};

export default App;