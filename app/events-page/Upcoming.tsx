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
      bgColor: "bg-[#7052FF]/10",
      iconColor: "bg-yellow-400",
      attendeesColor: "bg-[#7052FF]/20",
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
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold bg-gradient-to-r from-[#FFFFFF] via-[#E9DAFF] to-[#FFFFFF] text-[#4A4A4A] leading-tight mb-6 sm:mb-8 max-w-4xl mx-auto py-2 sm:py-4 md:py-6 lg:py-8 px-2 sm:px-2 md:px-6 rounded-2xl sm:rounded-3xl whitespace-nowrap text-center">
        Upcoming Events
      </h1>

      {/* Events grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
        {eventCards.map((card, index) => (
          <div 
            key={index} 
            className={`p-3 sm:p-4 md:p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] ${card.bgColor} border border-gray-100 flex flex-col min-h-[280px] sm:min-h-[300px]`}
          >
            {/* Date and attendees badges */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3 sm:mb-4">
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${card.iconColor} text-gray-800 self-start truncate max-w-full`}>
                {card.date}
              </span>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${card.attendeesColor} text-gray-800 self-start sm:self-auto flex-shrink-0`}>
                {card.attendees}
              </span>
            </div>

            {/* Event content */}
            <div className="flex-1 mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 leading-tight overflow-hidden" style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}>
                {card.title}
              </h3>
              <p className="text-sm font-semibold text-gray-700 mb-1 sm:mb-2 truncate">
                {card.organizer}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed overflow-hidden" style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}>
                {card.description}
              </p>
            </div>

            {/* Register button */}
            <button className="w-full py-2 sm:py-2.5 rounded-lg bg-[#7052FF] hover:bg-[#5a42d4] active:bg-[#4a36b8] text-white text-sm font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#7052FF]/40 focus:ring-offset-2 mt-auto">
              {card.buttonText}
            </button>
          </div>
        ))}
      </div>

      {/* View More Button */}
      <div className="flex justify-center mt-8 sm:mt-12">
        <button className="px-6 py-3 bg-white border-2 border-[#7052FF] text-[#7052FF] font-semibold rounded-lg hover:bg-[#7052FF] hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#7052FF]/40 focus:ring-offset-2">
          View All Events
        </button>
      </div>
    </div>
  );
};

export default Upcoming;