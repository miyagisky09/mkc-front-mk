import { useState } from "react";
import GradientBox from "../shared/gradient_box";
import Button from "../shared/button";
import { motion } from "motion/react";
import { useConnection } from "../../context/connected_context";
import { toast } from "react-toastify";
import { useLoadingContext } from "../../context/LoadingContext";
import { depositToVault } from "../../apis/backendAPI";

interface Props {
  setDepositModal: React.Dispatch<React.SetStateAction<boolean>>;
  setVaultPlans: React.Dispatch<React.SetStateAction<any>>;
  setVaultTransactions: React.Dispatch<React.SetStateAction<any[]>>;
  vault: string;
  apy: number;
}

const DepositModal = ({
  vault,
  apy,
  setDepositModal,
  setVaultPlans,
  setVaultTransactions,
}: Props) => {
  const { user, setUser } = useConnection();
  const { setLoading } = useLoadingContext();

  const [amount, setAmount] = useState<string>("");
  const [estimatedProfit, setEstimatedProfit] = useState<number>(0);

  const changeAmount = (value: string) => {
    const amount = value;

    if (amount === "") {
      setAmount("");
      setEstimatedProfit(0);
      return;
    }

    setAmount(amount);
    const profitAmount = (Number(amount) * apy) / 100;
    setEstimatedProfit(profitAmount);
  };

  const handleDeposit = async () => {
    if (Number(amount) > user.mkBalance) {
      toast.info("Your balance is insufficient");
      return;
    }
    if (Number(amount) < 10) {
      toast.info("Minimum Amount to deposit is 10 USD");
      return;
    }

    setLoading(true);
    const rdata = await depositToVault(user.id, vault, Number(amount));
    if (rdata.user) {
      setUser(rdata.user);
      if (rdata.user.vault) {
        rdata.user.vault.map((vault: any, index: number) => {
          setVaultPlans((prev: any) => ({
            ...prev,
            [vault.rank]: {
              ...prev[vault.rank],
              balance: vault.vaultAmount,
              earning: vault.profitAmount,
            },
          }));
        });
      }
    }
    if (rdata.vaultTransactions) {
      setVaultTransactions(rdata.vaultTransactions);
    }

    setDepositModal(false);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
    toast.success(`Deposited ${amount} USD to ${vault} Vault!`);
  };

  return (
    <motion.div
      className="w-[100%] min-h-[100vh] flex items-center px-4 justify-center fixed top-0 left-0 backdrop-blur-sm z-50"
      initial={{ y: 20, opacity: 0.7 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <GradientBox className="z-50 shadow-lg8">
        <label
          htmlFor="amount"
          className="w-[100%] flex flex-col gap-1 items-center justify-center text-white"
        >
          <p className="font-[400] text-[16px] self-start">Amount</p>
          <div className="flex w-[95%] self-center rounded-lg p-4 bg-[#1F2937]">
            <input
              type="number"
              name="amount"
              autoFocus
              placeholder="Enter deposit amount"
              onChange={(e) => changeAmount(e.target.value)}
              value={amount}
              id="amount"
              className=" placeholder:text-[14px] font-[400] text-[16px] text-white bg-inherit placeholder:text-[#888888] rounded-lg outline-none px-2 w-[87%] font-btn"
            />
            <p
              className="font-medium text-[14px] text-[#32ADE6] flex items-center"
              onClick={() => changeAmount(user.mkBalance)}
            >
              MAX
            </p>
          </div>
        </label>
        <div className="flex flex-col gap-2 text-[16px] w-full px-5 mt-2">
          <div className="flex justify-between w-full">
            <p className="text-[#888]">APY</p>
            <p className="text-white">{apy}%</p>
          </div>
          <div className="flex justify-between w-full">
            <p className="text-[#888]">Vault Rank</p>
            <p className="text-white">{vault}</p>
          </div>
          <div className="flex justify-between w-full">
            <p className="text-[#888]">Estimated Profit</p>
            <p className="text-white">{estimatedProfit.toFixed(2)} USD</p>
          </div>
        </div>
        <Button
          onClick={handleDeposit}
          text="Deposit"
          className="!w-[100%] mt-4"
        />
      </GradientBox>
      <div
        className="w-[100%] h-[100%] absolute top-0 left-0 z-15"
        onClick={() => setDepositModal(false)}
      />
    </motion.div>
  );
};

export default DepositModal;
