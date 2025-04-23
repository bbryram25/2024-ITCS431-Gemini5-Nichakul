import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ValidatePlan() {
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null); // Store the plan to be validated
  const [validationStatus, setValidationStatus] = useState("");

  useEffect(() => {
    document.title = "Validate Plan | GEMINI5";
    // Assuming you fetch the plan here from an API or local storage
    // For now, let's simulate a plan
    const fetchedPlan = {
      name: "Sample Plan",
      description: "This is a plan description.",
      date: "2025/04/30",
    };
    setPlan(fetchedPlan);
  }, []);

  const handleValidate = () => {
    // Logic for validation goes here
    // You can perform checks or send data to an API
    if (plan) {
      setValidationStatus("Plan is valid!");
      // Optionally, navigate to another page after validation
      // navigate("/next-page");
    } else {
      setValidationStatus("Plan is invalid.");
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-indigo-900">
      <div className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-md">
        <h2 className="text-center text-xl font-semibold mb-6">Validate Your Plan</h2>

        {plan ? (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="font-semibold text-lg">{plan.name}</h3>
              <p>{plan.description}</p>
              <p><strong>Date:</strong> {plan.date}</p>
            </div>

            <div className="text-center">
              <button
                onClick={handleValidate}
                className="w-full py-2 rounded-full bg-black text-white font-semibold hover:opacity-90 transition"
              >
                Validate Plan
              </button>
            </div>

            {validationStatus && (
              <div className="text-center mt-4">
                <p className="font-semibold text-lg">{validationStatus}</p>
              </div>
            )}
          </div>
        ) : (
          <p>Loading plan...</p>
        )}  
      </div>
    </div>
  );
}

export default ValidatePlan;
