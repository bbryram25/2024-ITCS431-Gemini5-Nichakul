import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../auth";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Retrieve user data from localStorage or API
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const handleLogout = () => {
        logout();
        localStorage.removeItem("user"); // Remove user from localStorage on logout
        navigate("/login");
    };

    // If the user is on /login or /register, show a minimal navbar
    if (location.pathname === "/login" || location.pathname === "/register") {
        return (
            <nav className="bg-white shadow-md font-sans text-gray-900">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="text-xl font-semibold">GEMINI5</div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="bg-white shadow-md font-sans text-gray-900">
            <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
                <div className="text-xl font-semibold">GEMINI5</div>

                <div className="space-x-6 flex items-center text-sm font-medium">
                    <Link to="/home" className="hover:underline">Home</Link>
                    <Link to="/show-list" className="hover:underline">Science Plan List</Link>

                    {/* Show Create Science Plan link if the user is an Astronomer */}
                    {user && user.role === "Astronomer" && (
                        <Link to="/createSciPlan" className="hover:underline">Create Science Plan</Link>
                    )}

                    {/* Show Validate and Submit Plan links based on role */}
                    {user && user.role === "ScienceObserver" && (
                        <Link to="/validate-plan" className="hover:underline">Validate Science Plan</Link>
                    )}

                    {user && user.role === "Astronomer" && (
                        <Link to="/submit-plan" className="hover:underline">Submit Science Plan</Link>
                    )}

                    {/* Logout button */}
                    {user && (
                        <button
                            onClick={handleLogout}
                            className="ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full transition"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
export default Navbar;