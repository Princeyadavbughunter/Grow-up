import React from "react";
import { HiDotsVertical } from "react-icons/hi";
import { IoLocationSharp } from "react-icons/io5";
import { FaLinkedin, FaInstagramSquare } from "react-icons/fa";
import {
    TiSocialFacebook,
    TiSocialTwitter,
} from "react-icons/ti";
import { Button } from "@/components/ui/button";
import { ImUsers } from "react-icons/im";
import { FaMessage } from "react-icons/fa6";


const ProfileData = () => {
    return (
        <div className="py-4 ">
            <div className="flex flex-wrap items-center gap-5 py-6">
                <img
                    src="https://via.placeholder.com/80"
                    alt="Profile"
                    className="w-20 h-20 rounded-full border border-gray-300"
                />
                <div className="flex-1">
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-10">
                        <h3 className="font-medium text-lg sm:text-xl">Anshi Gupta</h3>
                        <HiDotsVertical className="text-gray-500" />
                    </div>
                    <p className="text-gray-500 text-sm sm:text-base">
                        Founder - Finzie | Ex Groww | BITS Pilani
                    </p>
                    <p className="text-gray-500 text-sm sm:text-base flex items-center gap-1">
                        <IoLocationSharp /> Lakshman Puri, Delhi
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-6">
                <div className="flex-1 text-center sm:text-left">
                    <div>
                        <p className="flex flex-wrap  gap-2 font-semibold">
                            <button className=" font-medium rounded-full px-3 py-1 text-xs sm:text-sm border">
                                Ui/Ux Designer
                            </button>
                            <button className=" font-medium rounded-full px-3 py-1 text-xs sm:text-sm border">
                                Graphic Designing
                            </button>
                        </p>
                    </div>

                    <div className="text-[#979797] flex justify-center sm:justify-start gap-4 py-5">
                        <FaLinkedin size={32} />
                        <TiSocialTwitter size={32} />
                        <FaInstagramSquare size={32} />
                        <TiSocialFacebook size={32} />
                    </div>

                    <div>
                        <p className="flex flex-wrap gap-2 font-semibold">
                            <Button className="bg-[#7052FF] text-white font-medium flex items-center gap-1 px-4 py-2 rounded">
                                <ImUsers /> 1k Followers
                            </Button>
                            <Button className="bg-white font-medium border border-[#7052FF] text-[#7052FF] flex items-center gap-1 px-4 py-2 rounded">
                                <FaMessage /> Open Inbox
                            </Button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileData;
