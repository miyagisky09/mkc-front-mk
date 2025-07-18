import React, { useState } from "react";
import { format } from "date-fns";
import truncateMiddle from "../../utils/truncate_text";
import { RiArrowDropDownLine } from "react-icons/ri";
import { motion } from "motion/react";
import { RoleShareRate } from "../../config";

interface Props {
  user: any;
  orgChildren: any[];
}

const MyCard = ({user, orgChildren}: Props) => {
  return (
    <section className="rounded-xl bg-gradient-to-b from-[#168DBC] to-[#653D83] w-[100%] font-btn max-w-[905px]">
      <div className="backdrop-brightness-50 flex flex-col w-[100%] rounded-xl gap-4 h-[100%] pb-4 relative">
        <div className="rounded-l-xl  w-[150px] md:w-[50%] h-[70px] md:h-[100px] rounded-b-none relative truncate z-20 clip-diagonal bg-[#1F2937] p-3 pr-10 text-white" />
        <div className="absolute top-5 md:top-8 md:left-6 left-4 z-20 flex items-center gap-3">
          <img src="/images/crown.svg" alt="MKC" className="z-20" />
          <div className="flex items-center gap-2 md:flex-row md:gap-2">
            <p className="font-normal text-[16px] lg:text-[20px] text-white z-20">
              My Role
            </p>
            <p className="font-medium text-[20px] lg:text-[24px] text-[#FFC107] z-20">
              {user.role || "No Role"}
            </p>
          </div>
        </div>

        {/* show self holding team holding data */}
        <div className="flex justify-evenly md:justify-start gap-8 text-[16px] px-1 md:ml-5 mt-[-20px] w-full">
          <div className="flex flex-col md:flex-row justify-start gap-1 items-center">
            <p className="text-[#888]">Self Holding</p>
            <p className="text-white font-bold">{`${user.nftAmount} NFTs`}</p>
          </div>
          <div className="flex flex-col md:flex-row justify-start gap-1 items-center">
            <p className="text-[#888]">Team Holding</p>
            <p className="text-white font-bold">{`${user.totalNftAmount} NFTs`}</p>
          </div>
        </div>

        {/* show left Team right Team data */}
        <div className="grid grid-cols-2 gap-1 justify-center md:justify-start md:ml-4 px-1">
          {/* Left Team */}
          <div
            className="flex flex-col items-center gap-3 text-[16px] p-2 rounded-lg"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
          >
            <p className="text-[#30B0C7]">Left Team</p>
            {orgChildren[0] ? (
              <div className="flex flex-col gap-2">
                <div className="flex gap-1">
                  <p className="text-[#888]">Total</p>
                  <p className="text-white font-bold">{`${orgChildren[0].totalNftAmount} NFTs`}</p>
                </div>
                {/* <div className="flex gap-1">
                  <p className="text-[#888]">Top Role:</p>
                  <p className="text-white font-bold">
                    {RoleShareRate[orgChildren[0].topRole] >
                    RoleShareRate[orgChildren[0].role]
                      ? orgChildren[0].topRole
                      : orgChildren[0].role == ""
                      ? "No Role"
                      : orgChildren[0].role}
                  </p>
                </div> */}
              </div>
            ) : (
              <p className="text-white">No Team</p>
            )}
          </div>
          {/* Right Team */}
          <div
            className="flex flex-col items-center gap-3 text-[16px] py-2 rounded-lg"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
          >
            <p className="text-[#30B0C7]">Right Team</p>
            {orgChildren[1] ? (
              <div className="flex flex-col gap-2">
                <div className="flex gap-1">
                  <p className="text-[#888]">Total</p>
                  <p className="text-white font-bold">{`${orgChildren[1].totalNftAmount} NFTs`}</p>
                </div>
                {/* <div className="flex gap-1">
                  <p className="text-[#888]">Top Role:</p>
                  <p className="text-white font-bold">
                    {RoleShareRate[orgChildren[1].topRole] >
                    RoleShareRate[orgChildren[1].role]
                      ? orgChildren[1].topRole
                      : orgChildren[1].role == ""
                      ? "No Role"
                      : orgChildren[1].role}
                  </p>
                </div> */}
              </div>
            ) : (
              <p className="text-white">No Team</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyCard;
