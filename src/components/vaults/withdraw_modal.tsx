import { useState } from "react";
import GradientBox from "../shared/gradient_box";
import Button from "../shared/button";
import { motion } from "motion/react";
import { useConnection } from "../../context/connected_context";
import { toast } from "react-toastify";
import { useLoadingContext } from "../../context/LoadingContext";
import { withdrawFromVault } from "../../apis/backendAPI";

interface Props {
  setWithdrawModal: React.Dispatch<React.SetStateAction<boolean>>;
  setVaultPlans: React.Dispatch<React.SetStateAction<any>>;
  setVaultTransactions: React.Dispatch<React.SetStateAction<any[]>>;
  vault: string;
  currentData: any;
  defaultVaultPlans: any;
}

const WithdrawModal = ({
  vault,
  currentData,
  setWithdrawModal,
  setVaultPlans,
  setVaultTransactions,
  defaultVaultPlans,
}: Props) => {
  const { user, setUser } = useConnection();
  const { loading, setLoading } = useLoadingContext();

  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [receiveAmount, setReceiveAmount] = useState<number>(0);
  const [feeAmount, setFeeAmount] = useState<number>(0);

  const changeAmount = (value: string) => {
    let withdraw = Number(value);
    if (withdraw == 0) {
      setWithdrawAmount("");
      setReceiveAmount(0);
      setFeeAmount(0);
      return;
    }

    const profit = currentData?.earning;
    const deposit = currentData?.balance;

    if (withdraw > profit + deposit) {
      withdraw = profit + deposit;
    }
    setWithdrawAmount(withdraw.toString());

    let receive = 0;
    let fee = 0;
    if (withdraw >= profit) {
      // e.x withdraw is 50, profit is 10
      receive += profit * 0.8;
      receive += withdraw - profit;
      fee = profit * 0.2;
    } else {
      receive = withdraw * 0.8;
      fee = withdraw * 0.2;
    }
    setReceiveAmount(receive);
    setFeeAmount(fee);
  }

  const handleWithdraw = async () => {
    if (!withdrawAmount) {
      toast.info('Please Enter Amount');
      return;
    }
    setLoading(true);
    const rdata = await withdrawFromVault(user.id, vault, Number(withdrawAmount), feeAmount);
    if (rdata.user) {
      setUser(rdata.user);
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
      if (rdata.user.vault.length == 0) {
        setVaultPlans(defaultVaultPlans);
      }
    }
    if (rdata.vaultTransactions) {
      setVaultTransactions(rdata.vaultTransactions);
    }

    setWithdrawModal(false);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
    toast.success(`Withdraw Requested from ${vault} Vault!`);
  };

  return (
    <motion.div
      className="w-[100%] min-h-[100vh] flex items-center px-4 justify-center fixed top-0 left-0 backdrop-blur-sm z-50"
      initial={{ y: 20, opacity: 0.7 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <GradientBox className="z-50 shadow-lg8">
        <div className="flex self-center rounded-lg p-3 bg-[#181F33] mt-2">
          <input
            type="number"
            name="amount"
            autoFocus
            placeholder="Enter withdraw amount"
            onChange={(e) => changeAmount(e.target.value)}
            value={withdrawAmount}
            id="amount"
            className=" placeholder:text-[14px] font-[400] text-[16px] text-white bg-inherit placeholder:text-[#888888] rounded-lg outline-none px-2 w-[87%] font-btn"
          />
          <p
            className="font-medium text-[14px] text-[#32ADE6] flex items-center"
            onClick={() => changeAmount(currentData?.balance + currentData?.earning)}
          >
            MAX
          </p>
        </div>
        <div className="flex flex-col gap-1 text-[14px] text-[#30B0C7] w-full px-3">
          <div className="flex justify-between">
            <p>Deposited</p>
            <p className="text-white">{currentData?.balance} USD</p>
          </div>
          <div className="flex justify-between">
            <p>Earnings</p>
            <p className="text-white">{currentData?.earning} USD</p>
          </div>
          <hr className="border-[#555]" />
          <div className="flex justify-between">
            <p>Withdraw Amount</p>
            <p className="text-white">{withdrawAmount || 0} USD</p>
          </div>
          <div className="flex justify-between">
            <p>Fee Amount</p>
            <p className="text-white">{feeAmount.toFixed(2) || 0} USD</p>
          </div>
          <div className="flex justify-between">
            <p>You will receive</p>
            <p className="text-white">{receiveAmount.toFixed(2)} USD</p>
          </div>
        </div>
        <Button
          onClick={handleWithdraw}
          text="Withdraw"
          disabled={withdrawAmount == '' || loading}
          className="!w-[100%] mt-4"
        />
        <p className="text-white font-normal text-[14px] self-center">
          Withdrawal will be done after a day
        </p>
      </GradientBox>
      <div
        className="w-[100%] h-[100%] absolute top-0 left-0 z-15"
        onClick={() => setWithdrawModal(false)}
      />
    </motion.div>
  );
};

export default WithdrawModal;
