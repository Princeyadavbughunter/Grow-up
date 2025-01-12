import React from 'react'
import YourBioHeader from '../../_components/YourBioHeader'
import SummaryData from '../../profile/components/summrytabs/SummaryData'
import MyExperience from '../../profile/components/summrytabs/MyExperience'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import AddSkill from './AddSkill'
import ShowCasePortfolios from '../../_components/ShowCasePortfolios'

const BasicInfoBio = () => {
    return (
        <div className='py-40 w-[610px]'>
            <YourBioHeader />
            <SummaryData />
            <MyExperience />

            <div className="p-6  mx-auto space-y-9 ">
                <h2 className="text-xl font-bold mb-4">Add Experience</h2>

                {/* Title Field */}
                <Input
                    type="text"
                    placeholder="Title"
                    className="w-full mb-4 h-12 border-black"
                />

                <Select>
                    <SelectTrigger className="w-[180px] h-12 border-black">
                        <SelectValue placeholder="Employment Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="light">full-time</SelectItem>
                        <SelectItem value="dark">part-time</SelectItem>
                        <SelectItem value="system">internship</SelectItem>
                        <SelectItem value="system">contract</SelectItem>
                    </SelectContent>
                </Select>

                <Select>
                    <SelectTrigger className="w-[180px] h-12 border-black">
                        <SelectValue placeholder="Company Name" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="light">Google</SelectItem>
                        <SelectItem value="dark">Microsoft</SelectItem>
                        <SelectItem value="system">Amazon</SelectItem>
                        <SelectItem value="system">Tesla</SelectItem>
                    </SelectContent>
                </Select>



                <Input
                    type="text"
                    placeholder="Location"
                    className="w-full mb-4 h-12 border-black"
                />

                <Input
                    type="date"
                    placeholder="Start date"
                    className="w-full mb-4 h-12 border-black"
                />

                <div className="flex items-center mb-4">
                    <Checkbox id="currently-studying" className="mr-2 " />
                    <label htmlFor="currently-studying" className="text-sm text-gray-700">Currently studying here</label>
                </div>

                <Input
                    type="date"
                    placeholder="End date"
                    className="w-full mb-4 h-12 border-black"
                />
                <div className="flex justify-end gap-20">
                    <Button
                        type="button"
                        className="bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-full "
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        className="bg-[#7052FF] text-white hover:bg-blue-600 rounded-full px-12"
                    >
                        Save
                    </Button>
                </div>
            </div>

            <AddSkill />
            <ShowCasePortfolios />

        </div>
    )
}

export default BasicInfoBio