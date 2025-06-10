// @ts-nocheck
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
    const [activeWorkType, setActiveWorkType] = useState('Domain')
    const [activeJobType, setActiveJobType] = useState('All')

    const handleTabSwitch = (tab: any) => {
        setActiveTab(tab)
    }

    const handleSelectGig = (gig: any) => {
        // Handle gig selection
        console.log('Selected gig:', gig)
    }

    const handleFilterChange = (type: string, value: string) => {
        if (type === 'work') {
            setActiveWorkType(value)
        } else if (type === 'job') {
            setActiveJobType(value)
        }
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
                {activeTab === 'myGigs' && (
                    <Sidebar 
                        gigs={[]} 
                        onSelectGig={handleSelectGig}
                        activeWorkType={activeWorkType}
                        activeJobType={activeJobType}
                        onFilterChange={handleFilterChange}
                    />
                )}
                {activeTab === 'exploreGigs' && <ExploreGigs />}
            </div>
        </div>
    )
}

export default MainGigsTab
