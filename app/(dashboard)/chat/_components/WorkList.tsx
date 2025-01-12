import React from "react";

interface WorkListProps {
    workItems: { id: number; title: string; description: string }[];
    onSelectWork: (work: { id: number; title: string; description: string }) => void;
    selectedWorkId: number | null;
}

const WorkList: React.FC<WorkListProps> = ({
    workItems,
    onSelectWork,
    selectedWorkId,
}) => {
    return (
        <ul>
            {workItems.map((work) => (
                <li
                    key={work.id}
                    onClick={() => onSelectWork(work)}
                    className={`flex flex-col p-4 cursor-pointer hover:bg-gray-200 ${selectedWorkId === work.id ? "bg-gray-300" : ""
                        }`}
                >
                    <div className="font-semibold">{work.title}</div>
                    <div className="text-sm text-gray-600 truncate">{work.description}</div>
                </li>
            ))}
        </ul>
    );
};

export default WorkList;
