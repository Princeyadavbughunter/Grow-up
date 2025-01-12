"use client"
import { Input } from "@/components/ui/input";
import { SearchIcon, SearchXIcon } from "lucide-react";
import React, { useState } from "react";

interface LinkItem {
    id: string;
    platform: string;
    placeholder: string;
    icon: string;
    value: string;
}

const AddLinks: React.FC = () => {
    const [links, setLinks] = useState<LinkItem[]>([
        {
            id: "1",
            platform: "GitHub",
            placeholder: "Connect your GitHub profile",
            icon: "https://cdn-icons-png.flaticon.com/512/733/733553.png",
            value: "",
        },
        {
            id: "2",
            platform: "Dribbble",
            placeholder: "Connect your Dribbble profile",
            icon: "https://cdn-icons-png.flaticon.com/512/2111/2111370.png",
            value: "",
        },
        {
            id: "3",
            platform: "Figma",
            placeholder: "Connect your Figma profile",
            icon: "https://cdn-icons-png.flaticon.com/512/5968/5968705.png",
            value: "",
        },
        {
            id: "4",
            platform: "YouTube",
            placeholder: "Connect your YouTube profile",
            icon: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png",
            value: "",
        },
        {
            id: "5",
            platform: "Medium",
            placeholder: "Connect your Medium profile",
            icon: "https://cdn-icons-png.flaticon.com/512/5968/5968906.png",
            value: "",
        },
        {
            id: "6",
            platform: "Behance",
            placeholder: "Connect your Behance profile",
            icon: "https://cdn-icons-png.flaticon.com/512/5968/5968521.png",
            value: "",
        },
        {
            id: "7",
            platform: "Notion",
            placeholder: "Connect your Notion profile",
            icon: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
            value: "",
        },
        {
            id: "8",
            platform: "Substack",
            placeholder: "Connect your Substack profile",
            icon: "https://upload.wikimedia.org/wikipedia/commons/4/48/Substack_Logo.png",
            value: "",
        },
        {
            id: "9",
            platform: "Custom",
            placeholder: "Add a custom link",
            icon: "https://cdn-icons-png.flaticon.com/512/1828/1828919.png",
            value: "",
        },
    ]);

    const handleInputChange = (id: string, value: string) => {
        setLinks((prev) =>
            prev.map((link) => (link.id === id ? { ...link, value } : link))
        );
    };

    const handleDelete = (id: string) => {
        setLinks((prev) => prev.filter((link) => link.id !== id));
    };

    const handleConfirm = (id: string) => {
        const link = links.find((link) => link.id === id);
        if (link) {
            alert(`Link for ${link.platform} confirmed: ${link.value}`);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-800">Edit Portfolio Links</h2>
                <div className="border rounded-sm flex items-center px-2">
                    <SearchIcon size={18} color="gray" />
                    <Input placeholder="search" className="w-80 border-none shadow-none" />

                </div>
            </div>
            <div className="space-y-4">
                {links.map((link) => (
                    <div
                        key={link.id}
                        className="flex flex-col space-y-4 space-x-4 p-4  "
                    >
                        <img
                            src={link.icon}
                            alt={`${link.platform} icon`}
                            className="w-12 h-12 rounded-full ms-5"
                        />
                        <div className="flex-1 w-full">
                            <input
                                type="text"
                                placeholder={link.placeholder}
                                value={link.value}
                                onChange={(e) => handleInputChange(link.id, e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            />
                        </div>
                        <div className="flex items-center justify-end">
                            <button
                                onClick={() => handleDelete(link.id)}
                                className="px-4 py-2 bg-white text-gray-400"
                            >
                                Dismiss
                            </button>
                            <button
                                onClick={() => handleConfirm(link.id)}
                                className="px-4 py-2 bg-white text-gray-400"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AddLinks;
