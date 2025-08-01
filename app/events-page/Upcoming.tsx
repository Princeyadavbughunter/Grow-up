import React from 'react'

const Upcoming = () => {
  const eventCards = [
    {
      date: "Web, May 08 @ 6:00 PM",
      attendees: "456 Buddy",
      title: "Building the Fastest Growing Gaming Tech",
      organizer: "Growbuddy Events",
      description: "For the Community, From The community",
      buttonText: "Register Now",
      bgColor: "bg-purple-100",
      iconColor: "bg-yellow-400",
      attendeesColor: "bg-purple-200",
    },
    {
      date: "Thu, May 15 @ 7:30 PM",
      attendees: "324 Buddy",
      title: "AI Revolution in Healthcare",
      organizer: "TechMed Conference",
      description: "Transforming patient care through innovation",
      buttonText: "Register Now",
      bgColor: "bg-white",
      iconColor: "bg-blue-400",
      attendeesColor: "bg-blue-200",
    },
    {
      date: "Sat, May 18 @ 2:00 PM",
      attendees: "789 Buddy",
      title: "Sustainable Tech for Tomorrow",
      organizer: "Green Innovation Hub",
      description: "Building eco-friendly solutions",
      buttonText: "Register Now",
      bgColor: "bg-green-50",
      iconColor: "bg-green-400",
      attendeesColor: "bg-green-200",
    },
    {
      date: "Mon, May 20 @ 5:00 PM",
      attendees: "567 Buddy",
      title: "Blockchain & Future Finance",
      organizer: "FinTech Summit",
      description: "Decentralized finance revolution",
      buttonText: "Register Now",
      bgColor: "bg-white",
      iconColor: "bg-orange-400",
      attendeesColor: "bg-orange-200",
    },
    {
      date: "Wed, May 22 @ 4:00 PM",
      attendees: "432 Buddy",
      title: "Design Thinking Workshop",
      organizer: "Creative Collective",
      description: "Human-centered problem solving",
      buttonText: "Register Now",
      bgColor: "bg-pink-50",
      iconColor: "bg-pink-400",
      attendeesColor: "bg-pink-200",
    },
  ];

  return (
    <div className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      {/* Main heading */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[40px] font-bold text-center text-[#4A4A4A] mb-8 sm:mb-10 md:mb-12 lg:mb-16">
        Upcoming Events
      </h1>

      {/* Events grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-12 max-w-7xl mx-auto">
        {eventCards.map((card, index) => (
          <div 
            key={index} 
            className={`p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 ${card.bgColor} border border-gray-100`}
          >
            {/* Date and attendees badges */}
            <div className="flex justify-between items-start gap-2 mb-4">
              <span className={`text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full ${card.iconColor} text-gray-800 flex-shrink-0`}>
                {card.date}
              </span>
              <span className={`text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full ${card.attendeesColor} text-gray-800 flex-shrink-0`}>
                {card.attendees}
              </span>
            </div>

            {/* Event content */}
            <div className="mb-4">
              <h3 className="text-lg sm:text-xl md:text-lg font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
                {card.title}
              </h3>
              <p className="text-sm sm:text-base md:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                {card.organizer}
              </p>
              <p className="text-xs sm:text-sm md:text-xs text-gray-500 leading-relaxed">
                {card.description}
              </p>
            </div>

            {/* Register button */}
            <button className="w-full py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white text-sm sm:text-base md:text-sm font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2">
              {card.buttonText}
            </button>
          </div>
        ))}
      </div>

      {/* Mobile scroll indicator (optional) */}
      <div className="flex justify-center mt-8 sm:hidden">
        <div className="flex space-x-2">
          {eventCards.map((_, index) => (
            <div 
              key={index} 
              className="w-2 h-2 rounded-full bg-gray-300"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Upcoming;