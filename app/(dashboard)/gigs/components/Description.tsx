import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Building2, MapPin, Clock, Badge } from 'lucide-react'

interface DescriptionProps {
    selectedGig: Gig | null;
}

const Description = ({ selectedGig }: DescriptionProps) => {
    if (!selectedGig) {
        return (
            <div className="max-w-[450px]">
                <Card className="h-[600px] flex flex-col justify-center items-center">
                    <p className="text-gray-500">Select a job to view details</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-[450px] rounded-xl">
            <Card className="h-[600px] border-none p-4 rounded-xl flex flex-col">
                <CardHeader className="sticky top-0 z-10 bg-white">
                    <CardTitle>{selectedGig.job_title}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
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
                            {selectedGig.salary_range}/month
                        </div>
                        <Badge>{selectedGig.employment_type}</Badge>
                    </div>
                </CardHeader>

                <CardContent className="overflow-y-auto space-y-10 h-[500px]">
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
                            <li>Salary: ₹{selectedGig.salary_range}/month</li>
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