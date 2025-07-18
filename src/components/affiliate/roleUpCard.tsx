import React, { useState } from "react";
import { format } from "date-fns";
import truncateMiddle from "../../utils/truncate_text";
import { RiArrowDropDownLine } from "react-icons/ri";
import { motion } from "motion/react";
import { RoleShareRate, RolesUpData, RolesUpData_new } from "../../config";
import GradientBox from "../shared/gradient_box";

interface Props {
  user: any;
  orgChildren: any[];
}

const RoleUpCard = ({ user, orgChildren }: Props) => {
  let smallHolding = 0;
  if (orgChildren[1]) {
    smallHolding =
      orgChildren[0].totalNftAmount < orgChildren[1].totalNftAmount
        ? orgChildren[0].totalNftAmount
        : orgChildren[1].totalNftAmount;
  } else {
    smallHolding = 0;
  }

  // role up card is for new role condition
  const myRoleCondition = RolesUpData_new.filter(
    (item: any) => item.label == user.newRole
  )[0];

  const selfCondition: boolean = user.nftAmount >= myRoleCondition.selfHolding;
  const teamCondition: boolean = myRoleCondition.totalHolding
    ? user.totalNftAmount >= myRoleCondition.totalHolding &&
      smallHolding >= myRoleCondition.smallHolding
    : false;
  const position = RolesUpData_new.indexOf(myRoleCondition);
  const roleUpData = position == 0 ? null : RolesUpData_new[position - 1];

  return (
    <GradientBox className="px-2">
      <div className="flex items-center w-full text-white">
        {/* <img src="/images/roleUp.svg" alt="roleUp" /> */}
        <p className="text-[20px] ml-2">
          New Role Up to{" "}
          <span className="text-[#32ADE6]">
            {roleUpData?.label ? roleUpData.label : "End"}
          </span>
        </p>
      </div>

      {/* Compare data */}
      <div className="grid grid-cols-2 gap-2">
        {/* My Role Data */}
        <div
          className="flex flex-col items-center gap-3 text-[16px] p-2 rounded-lg text-white"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
        >
          <p className="font-medium text-[20px]">My Role</p>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-col gap-1">
              <div className="flex gap-1 items-center">
                <p className="text-[#30B0C7]">Self Holding</p>
                {/* {selfCondition && (
                  <img src="/images/correct.svg" width={15} alt="correct" />
                )} */}
              </div>
              <ul className="list-disc list-inside">
                <li className="text-white pl-2">{`${user.nftAmount} NFTs`}</li>
              </ul>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex gap-1 items-center">
                <p className="text-[#30B0C7]">Team Holding</p>
                {/* {teamCondition && (
                  <img src="/images/correct.svg" width={15} alt="correct" />
                )} */}
              </div>
              <ul className="list-disc list-inside">
                <li className="text-white pl-2">{`${user.totalNftAmount} NFTs`}</li>
                {smallHolding > 0 && (
                  <li className="text-white pl-2">
                  {smallHolding} NFTs <span className="text-[#888]">in Small Team</span>
                </li>
                )}
              </ul>
            </div>
          </div>
        </div>
        {/* Role Data to be Up */}
        <div
          className={`flex flex-col items-center gap-3 p-2 rounded-lg text-white ${
            roleUpData ? "justify-start" : "justify-center"
          }`}
          style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
        >
          {roleUpData ? (
            <>
              <p className="font-bold text-[20px] text-[#32ADE6]">
                {roleUpData?.label}
              </p>
              <div className="flex flex-col gap-2 w-full">
                <div className="flex flex-col gap-1">
                  <p className="text-[#30B0C7]">Self Holding</p>
                  <ul className="list-disc list-inside">
                    <li className="text-white pl-2">{`${roleUpData?.selfHolding} NFTs`}</li>
                  </ul>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-[#30B0C7]">Team Holding</p>
                  {roleUpData.totalHolding ? (
                    <ul className="list-disc list-inside">
                      <li className="text-white pl-2">{`${roleUpData?.totalHolding} NFTs`}</li>
                      <li className="text-white pl-2">
                        {`${roleUpData?.smallHolding} NFTs`}
                        <span className="text-[#888]"> in Small Team</span>
                      </li>
                    </ul>
                  ) : (
                    <ul className="list-disc list-inside">
                      <li className="text-white">No Team Condition Needed</li>
                    </ul>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-[20px] text-center text-[#FF2D55]">
              You are in <br /> Top Role now
            </div>
          )}
        </div>
      </div>
    </GradientBox>
  );
};

export default RoleUpCard;
