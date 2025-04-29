import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { sciencePlan } from "../data/sciencePlan";
import { useNavigate } from "react-router-dom";

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
        const response = await fetch("http://localhost:8080/api/sciencePlans");
        const data = await response.json();
        const plans = data.data;
        // const notSubmitted = data.filter((plan) => plan.status !== "SUBMITTED");
        const filtered = plans.filter(
          (plan) =>
            statusFilter === "ALL" ||
            statusFilter === "" ||
            plan.status === statusFilter
        );
        setNotSubmittedPlans(filtered);
      } catch (error) {
        console.error("Error fetching all plans:", error);
        // setNotSubmittedPlans(
        //   sciencePlan.filter((plan) => plan.status !== "SUBMITTED")
        // );
        // const fallbackData = sciencePlan.filter((plan) => plan.status !== "SUBMITTED");
        // const filteredFallback = sciencePlan.filter(
        //   (plan) =>
        //     statusFilter === "ALL" ||
        //     statusFilter === "" ||
        //     plan.status === statusFilter
        // );
        // setNotSubmittedPlans(filteredFallback);
      }
    };

    const fetchPlanById = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/sciencePlan/${id}`
        );
        const data = await response.json();
        const plan = data.data;
        setSelectedPlan(plan);
        setNotSubmittedPlans([plan]);
      } catch (error) {
        console.error("Error fetching plan by No.:", error);
        const fallback = sciencePlan.find((p) => p.planNo.toString() === id);
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
    navigate(`/submitSciencePlan/${plan.planNo}`);
  };

  const handleSubmitConfirmation = async () => {
    if (!selectedPlan) {
      alert("No plan selected!");
      return;
    }

    if (selectedPlan.status === "SAVED") {
      alert("Please test the science plan first before submitting.");
      return;
    }else if(selectedPlan.status === "SUBMITTED" || selectedPlan.status === "VALIDATED" || selectedPlan.status === "RUNNING" || selectedPlan.status === "INVALIDATED" || selectedPlan.status === "COMPLETED"){
      alert("This plan is already submitted.");
      return;
    }else if(selectedPlan.status === "TESTED"){
    }
    
    const confirmed = window.confirm("Do you want to submit this plan?");
    if (confirmed) {
      
      // navigate('/sciencePlans');
      const updatedPlan = { ...selectedPlan, status: "SUBMITTED" };

      // Make the API call to update the plan status on the server
      try {
        const response = await fetch(
          `http://localhost:8080/api/submitSciencePlan/${selectedPlan.planNo}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        console.log("Response:", response);
        if (response.status === 200) {
          setSelectedPlan(updatedPlan); // Update the state with the new status
          // alert("Plan is submitted successfully!");
          alert("Plan is submitted successfully!");          
          navigate("/sciencePlans"); // Navigate to the science plans page

        } else {
          // alert("Failed to submit the plan. Please try again.");
        }
      } catch (error) {
        console.error("Error updating plan status:", error);
        alert("Error submitting plan. Please try again later.");
      }
    } else {
      alert("Plan is not submitted!");
      navigate("/submitSciencePlan");
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
            <label
              htmlFor="statusFilter"
              className="mb-1 font-medium text-white-700"
            >
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
            onClick={() => navigate("/createSciPlan")}
          >
            Create a New Plan
          </button>
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
            {notSubmittedPlans.map((plan) => (
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
          <h3 className="text-xl font-semibold mb-2">Reviewing Plan</h3>
          <div className="grid grid-cols-2 gap-6">
            {/* Plan Metadata */}
            <div className="col-span-2 border border-gray-300 rounded p-4 bg-gray-50">
              <h4 className="text-lg font-semibold mb-2">
                Plan No.: {selectedPlan.planNo}
              </h4>
              <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                  <label className="font-semibold">Creator</label>
                  {selectedPlan.creator || ""}
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold">Funding (USD)</label>
                  {selectedPlan.fundingInUSD ? `$${parseFloat(selectedPlan.fundingInUSD).toFixed(2)}`  : ""}
                </div>
                <label className="font-semibold">Objective</label>
                <div className="col-span-2 flex flex-col">
                  {selectedPlan.objectives || ""}
                </div>
              </div>
            </div>

            {/* Star System */}
            <div className="col-span-2 border border-gray-300 rounded p-4 bg-gray-50">
            <h4 className="text-lg font-semibold mb-2">Star System (Target)</h4>
            {selectedPlan.starSystem || ""}
            </div>

            {/* Schedule Availability */}
            <div className="col-span-2 border border-gray-300 rounded p-4 bg-gray-50">
            <h4 className="text-lg font-semibold mb-2">
                Schedule Availability
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Start Date</label>
                  {new Date(selectedPlan.startDate).toLocaleString()}
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">End Date</label>
                  {new Date(selectedPlan.endDate).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Telescope Assigned */}
            <div className="col-span-2 border border-gray-300 rounded p-4 bg-gray-50">
            <h4 className="text-lg font-semibold mb-2">Telescope Location</h4>
            {selectedPlan.telescopeLocation || ""}
            </div>

            {/* Data Processing */}
            <div className="col-span-2 border border-gray-300 rounded p-4 bg-gray-50">
              <h4 className="text-lg font-semibold mb-4">Data Processing</h4>
              <div className="grid grid-cols-2 gap-4">
                {/* File Type */}
                <div className="flex flex-col">
                <label className="font-semibold mb-1">File Type</label>
                {selectedPlan.dataProcRequirements?.[0]?.fileType || ""}
                </div>

               {/* File Quality */}
               <div className="flex flex-col">
                  <label className="font-semibold mb-1">File Quality</label>
                  {selectedPlan.dataProcRequirements?.[0]?.fileQuality || ""}
                </div>

                {/* Color Type */}
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Color Type</label>
                  {selectedPlan.dataProcRequirements?.[0]?.colorType || ""}
                </div>

                {/* Contrast */}
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Contrast</label>
                  {selectedPlan.dataProcRequirements?.[0]?.contrast || ""}
                </div>

                {/* Exposure */}
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Exposure</label>
                  {selectedPlan.dataProcRequirements?.[0]?.exposure || ""}
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
                          {selectedPlan.dataProcRequirements?.[0]?.[field] ||
                            ""}
                        </div>
                      )
                    )}
                  </>
                )}

                {/* Show only for Black and White mode */}
                {selectedPlan.dataProcRequirements?.[0]?.colorType ===
                  "B&W mode" && (
                  <>
                    {["highlights", "shadows", "whites", "blacks"].map(
                      (field) => (
                        <div className="flex flex-col" key={field}>
                          <label className="font-semibold mb-1">
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                          </label>
                          {selectedPlan.dataProcRequirements?.[0]?.[field] ||
                            ""}
                        </div>
                      )
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          {selectedPlan && (
            <div className="flex justify-center space-x-4 mt-6">
              <button
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-800"
                onClick={() => navigate("/submitSciencePlan")}
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
