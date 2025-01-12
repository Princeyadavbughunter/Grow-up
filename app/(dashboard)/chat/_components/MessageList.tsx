import React from "react";

interface MessageListProps {
    chats: {
        id: number;
        name: string;
        lastMessage: string;
        time: string;
        messages: { id: number; text: string; sender: "user" | "me" }[];
    }[];
    onSelectChat: (chat: {
        id: number;
        name: string;
        lastMessage: string;
        time: string;
        messages: { id: number; text: string; sender: "user" | "me" }[];
    }) => void;
    selectedChatId: number | null;
}

const MessageList: React.FC<MessageListProps> = ({
    chats,
    onSelectChat,
    selectedChatId,
}) => {
    return (
        <ul>
            {chats.map((chat) => (
                <li
                    key={chat.id}
                    onClick={() => onSelectChat(chat)}
                    className={`flex items-center p-4 cursor-pointer hover:bg-gray-200 ${selectedChatId === chat.id ? "bg-gray-300" : ""
                        }`}
                >
                    <div className="h-10 w-10 bg-purple-500 rounded-full flex items-center justify-center text-white mr-4">
                        {chat.name.charAt(0)}

                    </div>

                    <div>
                        <div className="font-semibold">{chat.name}</div>
                        <div className="text-sm text-gray-600 truncate">{chat.lastMessage}</div>
                    </div>

                    <div className="ml-auto text-xs text-gray-500">{chat.time}</div>
                </li>
            ))}
        </ul>
    );
};

export default MessageList;
