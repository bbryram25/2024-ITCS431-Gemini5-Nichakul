import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ValidatePlan() {
  const { id } = useParams();
  const [submittedPlans, setSubmittedPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    document.title = "Validate Science Plan | GEMINI5";
    fetchPlans();
  }, []);

  useEffect(() => {
    document.title = "Validate Science Plan | GEMINI5";
    fetchPlanById();
  }, [id]);

  const fetchPlanById = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/science-plans/${id}`);
      const data = await response.json();
      setSelectedPlan(data);
      setSubmittedPlans([data]); // Optional: show in table
    } catch (error) {
      console.error("Error fetching plan by ID:", error);
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/science-plans"); // your real API endpoint
      const data = await response.json();
      const submitted = data.filter((plan) => plan.status === "SUBMITTED");
      setSubmittedPlans(submitted);
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };


  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setIsEditing(false);
    setValidationMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "funding") {
      const formattedValue = value.replace(/[^0-9.]/g, "").replace(/^([0-9]*\.?[0-9]{0,2}).*/, "$1");
      setSelectedPlan((prev) => ({ ...prev, [name]: formattedValue }));
    } else if (name.includes(".")) {
      const keys = name.split(".");
      setSelectedPlan((prev) => {
        const updated = { ...prev };
        let ref = updated;
        for (let i = 0; i < keys.length - 1; i++) {
          ref = ref[keys[i]];
        }
        ref[keys[keys.length - 1]] = value;
        return updated;
      });
    } else {
      setSelectedPlan((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleValidate = () => {
    const requiredFields = [
      "creator",
      "funding",
      "objective",
      "starSystemType",
      "startDate",
      "endDate",
      "telescopeLocation",
      "dataProcessing.fileType",
      "dataProcessing.quality",
      "dataProcessing.imageSettings.colorType",
      "dataProcessing.imageSettings.contrast",
      "dataProcessing.imageSettings.brightness",
      "dataProcessing.imageSettings.saturation",
    ];

    const isValid = requiredFields.every((field) => {
      const keys = field.split(".");
      let value = selectedPlan;
      for (const key of keys) {
        value = value ? value[key] : "";
      }
      return Boolean(value);
    });

    if (isValid) {
      setValidationMessage(`Validate Science Plan Succeed ID: ${selectedPlan.planID}`);
      setSelectedPlan((prev) => ({ ...prev, status: "VALIDATED" }));
      setIsEditing(false);
    } else {
      setValidationMessage(
        <>
          <div className="text-red-600 font-bold">Validate failed.</div>
          <div>The observer must review and correct the plan before revalidating.</div>
        </>
      );
      setSelectedPlan((prev) => ({ ...prev, status: "INVALIDATED" }));
      setIsEditing(true);
    }
  };

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
    setValidationMessage("");
  };

  const renderField = (label, fieldPath, type = "text") => {
    const value = fieldPath.split(".").reduce((obj, key) => obj?.[key] ?? "", selectedPlan);

    if (fieldPath === "telescopeLocation") {
      return (
        <div key={fieldPath} className="flex flex-col">
          <label className="block font-semibold">Telescope Location</label>
          <select
            name={fieldPath}
            value={value}
            onChange={handleChange}
            className="w-full p-1 border rounded"
            disabled={!isEditing}
          >
            <option value="">Select Location</option>
            <option value="Hawaii">Hawaii</option>
            <option value="Chile">Chile</option>
          </select>
        </div>
      );
    }
    if (fieldPath === "objective") {
      return (
        <div key={fieldPath} className="flex flex-col">
          <label className="block font-semibold">{label}</label>
          <textarea
            name={fieldPath}
            value={value}
            onChange={(e) => {
              handleChange(e);
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            className="w-full p-2 border rounded resize-none overflow-hidden"
            disabled={!isEditing}
          />
        </div>
      );
    }
    return (
      <div key={fieldPath} className="flex flex-col">
        <label className="block font-semibold">{label}</label>
        <input
          type={type}
          name={fieldPath}
          value={value}
          onChange={handleChange}
          className="w-full p-1 border rounded"
          disabled={!isEditing}
        />
      </div>
    );
  };

  return (
    <div className="w-screen min-h-screen p-6 bg-gradient-to-b from-gray-900 to-indigo-900 text-white">
      <h2 className="text-2xl font-bold mb-6">Submitted Science Plans</h2>

      {submittedPlans.length === 0 ? (
        <p>No submitted science plans.</p>
      ) : (
        <table className="w-full table-auto text-black bg-white rounded-xl mb-6">
          <thead>
            <tr className="text-center">
              <th className="p-2">Plan ID</th>
              <th className="p-2">Plan Name</th>
              <th className="p-2">Creator</th>
              <th className="p-2">Funding</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {submittedPlans.map((plan) => (
              <tr key={plan.planID} className="text-center">
                <td className="p-2">{plan.planId}</td>
                <td className="p-2">{plan.planName}</td>
                <td className="p-2">{plan.creator || "-"}</td>
                <td className="p-2">${parseFloat(plan.funding).toFixed(2)}</td>
                <td className="p-2">{plan.status}</td>
                <td className="p-2">
                  <button
                    className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-800"
                    onClick={() => handleSelectPlan(plan)}
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedPlan && (
        <div className="bg-white text-black p-6 rounded-xl shadow-md space-y-4">
          <h3 className="text-xl font-semibold mb-2">Reviewing Plan: {selectedPlan.planName}</h3>

          <div className="grid grid-cols-2 gap-6">
            {/* Plan Metadata */}
            <div className="col-span-2 border border-gray-300 rounded p-4 bg-gray-50 text-black">
              <h4 className="text-lg font-semibold mb-2">Plan Metadata</h4>
              <div className="grid grid-cols-2 gap-4">
                {renderField("Creator", "creator")}
                {renderField("Funding (USD)", "funding")}
                <div className="col-span-2">
                  {renderField("Objective", "objective", "textarea")}
                </div>

              </div>
            </div>

            {/* Star System */}
            <div className="col-span-2 border border-gray-300 rounded p-4 bg-gray-50 text-black">
              <h4 className="text-lg font-semibold mb-2">Star System</h4>
              <div className="grid grid-cols-2 gap-4">
                {renderField("Star System Type", "starSystemType")}
              </div>
            </div>

            {/* Schedule Availability */}
            <div className="col-span-2 border border-gray-300 rounded p-4 bg-gray-50 text-black">
              <h4 className="text-lg font-semibold mb-2">Schedule Availability</h4>
              <div className="grid grid-cols-2 gap-4">
                {renderField("Start Date", "startDate", "datetime-local")}
                {renderField("End Date", "endDate", "datetime-local")}
              </div>
            </div>

            {/* Telescope Location */}
            <div className="col-span-2 border border-gray-300 rounded p-4 bg-gray-50 text-black">
              <h4 className="text-lg font-semibold mb-2">Telescope Location</h4>
              <div className="grid grid-cols-2 gap-4">
                {renderField("Location", "telescopeLocation")}
              </div>
            </div>

            {/* Data Processing */}
            <div className="col-span-2 border border-gray-300 rounded p-4 bg-gray-50 text-black">
              <h4 className="text-lg font-semibold mb-2">Data Processing</h4>
              <div className="grid grid-cols-2 gap-4">
                {renderField("File Type", "dataProcessing.fileType")}
                {renderField("Quality", "dataProcessing.quality")}
                {renderField("Color Type", "dataProcessing.imageSettings.colorType")}
                {renderField("Contrast", "dataProcessing.imageSettings.contrast")}
                {renderField("Brightness", "dataProcessing.imageSettings.brightness")}
                {renderField("Saturation", "dataProcessing.imageSettings.saturation")}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={toggleEditMode}
              className={`px-6 py-2 rounded text-white font-semibold ${isEditing ? "bg-indigo-500 hover:bg-indigo-700" : "bg-emerald-500 hover:bg-emerald-700"
                }`}
            >
              {isEditing ? "Cancel Edit" : "Edit Plan"}
            </button>
            <button
              onClick={handleValidate}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-800"
            >
              {isEditing ? "Validate Again" : "Validate Plan"}
            </button>
          </div>

          {validationMessage && (
            <div className="text-center mt-4 text-lg font-medium">
              {validationMessage}
            </div>
          )}
        </div>
      )}
        </div>
      );
}

      export default ValidatePlan;
