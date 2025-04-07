import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { isLoggedIn, logout } from "../auth";

function Home() {
    if (!isLoggedIn()) {
        return <Navigate to="/login" replace />;
    }

    useEffect(() => {
        document.title = "GEMINI5";
    }, []);

    const handleLogout = () => {
        logout();
        window.location.href = "/login"; // Redirect to the login page after logout
    };

    return (
        <>
            <h1>Welcome to Gemini5</h1>
            <button
                onClick={handleLogout}
                className="mt-4 px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-700 transition"
            >
                Logout
            </button>
        </>
    );
}

export default Home;