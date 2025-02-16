import React from 'react'
import { CiEdit } from 'react-icons/ci'

const SummaryData = () => {
    return (
        <div>
            <p className='flex items-center py-4 font-semibold gap-5'>Summary <CiEdit /></p>
            <div className="bg-[#F6F8FF] shadow-sm rounded-lg p-4">
                <p>MY Jounrney</p>

                <div className='py-2'>
                    <p className="flex flex-wrap gap-2 font-semibold">
                        <button className=" font-medium rounded-full px-3 py-1 text-xs sm:text-sm border">
                            Ui/Ux Designer
                        </button>
                        <button className=" font-medium rounded-full px-3 py-1 text-xs sm:text-sm border">
                            Graphic Designing
                        </button>
                    </p>
                </div>

                <p className='text-[#6A737D]'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
            </div>
        </div>
    )
}

export default SummaryData