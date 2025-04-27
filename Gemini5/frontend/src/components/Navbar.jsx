import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout, getUser } from "../auth";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = getUser();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleUnauthorizedClick = (message) => {
        alert(message);
    };

    const hasPermission = (requiredRole) => {
        return user && user.role === requiredRole;
    };

    // Show minimal navbar on login/register page
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

                {user && (
                    <div className="space-x-6 flex items-center text-sm font-medium">
                        <Link to="/" className="hover:underline">Home</Link>
                        <Link to="/sciencePlans" className="hover:underline">Science Plan List</Link>
                        {hasPermission("Astronomer") && (
                            <Link to="/createSciencePlan" className="hover:underline">Create Science Plan</Link>
                        )}
                        {hasPermission("ScienceObserver") && (
                            <Link to="/validateSciencePlan" className="hover:underline">Validate Science Plan</Link>
                        )}
                        {hasPermission("Astronomer") && (
                            <Link to="/submitSciencePlan" className="hover:underline">Submit Science Plan</Link>
                        )}
                    </div>
                )}

                {/* Logout Button */}
                {user && (
                    <button
                        onClick={handleLogout}
                        className="ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full transition"
                    >
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;