"use client";

import { User } from "@/components/renderPages";
import MultiplePostsSkeleton from "@/components/skeletons/multiplePostSkeleton";
import { Button } from "@/components/ui/button";
import ProfileImage from "@/components/ui/profileImage";
import { communityState } from "@/state/atoms/communityState";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";

const Page = () => {
  const [communities, setCommunities] = useRecoilState(communityState);
  const [parent, enableAnimations] = useAutoAnimate();

  useEffect(() => {
    const getCommunities = async () => {
      const { data } = await axios.get("/api/communities/getAll");
      setCommunities(data);
    };
    getCommunities();
  }, []);

  return (
    <div className=" flex flex-col gap-4 p-4 sm:p-8">
      <Link
        href="/create-community"
        className=" w-full rounded-full border-2 bg-darkTheme p-2 px-4 text-lg font-extrabold text-lightTheme dark:bg-lightTheme dark:text-darkTheme"
      >
        Create a new community
      </Link>

      {communities.length === 0 && <MultiplePostsSkeleton />}

      {communities.length > 0 && (
        <div className=" mt-4 grid gap-4" ref={parent}>
          {communities.map((community: Community) => {
            return (
              <div className=" gap-2 sm:flex" key={community.id}>
                <div className=" flex gap-2">
                  <ProfileImage src={community.imageUrl} size={80} />
                  <div className=" w-full">
                    <p className=" text-lg font-bold">{community.name}</p>
                    <p className=" text-darkGray dark:text-lightGray ">
                      {community.description}
                    </p>
                  </div>
                </div>

                <Button
                  className=" mt-2 w-full border-2 border-gray-500 sm:ml-auto sm:mt-0 sm:w-fit"
                  variant="secondary"
                  onClick={() => {
                    toast("join feature is in development");
                  }}
                >
                  Join
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Page;

export interface Community {
  id?: string;
  name: string;
  members: User[];
  description: string;
  imageUrl: string;
}
