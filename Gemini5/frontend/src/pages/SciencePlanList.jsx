import React, { useEffect, useState } from "react";
import axios from "axios";

function SciencePlanList() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Science Plan List | GEMINI5";
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/science-plans");
      setPlans(response.data);
    } catch (error) {
      console.error("Error fetching science plans:", error);
    } finally {
      setLoading(false);
    }
  };  

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-gray-900 to-indigo-900 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Science Plan List</h1>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white text-black rounded-xl p-4 shadow-md">
              <h2 className="font-semibold text-lg mb-2">Plan: {plan.title}</h2>
              <p>Status: {plan.status}</p>
              <p>Telescope: {plan.telescope}</p>
              {/* Add more fields if needed */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SciencePlanList;
