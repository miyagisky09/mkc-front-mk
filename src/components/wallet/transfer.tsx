import { useCallback, useEffect, useState } from "react";
import GradientBox from "../shared/gradient_box";
import Button from "../shared/button";
import { motion } from "motion/react";
import { useConnection } from "../../context/connected_context";
import { toast } from "react-toastify";
import { useLoadingContext } from "../../context/LoadingContext";
import { getAllUsers, TransferBalance_api } from "../../apis/backendAPI";
import {
  Autocomplete,
  createTheme,
  ListItem,
  TextField,
  ThemeProvider,
} from "@mui/material";

interface Props {
  user: any;
  setUser: (value: any) => void;
  setTransactions: (value: any[]) => void;
  setTransferModal: (value: boolean) => void;
}

const TransferBalance = ({
  user,
  setTransactions,
  setUser,
  setTransferModal,
}: Props) => {
  const { loading, setLoading } = useLoadingContext();

  const [amount, setAmount] = useState<string>("");
  const [userList, setUserList] = useState<any[]>([]);
  const [receiver, setReceiver] = useState<any>(null);
  const [walletID, setWalletID] = useState<string>("");
  const [isMatch, setIsMatch] = useState<boolean>(true);

  const init = useCallback(async () => {
    setLoading(true);
    const rdata = await getAllUsers(user?.id);
    if (rdata.users) {
      setUserList(rdata.users);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    init();
  }, []);

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const changeWalleID = (value: string) => {
    setWalletID(value);
    const match = userList.filter((item: any) => item.mkWalletID == value)[0];
    if (match) {
      setReceiver(match);
      setIsMatch(true);
    } else {
      setIsMatch(false);
      setReceiver(null);
    }
  };

  const changeAmount = (value: string) => {
    if (Number(value) > user.mkBalance) {
      value = user.mkBalance;
    }
    setAmount(value);
  };

  const handleSubmit = async () => {
    console.log(amount, receiver);
    if (Number(amount) <= 0 || !receiver) {
      toast.info("Please input correct data");
      return;
    }
    setLoading(true);
    const rdata = await TransferBalance_api(
      user.id,
      receiver.id,
      Number(amount)
    );
    if (rdata.user) {
      setUser(rdata.user);
      setTransactions(rdata.user.transaction);
    }

    setTransferModal(false);
    setTimeout(() => {
      setLoading(false);
    }, 2000);

    toast.success(`Sent ${amount} USD to ${receiver.mkWalletID}!`);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <motion.div
        className="w-[100%] min-h-[100vh] flex items-center px-4 justify-center fixed top-0 left-0 backdrop-blur-sm z-50"
        initial={{ y: 40, opacity: 0.7 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <GradientBox className="z-50 shadow-lg8">
          <div
            className={`flex self-center rounded-lg p-2 bg-[#1F2937] border ${isMatch? 'border-[#555]' : '!border-[#FF5C5C]'} w-full`}
          >
            <input
              type="text"
              name="walletID"
              autoFocus
              placeholder="Enter Wallet ID"
              onChange={(e) => changeWalleID(e.target.value)}
              value={walletID}
              id="walletID"
              className="w-full placeholder:text-[14px] font-[400] text-[16px] text-white bg-inherit placeholder:text-[#888888] rounded-lg outline-none px-2 font-btn"
            />
          </div>
          <div className="flex self-center rounded-lg p-2 bg-[#1F2937] border border-[#555] w-full">
            <input
              type="number"
              name="amount"
              placeholder="Enter deposit amount"
              onChange={(e) => changeAmount(e.target.value)}
              value={amount}
              id="amount"
              className="w-[87%] placeholder:text-[14px] font-[400] text-[16px] text-white bg-inherit placeholder:text-[#888888] rounded-lg outline-none px-2 font-btn"
            />
            <p
              className="font-medium text-[14px] text-[#32ADE6] flex items-center"
              onClick={() => changeAmount(user.mkBalance)}
            >
              MAX
            </p>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            text="Transfer"
            className="!w-[100%] mt-4"
          />
        </GradientBox>
        <div
          className="w-[100%] h-[100%] absolute top-0 left-0 z-15"
          onClick={() => setTransferModal(false)}
        />
      </motion.div>
    </ThemeProvider>
  );
};

export default TransferBalance;
