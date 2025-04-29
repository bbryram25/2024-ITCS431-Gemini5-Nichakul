import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { starSystem } from "../data/starSystem"; 
import { getUser } from "../auth";

export default function CreatePlan() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [telescopes, setTelescopes] = useState(["HAWAII", "CHILE"]);
    
    // Initialize form with empty values
    const [form, setForm] = useState({
        creator: "",
        submitter: "",
        fundingInUSD: "",
        objectives: "",
        starSystem: "",
        startDate: "",
        endDate: "",
        telescopeLocation: "",
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

    // Predefined options
    const fileTypes = ["PNG", "JPEG", "RAW"];
    const fileQualities = ["Fine", "Low"];
    const colorTypes = ["Color mode", "B&W mode"];

    useEffect(() => {
        document.title = "Create Science Plan | GEMINI5";
        
        const initializeUser = async () => {
            const currentUser = getUser();
            
            if (!currentUser) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch(`http://localhost:8080/api/staffId/${currentUser.staffId}`, {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response) {
                    console.log('response not ok');
                    const currentUser = getUser();
                    const fullName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : '';
                    
                    setForm(prev => ({
                        ...prev,
                        creator: fullName,
                        submitter: fullName
                    }));
                }

                const data = await response.json();
                if (data.success && data.data) {
                    const staffData = data.data;
                    const fullName = `${staffData.firstName} ${staffData.lastName}`;
                    
                    setForm(prev => ({
                        ...prev,
                        creator: fullName,
                        submitter: fullName
                    }));
                }
            } catch (error) {
                console.error("Error fetching staff data:", error);
                const currentUser = getUser();
                const fullName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : '';
                    
                setForm(prev => ({
                    ...prev,
                    creator: fullName,
                    submitter: fullName
                }));
                // window.alert("Failed to load user data. Please try again.");
            }
        };

        initializeUser();
    }, [navigate]);

    const getLimitForField = (fieldName) => {
        switch (fieldName) {
            case "contrast":
                return 5.0;
            case "hue":
            case "exposure":
            case "highlights":
            case "shadows":
            case "whites":
            case "blacks":
            case "brightness":
            case "saturation":
            case "luminance":
                return 50.0;
            default:
                return 50.0;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (["contrast", "exposure", "highlights", "shadows", "whites", "blacks", 
             "brightness", "saturation", "luminance", "hue"].includes(name)) {
            // Allow empty string
            if (value === "") {
                setForm(prev => ({
                    ...prev,
                    [name]: ""
                }));
                return;
            }
            
            let numValue = parseFloat(value);
            
            // Only process if it's a valid number
            if (!isNaN(numValue)) {
                // Get the limit for this field
                const limit = getLimitForField(name);
                
                // Clamp the value between 0 and the limit
                numValue = Math.max(0, Math.min(numValue, limit));
                
                setForm(prev => ({
                    ...prev,
                    [name]: numValue
                }));
            }
        } else {
            setForm(prev => ({
                ...prev,
                [name]: value
            }));
        }
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
            window.alert(`Please fill in: ${emptyFields.join(", ")}`);
            return false;
        }

        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Reset time to start of day

        const start = new Date(form.startDate);
        const end = new Date(form.endDate);

        // Check if start date is before current date
        if (start < currentDate) {
            window.alert("Start date cannot be in the past");
            return false;
        }

        // Check if end date is before current date
        if (end < currentDate) {
            window.alert("End date cannot be in the past");
            return false;
        }

        // Check if end date is before start date
        if (end <= start) {
            window.alert("End date must be after start date");
            return false;
        }

        if (parseFloat(form.fundingInUSD) <= 0) {
            window.alert("Funding must be greater than 0");
            return false;
        }
        
        return true;
    };

    const formatDateForBackend = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).replace(',', '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Convert any empty numeric fields to 0 before validation
        const formWithDefaults = {
            ...form,
            contrast: form.contrast === "" ? 0 : parseFloat(form.contrast),
            exposure: form.exposure === "" ? 0 : parseFloat(form.exposure),
            highlights: form.highlights === "" ? 0 : parseFloat(form.highlights),
            shadows: form.shadows === "" ? 0 : parseFloat(form.shadows),
            whites: form.whites === "" ? 0 : parseFloat(form.whites),
            blacks: form.blacks === "" ? 0 : parseFloat(form.blacks),
            brightness: form.brightness === "" ? 0 : parseFloat(form.brightness),
            saturation: form.saturation === "" ? 0 : parseFloat(form.saturation),
            luminance: form.luminance === "" ? 0 : parseFloat(form.luminance),
            hue: form.hue === "" ? 0 : parseFloat(form.hue)
        };

        setForm(formWithDefaults);

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const submissionData = {
                creator: form.creator,
                submitter: form.submitter,
                fundingInUSD: parseFloat(form.fundingInUSD),
                objectives: form.objectives,
                starSystem: form.starSystem,
                startDate: formatDateForBackend(form.startDate),
                endDate: formatDateForBackend(form.endDate),
                telescopeLocation: form.telescopeLocation,
                fileType: form.fileType,
                fileQuality: form.fileQuality,
                colorType: form.colorType,
                contrast: form.contrast ? parseFloat(form.contrast) : 0,
                exposure: form.exposure ? parseFloat(form.exposure) : 0,
                brightness: form.colorType === "Color mode" ? (form.brightness ? parseFloat(form.brightness) : 0) : 0,
                saturation: form.colorType === "Color mode" ? (form.saturation ? parseFloat(form.saturation) : 0) : 0,
                luminance: form.colorType === "Color mode" ? (form.luminance ? parseFloat(form.luminance) : 0) : 0,
                hue: form.colorType === "Color mode" ? (form.hue ? parseFloat(form.hue) : 0) : 0,
                highlights: form.colorType === "B&W mode" ? (form.highlights ? parseFloat(form.highlights) : 0) : 0,
                shadows: form.colorType === "B&W mode" ? (form.shadows ? parseFloat(form.shadows) : 0) : 0,
                whites: form.colorType === "B&W mode" ? (form.whites ? parseFloat(form.whites) : 0) : 0,
                blacks: form.colorType === "B&W mode" ? (form.blacks ? parseFloat(form.blacks) : 0) : 0
            };

            const response = await fetch("http://localhost:8080/api/createSciencePlan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify(submissionData),
            });
            console.log("Response:", response);
            if (response.status === 201) {
                // Success case
                window.alert("Success: Science plan created with status CREATED");
                navigate("/sciencePlans");
            } else {
                // Error case
                throw new Error("Failed to create science plan.");
            }
        } catch (err) {
            window.alert("Failed to create science plan. Please try again.");
            console.error("Error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Add loading state display if needed
    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    // Add this function to get the appropriate processing fields based on color type
    const getProcessingFields = () => {
        const commonFields = [
            { name: "contrast", label: "Contrast" },
            { name: "exposure", label: "Exposure" }
        ];

        if (form.colorType === "Color mode") {
            return [
                ...commonFields,
                { name: "brightness", label: "Brightness" },
                { name: "saturation", label: "Saturation" },
                { name: "luminance", label: "Luminance" },
                { name: "hue", label: "Hue" }
            ];
        } else if (form.colorType === "B&W mode") {
            return [
                ...commonFields,
                { name: "highlights", label: "Highlights" },
                { name: "shadows", label: "Shadows" },
                { name: "whites", label: "Whites" },
                { name: "blacks", label: "Blacks" }
            ];
        }

        return commonFields;
    };

    const getCurrentDateTime = () => {
        const now = new Date();
        return now.toISOString().slice(0, 16); // Format: YYYY-MM-DDThh:mm
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
                                min={getCurrentDateTime()}
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
                                min={getCurrentDateTime()}
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
                        <label className="block mb-1 font-medium">Telescope Location</label>
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
                                    <label className="block mb-1 font-medium">
                                        {label} (0-{getLimitForField(name)})
                                    </label>
                                    <input
                                        type="number"
                                        name={name}
                                        value={form[name]}
                                        onChange={handleChange}
                                        step="0.01"
                                        min="0"
                                        max={getLimitForField(name)}
                                        className="w-full px-4 py-2 border rounded-md"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                <br />

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/sciencePlans')}
                        className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 text-white"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        {isSubmitting ? 'Creating...' : 'Create Plan'}
                    </button>
                </div>
            </form>
        </div>
    );
}
