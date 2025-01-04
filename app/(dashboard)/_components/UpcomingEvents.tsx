import Image from "next/image"

const UpcomingEvents = () => {
    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Upcoming events</h2>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Wed, May 08 @ 6:00 PM</span>
                    <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">456 Buddy</span>
                </div>

                <h3 className="text-lg font-semibold mb-2">Building the Fastest Growing Gaming Tech for future</h3>

                <div className="flex items-center gap-4 mb-4">
                    <Image
                        src="/logo.svg"
                        alt="Event"
                        width={40}
                        height={40}
                        className="rounded-lg"
                    />
                    <div>
                        <h4 className="font-semibold">Growbuddy Events</h4>
                        <p className="text-sm text-gray-500">Learn to build a product from scratch, market it and much more</p>
                    </div>
                </div>

                <button className="w-full bg-purple-600 text-white rounded-lg py-2">Register Now</button>
            </div>
        </div>
    )
}

export default UpcomingEvents