// @ts-nocheck
import React, { useState } from 'react';

const AddNote = () => {
    const [note, setNote] = useState<string>('');

    const handleSaveNote = () => {
        console.log('Note saved:', note);
        setNote('');
    };

    return (
        <div className="w-96">
            <p className='font-light'>Add Note</p>
            <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add your note here..."
                className="w-full p-4 mb-4 border rounded-md mt-5"
            />
            <button
                onClick={handleSaveNote}
                className="font-light float-right"
            >

                Save
            </button>
        </div>
    );
};

export default AddNote;
