import React from "react";
import { CiStar } from "react-icons/ci";
import { HiDotsVertical } from "react-icons/hi";

const SimilarProfiles = () => {
    const profiles = [
        {
            name: "Aryan Trivedi",
            title: "Founder - Finzie | Ex Groww | BITS Pilani",
            summary:
                "Hi, I am Aryan - Founder at Finzie. With a background in finance and tech, I enjoy building innovative solutions to complex problems.",
            img: "./images/p.png",
        },
        {
            name: "Priya Sharma",
            title: "Marketing Head - Flipkart",
            summary:
                "With over 10 years in the e-commerce space, I specialize in crafting creative marketing strategies that drive growth and engagement.",
            img: "./images/p2.png",
        },
        {
            name: "Rohit Mehra",
            title: "CTO - TechFusion | Mentor",
            summary:
                "A tech enthusiast and mentor, I lead product development at TechFusion, ensuring innovation and scalability in every project.",
            img: "./images/p.png",
        },
        {
            name: "Sanya Kapoor",
            title: "Product Manager - Zomato",
            summary:
                "I am passionate about user-centric product design, ensuring delightful experiences for millions of food lovers globally.",
            img: "./images/p2.png",
        },
        {
            name: "Kunal Singh",
            title: "Data Scientist - Amazon",
            summary:
                "Specializing in predictive modeling and data visualization, I leverage big data to create impactful business insights.",
            img: "./images/p.png",
        },
    ];

    return (
        <div className="p-2">
            <h3 className="text-lg font-semibold mb-4">Other similar profiles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-28">
                {profiles.map((profile, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-4 px-6 py-6 rounded-lg hover:shadow-md transition-shadow bg-[#F6F8FF]"
                    >
                        <img
                            src={profile.img}
                            alt={profile.name}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex flex-col flex-1">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="text-sm font-bold">{profile.name}</h4>
                                    <h5 className="text-sm text-gray-600">{profile.title}</h5>
                                </div>
                                <div className="flex items-center gap-2 text-gray-500">
                                    <CiStar />
                                    <HiDotsVertical />
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-2 mt-3">
                                {profile.summary}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SimilarProfiles;
