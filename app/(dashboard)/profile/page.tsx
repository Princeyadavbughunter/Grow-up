"use client";
import { useAuth } from "@/context/AuthContext";
import ProfileData from "./components/ProfileData";
import { useRouter } from "next/navigation";
import Summry from "./components/summrytabs/Summry";

const Page = () => {
  const {profileData} = useAuth();
  const router = useRouter();

  if (profileData===null) {
    router.push("/profile/create");
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] overflow-y-scroll justify-between px-4 sm:px-8 md:px-16 lg:px-32 xl:px-40 mx-auto max-w-7xl">
      {!profileData ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <>
          <ProfileData profileData={profileData} />
          <Summry profileData={profileData} />
        </>
      )}
    </div>
  );
};

export default Page;