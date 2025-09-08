'use client';
import Clubs from "@/app/(dashboard)/_components/Clubs";
import Posts from "@/app/(dashboard)/_components/Posts";
import UpcomingEvents from "@/app/(dashboard)/_components/UpcomingEvents";
import ProgressProfile from "../_components/ProgressProfile";
import PostButton from "../profile/create/_components/PostButton";

const Home = () => {
  return (
    <div className="max-w-7xl overflow-y-auto md:overflow-y-hidden mx-auto h-[calc(100vh-10rem)] grid grid-cols-1 lg:grid-cols-7 gap-4 p-4 md:p-6 lg:p-8">
      {/* Left sidebar - hidden on mobile, shown on lg+ */}
      <div className="hidden lg:block h-fit lg:sticky lg:top-4 lg:col-span-2">
        <UpcomingEvents />
        <ProgressProfile />
      </div>
      
      {/* Main content - full width on mobile, center column on lg+ */}
      <div className="col-span-1 lg:col-span-3">
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm ">
          <PostButton />
        </div>
        <div className="overflow-y-auto max-h-[calc(100vh-200px)] lg:max-h-[calc(100vh-136px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <Posts />
        </div>
      </div>
      
      {/* Right sidebar - shown below posts on mobile, right column on lg+ */}
      <div className="lg:h-fit lg:sticky lg:top-4 lg:col-span-2 space-y-4">
        <div className="h-[calc(100vh-200px)] pb-10 lg:h-[calc(100vh-136px)] overflow-y-auto" >
        <Clubs />
        </div>
        {/* Show profile components on mobile below clubs */}
        <div className="lg:hidden space-y-4">
          <UpcomingEvents />
          <ProgressProfile />
        </div>
      </div>
    </div>
  );
};

export default Home;
