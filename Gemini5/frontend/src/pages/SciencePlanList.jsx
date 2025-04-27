import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { sciencePlan } from "../data/sciencePlan"; // Optional fallback data for development

function SciencePlanList() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState("");

  const statusOptions = [
    // "Select Filter",
    "ALL",
    "CREATED",
    "TESTED",
    "SUBMITTED",
    "VALIDATED",
    "EXECUTED"
  ];

  // Set document title
  useEffect(() => {
    document.title = "Science Plan List | GEMINI5";
    fetchPlans();
  }, []);

  // Filter the plans based on both the search ID and status filter
  useEffect(() => {
    const filtered = plans.filter((plan) => {
      const statusMatch =
        statusFilter === "ALL" || plan.status === statusFilter;
      const idMatch = !searchId || plan.planID.toString().includes(searchId);
      return statusMatch && idMatch;
    });
    setFilteredPlans(filtered);
  }, [statusFilter, searchId, plans]);

  // Fetch science plans from the API
  const fetchPlans = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/science-plans");
      console.log("Fetched plans:", response.data);
      setPlans(response.data);
      setFilteredPlans(response.data); // Set both full and filtered list initially
    } catch (error) {
      console.error("Error fetching science plans:", error);
      setPlans(sciencePlan); // Fallback to local data during development
      setFilteredPlans(sciencePlan);
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).replace(",", "");
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-indigo-900 overflow-auto p-4">
      <div className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-4xl space-y-6">
        <h2 className="text-center text-xl font-semibold mb-6">
          Science Plan List
        </h2>

        {/* Filter by Status */}
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

        {/* Search by ID */}
        <div className="flex items-center gap-4 mb-4">
          <label htmlFor="searchId" className="w-32 font-medium text-black">
            Search by ID :
          </label>
          <input
            id="searchId"
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter Plan ID"
            className="flex-1 text-black px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Loading or Plan Display */}
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : filteredPlans.length > 0 ? (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {filteredPlans.map((plan) => (
              <div key={plan.planID} className="p-4 border rounded-lg bg-white shadow">
                <p><strong>ID:</strong> {plan.planID}</p>
                <p><strong>Name:</strong> {plan.planName}</p>
                <p><strong>Creator:</strong> {plan.creator}</p>
                <p><strong>Funding:</strong> ${Number(plan.funding).toFixed(2)}</p>
                <p><strong>Objective:</strong> {plan.objective}</p>
                <p><strong>Start Date:</strong> {formatDate(plan.startDate)}</p>
                <p><strong>End Date:</strong> {formatDate(plan.endDate)}</p>
                <p><strong>Star System (Target):</strong> {plan.target}</p>
                <p><strong>Assigned Telescope:</strong> {plan.assignedTelescope}</p>
                <p><strong>Status:</strong> {plan.status}</p>

                <div className="flex justify-end pt-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/detail/${plan.planID}`)}
                      className="bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600 transition"
                    >
                      Detail
                    </button>

                    {plan.status === "SUBMITTED" && (
                      <button
                        onClick={() => navigate(`/validate-plan/${plan.planID}`)}
                        className="bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600 transition"
                      >
                        Validate
                      </button>
                    )}

                    {plan.status === "TESTED" && (
                      <button
                        onClick={() => navigate(`/submit-plan/${plan.planID}`)}
                        className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 transition"
                      >
                        Submit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-300">No plans found.</p>
        )}
      </div>
    </div>
  );
}

export default SciencePlanList;
