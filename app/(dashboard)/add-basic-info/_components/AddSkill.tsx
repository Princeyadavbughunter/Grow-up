import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { CiCreditCard1 } from 'react-icons/ci';
import { IoMdAdd } from 'react-icons/io';

const AddSkill = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSkills, setSelectedSkills] = useState([]);
    const categories = ["Getting Started", "Soft Skills", "Technical Skills"];
    const allSkills = [
        "Premiere Pro", "Operation", "Flutter", "Social Media",
        "Communication", "Leadership", "Problem-Solving", "JavaScript", "React", "Node.js"
    ];

    const handleSearchChange = (e: any) => setSearchTerm(e.target.value);

    const handleCategoryChange = (e: any) => setSelectedCategory(e.target.value);

    const handleSkillSelect = (skill: any) => {
        setSelectedSkills((prevSkills: any) => {
            if (prevSkills.includes(skill)) {
                return prevSkills.filter((item: any) => item !== skill);
            }
            return [...prevSkills, skill];
        });
    };

    const handleSave = () => {
        console.log('Skills saved:', selectedSkills);
    };

    const handleCancel = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setSelectedSkills([]);
    };

    return (
        <div>
            {/* My Skills */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <h2 className="text-lg font-bold">My Skills</h2>
                    <div className="flex items-center gap-2">
                        <IoMdAdd className="text-xl cursor-pointer" />
                        <CiCreditCard1 className="text-xl cursor-pointer" />
                    </div>
                </div>
                {[{ category: "Getting Started", skills: ["Premiere Pro", "Operation", "Flutter", "Social Media"] },
                { category: "Soft Skills", skills: ["Communication", "Leadership", "Problem-Solving"] }].map((group) => (
                    <div key={group.category}>
                        <h3 className="font-semibold text-gray-600">{group.category}</h3>
                        <div className="flex flex-wrap gap-2 mt-2 border-b py-2">
                            {group.skills.map((skill) => (
                                <span key={skill} className="px-3 py-1 text-xs font-medium border rounded-full bg-[#E4DEFF]">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add New Skills */}
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Add New Skills</h3>

                {/* Search Bar */}
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search for skills..."
                    className="w-full px-4 py-2 border rounded-lg mb-4"
                />

                {/* Suggested Skills */}
                <div className="mb-4">
                    <h4 className="font-semibold">Suggested Skills</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {allSkills.filter(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())).map((skill) => (
                            <span
                                key={skill}
                                onClick={() => handleSkillSelect(skill)}
                                className={`px-3 py-1 text-xs font-medium border rounded-full cursor-pointer 
                                    ${selectedSkills.includes(skill) ? 'bg-blue-500 text-white' : 'bg-[#E4DEFF]'}
                                `}
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Category Selection */}
                <div className="mb-4">
                    <label htmlFor="category" className="font-semibold">Select Category</label>
                    <select
                        id="category"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        className="w-full px-4 py-2 border rounded-lg mt-2"
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-20">
                    <Button
                        onClick={handleCancel}
                        type="button"
                        className="bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-full "
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}

                        type="button"
                        className="bg-[#7052FF] text-white hover:bg-blue-600 rounded-full px-12"
                    >
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default AddSkill;
