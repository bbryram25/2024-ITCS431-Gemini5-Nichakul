import React, { useEffect, useState } from "react";
import axios from "axios";

function SciencePlanList() {
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // const statusOptions = ["all", "created", "tested", "submitted", "validated", "executed"];
  const statusOptions = [
    "ALL",
    "CREATED",
    "TESTED",
    "SUBMITTED",
    "VALIDATED",
    "EXECUTED"
  ];

  useEffect(() => {
    document.title = "Science Plan List | GEMINI5";
    fetchPlans();
  }, []);

  useEffect(() => {
    // Filter plans based on selected status
    if (statusFilter === "ALL") {
      setFilteredPlans(plans);
    } else {
      setFilteredPlans(plans.filter((plan) => plan.status === statusFilter));
    }
  }, [statusFilter, plans]);

  const fetchPlans = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/science-plans");
      setPlans(response.data);
      setFilteredPlans(response.data); // set both full and filtered list initially
    } catch (error) {
      console.error("Error fetching science plans:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-indigo-900">
      <div className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-2xl space-y-4">
        <h2 className="text-center text-xl font-semibold mb-6">
          Science Plan List
        </h2>
        {/* <div className="flex justify-center mb-6">
        <select
          className="text-black p-2 rounded-md"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div> */}
        <div className="flex items-center gap-4 mb-4">
          <label htmlFor="statusFilter" className="w-32 font-medium text-black">
            Filter by Status :
          </label>
          <select
            id="statusFilter"
            className="flex-1 text-black px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>


        {loading ? (
          <p className="text-center">Loading...</p>
        ) : filteredPlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPlans.map((plan) => (
              <div key={plan.id} className="bg-white text-black rounded-xl p-4 shadow-md">
                <h2 className="font-semibold text-lg mb-2">Plan: {plan.title}</h2>
                <p>Status: {plan.status}</p>
                <p>Telescope: {plan.telescope}</p>
                {/* Add more fields if needed */}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-300">No plans found for this status.</p>
        )}
      </div></div>
  );
}

export default SciencePlanList;
