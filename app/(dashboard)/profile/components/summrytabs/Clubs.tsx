import React from 'react'
import { FaLaptopCode } from 'react-icons/fa6'

const Clubs = () => {
    return (
        <div>
            {/* Clubs You May Like Section */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Clubs you may like</h3>
                <div className="space-y-4">
                    {Array(3).fill({
                        name: "Tech Minds",
                        members: "589 members",
                        description: "A group for tech enthusiasts. Follow a passion with people.",
                    }).map((club, index) => (
                        <div
                            key={index}
                            className="flex gap-2 items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow"
                        >
                            <div className="div">
                                <FaLaptopCode color='#7052FF' size={40} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold">{club.name}</h4>
                                <p className="text-xs text-gray-500">{club.members}</p>
                                <p className="text-xs text-gray-400 truncate">{club.description}</p>
                            </div>
                            <button className="text-sm font-semibold text-[#7052FF] px-4 py-1 border border-[#7052FF] rounded-full hover:bg-[#7052FF] hover:text-white transition-colors">
                                Join
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Clubs