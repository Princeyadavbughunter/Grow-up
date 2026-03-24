'use client';
import Clubs from "@/app/(dashboard)/_components/Clubs";
import Posts from "@/app/(dashboard)/_components/Posts";
import UpcomingEvents from "@/app/(dashboard)/_components/UpcomingEvents";
import ProgressProfile from "../_components/ProgressProfile";
import PostButton from "../profile/create/_components/PostButton";

const Home = () => {
  return (
    <div className="w-full font-work-sans grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-5 px-28 py-4 h-[calc(100vh-4.5rem)] overflow-hidden bg-white">

      {/* Left sidebar — 3/12 columns */}
      <div className="hidden lg:flex flex-col lg:col-span-3 h-full overflow-y-auto scrollbar-hide pb-20">
        <UpcomingEvents />
        <ProgressProfile />
      </div>

      {/* Center feed — 5/12 columns */}
      <div className="col-span-1 lg:col-span-5 flex flex-col h-full overflow-hidden">
        {/* Sticky create post */}
        <div className="flex-shrink-0 pt-2">
          <PostButton />
        </div>
        {/* Scrollable feed — no scrollbar */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pb-20 lg:pb-4">
          <Posts />
        </div>
      </div>

      {/* Right sidebar — 4/12 columns */}
      <div className="hidden lg:flex flex-col lg:col-span-4 h-full overflow-y-auto scrollbar-hide pb-20">
        <Clubs />
      </div>

      {/* Mobile: stacked below feed */}
      <div className="lg:hidden col-span-1 pb-24">
        <Clubs />
        <UpcomingEvents />
        <ProgressProfile />
      </div>
    </div>
  );
};

export default Home;
