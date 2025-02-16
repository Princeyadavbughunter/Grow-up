"use client";
import React from "react";
import SummryTab from "./components/SummryTab";
import ProfileData from "./components/ProfileData";

const Page = () => {
    return (
        <div className="flex flex-col justify-between px-40 mx-auto">
            <ProfileData />
            <SummryTab />
        </div>
    );
};

export default Page;
