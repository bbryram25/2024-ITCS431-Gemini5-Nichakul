import React, { useEffect, useState } from "react";

function ValidatePlan() {
  const [submittedPlans, setSubmittedPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    document.title = "Validate Science Plan | GEMINI5";

    const plans = [
      {
        planID: "1234",
        planName: "Sample Plan",
        creator: "",
        funding: 5000.00,
        objective: "To study space dust.",
        startDate: "2025-04-30T08:00",
        endDate: "2025-05-30T08:00",
        target: "Mars",
        starSystemType: "",
        telescope: "Hawaii",
        telescopeLocation: "Hawaii",
        dataProcessing: {
          fileType: "",
          quality: "High",
          imageSettings: {
            colorType: "RGB",
            contrast: "Medium",
            brightness: "Normal",
            saturation: "High",
          },
        },
        status: "SUBMITTED",
      },
    ];
    setSubmittedPlans(plans);
  }, []);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setIsEditing(false);
    setValidationMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "funding") {
      const formattedValue = value
        .replace(/[^0-9.]/g, "")
        .replace(/^(\d+)(\.\d{0,2})?.*$/, "$1$2");

      setSelectedPlan((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    } else if (name.includes("dataProcessing.") || name.includes("imageSettings.")) {
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
      setSelectedPlan((prev) => ({
        ...prev,
        [name]: value,
      }));
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
      "telescope",
      "telescopeLocation",
      "dataProcessing.fileType",
      "dataProcessing.quality",
      "dataProcessing.imageSettings.colorType",
    ];

    const isValid = requiredFields.every((field) => {
      const fieldParts = field.split(".");
      let value = selectedPlan;
      for (const part of fieldParts) {
        value = value ? value[part] : "";
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

  const renderFormFields = (fields) => {
    return fields.map((field) => {
      if (field === "funding") {
        return (
          <div key={field} className="flex flex-col">
            <label className="block font-semibold">Funding (USD):</label>
            <input
              type="text"
              name={field}
              value={selectedPlan[field] || ""}
              onChange={handleChange}
              className="w-full p-1 border rounded"
              disabled={!isEditing}
              placeholder="Enter funding"
            />
          </div>
        );
      }

      if (field === "telescope" || field === "telescopeLocation") {
        return (
          <div key={field} className="flex flex-col">
            <label className="block font-semibold capitalize">{field.replace(/([A-Z])/g, " $1")}:</label>
            <select
              name={field}
              value={selectedPlan[field] || ""}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full p-1 border rounded"
            >
              <option value="">Select a location</option>
              <option value="Hawaii">Hawaii</option>
              <option value="Chile">Chile</option>
            </select>
          </div>
        );
      }

      if (field.includes(".")) {
        const keys = field.split(".");
        let value = selectedPlan;
        keys.forEach((key) => (value = value ? value[key] : ""));

        return (
          <div key={field} className="flex flex-col">
            <label className="block font-semibold capitalize">{field.replace(/\./g, " > ")}</label>
            <input
              type="text"
              name={field}
              value={value}
              onChange={handleChange}
              className="w-full p-1 border rounded"
              disabled={!isEditing}
            />
          </div>
        );
      }

      return (
        <div key={field} className="flex flex-col">
          <label className="block font-semibold capitalize">{field.replace(/([A-Z])/g, " $1")}:</label>
          <input
            type={field.includes("Date") ? "datetime-local" : "text"}
            name={field}
            value={selectedPlan[field] || ""}
            onChange={handleChange}
            className="w-full p-1 border rounded"
            disabled={!isEditing}
          />
        </div>
      );
    });
  };

  return (
    <div className="w-screen min-h-screen p-6 bg-gradient-to-b from-gray-900 to-indigo-900 text-white">
      <h2 className="text-2xl font-bold mb-6">Submitted Science Plans</h2>

      {submittedPlans.length === 0 ? (
        <p>No submitted science plans.</p>
      ) : (
        <table className="w-full table-auto text-black bg-white rounded-xl mb-6">
          <thead>
            <tr className="text-left">
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
              <tr key={plan.planID}>
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
          <h3 className="text-xl font-semibold mb-2">Reviewing Plan: {selectedPlan.planName}</h3>

          <div className="grid grid-cols-2 gap-4">
            {renderFormFields([
              "creator",
              "funding",
              "objective",
              "starSystemType",
              "startDate",
              "endDate",
              "target",
              "telescope",
              "telescopeLocation",
              "dataProcessing.fileType",
              "dataProcessing.quality",
              "dataProcessing.imageSettings.colorType",
            ])}
          </div>

          <div className="text-center mt-6">
            <button
              onClick={handleValidate}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-800"
            >
              {isEditing ? "Validate Again" : "Validate Plan"}
            </button>
          </div>

          <button
            onClick={toggleEditMode}
            className="mt-2 px-6 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-800"
          >
            {isEditing ? "Cancel Edit" : "Edit Plan"}
          </button>

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
