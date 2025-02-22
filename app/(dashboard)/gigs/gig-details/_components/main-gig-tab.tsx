
import React, { useState } from 'react'
import Sidebar from '../../components/AllGigs'

const MyGigs = () => {
    return <div>My Gigs Content</div>
}

const ExploreGigs = () => {
    return <div>Explore Gigs Content</div>
}

const MainGigsTab = () => {
    const [activeTab, setActiveTab] = useState('myGigs')

    const handleTabSwitch = (tab: any) => {
        setActiveTab(tab)
    }

    return (
        <div className='p-6 bg-white rounded-lg  border max-w-[500px]'>
            <div className="tabs flex justify-center gap-10">
                <button
                    className={`${activeTab === 'myGigs' ? 'text-[#7052FF] text-sm font-semibold' : 'text-sm font-semibold'
                        }`}
                    onClick={() => handleTabSwitch('myGigs')}
                >
                    My Gigs
                </button>
                <button
                    className={`${activeTab === 'exploreGigs' ? 'text-[#7052FF] text-sm font-semibold' : 'text-sm font-semibold'
                        }`}
                    onClick={() => handleTabSwitch('exploreGigs')}
                >
                    Explore Gigs
                </button>
            </div>

            <div className="tab-content ">
                {activeTab === 'myGigs' && <Sidebar />}
                {activeTab === 'exploreGigs' && <ExploreGigs />}
            </div>
        </div>
    )
}

export default MainGigsTab
