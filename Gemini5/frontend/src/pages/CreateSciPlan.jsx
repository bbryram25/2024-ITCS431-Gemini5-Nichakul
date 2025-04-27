import React, { useState, useEffect } from "react";
import { dataProcessing } from "../data/dataProcessing";

function CreatePlan() {
    const [form, setForm] = useState({
        // planID: "",
        planName: "",
        creator: "",
        funding: "",
        objective: "",
        startDate: "",
        endDate: "",
        target: "",
        assignedTelescope: "",
        status: "",
        dataProcessing: "",
    });

    const [telescopes, setTelescopes] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [dataProcessingOptions, setDataProcessingOptions] = useState([]);

    const fallbackTelescopes = ["Hawaii", "Chile"];
    const fallbackStatuses = ["CREATED", "TESTED", "SUBMITTED", "VALIDATED", "RUNNING", "INVALIDATED", "COMPLETE"];

    useEffect(() => {
        fetch("http://localhost:8080/api/enums/assigned-telescope")
            .then((res) => res.json())
            .then(setTelescopes)
            .catch(() => {
                console.warn("Failed to fetch from backend. Using fallback.");
                setTelescopes(fallbackTelescopes);
            });

        fetch("http://localhost:8080/api/enums/status")
            .then((res) => res.json())
            .then(setStatuses)
            .catch(() => {
                console.warn("Failed to fetch from backend. Using fallback.");
                setStatuses(fallbackStatuses);
            });

        fetch("http://localhost:8080/api/data-processing-options")
            .then((res) => res.json())
            .then(setDataProcessingOptions)
            .catch(() => {
                console.warn("Failed to fetch from backend. Using fallback.");
                setDataProcessingOptions(dataProcessing);
            });
    }, []);

    // const handleCheckboxChange = (field, value) => {
    //     setForm((prev) => ({
    //         ...prev,
    //         [field]: prev[field].includes(value)
    //             ? prev[field].filter((v) => v !== value)
    //             : [...prev[field], value],
    //     }));
    // };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(form);
        const requiredFields = [
            // "planID", "creator"
            "planName", "funding", "objective", "startDate",
            "endDate", "target", "status", "dataProcessing", "assignedTelescope"
        ];

        for (let field of requiredFields) {
            if (!form[field]) {
                alert(`Please fill in the ${field}`);
                return;
            }
        }

        const start = new Date(form.startDate);
        const end = new Date(form.endDate);

        if (start >= end) {
        alert("Start Date cannot be after the End Date.");
        return;
    }
        console.log("Saving form:", form);
        alert("New science plan has been saved successfully!");
    };

    return (
        <div className="w-screen min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-indigo-900 p-6">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-2xl space-y-4"
            >
                <h2 className="text-xl font-semibold text-center mb-6">Create a Science Plan</h2>

                {/* {["planID", "planName", "creator", "funding", "objective", "target"].map((field) => (
                    <div key={field} className="flex items-center gap-4 mb-4">
                        <label htmlFor={field} className="w-32 font-medium capitalize">
                            {field}
                        </label>
                        <input
                            id={field}
                            name={field}
                            type={field === "funding" ? "number" : "text"}
                            placeholder={field}
                            value={form[field]}
                            onChange={handleChange}
                            className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                ))} */}

                {/* Plan ID (auto-generated)*/}
                {/* <div className="flex items-center gap-4 mb-4">
                    <label htmlFor="planID" className="w-32 font-medium">Plan ID</label> */}
                    {/* <input
                        id="planID"
                        name="planID"
                        type="text"
                        value={form.planID}
                        onChange={handleChange}
                        className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                        required
                    /> */}
                {/* </div> */}

                {/* Plan Name */}
                <div className="flex items-center gap-4 mb-4">
                    <label htmlFor="planName" className="w-32 font-medium">Plan Name</label>
                    <input
                        id="planName"
                        name="planName"
                        type="text"
                        value={form.planName}
                        onChange={handleChange}
                        className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>

                {/* Creator (auto-filled) */}
                <div className="flex items-center gap-4 mb-4">
                    <label htmlFor="creator" className="w-32 font-medium">Creator</label>
                    {/* <input
                        id="creator"
                        name="creator"
                        type="text"
                        value={form.creator}
                        readOnly
                        className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                    /> */}
                </div>

                {/* Funding */}
                <div className="flex items-center gap-4 mb-4">
                    <label htmlFor="funding" className="w-32 font-medium">Funding (USD)</label>
                    <input
                        id="funding"
                        name="funding"
                        type="number"
                        step="0.01"
                        value={form.funding}
                        min="0"
                        onChange={handleChange}
                        className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>

                {/* Objective */}
                <div className="flex flex-col gap-1 mb-4">
                    <label htmlFor="objective" className="font-medium">Objective</label>
                    <textarea
                        id="objective"
                        name="objective"
                        value={form.objective}
                        onChange={handleChange}
                        rows={4}
                        className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>

                {/* Target */}
                <div className="flex items-center gap-4 mb-4">
                    <label htmlFor="target" className="w-32 font-medium">Star System (Target)</label>
                    <input
                        id="target"
                        name="target"
                        type="text"
                        value={form.target}
                        onChange={handleChange}
                        className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>


                <div className="flex gap-4">
                    <div className="flex-1">
                        <label htmlFor="startDate" className="block mb-1 font-medium">Start Date</label>
                        <input
                            id="startDate"
                            name="startDate"
                            type="datetime-local"
                            value={form.startDate}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md"
                            required
                        />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="endDate" className="block mb-1 font-medium">End Date</label>
                        <input
                            id="endDate"
                            name="endDate"
                            type="datetime-local"
                            value={form.endDate}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md"
                            required
                        />
                    </div>
                </div>


                <div>
                    <label className="block mb-1 font-medium">Assigned Telescope</label>
                    <div className="flex flex-wrap gap-3">
                        {telescopes.map((option) => (
                            <label key={option} className="flex items-center gap-1">
                                <input
                                    type="radio"
                                    value={option}
                                    checked={form.assignedTelescope === option} // Check if the current option is selected
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setForm(prev => ({
                                            ...prev,
                                            assignedTelescope: value,
                                        }));
                                    }}
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block mb-1 font-medium">Science Plan Status</label>
                    <div className="flex flex-wrap gap-3">
                        {statuses.map((option) => (
                            <label key={option} className="flex items-center gap-1">
                                <input
                                    type="radio"
                                    value={option}
                                    checked={form.status === option} // Check if the current option is selected
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setForm(prev => ({
                                            ...prev,
                                            status: value,
                                        }));
                                    }}
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                </div>

                {/* <div>
                    <label className="block mb-1 font-medium">Data Processing</label>
                    <select
                        name="dataProcessing"
                        value={form.dataProcessing}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md"
                        required
                    >
                        <option value="">-- Select an option --</option>
                        {dataProcessingOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div> */}

                <div>
                    <label className="block mb-1 font-medium">Data Processing</label>
                    <select
                        name="dataProcessing"
                        value={form.dataProcessing}
                        onChange={(e) => {
                            if (e.target.value === "create-new") {
                                // Navigate to the data-processing creation page
                                window.location.href = "/dataProcessing";
                            } else {
                                handleChange(e);
                            }
                        }}
                        className="w-full px-4 py-2 border rounded-md"
                        required
                    >
                        <option value="">-- Select an option --</option>

                        {dataProcessingOptions.length > 0 ? (
                            <>
                                {dataProcessingOptions.map((option) => (
                                    // <option key={option} value={option}>
                                    //     {option}
                                    <option
                                        key={option.dataProcessingID}
                                        value={option.dataProcessingID}
                                    >
                                        {option.dataProcessingName}
                                    </option>
                                ))}
                                <option value="create-new">Create new data processing</option>
                            </>
                        ) : (
                            <option value="create-new">Create new data processing</option>
                        )}
                    </select>
                </div>


                <button
                    type="submit"
                    className="w-full py-2 rounded-full bg-black text-white font-semibold hover:opacity-90 transition"
                >
                    Save Science Plan
                </button>
            </form>
        </div>
    );
}

export default CreatePlan;
