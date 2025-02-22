'use client';
import Clubs from "@/app/(dashboard)/_components/Clubs";
import Posts from "@/app/(dashboard)/_components/Posts";
import UpcomingEvents from "@/app/(dashboard)/_components/UpcomingEvents";
import ProgressProfile from "./_components/ProgressProfile";
import PostButton from "./add-bio-main/_components/PostButton";

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-136px)] grid grid-cols-1 md:grid-cols-7 gap-4">
      <div className="h-fit md:sticky md:top-4 md:col-span-2">
        <UpcomingEvents />
        <ProgressProfile />
      </div>
      <div className="overflow-y-auto h-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent md:col-span-3">
        <PostButton />
        <Posts />
      </div>
      <div className="h-fit md:sticky md:top-4 md:col-span-2">
        <Clubs />
      </div>
    </div>
  );
};

export default Home;
