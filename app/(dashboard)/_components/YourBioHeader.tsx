// @ts-nocheck
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'

const YourBioHeader = () => {
    const [activeJobTypeTab, setActiveJobTypeTab] = useState<string>("About");

    return (
        <div>
            <p className='underline font-semibold'>Your bio</p>
            <div className="flex space-x-4 py-4">
                {["About", "Skills", "Porfolio", "Post"].map((tab) => (
                    <Button
                        key={tab}
                        variant={activeJobTypeTab === tab ? "default" : "ghost"}
                        className={activeJobTypeTab === tab ? "bg-[#979797] hover:bg-[#dcdcdc] rounded-full" : "rounded-full bg-[#dcdcdc]"}
                        onClick={() => setActiveJobTypeTab(tab)}
                    >
                        {tab}

                    </Button>
                ))}
            </div>
        </div>
    )
}

export default YourBioHeader