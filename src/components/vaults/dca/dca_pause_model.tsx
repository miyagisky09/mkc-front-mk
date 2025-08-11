import { motion } from "motion/react";
import { useConnection } from "../../../context/connected_context";
import { useLoadingContext } from "../../../context/LoadingContext";
import {
  pauseDCAVault,
} from "../../../apis/backendAPI";
import { toast } from "react-toastify";
import GradientBox from "../../shared/gradient_box";
import Button from "../../shared/button";

interface Props {
  setOpenPause: (value: boolean) => void;
  setDcaData: (value: boolean) => void;
  pauseItem: any;
}

const DCAPauseModal = ({
  pauseItem,
  setOpenPause,
  setDcaData,
}: Props) => {
  const { user, setUser } = useConnection();
  const { setLoading } = useLoadingContext();

  const handlePause = async () => {
    setLoading(true);
    const rdata = await pauseDCAVault(pauseItem.id);
    if (rdata.user) {
      setUser(rdata.user);
      setDcaData(rdata.user.dcaVault);
    }

    setOpenPause(false);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
    toast.success(`${pauseItem.token} status has updated!`);
  };

  return (
    <motion.div
      className="w-[100%] min-h-[80vh] flex items-center px-4 justify-center fixed top-0 left-0 backdrop-blur-sm z-50"
      initial={{ y: 20, opacity: 0.7 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <GradientBox className="z-50 shadow-lg8">
        <div className="flex flex-col w-full px-2 mt-3">
          <div className="flex items-center justify-between text-[#30B0C7]  text-[14px]">
            <p className="text-[#aaa]">Token</p>
            <p>{pauseItem.token}</p>
          </div>
          <div className="flex items-center justify-between text-[#30B0C7]  text-[14px]">
            <p className="text-[#aaa]">Amount per cycle</p>
            <p>{pauseItem.investAmount} USD</p>
          </div>
          <div className="flex items-center justify-between text-[#30B0C7]  text-[14px]">
            <p className="text-[#aaa]">Purchase Cycle</p>
            <p>{pauseItem.cycle} days</p>
          </div>
          <div className="flex items-center justify-between text-[#30B0C7]  text-[14px]">
            <p className="text-[#aaa]">Profit Amount</p>
            <p>{pauseItem.profit} USD</p>
          </div>
        </div>
        <Button
          onClick={handlePause}
          text={pauseItem.status == 'Paused' ? "Resume" : "Pause"}
          className="!w-[100%] !h-[40px]"
        />
        {/* <p className="text-white font-normal text-[14px] self-center">
          Withdrawal will be done after a day
        </p> */}
      </GradientBox>
      <div
        className="w-[100%] h-[100%] absolute top-0 left-0 z-15"
        onClick={() => setOpenPause(false)}
      />
    </motion.div>
  );
};

export default DCAPauseModal;
