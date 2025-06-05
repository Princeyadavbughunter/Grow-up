"use client";
import { useAuth } from "@/context/AuthContext";
import SummryTab from "./components/SummryTab";
import ProfileData from "./components/ProfileData";
import { useRouter } from "next/navigation";

const Page = () => {
  const {profileData} = useAuth();
  const router = useRouter();

  if (profileData===null) {
    router.push("/profile/create");
  }

  return (
    <div className="flex flex-col justify-between px-40 mx-auto">
      {!profileData ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <>
          <ProfileData profileData={profileData} />
          <SummryTab profileData={profileData} />
        </>
      )}
    </div>
  );
};

export default Page;