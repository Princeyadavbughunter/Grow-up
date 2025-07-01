// @ts-nocheck
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Building2, MapPin, Clock, Badge } from 'lucide-react'

interface DescriptionProps {
    selectedGig: Gig | null;
    showSmaller: boolean;
}

const Description = ({ selectedGig, showSmaller }: DescriptionProps) => {
    if (!selectedGig) {
        return (
            <div className="w-full p-2 sm:p-4">
                <Card className="h-full flex flex-col justify-center items-center p-2 sm:p-4">
                    <p className="text-gray-500">Select a job to view details</p>
                </Card>
            </div>
        );
    }

    return (
        <div className={`w-full ${showSmaller ? 'h-[calc(100vh-20rem)]' : 'h-[calc(100vh-12rem)]'} overflow-y-scroll rounded-xl p-2 sm:p-4`}>
            <Card className="h-full border-none p-2 sm:p-4 rounded-xl flex flex-col">
                <CardHeader className="sticky top-0 z-10 bg-white pb-4">
                    <CardTitle>{selectedGig.job_title}</CardTitle>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-2">
                        <div className="flex items-center">
                            <Building2 className="h-4 w-4 mr-1" />
                            {selectedGig.about_role}
                        </div>
                        <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {selectedGig.location}
                        </div>
                        <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {selectedGig.is_unpaid ? (
                                <span className="text-orange-600 font-medium">Unpaid</span>
                            ) : (
                                `${selectedGig.salary_range}/month`
                            )}
                        </div>
                        <Badge>{selectedGig.employment_type}</Badge>
                    </div>
                </CardHeader>

                <CardContent className="overflow-y-auto space-y-6 md:space-y-8 lg:space-y-10 h-[500px] pb-4">
                    <div>
                        <h3 className="font-medium mb-2">About Position</h3>
                        <p className="text-gray-600">
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
                                Salary: {selectedGig.is_unpaid ? (
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
        </div>
    );
};

export default Description;