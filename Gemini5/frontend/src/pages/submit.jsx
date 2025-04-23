import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function SubmitSciencePlan() {
  const { planId } = useParams();
  const [plan, setPlan] = useState(null);
  const [confirmation, setConfirmation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/science-plan/${planId}`)
      .then(response => setPlan(response.data))
      .catch(error => console.error("Error fetching plan:", error));
  }, [planId]);

  const handleSubmit = () => {
    if (plan.status === "TESTED") {
      axios.post("/api/submit-science-plan", { planId })
        .then(response => {
          alert("Science Plan submitted successfully!");
          navigate("/science-plans");
        })
        .catch(error => alert("Error submitting science plan"));
    } else {
      alert("Plan must be TESTED before submission");
    }
  };

  const handleCancel = () => {
    navigate("/show-list");
  };

  if (!plan) return <div>Loading...</div>;

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-indigo-900">
      <div className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-md">
        <h2 className="text-center text-xl font-semibold mb-6">Submit Science Plan</h2>

        <div className="mb-4">
          <p><strong>Plan Name:</strong> {plan.name}</p>
          <p><strong>Status:</strong> {plan.status}</p>
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-full bg-black text-white font-semibold hover:opacity-90 transition"
          >
            Confirm
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-full bg-gray-400 text-white font-semibold hover:opacity-90 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubmitSciencePlan;
