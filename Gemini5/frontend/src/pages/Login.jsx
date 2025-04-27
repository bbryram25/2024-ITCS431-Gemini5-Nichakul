import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../auth";
import { staff } from "../data/staff"; 

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login | GEMINI5";
  }, []);

  const handleLogIn = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    // // Simulate login API call
    // try {
    //     const response = await fetch("/api/login", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({ username, password }),
    //     });

    //     const data = await response.json();

    //     if (response.ok) {
    //         // Assuming the response contains a JWT token
    //         setToken(data.token); // Set the token in cookies
    //         // Redirect to the home page after successful login
    //         window.location.href = "/"; // Or use React Router's `useNavigate()` if necessary
    //     } else {
    //         setError(data.message || "Login failed");
    //     }
    // } catch (err) {
    //     console.error(err);
    //     setError("Something went wrong. Please try again.");
    // }
    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include", // Include credentials (cookies) in the request
      });
      const data = await response.json();

      if (response.ok) {
        setMessage("Login successful"); // Optionally show success message
        setUsername(""); // Clear the username field
        setPassword(""); // Clear the password field
        localStorage.setItem("user", JSON.stringify(data.data));
        navigate("/home"); // Redirect to home after successful login
        console.log("Login successful");
        // localStorage.setItem("token", data.token || ""); // Save the token in local storage
        // setMessage(data.detail);
        // navigate("/home"); // Redirect to the home page after successful login
        // window.location.href = "/home"; // Redirect to the home page after successful login
      } else {
        console.error("Login failed:", data.detail || "Unknown error");
        setMessage(data.detail || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setMessage("An error occurred");
      // Fallback to sample data if backend login fails
      const fallbackUser = staff.find(
        (s) => s.username === username && s.password === password
      );

      if (fallbackUser) {
        console.log("Login successful (from sample data)");

        // Optionally set token if needed
        // setToken("sample-token");

        // Save user info to localStorage if needed
        localStorage.setItem("user", JSON.stringify(fallbackUser));

        setMessage("Login successful (sample data)");
        navigate("/home");
      } else {
        setMessage("Username or Password is incorrect (sample)");
      }
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
          {message && (
            <div className="mb-4 text-center text-sm text-red-600 font-medium">
              Username or Password is incorrect!
            </div>
          )}

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
