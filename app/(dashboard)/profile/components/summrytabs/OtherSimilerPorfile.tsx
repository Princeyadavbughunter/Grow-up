import React from 'react'
import { FaUserPlus, FaLaptopCode } from 'react-icons/fa'
import { ImMail4 } from 'react-icons/im'

const OtherSimilerPorfile = () => {
    return (
        <div>
            <div className="mt-12">
                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Other similar profiles</h3>
                    <div className="space-y-4">
                        {Array(5).fill({
                            name: "Aryan Trivedi",
                            title: "Founder - Finzie | Ex Groww | BITS Pilani",
                            location: "Bengaluru",
                            summary: "Hi, I am Aryan - Founder at...",
                            img: "./images/p.png", // Update the path accordingly
                        }).map((profile, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-sm transition-shadow"
                            >
                                <img
                                    src={profile.img}
                                    alt={profile.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="flex flex-col">
                                    <h4 className="text-sm font-bold">{profile.name}</h4>
                                    <p className="text-xs text-gray-500">{profile.title}</p>
                                    <p className="text-xs text-gray-400">{profile.location}</p>
                                    <p className="text-xs text-gray-400 truncate">{profile.summary}</p>

                                    <div className="flex items-center gap-2 mt-2">
                                        <button className="flex items-center gap-2 text-sm font-semibold  px-4 py-1 border border-gray-400 text-gray-400 rounded-full  transition-colors">
                                            <FaUserPlus />

                                            Connect
                                        </button>
                                        <div className="text-gray-400 hover:text-gray-600 cursor-pointer">
                                            <ImMail4
                                                className="text-2xl cursor-pointer" />
                                        </div>
                                    </div>
                                </div>


                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OtherSimilerPorfile