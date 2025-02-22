import React from 'react';
import { BiLink } from 'react-icons/bi';

const Followers = () => {
    const followers = [
        {
            avatar: 'https://randomuser.me/portraits/men/1.jpg',
            name: 'John Doe',
            location: 'New York, USA',
        },
        {
            avatar: 'https://randomuser.me/portraits/women/2.jpg',
            name: 'Jane Smith',
            location: 'London, UK',
        },
        {
            avatar: 'https://randomuser.me/portraits/men/3.jpg',
            name: 'Mike Johnson',
            location: 'Sydney, Australia',
        },
        {
            avatar: 'https://randomuser.me/portraits/women/4.jpg',
            name: 'Emily Davis',
            location: 'Toronto, Canada',
        },
    ];

    return (
        <div>
            <div className="mb-6 rounded-lg border p-4 flex flex-col">
                <div className="div">
                    <div className="mb-4">
                        <div className="flex items-center gap-2">
                            <BiLink className="h-5 w-5 text-gray-500" />
                            <h3 className="text-lg font-medium">Invitation link</h3>
                        </div>
                        <p className="text-gray-500">https://sjsfhHAD44iddioAR.com/</p>
                    </div>
                    <div>
                        <div className="mb-2">
                            <span className="font-medium">Website</span>
                            <a href="https://ptai.in" className="ml-2 text-purple-600">ptai.in</a>
                        </div>
                        <div>
                            <span className="font-medium">Phone</span>
                            <span className="ml-2 text-purple-600">8800569545</span>
                        </div>
                    </div>
                </div>
                <div>
                    <h2 className="mb-4 text-xl font-bold">Followers</h2>
                    <div className="space-y-4">
                        {followers.map((follower, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <img src={follower.avatar} alt={follower.name} className="h-12 w-12 rounded-full" />
                                <div>
                                    <h3 className="font-medium">{follower.name}</h3>
                                    <p className="text-gray-500">{follower.location}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Followers;
