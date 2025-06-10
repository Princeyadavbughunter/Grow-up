// @ts-nocheck
import { Description } from '@radix-ui/react-dialog'
import React, { useEffect, useState } from 'react'
import { useAuth } from "@/context/AuthContext"
import { IoMdAdd } from 'react-icons/io'
import { CiEdit } from 'react-icons/ci'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Portfolio {
    name: "GitHub" | "Dribbble" | "Figma" | "YouTube" | "Medium";
    url: string;
    img: string;
}

const portfolioIcons = {
    "GitHub": "/images/git.png",
    "Dribbble": "/images/dribble.png",
    "Figma": "/images/p1.png",
    "YouTube": "/images/youtube.png",
    "Medium": "/images/medium.png",
} as const;

type PortfolioType = keyof typeof portfolioIcons;

interface EditingPortfolio {
    name: PortfolioType;
    url: string;
}

const defaultPortfolio: EditingPortfolio = {
    name: "GitHub",
    url: "",
};

const ShowCasePortfolios = () => {
    const { apiCaller, profileData, refreshProfile } = useAuth();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editingPortfolio, setEditingPortfolio] = useState<EditingPortfolio>(defaultPortfolio);

    const portfolioLinks = [
        { name: "GitHub", url: profileData?.github_account || "", img: portfolioIcons["GitHub"] },
        { name: "Dribbble", url: profileData?.dribble_account || "", img: portfolioIcons["Dribbble"] },
        { name: "Figma", url: profileData?.figma_account || "", img: portfolioIcons["Figma"] },
        { name: "YouTube", url: profileData?.youtube_account || "", img: portfolioIcons["YouTube"] },
        { name: "Medium", url: profileData?.medium_account || "", img: portfolioIcons["Medium"] },
    ].filter(portfolio => portfolio.url) as Portfolio[];

    const handleEditClick = (portfolio?: Portfolio) => {
        if (portfolio) {
            setEditingPortfolio({
                name: portfolio.name,
                url: portfolio.url,
            });
        } else {
            setEditingPortfolio(defaultPortfolio);
        }
        setIsEditing(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === "name" && Object.keys(portfolioIcons).includes(value)) {
            setEditingPortfolio(prev => ({
                ...prev,
                name: value as PortfolioType
            }));
        } else if (name === "url") {
            setEditingPortfolio(prev => ({
                ...prev,
                url: value
            }));
        }
    };

    const handleSubmit = async () => {
        if (!editingPortfolio.name || !editingPortfolio.url || !profileData?.id) return;
        
        try {
            const updateData = {
                [`${editingPortfolio.name.toLowerCase()}_account`]: editingPortfolio.url
            };
            await apiCaller.patch(`/freelancer/freelancer-profile/?id=${profileData.id}`, updateData);
            await refreshProfile();
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving portfolio:', error);
        }
    };

    return (
        <div>
            <div className="mt-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Showcase your portfolio</h2>
                    <div className="flex items-center gap-2">
                        <IoMdAdd 
                            className="text-xl cursor-pointer" 
                            onClick={() => handleEditClick()}
                        />
                        <CiEdit className="text-xl cursor-pointer" />
                    </div>
                </div>
                <div className="flex flex-wrap gap-5">
                    {portfolioLinks.map((portfolio) => (
                        <div
                            key={portfolio.name}
                            className="w-32 h-48 flex flex-col items-center justify-between shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => handleEditClick(portfolio)}
                        >
                            <div className="w-60 h-40 flex items-center justify-center">
                                <img
                                    src={portfolio.img}
                                    alt={portfolio.name}
                                    className="w-10 h-10 object-contain"
                                />
                            </div>
                            <span className="text-sm font-semibold mt-2">{portfolio.name}</span>
                            <a 
                                href={portfolio.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline truncate max-w-full"
                                onClick={(e) => e.stopPropagation()}
                            >
                                View Profile
                            </a>
                        </div>
                    ))}
                    {portfolioLinks.length === 0 && (
                        <p className="text-gray-500">No portfolio links added yet. Click the + button to add one.</p>
                    )}
                </div>
            </div>

            {/* Edit Portfolio Dialog */}
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingPortfolio.url ? 'Edit Portfolio' : 'Add Portfolio'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label htmlFor="name">Platform</label>
                            <select
                                id="name"
                                name="name"
                                value={editingPortfolio.name}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded-md"
                            >
                                {(Object.keys(portfolioIcons) as Array<PortfolioType>).map((platform) => (
                                    <option key={platform} value={platform}>
                                        {platform}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="url">Profile URL</label>
                            <Input
                                id="url"
                                name="url"
                                value={editingPortfolio.url}
                                onChange={handleInputChange}
                                placeholder="Enter your profile URL"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit}>
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ShowCasePortfolios