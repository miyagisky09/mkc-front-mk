import { useEffect, useState } from "react";
import GradientBox from "../shared/gradient_box";
import Button from "../shared/button";
import { useConnection } from "../../context/connected_context";
import { useNavigate } from "react-router-dom";

const ConnectWalletTwo = ({
  onClick,
  setWalletID,
  walletID,
}: {
  onClick: () => void;
  setWalletID: (value: string) => void;
  walletID: string;
}) => {
  const { user, isConnected } = useConnection();
  const navigate = useNavigate();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value;
    if (value.length > 12) {
      return;
    }
    if (/[A-Za-z0-9_-]+$/.test(value) || !value) {
      setWalletID(value);
      return;
    }
  };

  useEffect(() => {
    if (user && isConnected) {
      navigate("/deposit-withdraw");
    }
  }, []);

  return (
    <GradientBox>
      <div className="flex flex-col gap-0 w-[100%] pb-4 justify-center items-center font-btn">
        <h1 className="font-[500] text-[20px] md:text-[28px] lg:text-[34px] text-white">
          Create your MK Wallet
        </h1>
        <p className="text-[16px] font-[400] text-[#888888] text-center">
          Your gateway to decentralized finance.
        </p>
      </div>

      <div className="flex flex-col gap-2 items-start w-[100%] font-btn">
        <h2 className="text-white font-[500] text-[20px] max-md:text-[16px] font-btn">
          Your Wallet ID
        </h2>
        <input
          type="text"
          value={walletID}
          onChange={onChange}
          pattern="[a-zA-Z0-9]*"
          placeholder="Enter name"
          className="w-[100%] p-4 bg-[#1F2937] placeholder:text-[14px] font-[400] text-[16px] text-white placeholder:text-[#888888] rounded-lg outline-none font-btn"
        />
      </div>

      <div className="flex items-center justify-between w-[100%] mt-4 font-btn">
        <p className="text-[16px] font-[400] text-[#888888]">
          Estimated Gas fee
        </p>
        <p className="text-[16px] font-[400] text-white">0 TRX</p>
      </div>

      <Button
        onClick={onClick}
        text="Create your Wallet"
        className="mt-8 !w-[100%] max-md:h-[40px]"
      />
    </GradientBox>
  );
};

export default ConnectWalletTwo;
