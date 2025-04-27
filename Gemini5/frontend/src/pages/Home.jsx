import React, { useEffect, useState } from "react";
// import { Link, Navigate } from "react-router-dom";
import { Navigate, useNavigate } from "react-router-dom";
import { isLoggedIn, logout } from "../auth";


function Home() {
    // if (!isLoggedIn()) {
    //     return <Navigate to="/login" replace />;
    // }
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        document.title = "Home | GEMINI5";
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    // const handleNavigation = (path) => {
    //     navigate(path);
    // };
    const handleNavigation = (path, allowedRoles) => {
        if (allowedRoles.includes(user.role)) {
            navigate(path);
        } else {
            alert(`Only ${allowedRoles.join(" or ")} can access.`);
        }
    };
    if (!user) return null;    

    // useEffect(() => {
    //     document.title = "GEMINI5";
    // }, []);

    const handleLogout = () => {
        logout();
        window.location.href = "/login"; // Redirect to the login page after logout
    };

    return (
        // <>
        //     <h1>Welcome to Gemini5</h1>
        //     <button
        //         onClick={handleLogout}
        //         className="mt-4 px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-700 transition"
        //     >
        //         Logout
        //     </button>
        // </>
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
                        onClick={() => navigate("/show-list")}
                        className="w-full py-2 rounded-full bg-black text-white font-semibold hover:opacity-90 transition"
                    >
                        Show Science Plan List
                    </button>
                    <button
                        // onClick={() => handleNavigation("/CreateSciPlan")}
                        onClick={() => handleNavigation("/CreateSciPlan", ["Astronomer"])}
                        className="w-full py-2 rounded-full bg-black text-white font-semibold hover:opacity-90 transition"
                    >
                        Create Science Plan
                    </button>
                    <button
                        // onClick={() => handleNavigation("/validate-plan")}
                        onClick={() => handleNavigation("/validate-plan", ["ScienceObserver"])}
                        className="w-full py-2 rounded-full bg-black text-white font-semibold hover:opacity-90 transition"
                    >
                        Validate Science Plan
                    </button>
                    <button
                        // onClick={() => handleNavigation("/submit-plan")}
                        onClick={() => handleNavigation("/submit-plan", ["Astronomer"])}
                        className="w-full py-2 rounded-full bg-black text-white font-semibold hover:opacity-90 transition"
                    >
                        Submit Science Plan
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Home;