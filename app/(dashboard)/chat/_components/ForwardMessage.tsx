import React, { useState } from 'react';

const ForwardMessage = () => {
    const profiles = [
        { id: '1', name: 'Aryan Trivedi', image: 'https://via.placeholder.com/40' },
        { id: '2', name: 'John Doe', image: 'https://via.placeholder.com/40' },
        { id: '3', name: 'Jane Smith', image: 'https://via.placeholder.com/40' },
        { id: '4', name: 'Alice Johnson', image: 'https://via.placeholder.com/40' },
    ];

    const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const handleSelectProfile = (profileId: string) => {
        setSelectedProfiles((prev) =>
            prev.includes(profileId) ? prev.filter((id) => id !== profileId) : [...prev, profileId]
        );
    };

    const filteredProfiles = profiles.filter((profile) =>
        profile.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-[400px]  space-y-4">
            <div className="flex items-center bg-gray-100 p-2 rounded-lg">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 bg-transparent text-sm rounded-lg focus:outline-none"
                />
            </div>

            <div className="max-h-[300px] overflow-y-auto space-y-4">
                {filteredProfiles.map((profile) => (
                    <div
                        key={profile.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-lg cursor-pointer"
                    >
                        <div className="h-10 w-10 rounded-full bg-black flex items-center justify-center text-white">
                            {profile.name.charAt(0)}
                        </div>
                        <span className="flex-1 text-sm ms-2">{profile.name}</span>
                        <input
                            type="checkbox"
                            checked={selectedProfiles.includes(profile.id)}
                            onChange={() => handleSelectProfile(profile.id)}
                            className="h-5 w-5 text-purple-500 focus:ring-0"
                        />
                    </div>
                ))}
            </div>

            <div className="flex justify-between items-center mt-4">
                <button className="text-gray-500 hover:text-gray-700 text-sm">Cancel</button>
                <button
                    className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm hover:bg-purple-600"
                    disabled={selectedProfiles.length === 0}
                >
                    Forward
                </button>
            </div>
        </div>
    );
};

export default ForwardMessage;
