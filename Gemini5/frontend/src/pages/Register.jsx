import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getUser } from "../auth";  // Import getUser instead of using localStorage directly

function Register() {
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [role, setRole] = useState("Astronomer");
    const [password, setPassword] = useState("");

    useEffect(() => {
        document.title = "Register | GEMINI5";
        // If user is already logged in, redirect to home
        const user = getUser();
        if (user) {
            navigate('/');
        }
    }, [navigate]);

    const handleRegister = async (e) => {
        e.preventDefault();

        const registerData = { username, firstName, lastName, role, password };

        try {
            const response = await fetch("http://localhost:8080/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(registerData),
            });

            const data = await response.json();

            if (response.ok) {
                navigate("/login"); // Redirect to login after successful registration
            } else {
                setError(data.message || "Registration failed");
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <>
            <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-indigo-900">
                <div className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-md">
                    <h2 className="text-center text-xl font-semibold mb-6">
                        Register New Staff
                    </h2>
                    {error && (
                        <div className="mb-4 text-center text-sm text-red-600">
                            {error}
                        </div>
                    )}
                    <form className="space-y-4" onSubmit={handleRegister}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">First Name</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Last Name</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            >
                                <option value="Astronomer">Astronomer</option>
                                <option value="ScienceObserver">Science Observer</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 rounded-full bg-black text-white font-semibold hover:opacity-90 transition"
                        >
                            Register
                        </button>

                        <div className="flex justify-center text-sm mt-2 text-gray-600">
                            <Link to="/login" className="hover:underline">
                                Back to login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Register;