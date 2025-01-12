import { Description } from '@radix-ui/react-dialog'
import React from 'react'

const ShowCasePortfolios = () => {
    return (
        <div>
            <div className="mt-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Showcase your porfolio</h2>
                </div>
                <div className="flex flex-wrap gap-5">
                    {[
                        { name: "GitHub", img: "./images/git.png", Description: "Connect your github profile with Growup buddy" },
                        { name: "Dribbble", img: "./images/dribble.png", Description: "Connect your github profile with Growup buddy" },
                        { name: "Figma", img: "./images/p1.png", Description: "Connect your github profile with Growup buddy" },
                        { name: "YouTube", img: "./images/youtube.png", Description: "Connect your github profile with Growup buddy" },
                        { name: "Medium", img: "./images/medium.png", Description: "Connect your github profile with Growup buddy" },
                        { name: "Figma", img: "./images/p1.png", Description: "Connect your github profile with Growup buddy" },
                        { name: "YouTube", img: "./images/youtube.png", Description: "Connect your github profile with Growup buddy" },
                        { name: "YouTube", img: "./images/youtube.png", Description: "Connect your github profile with Growup buddy" },

                    ].map((portfolio) => (
                        <div
                            key={portfolio.name}
                            className="w-32 h-48  flex flex-col items-center justify-between border rounded-2xl p-4"
                        >
                            <div className="w-60 h-40 flex items-center justify-center">
                                <img
                                    src={portfolio.img}
                                    className="w-10 h-10 object-contain"
                                />
                            </div>
                            <span className="text-sm font-semibold mt-2">{portfolio.name}</span>
                            <span className="text-sm font-semibold mt-2 text-center">{portfolio.Description}</span>
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

export default ShowCasePortfolios