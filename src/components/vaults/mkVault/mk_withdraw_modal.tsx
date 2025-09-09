
import { motion } from "motion/react";
import { useConnection } from "../../../context/connected_context";
import { useLoadingContext } from "../../../context/LoadingContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { withdrawFromMkVault } from "../../../apis/backendAPI";
import GradientBox from "../../shared/gradient_box";
import Button from "../../shared/button";
interface Props {
  setWithdrawModal: React.Dispatch<React.SetStateAction<boolean>>;
  setMkVaults: React.Dispatch<React.SetStateAction<any>>;
  setVaultTransactions: React.Dispatch<React.SetStateAction<any[]>>;
  vault: any;
}

const MkWithdrawModal = ({
  vault,
  setWithdrawModal,
  setMkVaults,
  setVaultTransactions,
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

    const profit = vault?.profitAmount;
    const deposit = vault?.vaultAmount;

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

    const rdata = await withdrawFromMkVault(user.id, vault.id, Number(withdrawAmount), feeAmount);
    if (rdata.user) {
      setUser(rdata.user);
      setMkVaults(rdata.user.mkVault);
    }
    if (rdata.mkVaultTransactions) {
      setVaultTransactions(rdata.mkVaultTransactions);
    }

    setWithdrawModal(false);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
    toast.success(`Withdraw Requested from ${vault} Vault!`);
  };

  useEffect(() => {
    changeAmount(vault?.vaultAmount + vault?.profitAmount);
  }, [])

  return (
    <motion.div
      className="w-[100%] min-h-[100vh] flex items-center px-4 justify-center fixed top-0 left-0 backdrop-blur-sm z-50"
      initial={{ y: 20, opacity: 0.7 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <GradientBox className="z-50 shadow-lg8">
        <div className="flex flex-col gap-1 text-[14px] text-[#30B0C7] w-full px-3">
          <div className="flex justify-between">
            <p>Deposited</p>
            <p className="text-white">{vault?.vaultAmount} USD</p>
          </div>
          <div className="flex justify-between">
            <p>Earnings</p>
            <p className="text-white">{vault?.profitAmount} USD</p>
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

export default MkWithdrawModal;
