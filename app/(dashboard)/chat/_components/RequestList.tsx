import React from "react";

interface RequestListProps {
    requests: { id: number; title: string; description: string }[];
    onSelectRequest: (request: { id: number; title: string; description: string }) => void;
    selectedRequestId: number | null;
}

const RequestList: React.FC<RequestListProps> = ({
    requests,
    onSelectRequest,
    selectedRequestId,
}) => {
    return (
        <ul>
            {requests.map((request) => (
                <li
                    key={request.id}
                    onClick={() => onSelectRequest(request)}
                    className={`flex flex-col p-4 cursor-pointer hover:bg-gray-200 ${selectedRequestId === request.id ? "bg-gray-300" : ""
                        }`}
                >
                    <div className="font-semibold">{request.title}</div>
                    <div className="text-sm text-gray-600 truncate">{request.description}</div>
                </li>
            ))}
        </ul>
    );
};

export default RequestList;
