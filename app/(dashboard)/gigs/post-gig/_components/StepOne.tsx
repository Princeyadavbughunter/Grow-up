import { Checkbox } from "@/components/ui/checkbox";
import React, { useState, useEffect } from "react";

interface StepOneProps {
    onNext: () => void;
}

const StepOne: React.FC<StepOneProps> = ({ onNext }) => {
    const [role, setRole] = useState<string>("");

    useEffect(() => {
        // Trigger 'onNext' when the 'Enter' key is pressed
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === "Enter" && role.trim() !== "") {
                onNext();
            }
        };

        // Add the event listener
        document.addEventListener("keydown", handleKeyPress);

        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [role, onNext]);

    return (
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md overflow-y-auto h-[570px]">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Add the Role</h2>
            <p className="flex justify-between items-center">
                Mention the role you are looking for
                <span className="text-xs text-gray-500">{role.length}/120</span>
            </p>
            <textarea
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Web Designer"
                maxLength={120}
                value={role}
                onChange={(e) => setRole(e.target.value)}
            ></textarea>

            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Select Role Type</h3>
                {["Freelance", "Contract", "Collaboration", "Internship"].map((type) => (
                    <label
                        key={type}
                        className="flex items-center space-x-2 mb-3 h-12 border p-2 rounded-xl cursor-pointer"
                    >
                        <input type="radio" name="roleType" className="form-radio text-purple-500" />
                        <span className="text-gray-600">{type}</span>
                    </label>
                ))}
            </div>
            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Add Compensation</h3>
                <p className="text-xs text-gray-500">Provide the Pay amount to attract applicants</p>
                <div className="flex items-center gap-4">
                    <select className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option>Type</option>
                        <option>Hourly</option>
                    </select>
                </div>

                <div className="flex items-center mt-5 gap-2">
                    <div className="div">
                        <p>Pay</p>
                        <input
                            type="number"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="₹1000"
                        />
                    </div>
                    <div className="mt-6">
                        <input
                            type="number"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="₹1000"
                        />
                    </div>
                </div>

                <div className="mt-5">
                    <label>This Project has no compensation</label>
                    <Checkbox className="ms-2" />
                </div>
            </div>
        </div>
    );
};

export default StepOne;
