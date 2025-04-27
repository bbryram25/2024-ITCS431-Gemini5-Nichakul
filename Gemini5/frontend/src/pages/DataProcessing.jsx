import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


function DataProcessing() {
    const [form, setForm] = useState({
        // dataProcessingID: "",
        dataProcessingName: "",
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
        hue: 0,
    });

    const [fileTypes, setFileTypes] = useState([]);
    const [fileQualities, setFileQualities] = useState([]);
    const [colorTypes, setColorTypes] = useState([]);
    const isColorMode = form.colorType === "Color mode";
    const isBWMode = form.colorType === "Black and White mode";

    const fallbackEnums = {
        fileTypes: ["PNG", "JPEG", "RAW"],
        fileQualities: ["Low", "Fine"],
        colorTypes: ["Color mode", "Black and White mode"],
    };

    // useEffect(() => {
    //     fetch("http://localhost:8080/api/enums/file-type")
    //         .then(res => res.json())
    //         .then(setFileTypes);

    //     fetch("http://localhost:8080/api/enums/file-quality")
    //         .then(res => res.json())
    //         .then(setFileQualities);

    //     fetch("http://localhost:8080/api/enums/color-type")
    //         .then(res => res.json())
    //         .then(setColorTypes);
    // }, []);

    useEffect(() => {
        const fetchEnums = async () => {
            try {
                const [typeRes, qualityRes, colorRes] = await Promise.all([
                    fetch("http://localhost:8080/api/enums/file-type"),
                    fetch("http://localhost:8080/api/enums/file-quality"),
                    fetch("http://localhost:8080/api/enums/color-type")
                ]);

                setFileTypes(typeRes.ok ? await typeRes.json() : fallbackEnums.fileTypes);
                setFileQualities(qualityRes.ok ? await qualityRes.json() : fallbackEnums.fileQualities);
                setColorTypes(colorRes.ok ? await colorRes.json() : fallbackEnums.colorTypes);
            } catch (err) {
                console.warn("Falling back to static enums due to network error:", err);
                setFileTypes(fallbackEnums.fileTypes);
                setFileQualities(fallbackEnums.fileQualities);
                setColorTypes(fallbackEnums.colorTypes);
            }
        };

        fetchEnums();
    }, []);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "number" ? parseFloat(value) : value,
        }));
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     console.log(form);
    //     // POST to backend here
    // };

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // send form data to the backend
        fetch("http://localhost:8080/api/data-processing", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        })
            .then((res) => {
                if (res.ok) {
                    navigate("/createSciPlan"); // Navigate to CreateSciPlan page
                } else {
                    // Handle error, show alert/toast
                    alert("Failed to save data processing.");
                }
            })
            .catch((error) => {
                console.error("Error saving data processing:", error);
                alert("Something went wrong.");
            });
    };


    return (
        <div className="w-screen min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-indigo-900 p-6">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-3xl space-y-4"
            >
                <h2 className="text-xl font-semibold text-center mb-6">Create Data Processing</h2>

                {/* <div className="flex items-center gap-4 mb-4">
                    <label htmlFor="dataProcessingID" className="w-48 font-medium">Data Processing ID</label>
                    <input
                        id="dataProcessingID"
                        name="dataProcessingID"
                        type="text"
                        value={form.dataProcessingID}
                        onChange={handleChange}
                        className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div> */}
                <div className="flex items-center gap-4 mb-4">
                    <label htmlFor="dataProcessingID" className="w-48 font-medium">Data Processing Name</label>
                    <input
                        id="dataProcessingName"
                        name="dataProcessingName"
                        type="text"
                        value={form.dataProcessingName}
                        onChange={handleChange}
                        className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>

                {[["fileType", fileTypes], ["fileQuality", fileQualities], ["colorType", colorTypes]].map(([field, options]) => (
                    <div key={field}>
                        <label className="block mb-1 font-medium capitalize">{field}</label>
                        <select
                            name={field}
                            value={form[field]}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md"
                            required
                        >
                            <option value="">-- Select --</option>
                            {options.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                ))}

                {(isColorMode || isBWMode) && (
                    <InputField label="Contrast" name="contrast" value={form.contrast} onChange={handleChange} />
                )}

                {isColorMode && (
                    <>
                        <InputField label="Brightness" name="brightness" value={form.brightness} onChange={handleChange} />
                        <InputField label="Saturation" name="saturation" value={form.saturation} onChange={handleChange} />
                        <InputField label="Luminance" name="luminance" value={form.luminance} onChange={handleChange} />
                        <InputField label="Hue" name="hue" value={form.hue} onChange={handleChange} />
                    </>
                )}

                {isBWMode && (
                    <>
                        <InputField label="Highlights" name="highlights" value={form.highlights} onChange={handleChange} />
                        <InputField label="Shadows" name="shadows" value={form.shadows} onChange={handleChange} />
                        <InputField label="Whites" name="whites" value={form.whites} onChange={handleChange} />
                        <InputField label="Blacks" name="blacks" value={form.blacks} onChange={handleChange} />
                    </>
                )}

                {(isColorMode || isBWMode) && (
                    <InputField label="Exposure" name="exposure" value={form.exposure} onChange={handleChange} />
                )}


                <button
                    type="submit"
                    className="w-full py-2 rounded-full bg-black text-white font-semibold hover:opacity-90 transition"
                >
                    Save Data Processing
                </button>
            </form>
        </div>
    );
}
const InputField = ({ label, name, value, onChange }) => (
    <div className="flex items-center gap-4 mb-4">
        <label htmlFor={name} className="w-48 font-medium capitalize">{label}</label>
        <input
            id={name}
            name={name}
            type="number"
            step="0.1"
            value={value}
            onChange={onChange}
            className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
        />
    </div>
);

export default DataProcessing;
