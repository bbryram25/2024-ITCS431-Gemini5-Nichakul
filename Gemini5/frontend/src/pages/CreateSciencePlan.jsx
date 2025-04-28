import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { starSystem } from "../data/starSystem"; 

export default function CreatePlan() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    
    const [form, setForm] = useState({
        // Science plan information
        creator: "astro.user",
        submitter: "",
        fundingInUSD: "",
        objectives: "",
        starSystem: "",
        startDate: "",
        endDate: "",
        telescopeLocation: "",
        // Data processing information
        fileType: "",
        fileQuality: "",
        colorType: "",
        contrast: 0,
        brightness: 0,
        saturation: 0,
        highlights: 0,
        exposure: 0,
        shadows: 0,
        whites: 0,
        blacks: 0,
        luminance: 0,
        hue: 0
    });

    const [telescopes, setTelescopes] = useState([]);

    // Predefined options for data processing
    const fileTypes = ["PNG", "JPEG", "RAW"];
    const fileQualities = ["Fine", "Low"];
    const colorTypes = ["Color mode", "B&W mode"];

    useEffect(() => {
        document.title = "Create Science Plan | GEMINI5"; 
        const fetchTelescopes = async () => {
            // try {
            //     const response = await fetch("http://localhost:8080/api/enums/assigned-telescope");
            //     if (!response.ok) throw new Error("Failed to fetch telescopes");
            //     const data = await response.json();
            //     setTelescopes(data);
            // } catch (err) {
            setTelescopes(["HAWAII", "CHILE"]);
            // }
        };

        fetchTelescopes();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const requiredFields = [
            "creator",
            "fundingInUSD",
            "objectives",
            "startDate",
            "endDate",
            "starSystem",
            "telescopeLocation",
            "fileType",
            "fileQuality",
            "colorType"
        ];

        const emptyFields = requiredFields.filter(field => !form[field]);
        if (emptyFields.length > 0) {
            setError(`Please fill in: ${emptyFields.join(", ")}`);
            return false;
        }

        const start = new Date(form.startDate);
        const end = new Date(form.endDate);
        if (end <= start) {
            setError("End date must be after start date");
            return false;
        }

        if (parseFloat(form.fundingInUSD) <= 0) {
            setError("Funding must be greater than 0");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        // Prepare the submission data
        const submissionData = JSON.stringify({
            // Science plan information
            creator: form.creator,
            submitter: form.creator,
            fundingInUSD: parseFloat(form.fundingInUSD),
            objectives: form.objectives,
            starSystem: form.starSystem,
            startDate: formatDate(new Date(form.startDate).toISOString()),
            endDate: formatDate(new Date(form.endDate).toISOString()),
            telescopeLocation: form.telescopeLocation,

            // Data processing information
            fileType: form.fileType,
            fileQuality: form.fileQuality,
            colorType: form.colorType,

            // Common fields
            contrast: parseFloat(form.contrast),
            exposure: parseFloat(form.exposure),
            // Color mode specific fields
            brightness: form.colorType === "Color mode" ? parseFloat(form.brightness) : 0,
            saturation: form.colorType === "Color mode" ? parseFloat(form.saturation) : 0,
            luminance: form.colorType === "Color mode" ? parseFloat(form.luminance) : 0,
            hue: form.colorType === "Color mode" ? parseFloat(form.hue) : 0,
            // B&W mode specific fields
            highlights: form.colorType === "B&W mode" ? parseFloat(form.highlights) : 0,
            shadows: form.colorType === "B&W mode" ? parseFloat(form.shadows) : 0,
            whites: form.colorType === "B&W mode" ? parseFloat(form.whites) : 0,
            blacks: form.colorType === "B&W mode" ? parseFloat(form.blacks) : 0
        });

        try {
            console.log("SubmissionData:", submissionData);
            const response = await fetch("http://localhost:8080/api/createSciencePlan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: submissionData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            navigate("/science-plans");
        } catch (err) {
            setError("Failed to create science plan. Please try again.");
            console.error("Error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setError(null);

    //     if (!validateForm()) {
    //         return;
    //     }

    //     setIsSubmitting(true);

    //     try {
    //         const response = await fetch("http://localhost:8080/api/science-plans", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({
    //                 // Science plan information
    //                 creator: form.creator,
    //                 submitter: form.submitter,
    //                 fundingInUSD: parseFloat(form.fundingInUSD),
    //                 objectives: form.objectives,
    //                 starSystem: form.starSystem,
    //                 startDate: new Date(form.startDate).toISOString(),
    //                 endDate: new Date(form.endDate).toISOString(),
    //                 telescopeLocation: form.telescopeLocation,

    //                 // Data processing information
    //                 fileType: form.fileType,
    //                 fileQuality: form.fileQuality,
    //                 colorType: form.colorType,

    //                 // Common fields
    //                 contrast: parseFloat(form.contrast),
    //                 exposure: parseFloat(form.exposure),
    //                 // Conditional fields based on color type
    //                 ...(form.colorType === "Color mode" 
    //                     ? {
    //                         brightness: parseFloat(form.brightness),
    //                         saturation: parseFloat(form.saturation),
    //                         luminance: parseFloat(form.luminance),
    //                         hue: parseFloat(form.hue),
    //                         // Set B&W mode fields to 0
    //                         highlights: 0,
    //                         shadows: 0,
    //                         whites: 0,
    //                         blacks: 0
    //                     } 
    //                     : {
    //                         highlights: parseFloat(form.highlights),
    //                         shadows: parseFloat(form.shadows),
    //                         whites: parseFloat(form.whites),
    //                         blacks: parseFloat(form.blacks),
    //                         // Set Color mode fields to 0
    //                         brightness: 0,
    //                         saturation: 0,
    //                         luminance: 0,
    //                         hue: 0
    //                     }
    //                 ),
    //             }),
    //         });

    //         if (!response.ok) {
    //             throw new Error(`HTTP error! status: ${response.status}`);
    //         }

    //         const result = await response.json();
    //         navigate("/science-plans");
    //     } catch (err) {
    //         setError("Failed to create science plan. Please try again.");
    //         console.error("Error:", err);
    //     } finally {
    //         setIsSubmitting(false);
    //     }
    // };

    // Define the fields to show based on color type
    const getProcessingFields = () => {
        const commonFields = [
            { name: "contrast", label: "Contrast" },
            { name: "exposure", label: "Exposure" }
        ];

        const colorModeFields = [
            { name: "brightness", label: "Brightness" },
            { name: "saturation", label: "Saturation" },
            { name: "luminance", label: "Luminance" },
            { name: "hue", label: "Hue" }
        ];

        const bwModeFields = [
            { name: "highlights", label: "Highlights" },
            { name: "shadows", label: "Shadows" },
            { name: "whites", label: "Whites" },
            { name: "blacks", label: "Blacks" }
        ];

        if (form.colorType === "Color mode") {
            return [...commonFields, ...colorModeFields];
        } else if (form.colorType === "B&W mode") {
            return [...commonFields, ...bwModeFields];
        }
        return commonFields;
    };

    return (
        <div className="w-screen min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-indigo-900 p-6">
            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-4xl space-y-4">
                <h2 className="text-xl font-semibold text-center mb-6">Create a Science Plan</h2>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        {error}
                    </div>
                )}

                {/* Basic Plan Information */}
                <div className="space-y-4 mb-6">
                    <h3 className="text-lg font-medium">Plan Information</h3>
                    
                    {/* <div className="flex items-center gap-4">
                        <label className="w-32 font-medium">Plan Name</label>
                        <input
                            name="planName"
                            type="text"
                            value={form.planName}
                            onChange={handleChange}
                            className="flex-1 px-4 py-2 border rounded-md"
                            required
                        />
                    </div> */}

                    <div className="flex items-center gap-4">
                        <label className="w-32 font-medium">Creator</label>
                        <div className="flex-1 px-4 py-2 border rounded-md bg-gray-50">
                            {form.creator}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="w-32 font-medium">Funding (USD)</label>
                        <input
                            name="fundingInUSD"
                            type="number"
                            step="0.01"
                            min="0"
                            value={form.fundingInUSD}
                            onChange={handleChange}
                            className="flex-1 px-4 py-2 border rounded-md"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="font-medium">Objective</label>
                        <textarea
                            name="objectives"
                            value={form.objectives}
                            onChange={handleChange}
                            rows={4}
                            className="px-4 py-2 border rounded-md"
                            required
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block mb-1 font-medium">Start Date</label>
                            <input
                                name="startDate"
                                type="datetime-local"
                                value={form.startDate}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md"
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block mb-1 font-medium">End Date</label>
                            <input
                                name="endDate"
                                type="datetime-local"
                                value={form.endDate}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="w-32 font-medium">Target</label>
                        <select
                            name="starSystem"
                            value={form.starSystem}
                            onChange={handleChange}
                            className="flex-1 px-4 py-2 border rounded-md"
                            required
                        >
                            <option value="">Select Target</option>
                            {starSystem.map((system) => (
                                <option key={system} value={system}>
                                    {system}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Assigned Telescope</label>
                        <div className="flex flex-wrap gap-3">
                            {telescopes.map((telescope) => (
                                <label key={telescope} className="flex items-center gap-1">
                                    <input
                                        type="radio"
                                        name="telescopeLocation"
                                        value={telescope}
                                        checked={form.telescopeLocation === telescope}
                                        onChange={handleChange}
                                        required
                                    />
                                    {telescope}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
                <br />

                {/* Data Processing Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Data Processing Configuration</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-medium">File Type</label>
                            <select
                                name="fileType"
                                value={form.fileType}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md"
                                required
                            >
                                <option value="">Select File Type</option>
                                {fileTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">File Quality</label>
                            <select
                                name="fileQuality"
                                value={form.fileQuality}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md"
                                required
                            >
                                <option value="">Select Quality</option>
                                {fileQualities.map(quality => (
                                    <option key={quality} value={quality}>{quality}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Color Type</label>
                            <select
                                name="colorType"
                                value={form.colorType}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md"
                                required
                            >
                                <option value="">Select Color Type</option>
                                {colorTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {form.colorType && (
                        <div className="grid grid-cols-2 gap-4">
                            {getProcessingFields().map(({ name, label }) => (
                                <div key={name}>
                                    <label className="block mb-1 font-medium">{label}</label>
                                    <input
                                        type="number"
                                        name={name}
                                        value={form[name]}
                                        onChange={handleChange}
                                        step="0.1"
                                        min="0"
                                        max={name === "hue" ? "1" : "2"}
                                        className="w-full px-4 py-2 border rounded-md"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                <br />

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-2 rounded-full bg-black text-white font-semibold 
                        ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'} transition`}
                >
                    {isSubmitting ? 'Creating...' : 'Create Science Plan'}
                </button>
            </form>
        </div>
    );
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}
