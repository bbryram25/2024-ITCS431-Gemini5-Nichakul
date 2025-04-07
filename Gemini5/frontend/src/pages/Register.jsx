import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Register() {
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [role, setRole] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        document.title = "Register | GEMINI5";
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();

        // Prepare the data to send to the backend
        const registerData = { username, firstName, lastName, role, password };

        try {
            // Simulate API request for registration
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(registerData),
            });

            const data = await response.json();

            if (response.ok) {
                // Assuming the response contains a JWT token
                setToken(data.token); // Save the token in cookies
                navigate("/"); // Redirect to the home page after successful registration
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
                    <form className="space-y-4" onSubmit={handleRegister}>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                placeholder="Username"
                                className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">First Name</label>
                            <input
                                type="text"
                                placeholder="First Name"
                                className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Last Name</label>
                            <input
                                type="text"
                                placeholder="Last Name"
                                className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <select
                                className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >   
                                <option value="Astronomer">Astronomer</option>
                                <option value="Administrator">Administrator</option>
                                <option value="Telescope Operator">Telescope Operator</option>
                                <option value="Science Observer">Science Observer</option>
                                <option value="Support">Support</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                placeholder="Enter a password"
                                className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                            <Link to="/" className="hover:underline">
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
