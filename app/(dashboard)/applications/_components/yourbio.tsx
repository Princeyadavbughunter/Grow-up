import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import SummaryData from '../../profile/components/summrytabs/SummaryData';
import MyExperience from '../../profile/components/summrytabs/MyExperience';
import MyEducation from '../../profile/components/summrytabs/MyEducation';
import Portfolios from '../../profile/components/summrytabs/Portfolios';
import Posts from '../../_components/Posts';
import YourBioHeader from '../../_components/YourBioHeader';

const YourBio = () => {

    return (
        <div className='py-10 max-w-[580px]'>
            <YourBioHeader />
            <SummaryData />
            <MyExperience />
            <MyEducation />
            <Portfolios />
            <Posts />

        </div>
    )
}

export default YourBio