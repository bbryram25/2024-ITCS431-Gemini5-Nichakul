import React, { useState, useEffect } from "react";

function CreatePlan() {
    const [form, setForm] = useState({
        planID: "",
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

    useEffect(() => {
        fetch("http://localhost:8080/api/enums/assigned-telescope")
            .then((res) => res.json())
            .then(setTelescopes);

        fetch("http://localhost:8080/api/enums/status")
            .then((res) => res.json())
            .then(setStatuses);

        fetch("http://localhost:8080/api/data-processing-options")
            .then((res) => res.json())
            .then(setDataProcessingOptions);
    }, []);

    const handleCheckboxChange = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: prev[field].includes(value)
                ? prev[field].filter((v) => v !== value)
                : [...prev[field], value],
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form);
        // POST to backend here
    };

    return (
        <div className="w-screen min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-indigo-900 p-6">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-2xl space-y-4"
            >
                <h2 className="text-xl font-semibold text-center mb-6">Create Science Plan</h2>

                {["planID", "planName", "creator", "funding", "objective", "target"].map((field) => (
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
                ))}


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
                                    checked={form.telescope === option} // Check if the current option is selected
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setForm(prev => ({
                                            ...prev,
                                            telescope: value,
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

                <div>
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
                </div>

                <button
                    type="submit"
                    className="w-full py-2 rounded-full bg-black text-white font-semibold hover:opacity-90 transition"
                >
                    Create
                </button>
            </form>
        </div>
    );
}

export default CreatePlan;
