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

    const handleUnauthorizedClick = (message) => {
        alert(message);
    };

    const hasPermission = (requiredRole) => {
        return user && user.role === requiredRole;
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
                    <Link to="/" className="hover:underline">Home</Link>
                    <Link to="/sciencePlans" className="hover:underline">Science Plan List</Link>
                    <Link to="/createSciencePlan" className="hover:underline">Create Science Plan</Link>
                    <Link to="/validateSciencePlan" className="hover:underline">Validate Science Plan</Link>
                    <Link to="/submitSciencePlan" className="hover:underline">Submit Science Plan</Link>

                    <span
                        onClick={() => navigate("/home")}
                        className="text-gray-900 hover:text-blue-500 hover:underline cursor-pointer"
                    >
                        Home
                    </span>

                    <span
                        onClick={() => navigate("/show-list")}
                        className="text-gray-900 hover:text-blue-500 hover:underline cursor-pointer"
                    >
                        Science Plan List
                    </span>

                    <span
                        onClick={() => {
                            if (hasPermission("Astronomer")) {
                                navigate("/createSciPlan");
                            } else {
                                handleUnauthorizedClick("Only Astronomers can create science plans.");
                            }
                        }}
                        className="text-gray-900 hover:text-blue-500 hover:underline cursor-pointer"
                    >
                        Create Science Plan
                    </span>

                    <span
                        onClick={() => {
                            if (hasPermission("ScienceObserver")) {
                                navigate("/validate-plan");
                            } else {
                                handleUnauthorizedClick("Only ScienceObservers can validate plans.");
                            }
                        }}
                        className="text-gray-900 hover:text-blue-500 hover:underline cursor-pointer"
                    >
                        Validate Science Plan
                    </span>

                    <span
                        onClick={() => {
                            if (hasPermission("Astronomer")) {
                                navigate("/submit-plan");
                            } else {
                                handleUnauthorizedClick("Only Astronomers can submit plans.");
                            }
                        }}
                        className="text-gray-900 hover:text-blue-500 hover:underline cursor-pointer"
                    >
                        Submit Science Plan
                    </span>
                </div>

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
        </nav>
    );
}

export default Navbar;