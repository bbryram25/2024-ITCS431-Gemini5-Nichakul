import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Menu() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Menu | GEMINI5";
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-indigo-900">
      <div className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-md">
        <h2 className="text-center text-xl font-semibold mb-6">
          Welcome to the Menu
        </h2>
        <div className="space-y-4">
          <button
            onClick={() => handleNavigation("/show-list")}
            className="w-full py-2 rounded-full bg-black text-white font-semibold hover:opacity-90 transition"
          >
            Show List
          </button>
          <button
            onClick={() => handleNavigation("/CreatePlan")}
            className="w-full py-2 rounded-full bg-black text-white font-semibold hover:opacity-90 transition"
          >
            Create Plan
          </button>
          <button
            onClick={() => handleNavigation("/validate-plan")}
            className="w-full py-2 rounded-full bg-black text-white font-semibold hover:opacity-90 transition"
          >
            Validate Plan
          </button>
          <button
            onClick={() => handleNavigation("/submit")}
            className="w-full py-2 rounded-full bg-black text-white font-semibold hover:opacity-90 transition"
          >
            Submit Plan
          </button>
        </div>
      </div>
    </div>
  );
}

export default Menu;
