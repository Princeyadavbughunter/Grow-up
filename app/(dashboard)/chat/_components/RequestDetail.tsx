import { Button } from "@/components/ui/button";
import { LucideSendHorizontal } from "lucide-react";
import React, { useState } from "react";

interface RequestDetailProps {
    selectedRequest: {
        id: number;
        title: string;
        description: string;
        profilePicture: string;
        lastMessage: string;
        time: string;
    } | null;
}

const RequestDetail: React.FC<RequestDetailProps> = ({ selectedRequest }) => {
    const [newMessage, setNewMessage] = useState<string>("");
    const [activeMessageId, setActiveMessageId] = useState<number | null>(null);


    const handleSendMessage = () => {
        if (newMessage.trim() && selectedRequest) {
            console.log("Message Sent:", newMessage);
            setNewMessage("");
        }
    };


    if (!selectedRequest) {
        return (
            <div className="flex items-center justify-center text-gray-500 h-full">
                <p>Select a request to view details</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[570px]">
            <div className="p-4 border-b flex items-center bg-gray-100 sticky top-0 z-10 ">
                <div className="h-10 w-10 bg-purple-500 rounded-full flex items-center justify-center text-white mr-4">
                    <img src={selectedRequest.profilePicture} alt="Profile" className="rounded-full" />
                </div>
                <h2 className="flex items-center justify-between w-full text-lg font-semibold">
                    {selectedRequest.title}
                    <div className="space-x-2">
                        <Button variant="secondary" className="bg-purple-600 text-white hover:bg-purple-700">
                            Accept Request
                        </Button>
                        <Button variant="outline">Deny</Button>
                    </div>
                </h2>
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-white">
                <div className="mb-4">
                    <div className="font-semibold">{selectedRequest.title}</div>
                    <div className="text-sm text-gray-600">{selectedRequest.description}</div>
                </div>


            </div>


            <div className="p-4 border-t bg-gray-100 sticky bottom-0">
                <div className="flex items-center gap-2">
                    <label className="cursor-pointer">
                        <input type="file" accept="*" className="hidden" />
                        <img src="./images/Add.png" alt="Add" />
                    </label>

                    <input
                        type="text"
                        placeholder="Type Your Message Here..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 p-2 border rounded-md mr-2"
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-purple-500 text-white p-2 rounded-full hover:bg-purple-600"
                    >
                        <LucideSendHorizontal />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RequestDetail;
