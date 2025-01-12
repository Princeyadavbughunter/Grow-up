import Image from "next/image"

const Posts = () => {
    return (
        <div className="p-4">


            {[1, 2].map((i) => (
                <PostCard key={i} />
            ))}
        </div>
    )
}

const PostCard = () => (
    <div className="bg-white rounded-xl p-4 mb-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <Image
                    src="https://randomuser.me/api/portraits/men/2.jpg"
                    alt="User"
                    width={40}
                    height={40}
                    className="rounded-full"
                />
                <div>
                    <h3 className="font-semibold">Ankur</h3>
                    <p className="text-sm text-gray-500">23 hours ago</p>
                </div>
            </div>
            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Tech</span>
        </div>

        <p className="mb-4">Who's the worst family guy person character ever?</p>
        <Image
            src="https://source.unsplash.com/random/800x600"
            alt="Post"
            width={800}
            height={600}
            className="rounded-xl mb-4"
        />

        <div className="flex items-center justify-between text-gray-500">
            <button className="flex items-center gap-2">
                <span>❤️</span>
                <span>46</span>
            </button>
            <button className="flex items-center gap-2">
                <span>💬</span>
                <span>46</span>
            </button>
            <button className="flex items-center gap-2">
                <span>👁️</span>
                <span>46</span>
            </button>
            <button>
                <span>📤</span>
            </button>
        </div>
    </div>
)

export default Posts