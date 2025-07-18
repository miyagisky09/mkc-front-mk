import { motion } from "motion/react";
import { useConnection } from "../../../context/connected_context";
import { useLoadingContext } from "../../../context/LoadingContext";
import {
  withdrawFromDCAVault,
  withdrawFromVault,
} from "../../../apis/backendAPI";
import { toast } from "react-toastify";
import GradientBox from "../../shared/gradient_box";
import Button from "../../shared/button";

interface Props {
  setOpenWithdraw: React.Dispatch<React.SetStateAction<boolean>>;
  setDcaData: React.Dispatch<React.SetStateAction<any>>;
  setDcaTransactions: React.Dispatch<React.SetStateAction<any[]>>;
  withdrawItem: any;
}

const DCAWithdrawModal = ({
  withdrawItem,
  setOpenWithdraw,
  setDcaData,
  setDcaTransactions,
}: Props) => {
  console.log(withdrawItem);
  const { user, setUser } = useConnection();
  const { setLoading } = useLoadingContext();

  const handleWithdraw = async () => {
    setLoading(true);
    const rdata = await withdrawFromDCAVault(withdrawItem, user.id);
    console.log(rdata);
    if (rdata.user) {
      console.log(rdata.dcaVaultTransactions)
      setUser(rdata.user);
      setDcaData(rdata.user.dcaVault);
      setDcaTransactions(rdata.dcaVaultTransactions);
    }

    setOpenWithdraw(false);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
    toast.success(`Withdraw Requested from ${withdrawItem.token}!`);
  };

  return (
    <motion.div
      className="w-[100%] min-h-[100vh] flex items-center px-4 justify-center fixed top-0 left-0 backdrop-blur-sm z-50"
      initial={{ y: 20, opacity: 0.7 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <GradientBox className="z-50 shadow-lg8">
        <div className="flex flex-col w-full px-2 mt-3">
          <div className="flex items-center justify-between text-[#30B0C7]  text-[14px]">
            <p className="text-[#aaa]">Token</p>
            <p>{withdrawItem.token}</p>
          </div>
          <div className="flex items-center justify-between text-[#30B0C7]  text-[14px]">
            <p className="text-[#aaa]">Invest Amount</p>
            <p>{withdrawItem.investAmount} USD</p>
          </div>
          <div className="flex items-center justify-between text-[#30B0C7]  text-[14px]">
            <p className="text-[#aaa]">Profit Amount</p>
            <p>{withdrawItem.profit} USD</p>
          </div>
          <div className="flex items-center justify-between text-[#30B0C7]  text-[14px]">
            <p className="text-[#aaa]">You will receive</p>
            <p>
              {withdrawItem.profit > 0
                ? (withdrawItem.investAmount + withdrawItem.profit * 0.8).toFixed(3)
                : withdrawItem.investAmount}{" "}
              USD
            </p>
          </div>
        </div>
        <Button
          onClick={handleWithdraw}
          text="Withdraw"
          className="!w-[100%] !h-[40px]"
        />
        <p className="text-white font-normal text-[14px] self-center">
          Withdrawal will be done after a day
        </p>
      </GradientBox>
      <div
        className="w-[100%] h-[100%] absolute top-0 left-0 z-15"
        onClick={() => setOpenWithdraw(false)}
      />
    </motion.div>
  );
};

export default DCAWithdrawModal;
