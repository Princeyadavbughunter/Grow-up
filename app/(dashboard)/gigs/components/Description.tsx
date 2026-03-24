// @ts-nocheck
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, MapPin, Clock, Share2, ExternalLink, Wallet, Compass } from 'lucide-react'
import ShareGigPopup from './ShareGigPopup'

interface DescriptionProps {
    selectedGig: Gig | null;
    showSmaller: boolean;
}

const Description = ({ selectedGig, showSmaller }: DescriptionProps) => {
    const router = useRouter();
    const [showSharePopup, setShowSharePopup] = useState(false);

    if (!selectedGig) {
        return (
            <div className={`w-full ${showSmaller ? 'h-[calc(100vh-19rem)]' : 'h-[calc(100vh-12rem)]'} p-2 sm:p-4`}>
                <Card className="h-full flex flex-col justify-center items-center p-2 sm:p-4">
                    <p className="text-gray-500">Select a job to view details</p>
                </Card>
            </div>
        );
    }

    return (
        <div className={`w-full ${showSmaller ? 'h-[calc(100vh-19rem)]' : 'h-[calc(100vh-12rem)]'} overflow-y-scroll rounded-xl p-2 sm:p-4 bg-white`}>
            <Card className="h-full border-none p-2 sm:p-4 rounded-xl flex flex-col cursor-pointer" onClick={() => router.push(`/gigs/${selectedGig.id}`)} >
                <CardHeader className="sticky top-0 z-10 bg-white pb-6 pt-4 border-b border-gray-100 mb-6">
                    <div className="flex justify-between items-start gap-4">
                        <CardTitle className="text-2xl sm:text-[28px] font-bold text-gray-900 leading-tight">
                            {selectedGig.job_title}
                        </CardTitle>
                        <div className="flex items-center gap-3 shrink-0 mt-1">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-gray-900 leading-tight">{selectedGig.about_role || "Company Name"}</p>
                                <p className="text-xs text-gray-500 font-medium">{selectedGig.location}</p>
                            </div>
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 border border-gray-100 shadow-sm overflow-hidden p-1">
                                <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="100" height="100" fill="#FFEACB" />
                                    <path d="M20 80L50 20L80 80H20Z" fill="#202020" stroke="#FFEACB" strokeWidth="4" strokeLinejoin="round" />
                                    <path d="M35 80L50 50L65 80H35Z" fill="#F0B52B" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8">
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm font-medium text-gray-700">
                            <div className="flex items-center gap-1.5">
                                <Wallet className="w-4 h-4 text-gray-400" />
                                <span>
                                    {selectedGig.is_unpaid || !selectedGig.salary_range || selectedGig.salary_range.trim() === '' ? (
                                        <span className="text-orange-600 font-medium">Unpaid</span>
                                    ) : (
                                        `${selectedGig.salary_range}/month`
                                    )}
                                </span>
                            </div>
                            <div className="w-px h-4 bg-gray-300"></div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span>{selectedGig.experience || "Not specified"}</span>
                            </div>
                            <div className="w-px h-4 bg-gray-300"></div>
                            <div className="flex items-center gap-1.5">
                                <Compass className="w-4 h-4 text-gray-400" />
                                <span>{selectedGig.work_type || "Remote"}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto">
                            <Badge variant="outline" className="rounded-full px-3 py-0.5 text-xs font-medium text-gray-500 border-gray-300 bg-white">
                                {selectedGig.employment_type}
                            </Badge>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 rounded-full shrink-0 border-gray-200 hover:bg-gray-50 text-gray-400"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowSharePopup(true);
                                }}
                            >
                                <Share2 className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="overflow-y-auto space-y-8 md:space-y-10 h-[500px] pb-4 px-2 sm:px-6">
                    <div>
                        <h3 className="font-bold text-gray-900 text-[17px] mb-3">About Position</h3>
                        <h4 className="font-semibold text-gray-800 text-sm mb-2">Description</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {selectedGig.job_description}
                        </p>
                    </div>

                    <div>
                        <h3 className="font-medium mb-2">Role Details</h3>
                        <ul className="list-disc pl-4 space-y-2 text-gray-600">
                            <li>Experience Required: {selectedGig.experience}</li>
                            <li>Required Skills: {selectedGig.required_skills}</li>
                            <li>Employment Type: {selectedGig.employment_type}</li>
                            {selectedGig.work_type && (
                                <li>Work Type: {selectedGig.work_type}</li>
                            )}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-medium mb-2">Additional Information</h3>
                        <ul className="list-disc pl-4 space-y-2 text-gray-600">
                            <li>
                                Salary: {selectedGig.is_unpaid || !selectedGig.salary_range || selectedGig.salary_range.trim() === '' ? (
                                    <span className="text-orange-600 font-medium">Unpaid</span>
                                ) : (
                                    `₹${selectedGig.salary_range}/month`
                                )}
                            </li>
                            <li>Location: {selectedGig.location}</li>
                            <li>Status: {selectedGig.is_active}</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>

            {/* Share Popup */}
            <ShareGigPopup
                isOpen={showSharePopup}
                onClose={() => setShowSharePopup(false)}
                gigId={selectedGig.id}
                gigTitle={selectedGig.job_title}
            />
        </div>
    );
};

export default Description;