import React, { useEffect, useState } from "react";
import { setToken } from "../auth";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        document.title = "Login | GEMINI5";
      }, []);

    const handleLogIn = async (e) => {
        e.preventDefault();

        // Simulate login API call
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Assuming the response contains a JWT token
                setToken(data.token); // Set the token in cookies
                // Redirect to the home page after successful login
                window.location.href = "/"; // Or use React Router's `useNavigate()` if necessary
            } else {
                setError(data.message || "Login failed");
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
                    {/* <h1 className="text-center text-xl font-bold mb-6">
                        GEMINI5
                    </h1> */}
                    <h2 className="text-center text-xl font-semibold mb-6">
                        Log in to your account
                    </h2>
                    <form className="space-y-4" onSubmit={handleLogIn}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 rounded-full bg-black text-white font-semibold hover:opacity-90 transition"
                        >
                            Log in
                        </button>
                        <div className="flex justify-center text-sm mt-2 text-gray-600">
                            <a href="/register" className="hover:underline">
                                Create an account
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;