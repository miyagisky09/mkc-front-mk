import { useState } from "react";
import GradientBox from "../shared/gradient_box";
import { IoLockClosedSharp } from "react-icons/io5";
import DepositModal from "./deposit_modal";
import { FaBan } from "react-icons/fa";

interface Props {
  icon: string;
  title: string;
  apy: number;
  balance: number;
  earning: number;
  lock_period: number;
  locked?: boolean;
  index: number;
  setRank: (value: string) => void;
  setDepositModal: (value: boolean) => void;
  setWithdrawModal: (value: boolean) => void;
  depositDisabled?: boolean;
  withdrawDisabled?: boolean;
  peLockRequired?: number;
}

const VaultsTemplate = (props: Props) => {
  const openDepositModal = () => {
    props.setDepositModal(true);
    props.setRank(props.title);
  };
  const openWithdrawModal = () => {
    props.setWithdrawModal(true);
    props.setRank(props.title);
  };

  return (
    <GradientBox key={props.index}>
      <div className="flex w-[100%] flex-col gap-4 md:flex-row md:items-end  md:pb-4">
        <div className="flex flex-col gap-4 items-center w-[100%] md:w-[70%] md:px-4">
          <div className="flex w-[100%] items-center justify-between text-white font-btn pt-4  md:self-start">
            <div className="flex items-center gap-2">
              {/* <img src={props.icon} alt={props.title} /> */}
              <div className="flex flex-col items-start">
                <p className="font-[500] text-[20px]">{props.title}</p>
                {/* <p className="font-[400] text-[16px] text-[#888888]">
                                        Requires {props.nft_requirement} NFTs
                                    </p> */}
              </div>
            </div>
            <p className="bg-[#1A3947] rounded-lg w-[90px] h-[29px] text-[14px] text-[#30B0C7] font-[400] flex items-center justify-center">
              {props.apy}% APY
            </p>
          </div>

          <div className="w-[100%] flex flex-col gap-2 text-white md:self-start md:mt-3">
            {props.peLockRequired && (
              <div className="flex justify-between">
                <p className="font-[400] text-[16px] text-[#888888]">
                  Required Lock Period
                </p>
                <p className="font-bold text-[16px]">
                  {props.peLockRequired} days
                </p>
              </div>
            )}
            <div className="flex justify-between">
              <p className="font-[400] text-[16px] text-[#888888]">
                Total Balance
              </p>
              <p className="font-bold text-[16px]">
                {(props.balance + props.earning).toLocaleString()} USDT
              </p>
            </div>
            <div className="flex justify-between">
              <p className="font-[400] text-[16px] text-[#888888]">
                Profit Amount
              </p>
              <p className="text-[16px] font-[500] text-[#30B0C7]">
                + {props.earning.toLocaleString()} USDT
              </p>
            </div>
            <div className="flex justify-between">
              <p className="font-[400] text-[16px] text-[#888888]">Duration</p>
              <p className="text-[16px] font-[500] text-[#30B0C7]">
                {`${props.lock_period} day${props.lock_period > 1 ? "s" : ""}`}
              </p>
            </div>
          </div>
        </div>

        {props.locked ? (
          <div className="flex w-[100%] md:w-[30%] items-center justify-between max-md:my-4 text-white md:flex-col md:gap-14 gap-4">
            <p className="font-[300] tracking-wide text-[16px] flex gap-2 items-center">
              Locked <IoLockClosedSharp className="text-[20px] text-wrap" />
            </p>
            <p className="bg-[#1F2937] text-wh rounded-lg w-[188px] h-[37px] flex items-center justify-center font-[300] text-[16px]">
              Role Upgrade Required
            </p>
          </div>
        ) : (
          <div className="flex w-[100%]  md:w-[30%] items-center max-md:justify-between max-md:my-4 md:flex-col gap-4 md:gap-14">
            <button
              className="w-[169px] h-[37px] rounded-lg bg-[#30B0C7] font-btn text-[16px] font-medium  flex items-center justify-center text-white"
              onClick={openDepositModal}
              disabled={props.depositDisabled}
            >
              Deposit
            </button>
            <button
              className={`relative w-[169px] h-[37px] rounded-lg text-[#FF5C5C] text-[16px] font-medium  flex items-center gap-1 justify-center ${
                props.balance && !props.withdrawDisabled
                  ? "bg-[#300404]"
                  : "bg-[#4c2f2f] text-[#855f5f]"
              }`}
              onClick={openWithdrawModal}
              disabled={!props.balance || props.withdrawDisabled}
            >
              {(!props.balance || props.withdrawDisabled) && <FaBan />}
              <p className="z-3">Withdraw</p>
            </button>
          </div>
        )}
      </div>
    </GradientBox>
  );
};

export default VaultsTemplate;
