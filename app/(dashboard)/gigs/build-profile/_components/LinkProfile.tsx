import { CheckIcon, SearchIcon } from 'lucide-react';
import React, { useState } from 'react';

// Define the types for the props of the ProfileCard component
interface ProfileCardProps {
    name: string;
    description: string;
    imageUrl: string;
    isSelected: boolean;
    onSelect: () => void;
}

// ProfileCard component for displaying individual profile information
const ProfileCard: React.FC<ProfileCardProps> = ({ name, description, imageUrl, isSelected, onSelect }) => (
    <div className="flex-1 mt-2 flex flex-col items-center justify-center">
        <img src={imageUrl} alt="Profile" className="w-10 h-10 rounded-full border" />
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-gray-500">{description}</p>
        <button
            onClick={onSelect}
            className={`w-full mt-2 bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 ${isSelected ? 'bg-purple-800' : ''
                }`}
        >
            {isSelected ? <CheckIcon size={18} color="white" /> : 'Select'}
        </button>
    </div>
);

const LinkProfile = () => {
    const [linkedinProfile, setLinkedinProfile] = useState('');
    const [selectedProfile, setSelectedProfile] = useState<null | { name: string; description: string; imageUrl: string }>(null);

    const handleSubmit = () => {
        console.log({ linkedinProfile, selectedProfile });
    };

    const handleSelectProfile = (profile: { name: string; description: string; imageUrl: string }) => {
        setSelectedProfile(profile);
    };

    // Placeholder profile data
    const profiles = [
        { name: 'John Doe', description: 'Software Engineer', imageUrl: 'profile-pic1.jpg' },
        { name: 'Jane Smith', description: 'Product Manager', imageUrl: 'profile-pic2.jpg' },
        { name: 'Bob Johnson', description: 'Designer', imageUrl: 'profile-pic3.jpg' },
        { name: 'Alice Brown', description: 'UX Researcher', imageUrl: 'profile-pic4.jpg' }
    ];

    return (
        <div className='p-6 bg-white rounded-lg overflow-y-auto h-[570px] border w-[400px]'>
            <div className="flex-1">
                <h3 className="text-xl font-normal text-gray-800 mb-4">
                    Link your profile with LinkedIn <span className='text-gray-500 text-sm'>(optional)</span>
                </h3>

                <div className="flex items-center p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
                    <SearchIcon size={18} color='gray' />
                    <input
                        type="search"
                        value={linkedinProfile}
                        onChange={(e) => setLinkedinProfile(e.target.value)}
                        placeholder="Search your Linkedin profile"
                        className="w-full ms-2 outline-none"
                    />
                </div>

                <div className="flex flex-wrap mt-4 space-x-4 space-y-4 justify-center">
                    {profiles.map((profile, index) => (
                        <ProfileCard
                            key={index}
                            name={profile.name}
                            description={profile.description}
                            imageUrl={profile.imageUrl}
                            isSelected={selectedProfile === profile}
                            onSelect={() => handleSelectProfile(profile)}
                        />
                    ))}
                </div>

                <button
                    className="w-full mt-10 bg-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-purple-700"
                    onClick={handleSubmit}
                >
                    Continue
                </button>
            </div>
        </div>
    );
}

export default LinkProfile;
