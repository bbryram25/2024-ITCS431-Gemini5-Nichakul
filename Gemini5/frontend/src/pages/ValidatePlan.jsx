import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { sciencePlan } from "../data/sciencePlan";
import { useNavigate } from 'react-router-dom';

function ValidatePlan() {
  const { id } = useParams();
  const [submittedPlans, setSubmittedPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const navigate = useNavigate();

  // useEffect(() => {
  //   document.title = "Validate Science Plan | GEMINI5";
  //   fetchPlans();
  // }, []);

  // useEffect(() => {
  //   document.title = "Validate Science Plan | GEMINI5";
  //   fetchPlanById();
  // }, [id]);

  useEffect(() => {
    document.title = "Validate Science Plan | GEMINI5";
    const fetchPlans = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/science-plans");
        const data = await response.json();
        const submitted = data.filter((plan) => plan.status === "SUBMITTED");
        setSubmittedPlans(submitted);
      } catch (error) {
        console.error("Error fetching all plans:", error);
        setSubmittedPlans(
          sciencePlan.filter((plan) => plan.status === "SUBMITTED")
        );
      }
    };

    const fetchPlanById = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/science-plans/${id}`);
        const data = await response.json();
        setSelectedPlan(data);
        setSubmittedPlans([data]);
      } catch (error) {
        console.error("Error fetching plan by ID:", error);
        const fallback = sciencePlan.find((p) => p.planID.toString() === id);
        if (fallback) {
          setSelectedPlan(fallback);
          setSubmittedPlans([fallback]);
        } else {
          setSelectedPlan(null);
          setSubmittedPlans([]);
        }
      }
    };

    if (id) {
      fetchPlanById();
    } else {
      fetchPlans();
    }
  }, [id]);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setIsEditing(false);
    setValidationMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`/validate-plan/${plan.planID}`);
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
    const baseRequiredFields = [
      "creator",
      "funding",
      "objective",
      "target",
      "startDate",
      "endDate",
      "assignedTelescope",
      "dataProcessing.fileType",
      "dataProcessing.fileQuality",
      "dataProcessing.colorType",
      "dataProcessing.contrast",
      "dataProcessing.exposure",
    ];

    // Fields for "Color mode" and "Black and White mode"
    const colorModeFields = [
      "dataProcessing.brightness",
      "dataProcessing.saturation",
      "dataProcessing.luminance",
      "dataProcessing.hue",
    ];

    const bwModeFields = [
      "dataProcessing.highlights",
      "dataProcessing.shadows",
      "dataProcessing.whites",
      "dataProcessing.blacks",
    ];

    let requiredFields = [...baseRequiredFields];

    // Adjust required fields based on the selected color mode
    const colorType = selectedPlan.dataProcessing?.colorType;
    if (colorType === "Color mode") {
      requiredFields.push(...colorModeFields);
    } else if (colorType === "Black and White mode") {
      requiredFields.push(...bwModeFields);
    }

    // Collect missing fields
    const missingFields = requiredFields.filter((field) => {
      const keys = field.split(".");
      let value = selectedPlan;
      for (const key of keys) {
        value = value ? value[key] : "";
      }
      return !value;
    });

    if (missingFields.length > 0) {
      const missingFieldsList = missingFields.map((field) => field.replace("dataProcessing.", "")).join(", ");
      alert(`The following fields are missing: ${missingFieldsList}`);

      setValidationMessage(
        <>
          <div className="text-red-600 font-bold">Validate failed.</div>
          <div>The observer must review and correct the plan before revalidating.</div>
        </>
      );
      setSelectedPlan((prev) => ({ ...prev, status: "INVALIDATED" }));
      setIsEditing(true);
    } else {
      setValidationMessage(`Validate Science Plan Succeed ID: ${selectedPlan.planID}`);
      setSelectedPlan((prev) => ({ ...prev, status: "VALIDATED" }));
      setIsEditing(false);
    }
  };

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
    setValidationMessage("");
  };

  return (
    <div className="w-screen min-h-screen p-6 bg-gradient-to-b from-gray-900 to-indigo-900 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Submitted Plans</h2>
        {submittedPlans.length !== 0 
        // && (
          // <button
          //   className="text-blue-600 hover:underline focus:outline-none"
          //   onClick={() => navigate('/validate-plan')}
          // >
          //   All Plans
          // </button>
        // )
        }
      </div>


      {submittedPlans.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <p>No submitted science plans.</p>
        </div>
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
                <td className="p-2">{plan.planID}</td>
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
          <h3 className="text-xl font-semibold mb-2">
            Reviewing Plan</h3>
          <div className="grid grid-cols-2 gap-6">
            {/* Plan Metadata */}
            <div className="col-span-2 border border-gray-300 rounded p-4 bg-gray-50">
              <h4 className="text-lg font-semibold mb-2">(ID: {selectedPlan.planID}) {selectedPlan.planName}</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="font-semibold">Creator</label>
                  <input
                    type="text"
                    name="creator"
                    value={selectedPlan.creator || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="p-1 border rounded"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold">Funding (USD)</label>
                  <input
                    type="text"
                    name="funding"
                    value={(selectedPlan.funding || "")}
                    // onChange={handleChange}
                    onChange={(e) => {
                      let inputValue = e.target.value;
                      inputValue = inputValue.replace(/[^0-9.]/g, "");
                      const decimalCount = (inputValue.match(/\./g) || []).length;
                      if (decimalCount > 1) {
                        inputValue = inputValue.slice(0, inputValue.lastIndexOf('.')) + inputValue.slice(inputValue.lastIndexOf('.') + 1);
                      }
                      if (inputValue === "") {
                        inputValue = "0.00";
                      }

                      // Ensure the value always has 2 decimal places
                      if (inputValue.indexOf('.') !== -1) {
                        const parts = inputValue.split('.');
                        parts[1] = parts[1].slice(0, 2); // Limit decimals to two places
                        inputValue = parts.join('.');
                      } else {
                        // If there's no decimal, add .00 by default
                        inputValue = `${inputValue}.00`;
                      }

                      // Update the state with the formatted value
                      setSelectedPlan((prev) => ({
                        ...prev,
                        funding: inputValue
                      }));
                    }}
                    disabled={!isEditing}
                    className="p-1 border rounded"
                  />
                </div>
                <div className="col-span-2 flex flex-col">
                  <label className="font-semibold">Objective</label>
                  <textarea
                    name="objective"
                    value={selectedPlan.objective || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="p-2 border rounded resize-none overflow-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Star System */}
            <div className="col-span-2 border border-gray-300 rounded p-4 bg-gray-50">
              <h4 className="text-lg font-semibold mb-2">Star System (Target)</h4>
              <input
                type="text"
                name="starSystem"
                value={selectedPlan.target || ""}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-1 border rounded"
              />
            </div>

            {/* Schedule Availability */}
            <div className="col-span-2 border border-gray-300 rounded p-4 bg-gray-50">
              <h4 className="text-lg font-semibold mb-2">Schedule Availability</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Start Date</label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={new Date(selectedPlan.startDate).toISOString().slice(0, 16)}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="p-1 border rounded"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">End Date</label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={new Date(selectedPlan.endDate).toISOString().slice(0, 16)}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="p-1 border rounded"
                  />
                </div>
              </div>
            </div>

            {/* Telescope Assigned */}
            <div className="col-span-2 border border-gray-300 rounded p-4 bg-gray-50">
              <h4 className="text-lg font-semibold mb-2">Telescope Assigned</h4>
              <select
                name="assignedTelescope"
                value={selectedPlan.assignedTelescope || ""}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-1 border rounded"
              >
                {/* <option value="">Select Location</option> */}
                <option value="Hawaii">Hawaii</option>
                <option value="Chile">Chile</option>
              </select>
            </div>

            {/* Data Processing */}
            <div className="col-span-2 border border-gray-300 rounded p-4 bg-gray-50">
              <h4 className="text-lg font-semibold mb-4">Data Processing</h4>
              <div className="grid grid-cols-2 gap-4">
                {/* File Type */}
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">File Type</label>
                  <select
                    name="dataProcessing.fileType"
                    value={selectedPlan.dataProcessing?.fileType || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="p-1 border rounded"
                  >
                    {/* <option value="">Select File Type</option> */}
                    <option value="PNG">PNG</option>
                    <option value="JPEG">JPEG</option>
                    <option value="RAW">RAW</option>
                  </select>
                </div>

                {/* File Quality */}
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">File Quality</label>
                  <select
                    name="dataProcessing.quality"
                    value={selectedPlan.dataProcessing?.fileQuality || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="p-1 border rounded"
                  >
                    {/* <option value="">Select Quality</option> */}
                    <option value="Low">Low</option>
                    <option value="Fine">Fine</option>
                  </select>
                </div>

                {/* Color Type */}
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Color Type</label>
                  <select
                    name="dataProcessing.colorType"
                    value={selectedPlan.dataProcessing?.colorType || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="p-1 border rounded"
                  >
                    {/* <option value="">Select Color Type</option> */}
                    <option value="Color mode">Color mode</option>
                    <option value="Black and White mode">Black and White mode</option>
                  </select>
                </div>

                {/* Contrast */}
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Contrast</label>
                  <input
                    type="number"
                    step="0.01"
                    name="dataProcessing.contrast"
                    value={selectedPlan.dataProcessing?.contrast || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="p-1 border rounded"
                  />
                </div>

                {/* Exposure */}
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Exposure</label>
                  <input
                    type="number"
                    step="0.01"
                    name="dataProcessing.exposure"
                    value={selectedPlan.dataProcessing?.exposure || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="p-1 border rounded"
                  />
                </div>

                {/* Show only for Color mode */}
                {selectedPlan.dataProcessing?.colorType === "Color mode" && (
                  <>
                    {["brightness", "saturation", "luminance", "hue"].map((field) => (
                      <div className="flex flex-col" key={field}>
                        <label className="font-semibold mb-1">
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          name={`dataProcessing.${field}`}
                          value={selectedPlan.dataProcessing?.[field] || ""}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="p-1 border rounded"
                        />
                      </div>
                    ))}
                  </>
                )}

                {/* Show only for Black and White mode */}
                {selectedPlan.dataProcessing?.colorType === "Black and White mode" && (
                  <>
                    {["highlights", "shadows", "whites", "blacks"].map((field) => (
                      <div className="flex flex-col" key={field}>
                        <label className="font-semibold mb-1">
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          name={`dataProcessing.${field}`}
                          value={selectedPlan.dataProcessing?.[field] || ""}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="p-1 border rounded"
                        />
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={toggleEditMode}
              className={`px-6 py-2 rounded text-white font-semibold ${isEditing ? "bg-indigo-500 hover:bg-indigo-700" : "bg-emerald-500 hover:bg-emerald-700"
                }`}
            >
              {isEditing ? "Save Edit" : "Edit Plan"}
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
