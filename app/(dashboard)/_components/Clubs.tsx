const Clubs = () => {
    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Clubs</h2>
                <button className="text-sm text-purple-600">View all</button>
            </div>

            {[1, 2, 3, 4].map((i) => (
                <ClubCard key={i} />
            ))}
        </div>
    )
}

const ClubCard = () => (
    <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 text-xl">T</span>
                </div>
                <div>
                    <h3 className="font-semibold">Tech Minds</h3>
                    <p className="text-sm text-gray-500">9899 members</p>
                </div>
            </div>
            <button className="text-purple-600">Join</button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
            A group for tech enthusiasts, follow a passion with people follow a passion with people
            <button className="text-purple-600 ml-1">Read More...</button>
        </p>
    </div>
)

export default Clubs