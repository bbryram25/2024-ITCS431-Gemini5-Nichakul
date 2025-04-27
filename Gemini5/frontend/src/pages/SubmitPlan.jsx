import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { sciencePlan } from "../data/sciencePlan";
import { useNavigate } from 'react-router-dom';

function submit() {
  const { id } = useParams();
  const [notSubmittedPlans, setNotSubmittedPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  useEffect(() => {
    document.title = "Submit Science Plan | GEMINI5";
    if (!id) setSelectedPlan(null);
    const fetchPlans = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/science-plans");
        const data = await response.json();
        // const notSubmitted = data.filter((plan) => plan.status !== "SUBMITTED");
        const filtered = sciencePlan.filter((plan) =>
          statusFilter === "ALL" || statusFilter === "" || plan.status === statusFilter
        );
        setNotSubmittedPlans(filtered);
      } catch (error) {
        console.error("Error fetching all plans:", error);
        // setNotSubmittedPlans(
        //   sciencePlan.filter((plan) => plan.status !== "SUBMITTED")
        // );
        // const fallbackData = sciencePlan.filter((plan) => plan.status !== "SUBMITTED");
        const filteredFallback = sciencePlan.filter((plan) =>
          statusFilter === "ALL" || statusFilter === "" || plan.status === statusFilter
        );
        setNotSubmittedPlans(filteredFallback);
      }
    };

    const fetchPlanById = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/science-plans/${id}`);
        const data = await response.json();
        setSelectedPlan(data);
        setNotSubmittedPlans([data]);
      } catch (error) {
        console.error("Error fetching plan by ID:", error);
        const fallback = sciencePlan.find((p) => p.planID.toString() === id);
        if (fallback) {
          setSelectedPlan(fallback);
          setNotSubmittedPlans([fallback]);
        } else {
          setSelectedPlan(null);
          setNotSubmittedPlans([]);
        }
      }
    };

    if (id) {
      fetchPlanById();
    } else {
      fetchPlans();
    }
  }, [id, statusFilter]);

  const handleSelectPlan = (plan) => {
    // if (plan.status !== "TESTED") {
    // alert("This plan is not tested yet.");
    // return;
    // }
    setSelectedPlan(plan);
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`/submitSciencePlan/${plan.planID}`);
  };

  const handleSubmitConfirmation = async () => {
    if (!selectedPlan) {
      alert("No plan selected!");
      return;
    }
  
    if (selectedPlan.status !== "TESTED") {
      alert("Please test the science plan first before submitting.");
      return;
    }
  
    const confirmed = window.confirm("Do you want to submit this plan?");
    if (confirmed) {
      alert("Plan is submitted successfully!");
      // TODO: add API call to update plan status here
    } else {
      alert("Plan is not submitted!");
    }
  };
  

  return (
    <div className="w-screen min-h-screen p-6 bg-gradient-to-b from-gray-900 to-indigo-900 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Science Plans</h2>
        {/* {notSubmittedPlans.length !== 0 && (
          <button
            className="text-blue-600 hover:underline focus:outline-none"
            onClick={() => navigate('/submitSciencePlan')}
          >
            All
          </button>
        )} */}
        {!id && (
          <div className="flex flex-col">
            <label htmlFor="statusFilter" className="mb-1 font-medium text-white-700">
              Status
            </label>
            <select value={statusFilter} onChange={handleStatusFilterChange}>
              <option value="ALL">ALL</option>
              <option value="CREATED">CREATED</option>
              <option value="TESTED">TESTED</option>
              <option value="SUBMITTED">SUBMITTED</option>
              <option value="VALIDATED">VALIDATED</option>
              <option value="INVALIDATED">INVALIDATED</option>
              <option value="EXECUTED">EXECUTED</option>
            </select>
          </div>
        )} 
        {/* {id && selectedPlan && (
          <div className="flex justify-start mb-4">
            <button
              className="text-blue-600 hover:underline focus:outline-none"
              onClick={() => navigate('/submitSciencePlan')}
            >
              All Plans
            </button>
          </div>
        )} */}
      </div>

      {notSubmittedPlans.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <p>There is no plan.</p>
          <button
            className="text-blue-600 hover:underline focus:outline-none"
            onClick={() => navigate('/createSciPlan')}
          >
            Create a New Plan
          </button>
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
            {notSubmittedPlans.map((plan) => (
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
                    className="p-1 border rounded"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold">Funding (USD)</label>
                  <input
                    type="text"
                    name="funding"
                    value={(selectedPlan.funding || "")}
                    className="p-1 border rounded"
                  />
                </div>
                <div className="col-span-2 flex flex-col">
                  <label className="font-semibold">Objective</label>
                  <textarea
                    name="objective"
                    value={selectedPlan.objective || ""}
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
                    className="p-1 border rounded"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">End Date</label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={new Date(selectedPlan.endDate).toISOString().slice(0, 16)}
                    className="p-1 border rounded"
                  />
                </div>
              </div>
            </div>

            {/* Telescope Assigned */}
            <div className="col-span-2 border border-gray-300 rounded p-4 bg-gray-50">
              <h4 className="text-lg font-semibold mb-2">Telescope Assigned</h4>
              <input
                type="text"
                name="assignedTelescope"
                value={selectedPlan.assignedTelescope || ""}
                className="w-full p-1 border rounded"
              />
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
                    name="dataProcessing.fileType"
                    value={selectedPlan.dataProcessing?.fileType || ""}
                    className="w-full p-1 border rounded"
                  />
                </div>

                {/* File Quality */}
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">File Quality</label>
                  <input
                    type="text"
                    name="dataProcessing.fileQuality"
                    value={selectedPlan.dataProcessing?.fileQuality || ""}
                    className="w-full p-1 border rounded"
                  />
                </div>

                {/* Color Type */}
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Color Type</label>
                  <input
                    type="text"
                    name="dataProcessing.colorType"
                    value={selectedPlan.dataProcessing?.colorType || ""}
                    className="w-full p-1 border rounded"
                  />
                </div>

                {/* Contrast */}
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Contrast</label>
                  <input
                    type="number"
                    name="dataProcessing.contrast"
                    value={selectedPlan.dataProcessing?.contrast || ""}
                    className="p-1 border rounded"
                  />
                </div>

                {/* Exposure */}
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Exposure</label>
                  <input
                    type="number"
                    name="dataProcessing.exposure"
                    value={selectedPlan.dataProcessing?.exposure || ""}
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
                          name={`dataProcessing.${field}`}
                          value={selectedPlan.dataProcessing?.[field] || ""}
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
                          name={`dataProcessing.${field}`}
                          value={selectedPlan.dataProcessing?.[field] || ""}
                          className="p-1 border rounded"
                        />
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
          {selectedPlan && (
            <div className="flex justify-center space-x-4 mt-6">
              <button
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-800"
                onClick={() => navigate('/submitSciencePlan')}
              >
                Cancel
              </button>
              
              <button
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-800"
                onClick={handleSubmitConfirmation}
              >
                Confirm
              </button>
              
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default submit;