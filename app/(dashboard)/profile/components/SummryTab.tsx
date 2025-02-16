import React, { useState } from "react";
import Endorsement from "./summrytabs/Endorsement";
import Summry from "./summrytabs/Summry";


const SummryTab = () => {
    const [activeTab, setActiveTab] = useState(1);

    return (
        <>
            <div className="max-w-[200px]">
                <div className="flex">
                    <button className={`flex-1 text-center py-2 font-medium ${activeTab === 1 ? "text-black border-b-2 border-black" : "text-gray-600"}`} onClick={() => setActiveTab(1)}
                    >
                        Anshi Bio
                    </button>
                    <button
                        className={`flex-1 text-center py-2 font-medium ${activeTab === 2 ? "text-black border-b-2 border-black" : "text-gray-600"
                            }`}
                        onClick={() => setActiveTab(2)}
                    >
                        Endorsement
                    </button>
                </div>

            </div>
            <div className="mt-4 w-full flex justify-between">
                {activeTab === 1 && <Summry />}
                {activeTab === 2 && <Endorsement />}
            </div>
        </>
    );
};

export default SummryTab;
