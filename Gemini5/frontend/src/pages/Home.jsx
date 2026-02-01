import React, { useEffect, useState } from "react";
// import { Link, Navigate } from "react-router-dom";
import { Navigate, useNavigate } from "react-router-dom";
import { isLoggedIn, logout, getUser } from "../auth";

function Home() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        document.title = "Home | GEMINI5";
        const currentUser = getUser();
        if (currentUser) {
            setUser(currentUser);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleNavigation = (path, allowedRoles) => {
        if (allowedRoles.includes(user.role)) {
            navigate(path);
        } else {
            alert(`Only ${allowedRoles.join(" or ")} can access.`);
        }
    };

    if (!user) return null;    

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-indigo-900">
            <div className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-md">
                <h2 className="text-center text-xl font-semibold mb-6">
                    Home
                </h2>
                {/* Welcome message */}
                {user && (
                    <p className="text-center text-m text-gray-700 mb-6">
                        Welcome {user.firstName} {user.lastName}, our {user.role}!
                    </p>
                )}
                <div className="space-y-4">
                    <button
                        onClick={() => navigate("/sciencePlans")}
                        className="w-full py-2 rounded-full bg-black text-white font-semibold hover:opacity-90 transition"
                    >
                        List of Science Plan
                    </button>
                    <button
                        onClick={() => handleNavigation("/createSciencePlan", ["Astronomer"])}
                        className="w-full py-2 rounded-full bg-black text-white font-semibold hover:opacity-90 transition"
                    >
                        Create Science Plan
                    </button>
                    <button
                        onClick={() => handleNavigation("/submitSciencePlan", ["Astronomer"])}
                        className="w-full py-2 rounded-full bg-black text-white font-semibold hover:opacity-90 transition"
                    >
                        Submit Science Plan
                    </button>
                    <button
                        // onClick={() => handleNavigation("/validate-plan")}
                        onClick={() => handleNavigation("/validateSciencePlan", ["Science_Observer"])}
                        className="w-full py-2 rounded-full bg-black text-white font-semibold hover:opacity-90 transition"
                    >
                        Validate Science Plan
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Home;