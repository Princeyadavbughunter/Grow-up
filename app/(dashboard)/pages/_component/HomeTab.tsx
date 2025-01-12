import React from 'react'

const HomeTab = () => {
    return (
        <div className='flex flex-col justify-center px-20'>
            <div className="rounded-xl bg-slate-400 text-gray-600 border p-3">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make   ....See more
            </div>
            <div className="rounded-xl border mt-5 p-3">
                <div>
                    <p>Website</p>
                    <p className='text-[#7052FF]'>Link</p>
                </div>

                <div>
                    <p>Phone</p>
                    <p className='text-[#7052FF]'>8888888888</p>
                </div>
            </div>
        </div>
    )
}

export default HomeTab