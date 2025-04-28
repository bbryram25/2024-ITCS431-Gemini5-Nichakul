import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sciencePlan } from "../data/sciencePlan"; 

function Detail() {
  const { id } = useParams();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Science Plan Details | GEMINI5";

    const fetchPlanById = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/sciencePlan/${id}`);
        const data = await response.json();
        setSelectedPlan(data.data);
      } catch (error) {
        console.error("Error fetching plan by ID:", error);
        const fallback = sciencePlan.find((p) => p.planID.toString() === id);
        setSelectedPlan(fallback || null);
      } finally{
        setLoading(false);
      }
    };

    if (id) {
      fetchPlanById();
    }
  }, [id]);

  const handleGoBack = () => {
    navigate("/sciencePlans");
  };

  // Function to style status color based on the status
  const getStatusColor = (status) => {
    switch (status) {
      case "TESTED":
        return "bg-green-500 text-white"; 
      case "INVALIDATED":
        return "bg-red-500 text-white"; 
      default:
        return "bg-gray-500 text-white"; 
    }
  };

  return (
    <div className="w-screen min-h-screen p-6 bg-gradient-to-b from-gray-900 to-indigo-900 text-white">
      <div className="flex justify-between items-center mb-4">
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-800"
          onClick={handleGoBack}
        >
          Back
        </button>
      </div>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : 
        (selectedPlan ? (
          <div className="flex flex-col items-center space-y-4 p-6">
            {/* Science Plan Details Title */}
            <h2 className="text-3xl font-bold text-center text-white">
              Science Plan Details
            </h2>

            <div className="bg-white text-black p-6 rounded-xl shadow-md w-full max-w-3xl">
              <h3 className="text-xl font-semibold mb-2">
                Plan No.: {selectedPlan.planNo}
              </h3>
              <div className="space-y-2">
              <div>
                <strong>Creator:</strong> {selectedPlan.creator || "N/A"}
              </div>
              <div>
                <strong>Funding:</strong> ${parseFloat(selectedPlan.fundingInUSD).toFixed(2)}
              </div>
              <div>
                <strong>Objective:</strong> {selectedPlan.objectives || "N/A"}
              </div>
              <div>
                <strong>Status:</strong> 
                <span className={`px-2 py-1 rounded-full ${getStatusColor(selectedPlan.status)}`}>
                  {selectedPlan.status}
                </span>
              </div>
              <div>
                <strong>Start Date:</strong> {new Date(selectedPlan.startDate).toLocaleString()}
              </div>
              <div>
                <strong>End Date:</strong> {new Date(selectedPlan.endDate).toLocaleString()}
              </div>
              <div>
                <strong>Star System (Target):</strong> {selectedPlan.starSystem || "N/A"}
              </div>
              <div>
                <strong>Telescope Assigned:</strong> {selectedPlan.telescopeLocation || "N/A"}
              </div>
              <div>
                <strong>File Type:</strong> {selectedPlan.dataProcRequirements?.[0]?.fileType || "N/A"}
              </div>
              <div>
                <strong>File Quality:</strong> {selectedPlan.dataProcRequirements?.[0]?.fileQuality || "N/A"}
              </div>
              <div>
                <strong>Color Type:</strong> {selectedPlan.dataProcRequirements?.[0]?.colorType || "N/A"}
              </div>
              <div>
                <strong>Contrast:</strong> {selectedPlan.dataProcRequirements?.[0]?.contrast || "N/A"}
              </div>
              <div>
                <strong>Exposure:</strong> {selectedPlan.dataProcRequirements?.[0]?.exposure || "N/A"}
              </div>

              {/* Show only for Color mode */}
              {selectedPlan.dataProcRequirements?.colorType === "Color mode" && (
                <>
                  <div>
                    <strong>Brightness:</strong> {selectedPlan.dataProcRequirements?.[0]?.brightness || "N/A"}
                  </div>
                  <div>
                    <strong>Saturation:</strong> {selectedPlan.dataProcRequirements?.[0]?.saturation || "N/A"}
                  </div>
                  <div>
                    <strong>Luminance:</strong> {selectedPlan.dataProcRequirements?.[0]?.luminance || "N/A"}
                  </div>
                  <div>
                    <strong>Hue:</strong> {selectedPlan.dataProcRequirements?.[0]?.hue || "N/A"}
                  </div>
                </>
              )}

              {/* Show only for Black and White mode */}
              {selectedPlan.dataProcRequirements?.[0]?.colorType === "B&W mode" && (
                <>
                  <div>
                    <strong>Highlights:</strong> {selectedPlan.dataProcRequirements?.[0]?.highlights || "N/A"}
                  </div>
                  <div>
                    <strong>Shadows:</strong> {selectedPlan.dataProcRequirements?.[0]?.shadows || "N/A"}
                  </div>
                  <div>
                    <strong>Whites:</strong> {selectedPlan.dataProcRequirements?.[0]?.whites || "N/A"}
                  </div>
                  <div>
                    <strong>Blacks:</strong> {selectedPlan.dataProcRequirements?.[0]?.blacks || "N/A"}
                  </div>
                </>
              )}
              </div>
            </div>
          </div>
        ) : (
            <div className="text-center text-white">
              <p>Plan details not found.</p>
            </div>
        ))
      }
    </div>
  );
}

export default Detail;
