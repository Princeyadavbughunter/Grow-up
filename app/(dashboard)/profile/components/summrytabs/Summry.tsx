import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { CiEdit } from "react-icons/ci";
import { FaHeart, FaCommentDots, FaEye, FaShare } from 'react-icons/fa';
import { HiDotsVertical } from 'react-icons/hi';
import { IoMdAdd } from "react-icons/io";
import { FaUserPlus } from "react-icons/fa";
import { ImMail4 } from "react-icons/im";
import { FaLaptopCode } from "react-icons/fa6";
import SummaryData from './SummaryData';
import MyExperience from './MyExperience';
import MyEducation from './MyEducation';
import Myskills from './Myskills';
import Portfolios from './Portfolios';
import Posts from './Posts';
import OtherSimilerPorfile from './OtherSimilerPorfile';
import Clubs from './Clubs';

const Summry = () => {
    const [activeJobTypeTab, setActiveJobTypeTab] = useState<string>("About");

    return (
        <div className='w-full'>
            <div className="flex space-x-4">
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

            <div className="flex justify-between gap-10">
                <div className="">
                    <SummaryData />
                    <MyExperience />
                    <MyEducation />
                    <Myskills />
                    <Portfolios />
                    <Posts />

                </div>

                <div className="div">
                    <OtherSimilerPorfile />
                    <Clubs />
                </div>
            </div>
        </div >
    )
}

export default Summry