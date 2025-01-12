import React from 'react';

const DeleteMessage = () => {

    return (
        <>


            <div className=" bg-opacity-50 flex justify-center items-center z-50">
                <div className="space-y-10 p-3">
                    <p className="mb-4 text-lg text-center">Are you sure you want to delete?</p>
                    <p className='text-center text-sm font-medium'>Both the users won’t be able to see<br /> the message permanently.</p>
                    <div className="flex items-center justify-between">
                        <button className='hover:text-blue-600'>No, cancel</button>
                        <button className='hover:text-blue-600'>Yes, Delete</button>

                    </div>
                </div>

            </div>
        </>
    );
};

export default DeleteMessage;
