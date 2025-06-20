// @ts-nocheck
import React, { useState } from 'react'
import { IoMdAdd } from 'react-icons/io'
import { CiEdit } from 'react-icons/ci'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/AuthContext"

interface Portfolio {
    name: string;
    url: string;
    img: string;
}

interface PortfolioFormData {
    name: string;
    url: string;
}

interface PortfoliosProps {
    profileData: {
        id: string;
        github_account: string | null;
        dribble_account: string | null;
        figma_account: string | null;
        youtube_account: string | null;
        medium_account: string | null;
    } | null;
}

const portfolioIcons = {
    "GitHub": "./images/git.png",
    "Dribbble": "./images/dribble.png",
    "Figma": "./images/p1.png",
    "YouTube": "./images/youtube.png",
    "Medium": "./images/medium.png",
} as const;

type PortfolioType = keyof typeof portfolioIcons;

const defaultPortfolioForm = {
    name: "" as PortfolioType,
    url: "",
};

const Portfolios: React.FC<PortfoliosProps> = ({ profileData }) => {
    // @ts-ignore
    const { apiCaller, refreshProfile } = useAuth();
    // @ts-ignore
    const [isEditing, setIsEditing] = useState<boolean>(false);
    // @ts-ignore
    const [editingPortfolio, setEditingPortfolio] = useState<typeof defaultPortfolioForm>(defaultPortfolioForm);

    const portfolioLinks = [
        { name: "GitHub", url: profileData?.github_account || "", img: portfolioIcons["GitHub"] },
        { name: "Dribbble", url: profileData?.dribble_account || "", img: portfolioIcons["Dribbble"] },
        { name: "Figma", url: profileData?.figma_account || "", img: portfolioIcons["Figma"] },
        { name: "YouTube", url: profileData?.youtube_account || "", img: portfolioIcons["YouTube"] },
        { name: "Medium", url: profileData?.medium_account || "", img: portfolioIcons["Medium"] },
    ].filter(portfolio => portfolio.url);

    const handleEditClick = (portfolio?: Portfolio) => {
        if (portfolio) {
            setEditingPortfolio({
                name: portfolio.name as PortfolioType,
                url: portfolio.url,
            });
        } else {
            setEditingPortfolio(defaultPortfolioForm);
        }
        setIsEditing(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditingPortfolio(prev => ({
            ...prev,
            [name]: value
        }));
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
            {/* My Portfolios */}
            <div className="my-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">My Portfolios</h2>
                    <div className="flex items-center gap-2">
                        <IoMdAdd 
                            className="text-xl cursor-pointer" 
                            onClick={() => handleEditClick()}
                        />
                        <CiEdit className="text-xl cursor-pointer" />
                    </div>
                </div>
                <div className="flex flex-wrap gap-10">
                    {portfolioLinks.map((portfolio) => (
                        <div
                            key={portfolio.name}
                            className="w-32 h-40 flex flex-col items-center justify-between shadow-md rounded-lg p-4 cursor-pointer"
                            onClick={() => handleEditClick(portfolio)}
                        >
                            <div className="w-60 h-40 flex items-center justify-center">
                                <img
                                    src={portfolio.img}
                                    className="w-10 h-10 object-contain"
                                    alt={portfolio.name}
                                />
                            </div>
                            <span className="text-sm font-semibold mt-2">{portfolio.name}</span>
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
                        <DialogTitle>{editingPortfolio.name ? 'Edit Portfolio' : 'Add Portfolio'}</DialogTitle>
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
                                <option value="">Select Platform</option>
                                {(Object.keys(portfolioIcons) as PortfolioType[]).map((platform) => (
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

export default Portfolios