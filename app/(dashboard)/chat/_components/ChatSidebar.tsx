import React, { useState } from "react";
import MessageList from "./MessageList";
import WorkList from "./WorkList";
import RequestList from "./RequestList";
import ChatDetail from "./ChatDetail";
import RequestDetail from "./RequestDetail";

// Tab Button Component
const TabButton = ({
    label,
    isActive,
    onClick,
}: {
    label: string;
    isActive: boolean;
    onClick: () => void;
}) => (
    <button
        onClick={onClick}
        className={`flex-1 py-2 text-center ${isActive ? "border-b-2 border-black text-black" : "text-gray-500"}`}
    >
        {label}
    </button>
);

const ChatSidebar = () => {
    const [selectedTab, setSelectedTab] = useState("Message");
    const [selectedChat, setSelectedChat] = useState<{
        id: number;
        name: string;
        lastMessage: string;
        time: string;
        messages: { id: number; text: string; sender: "user" | "me" }[];
    } | null>(null);

    const [selectedRequest, setSelectedRequest] = useState<{
        id: number;
        title: string;
        description: string;
        profilePicture: string;
        lastMessage: string;
        time: string;
    } | null>(null);

    const [selectedWork, setSelectedWork] = useState<{ id: number; title: string; description: string } | null>(null);

    const chats = [
        {
            id: 1,
            name: "Aryan Trivedi",
            lastMessage: "Hi, how are you?",
            time: "10:15 AM",
            messages: [
                { id: 1, text: "Hi, how are you?", sender: "user" },
                { id: 2, text: "I'm good. How about you?", sender: "me" },
                { id: 3, text: "All good!", sender: "user" },
            ],
        },
        {
            id: 2,
            name: "John Doe",
            lastMessage: "Can we meet tomorrow?",
            time: "Yesterday",
            messages: [
                { id: 1, text: "Can we meet tomorrow?", sender: "user" },
                { id: 2, text: "Sure, what time?", sender: "me" },
                { id: 3, text: "10 AM works for me.", sender: "user" },
            ],
        },
        {
            id: 3,
            name: "Jane Smith",
            lastMessage: "Let me know your thoughts.",
            time: "2 days ago",
            messages: [
                { id: 1, text: "Let me know your thoughts.", sender: "user" },
                { id: 2, text: "I'll get back to you soon.", sender: "me" },
            ],
        },
    ];

    const workItems = [
        { id: 1, title: "Task 1", description: "Description of task 1" },
        { id: 2, title: "Task 2", description: "Description of task 2" },
    ];

    const requests = [
        {
            id: 1,
            title: "Arvind Das",
            description: "Can you review my work?",
            profilePicture: "/path/to/pic1.jpg",
            lastMessage: "Looking forward to your feedback",
            time: "2 hours ago"
        },
        {
            id: 2,
            title: "Sachin Pandat",
            description: "Let's collaborate on a project.",
            profilePicture: "/path/to/pic2.jpg",
            lastMessage: "Excited to work with you",
            time: "1 day ago"
        }
    ];


    const renderContent = () => {
        switch (selectedTab) {
            case "Message":
                return <ChatDetail selectedChat={selectedChat} />;
            case "Work":
                return <div className="p-4 text-gray-500">Work Items</div>;
            case "Request":
                return <RequestDetail selectedRequest={selectedRequest} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col h-[570px]">
            <div className="flex flex-1">
                <div className="w-1/4 bg-gray-100 border-r py-[30px]">
                    <div className="flex items-center border-b bg-gray-100">
                        {["Message", "Work", "Request"].map((tab) => (
                            <TabButton
                                key={tab}
                                label={tab}
                                isActive={selectedTab === tab}
                                onClick={() => setSelectedTab(tab)}
                            />
                        ))}
                    </div>
                    {selectedTab === "Message" && (
                        <MessageList
                            chats={chats}
                            onSelectChat={setSelectedChat}
                            selectedChatId={selectedChat?.id || null}
                        />
                    )}
                    {selectedTab === "Work" && (
                        <WorkList
                            workItems={workItems}
                            onSelectWork={setSelectedWork}
                            selectedWorkId={selectedWork?.id || null}
                        />
                    )}

                    {selectedTab === "Request" && (
                        <RequestList
                            requests={requests}
                            onSelectRequest={setSelectedRequest}  // This should now correctly set the full request object
                            selectedRequestId={selectedRequest?.id || null}
                        />
                    )}


                </div>

                <div className="flex-1 bg-white">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default ChatSidebar;
