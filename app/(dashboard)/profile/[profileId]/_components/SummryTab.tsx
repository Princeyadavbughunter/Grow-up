import React, { useState } from "react";
import Summry from "./summrytabs/Summry";

interface SummryTabProps {
  profileData: ProfileData
}

const SummryTab: React.FC<SummryTabProps> = ({ profileData }) => {
    const [activeTab, setActiveTab] = useState(1);
    const userName = profileData ? `${profileData.first_name} Bio` : "Anshi Bio";

    return (
        <>
            <div className="max-w-[200px]">
                <div className="flex">
                    <button 
                        className={`flex-1 text-center py-2 font-medium ${activeTab === 1 ? "text-black border-b-2 border-black" : "text-gray-600"}`} 
                        onClick={() => setActiveTab(1)}
                    >
                        {userName}
                    </button>
                    {/* <button
                        className={`flex-1 text-center py-2 font-medium ${activeTab === 2 ? "text-black border-b-2 border-black" : "text-gray-600"}`}
                        onClick={() => setActiveTab(2)}
                    >
                        Endorsement
                    </button> */}
                </div>
            </div>
            <div className="mt-4 w-full flex justify-between">
                {activeTab === 1 && <Summry profileData={profileData} />}
            </div>
        </>
    );
};

export default SummryTab;