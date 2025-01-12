import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LucideSendHorizontal } from "lucide-react";
import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogClose } from "@/components/ui/dialog";
import ForwardMessage from "./ForwardMessage";
import ReportMessage from "./ReportMessage";
import AddNote from "./AddNote";
import DeleteMessage from "./DeleteMessage ";

interface ChatDetailProps {
    selectedChat: {
        id: number;
        name: string;
        messages: { id: number; text: string; sender: "user" | "me" }[];
    } | null;
}

const ChatDetail: React.FC<ChatDetailProps> = ({ selectedChat }) => {
    const [newMessage, setNewMessage] = useState<string>("");
    const [activeMessageId, setActiveMessageId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<React.ReactNode>(null); // Change to React.ReactNode

    const handleSendMessage = () => {
        if (newMessage.trim() && selectedChat) {
            selectedChat.messages.push({
                id: Date.now(),
                text: newMessage,
                sender: "me",
            });
            setNewMessage("");
        }
    };

    const openModal = (content: React.ReactNode) => {
        setModalContent(content); // Now accepts JSX content
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent(null); // Reset modal content
    };

    if (!selectedChat) {
        return (
            <div className="flex items-center justify-center text-gray-500 h-full">
                <p>Select a chat to view details</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b flex items-center bg-gray-100 sticky top-0 z-10">
                <div className="h-10 w-10 bg-purple-500 rounded-full flex items-center justify-center text-white mr-4">
                    {selectedChat.name.charAt(0)}
                </div>
                <h2 className="flex items-center justify-between w-full text-lg font-semibold">
                    {selectedChat.name}

                </h2>
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-white">
                {selectedChat.messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`relative flex ${msg.sender === "me" ? "justify-end" : "justify-start"
                            } mb-2`}
                    >
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div
                                    className={`p-2 rounded-lg cursor-pointer ${msg.sender === "me"
                                        ? "bg-purple-500 text-white"
                                        : "bg-gray-200 text-black"
                                        }`}
                                    onClick={() => setActiveMessageId(msg.id)}
                                >
                                    {msg.text}
                                </div>
                            </DropdownMenuTrigger>

                            {activeMessageId === msg.id && (
                                <DropdownMenuContent
                                    align={msg.sender === "me" ? "end" : "start"}
                                    sideOffset={5}
                                >
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={() => openModal(<ForwardMessage />)}
                                    >
                                        Forward
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={() => openModal("")}
                                    >
                                        Reply
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={() => openModal(<DeleteMessage />)}
                                    >
                                        Delete
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={() => openModal(<ReportMessage />)}
                                    >
                                        Report
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={() => openModal(<AddNote />)}
                                    >
                                        Add Notes
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            )}
                        </DropdownMenu>
                    </div>
                ))}
            </div>

            {/* ShadCN Dialog for Modal Content */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild />
                <DialogContent className="p-6 flex justify-center max-w-lg w-full bg-white rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold">{modalContent}</h3>
                </DialogContent>
                <DialogClose />
            </Dialog>

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

export default ChatDetail;
