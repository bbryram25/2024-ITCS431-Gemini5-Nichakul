import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { setToken, setUser, getUser } from "../auth";
import { staff } from "../data/staff";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login | GEMINI5";
    const user = getUser();
    if (user) {
      navigate('/');
    }
  }, [navigate]);

  // Add the missing handleInputChange function
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFallbackLogin = () => {
    const fallbackUser = staff.find(
      (s) => s.username === formData.username && s.password === formData.password
    );

    if (fallbackUser) {
      setUser(fallbackUser);
      setMessage("Login successful (fallback)");
      navigate("/");
      return true;
    }
    return false;
  };

  const handleLogIn = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.data);
        if (data.token) {
          setToken(data.token);
        }
        setMessage("Login successful");
        navigate("/");
        return;
      }

      throw new Error(data.detail || "Login failed");
    } catch (error) {
      console.error("Error during login:", error);
      
      if (handleFallbackLogin()) {
        return;
      }

      setMessage("Username or Password is incorrect");
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-indigo-900">
      <div className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-md">
        <h2 className="text-center text-xl font-semibold mb-6">
          Log in to your account
        </h2>
        
        {message && (
          <div className="mb-4 text-center text-sm text-red-600 font-medium">
            {message}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogIn}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleInputChange}
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
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
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
            <Link to="/register" className="hover:underline">
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;