'use client';
import Clubs from "@/app/(dashboard)/_components/Clubs";
import Posts from "@/app/(dashboard)/_components/Posts";
import UpcomingEvents from "@/app/(dashboard)/_components/UpcomingEvents";
import ProgressProfile from "./_components/ProgressProfile";
import PostButton from "./profile/create/_components/PostButton";

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-136px)] grid grid-cols-1 lg:grid-cols-7 gap-4 p-4 md:p-6 lg:p-8">
      <div className="h-fit lg:sticky lg:top-4 lg:col-span-2">
        <UpcomingEvents />
        <ProgressProfile />
      </div>
      <div className="overflow-y-auto h-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent md:col-span-3">
        <div className="sticky top-0 z-10 ">
          <PostButton />
        </div>
        <Posts />
      </div>
      <div className="h-fit lg:sticky lg:top-4 lg:col-span-2">
        <Clubs />
      </div>
    </div>
  );
};

export default Home;
