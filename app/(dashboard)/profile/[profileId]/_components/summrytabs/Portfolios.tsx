import React from 'react'

const Portfolios = () => {
    return (
        <div>
            {/* My Portfolios */}
            <div className="">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">My Portfolios</h2>
                </div>
                <div className="flex flex-wrap gap-10">
                    {[
                        { name: "GitHub", img: "/images/git.png", url: "https://github.com" },
                        { name: "Dribbble", img: "/images/dribble.png", url: "https://dribbble.com" },
                        { name: "Figma", img: "/images/p1.png", url: "https://figma.com" },
                        { name: "YouTube", img: "/images/youtube.png", url: "https://youtube.com" },
                        { name: "Medium", img: "/images/medium.png", url: "https://medium.com" },

                    ].map((portfolio) => (
                        <div
                            key={portfolio.name}
                            className="w-32 h-40  flex flex-col items-center justify-between shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => window.open(portfolio.url, '_blank')}
                        >
                            <div className="w-60 h-40 flex items-center justify-center">
                                <img
                                    src={portfolio.img}
                                    className="w-10 h-10 object-contain"
                                    alt={portfolio.name}
                                />
                            </div>
                            <span className="text-sm font-semibold mt-2">{portfolio.name}</span>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-4">
                    <button className="text-blue-600">See more portfolio</button>
                </div>
            </div>
        </div>
    )
}

export default Portfolios