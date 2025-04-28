import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { sciencePlan } from "../data/sciencePlan";
import { useNavigate } from "react-router-dom";

function ValidatePlan() {
  const { id } = useParams();
  const [submittedPlans, setSubmittedPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  // const [isEditing, setIsEditing] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Validate Science Plan | GEMINI5";
    if (!id) setSelectedPlan(null);
    const fetchPlans = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/sciencePlans");
        const data = await response.json();
        const plans = data.data;
        const submitted = plans.filter((plan) => plan.status === "SUBMITTED");
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
        const response = await fetch(
          `http://localhost:8080/api/sciencePlan/${id}`
        );
        const data = await response.json();
        const plans = data.data;
        setSelectedPlan(plans);
        setSubmittedPlans([plans]);
      } catch (error) {
        console.error("Error fetching plan by ID:", error);
        const fallback = sciencePlan.find((p) => p.planNo.toString() === id);
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
    // setIsEditing(false);
    setValidationMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`/validateSciencePlan/${plan.planNo}`);
  };

  const handleValidate = async () => {
    const baseRequiredFields = [
      "creator",
      "fundingInUSD",
      "objectives",
      "starSystem",
      "startDate",
      "endDate",
      "telescopeLocation",
      "dataProcRequirements.fileType",
      "dataProcRequirements.fileQuality",
      "dataProcRequirements.colorType",
      "dataProcRequirements.contrast",
      "dataProcRequirements.exposure",
    ];

    // Fields for "Color mode" and "Black and White mode"
    const colorModeFields = [
      "dataProcRequirements.brightness",
      "dataProcRequirements.saturation",
      "dataProcRequirements.luminance",
      "dataProcRequirements.hue",
    ];

    const bwModeFields = [
      "dataProcRequirements.highlights",
      "dataProcRequirements.shadows",
      "dataProcRequirements.whites",
      "dataProcRequirements.blacks",
    ];

    let requiredFields = [...baseRequiredFields];

    // Adjust required fields based on the selected color mode
    const colorType = selectedPlan.dataProcRequirements?.[0]?.colorType;
    if (colorType === "Color mode") {
      requiredFields.push(...colorModeFields);
    } else if (colorType === "B&W mode") {
      requiredFields.push(...bwModeFields);
    }
    console.log(selectedPlan.dataProcRequirements);

    // Collect missing fields
    const missingFields = requiredFields.filter((field) => {
      const keys = field.split(".");
      let value = selectedPlan;

      // Check if dataProcRequirements exists and is an array before accessing
      if (
        keys[0] === "dataProcRequirements" &&
        Array.isArray(selectedPlan.dataProcRequirements)
      ) {
        value = selectedPlan.dataProcRequirements[0];
        keys.shift(); // Remove the "dataProcRequirements" key from the path
      }

      // Traverse the remaining keys
      for (const key of keys) {
        value = value ? value[key] : undefined;
      }

      return value === undefined || value === null;
    });

    if (selectedPlan.startDate && selectedPlan.endDate) {
      const start = new Date(selectedPlan.startDate);
      const end = new Date(selectedPlan.endDate);
      if (start >= end) {
        alert("Start Date cannot be after the End Date.");
        setValidationMessage(
          <>
            <div className="text-red-600 font-bold">Validate failed.</div>
            <div>Start Date cannot be after the End Date.</div>
          </>
        );
        setSelectedPlan((prev) => ({ ...prev, status: "INVALIDATED" }));
        // setIsEditing(true);
        return;
      }
    }

    if (missingFields.length > 0) {
      const missingFieldsList = missingFields
        .map((field) => field.replace("dataProcRequirements.", ""))
        .join(", ");
      alert(`The following fields are missing: ${missingFieldsList}`);

      setValidationMessage(
        <>
          <div className="text-red-600 font-bold">Validate failed.</div>
          <div>
            The observer must review and correct the plan before revalidating.
          </div>
        </>
      );
      setSelectedPlan((prev) => ({ ...prev, status: "INVALIDATED" }));
      // setIsEditing(true);
    } else {
      try {
        const response = await fetch(`http://localhost:8080/api/validateSciencePlan/${selectedPlan.planNo}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to validate science plan.");
        }

        alert(
          `Science Plan ID ${selectedPlan.planNo} has been successfully validated.`
        );
        setValidationMessage(
          `Validate Science Plan Succeed ID: ${selectedPlan.planNo}`
        );
        setSelectedPlan((prev) => ({ ...prev, status: "VALIDATED" }));
      } catch (error) {
        console.error(error);
        alert("Error validating the science plan.");
      }
    }
  };

  // const toggleEditMode = () => {
  //   setIsEditing((prev) => !prev);
  //   setValidationMessage("");
  // };

  return (
    <div className="w-screen min-h-screen p-6 bg-gradient-to-b from-gray-900 to-indigo-900 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-center">Validate Science Plan</h2>
        {submittedPlans.length !== 0}
      </div>

      {submittedPlans.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <p>There are currently no submitted science plans.</p>
        </div>
      ) : (
        <table className="w-full table-auto text-black bg-white rounded-xl mb-6">
          <thead>
            <tr className="text-center">
              <th className="p-2">Plan No.</th>
              {/* <th className="p-2">Plan Name</th> */}
              <th className="p-2">Creator</th>
              <th className="p-2">Funding</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {submittedPlans.map((plan) => (
              <tr key={plan.planNo} className="text-center">
                <td className="p-2">{plan.planNo}</td>
                {/* <td className="p-2">{plan.planName}</td> */}
                <td className="p-2">{plan.creator || "-"}</td>
                <td className="p-2">
                  ${parseFloat(plan.fundingInUSD).toFixed(2)}
                </td>
                <td className="p-2">{plan.status}</td>
                <td className="p-2">
                  <button
                    className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-800"
                    onClick={() => handleSelectPlan(plan)}
                  >
                    Validate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedPlan && (
        <div className="bg-white text-black p-6 rounded-xl shadow-md space-y-4">
          <h3 className="text-xl font-semibold mb-2">Reviewing Plan</h3>
          <div className="grid grid-cols-2 gap-6">
            {/* Plan Metadata */}
            <div className="col-span-2 border border-gray-300 rounded p-4 bg-gray-50">
              <h4 className="text-lg font-semibold mb-2">
                Plan No. {selectedPlan.planNo}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="font-semibold">Creator</label>
                  <input
                    type="text"
                    name="creator"
                    defaultValue={selectedPlan.creator || ""}
                    // onChange={handleChange}
                    // disabled={!isEditing}
                    className="p-1 border rounded"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold">Funding (USD)</label>
                  <input
                    type="text"
                    name="funding"
                    // value={(selectedPlan.funding || "")}
                    defaultValue={
                      selectedPlan.fundingInUSD
                        ? `$${parseFloat(selectedPlan.fundingInUSD).toFixed(2)}`
                        : ""
                    }
                    className="p-1 border rounded"
                  />
                </div>
                <div className="col-span-2 flex flex-col">
                  <label className="font-semibold">Objective</label>
                  <textarea
                    name="objectives"
                    defaultValue={selectedPlan.objectives || ""}
                    // onChange={handleChange}
                    // disabled={!isEditing}
                    className="p-2 border rounded resize-none overflow-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Star System */}
            <div className="col-span-2 border border-gray-300 rounded p-4 bg-gray-50">
              <h4 className="text-lg font-semibold mb-2">
                Star System (Target)
              </h4>
              <input
                type="text"
                name="starSystem"
                defaultValue={selectedPlan.starSystem || ""}
                // onChange={handleChange}
                // disabled={!isEditing}
                className="w-full p-1 border rounded"
              />
            </div>

            {/* Schedule Availability */}
            <div className="col-span-2 border border-gray-300 rounded p-4 bg-gray-50">
              <h4 className="text-lg font-semibold mb-2">
                Schedule Availability
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Start Date</label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    defaultValue={new Date(selectedPlan.startDate)
                      .toISOString()
                      .slice(0, 16)}
                    // onChange={handleChange}
                    // disabled={!isEditing}
                    className="p-1 border rounded"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">End Date</label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    defaultValue={new Date(selectedPlan.endDate)
                      .toISOString()
                      .slice(0, 16)}
                    // onChange={handleChange}
                    // disabled={!isEditing}
                    className="p-1 border rounded"
                  />
                </div>
              </div>
            </div>

            {/* Telescope Assigned */}
            <div className="col-span-2 border border-gray-300 rounded p-4 bg-gray-50">
              <h4 className="text-lg font-semibold mb-2">Telescope Location</h4>
              <select
                name="assignedTelescope"
                defaultValue={selectedPlan.telescopeLocation || ""}
                // onChange={handleChange}
                // disabled={!isEditing}
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
                  <input
                    type="text"
                    name="fileType"
                    defaultValue={
                      selectedPlan.dataProcRequirements?.[0]?.fileType || ""
                    }
                    // onChange={handleChange}
                    // disabled={!isEditing}
                    className="p-1 border rounded"
                    placeholder="Enter File Type"
                  />
                </div>

                {/* File Quality */}
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">File Quality</label>
                  <input
                    type="text"
                    name="fileQuality"
                    defaultValue={
                      selectedPlan.dataProcRequirements?.[0]?.fileQuality || ""
                    }
                    // onChange={handleChange}
                    // disabled={!isEditing}
                    className="p-1 border rounded"
                    placeholder="Enter File Quality"
                  />
                </div>

                {/* Color Type */}
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Color Type</label>
                  <input
                    type="text"
                    name="colorType"
                    defaultValue={
                      selectedPlan.dataProcRequirements?.[0]?.colorType || ""
                    }
                    // onChange={handleChange}
                    // disabled={!isEditing}
                    className="p-1 border rounded"
                    placeholder="Enter Color Type"
                  />
                </div>

                {/* Contrast */}
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Contrast</label>
                  <input
                    type="number"
                    step="0.01"
                    name="dataProcRequirements.contrast"
                    defaultValue={
                      selectedPlan.dataProcRequirements?.[0]?.contrast || ""
                    }
                    // onChange={handleChange}
                    // disabled={!isEditing}
                    className="p-1 border rounded"
                  />
                </div>

                {/* Exposure */}
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Exposure</label>
                  <input
                    type="number"
                    step="0.01"
                    name="dataProcRequirements.exposure"
                    defaultValue={
                      selectedPlan.dataProcRequirements?.[0]?.exposure || ""
                    }
                    // onChange={handleChange}
                    // disabled={!isEditing}
                    className="p-1 border rounded"
                  />
                </div>

                {/* Show only for Color mode */}
                {selectedPlan.dataProcRequirements?.[0]?.colorType ===
                  "Color mode" && (
                  <>
                    {["brightness", "saturation", "luminance", "hue"].map(
                      (field) => (
                        <div className="flex flex-col" key={field}>
                          <label className="font-semibold mb-1">
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            name={`dataProcRequirements.${field}`}
                            defaultValue={
                              selectedPlan.dataProcRequirements?.[0]?.[field] ||
                              ""
                            }
                            // onChange={handleChange}
                            // disabled={!isEditing}
                            className="p-1 border rounded"
                          />
                        </div>
                      )
                    )}
                  </>
                )}

                {/* Show only for Black and White mode */}
                {selectedPlan.dataProcRequirements?.[0]?.colorType ===
                  "Black and White mode" && (
                  <>
                    {["highlights", "shadows", "whites", "blacks"].map(
                      (field) => (
                        <div className="flex flex-col" key={field}>
                          <label className="font-semibold mb-1">
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            name={`dataProcRequirements.${field}`}
                            defaultValue={
                              selectedPlan.dataProcRequirements?.[0]?.[field] ||
                              ""
                            }
                            // onChange={handleChange}
                            // disabled={!isEditing}
                            className="p-1 border rounded"
                          />
                        </div>
                      )
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-4">
            {/* <button
              className="px-6 py-3 !bg-red-700 text-white rounded hover:!bg-red-800 font-semibold"
              onClick={() => {
                alert(
                  `Science Plan No ${selectedPlan.planNo} has been marked as INVALIDATED.`
                );
                setSelectedPlan((prev) => ({ ...prev, status: "INVALID" }));
                setValidationMessage(
                  `Science Plan No ${selectedPlan.planNo} marked as INVALIDATED`
                );
              }}
            >
              Invalidated
            </button> */}
            <button
              className="px-6 py-3 !bg-red-700 text-white rounded hover:!bg-red-800 font-semibold"
              onClick={async () => {
                try {
                  const response = await fetch(`http://localhost:8080/api/invalidateSciencePlan/${selectedPlan.planNo}`,
                    {
                      method: "GET",
                      credentials: "include",
                    }
                  );

                  if (!response.ok) {
                    throw new Error("Failed to validate science plan.");
                  }

                  alert(
                    `Science Plan No ${selectedPlan.planNo} has been marked as INVALIDATED.`
                  );
                  setSelectedPlan((prev) => ({ ...prev, status: "INVALID" }));
                  setValidationMessage(
                    `Science Plan No ${selectedPlan.planNo} marked as INVALIDATED`
                  );
                } catch (error) {
                  console.error(error);
                  alert("Error validating the science plan.");
                }
              }}
            >
              Invalidated
            </button>

            <button
              className="px-6 py-3 !bg-blue-900 text-white rounded hover:!bg-green-800 font-semibold"
              onClick={handleValidate}
            >
              Validate
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
