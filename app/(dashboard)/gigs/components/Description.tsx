import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Building2, MapPin, Clock, Badge } from 'lucide-react'
import React from 'react'

const Description = () => {
    return (
        <div className="max-w-[450px]">
            <Card className="h-[600px] flex flex-col">
                {/* Header Section */}
                <CardHeader className="sticky top-0 z-10 bg-white">
                    <CardTitle>Web Developer</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                            <Building2 className="h-4 w-4 mr-1" />
                            Cat Group India
                        </div>
                        <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            Remote
                        </div>
                        <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            3 Months
                        </div>
                        <Badge>Internship</Badge>
                    </div>
                </CardHeader>

                {/* Scrollable Content */}
                <CardContent className="overflow-y-auto space-y-10 h-[500px]">
                    <div>
                        <h3 className="font-medium mb-2">About Position</h3>
                        <p className="text-gray-600">
                            Seeking a talented UI/UX Designer to spearhead our mobile app's design, creating intuitive and engaging user experiences. Work alongside product managers and engineers in a collaborative environment to translate our vision into a functional and visually appealing app.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-medium mb-2">Responsibilities</h3>
                        <ul className="list-disc pl-4 space-y-2 text-gray-600">
                            <li>
                                5+ years of experience as a UI/UX Designer with hands-on experience in crafting wireframes, user stories, journeys, and mockups for a diverse range of devices.
                            </li>
                            <li>Solve design challenges with elegant solutions.</li>
                            <li>Employ a user-centered approach to design, with a cycle of testing and iteration.</li>
                            <li>Engage in collaborative problem-solving and idea generation.</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Description
