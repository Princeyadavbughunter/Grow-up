import React from 'react'
import { CiEdit } from 'react-icons/ci'
import { FaHeart, FaCommentDots, FaEye, FaShare } from 'react-icons/fa'
import { HiDotsVertical } from 'react-icons/hi'

const Posts = () => {
    return (
        <div>
            <div className="mb-28">
                <div className="flex items-center gap-4 mb-4">
                    <h2 className="text-lg font-bold">Posts</h2>
                    <div className="flex items-center gap-2">
                        <CiEdit className="text-xl cursor-pointer" />
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Post 1 */}
                    <div className="bg-white shadow-sm rounded-lg p-4 flex flex-col gap-4 w-full ">
                        <div className="flex items-center gap-4">
                            <img
                                src="./images/p.png"
                                alt="Profile Picture"
                                className="w-10 h-10 rounded-full"
                            />
                            <span className="font-semibold flex justify-between items-center w-full">
                                Ankur
                                <HiDotsVertical className="text-gray-500" />
                            </span>
                        </div>
                        <div className="flex items-center gap-10">
                            <img src='./images/p.png' />
                            <p className="text-gray-800">
                                Who’s the worst family guy person character ever?
                            </p>
                        </div>

                        <div className="flex items-center justify-between mt-4 w-full">
                            <div className="flex items-center gap-1 text-red-600">
                                <div className="flex items-center gap-1">
                                    <FaHeart />
                                    <span>46</span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-600">
                                    <FaCommentDots />
                                    <span>46</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 text-gray-600">
                                <div className="flex items-center gap-1">
                                    <FaEye />
                                    <span>46</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FaShare />
                                    <span>46</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Post 2 */}
                    <div className="bg-white shadow-sm rounded-lg p-4 flex flex-col gap-4 w-full ">
                        <div className="flex items-center gap-4">
                            <img
                                src="./images/p.png"
                                alt="Profile Picture"
                                className="w-10 h-10 rounded-full"
                            />
                            <span className="font-semibold flex justify-between items-center w-full">
                                Ankur
                                <HiDotsVertical className="text-gray-500" />
                            </span>
                        </div>
                        <div className="flex items-center gap-10">
                            <img src='./images/p.png' />
                            <p className="text-gray-800">
                                Who’s the worst family guy person character ever?
                            </p>
                        </div>

                        <div className="flex items-center justify-between mt-4 w-full">
                            <div className="flex items-center gap-1 text-red-600">
                                <div className="flex items-center gap-1">
                                    <FaHeart />
                                    <span>46</span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-600">
                                    <FaCommentDots />
                                    <span>46</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 text-gray-600">
                                <div className="flex items-center gap-1">
                                    <FaEye />
                                    <span>46</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FaShare />
                                    <span>46</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="text-center mt-4">
                    <button className="text-blue-600">See more posts</button>
                </div>
            </div>

        </div>
    )
}

export default Posts