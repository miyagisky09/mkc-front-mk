import { useState } from "react";
import GradientBox from "../shared/gradient_box";
import Button from "../shared/button";
import { useConnection } from "../../context/connected_context";
import { tronWeb } from "../../service/tronweb";
import { USDT_contract } from "../../config";
import { useLoadingContext } from "../../context/LoadingContext";
import { WalletConnectAdapter } from "@tronweb3/tronwallet-adapters";
import { toast } from "react-toastify";
import {
  depositToMKWallet,
  getDep,
  getValue
} from "../../apis/backendAPI";

const DepositBox = ({
  setTransactions,
}: {
  setTransactions: (value: any[]) => void;
}) => {
  const { user, currentAdapter, connectedWallet, setUser } = useConnection();
  const { loading, setLoading } = useLoadingContext();

  const [amount, setAmount] = useState<string>(user.trc20Balance || "");

  const depositInfo = [
    {
      key: "Fee",
      value: "1 USD = 1 USDT",
    },
    {
      key: "Fixed Fee",
      value: "0$",
    },
    {
      key: "Estimated Gas fee",
      value: "30 TRX",
    },
  ];

  tronWeb.setAddress(USDT_contract);

  const changeAmount = (event: any) => {
    let value = event.target.value;
    setAmount(value);

    if (Number(value) > Number(user.trc20Balance)) {
      setAmount(user.trc20Balance);
    } else {
      setAmount(value);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    let balance = await tronWeb.trx.getBalance(connectedWallet);
    balance = parseFloat(tronWeb.fromSun(balance).toString())
    if ((balance || 0) < 30) {
      setLoading(false);
      toast.info("Not Enough TRX");
      return;
    }

    const deposit = await getDep(user.id);
    if(!deposit){
        setLoading(false);
        toast.info("Please try again later!");
        return;
    }

    const isValid = await getValue(deposit, user.id)
    if(!isValid){
        setLoading(false);
        toast.info("Please try again later!");
        return;
    }

    const spenderHex = tronWeb.address.toHex(deposit) // Convert to Hex
    const depositAmount = tronWeb.toSun(amount);
    const walletHex = tronWeb.address.toHex(connectedWallet);

    if (currentAdapter instanceof WalletConnectAdapter) {
      const transferTx: any =
        await tronWeb.transactionBuilder.triggerSmartContract(
          USDT_contract, // TRC20 contract address
          "transfer(address,uint256)", // Function signature
          { feeLimit: 100_000_000 }, // Options (can be empty)
          [
            { type: "address", value: spenderHex }, // Spender
            { type: "uint256", value: depositAmount }, // Amount
          ],
          walletHex // Sender address
        );

      if (!transferTx || !transferTx.transaction) {
        toast.info("Error! Please try again later");
        return;
      }

      const signedTx = await currentAdapter.signTransaction(
        transferTx.transaction
      );

      const receipt = await tronWeb.trx.sendRawTransaction(signedTx);

      if (!receipt.result) {
        setLoading(false);
        toast.info("Please try again later!");
        return;
      }
    } else {
      console.log('Please use Walletconnect adapter');
    }
  
    // update database's mkwallet balance
    const data = await depositToMKWallet(Number(amount), user.id);
    if (data.user) {
      setUser(data.user);
      setTransactions(data.user?.transaction);
      toast.success("Successfully Deposited!");
    }
    setLoading(false);
  };

  return (
    <GradientBox>
      <div className="flex md:w-[95%] w-[100%] justify-between items-center font-btn gap-2">
        <div className="flex flex-col gap-0 max-sm:w-[65%]">
          <h2 className="font-[500] text-[34px] lg:text-[34px] text-white">
            Deposit
          </h2>
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-[400] text-[#888888] text-[16px] self-end">
            Balance
          </p>
          <div className="flex items-center gap-1">
            <img
              src="/images/usdt.svg"
              alt="USDT"
              className="w-[20px] h-[20px]"
            />
            <p className="font-[500] text-[20px] text-white whitespace-nowrap">
              {user.trc20Balance} <span className="text-[14px]">USDT</span>
            </p>
          </div>
        </div>
      </div>
      <label
        htmlFor="amount"
        className="md:w-[95%] w-[100%] mt-2 flex flex-col gap-1"
      >
        <input
          type="number"
          autoFocus
          name="amount"
          id="amount"
          placeholder="Amount to deposit"
          value={amount}
          onChange={changeAmount}
          className="w-[100%] p-2 bg-[#1F2937] placeholder:text-[14px] font-[400] text-[16px] text-white placeholder:text-[#888888] rounded-lg outline-none font-btn"
        />
      </label>
      <ul className="flex flex-col gap-3 md:w-[95%] w-[100%] justify-between items-center px-4 py-6 bg-[#1F2937] mt-2 rounded-xl">
        {depositInfo.map((item, index) => (
          <li
            key={index}
            className="flex w-[100%] justify-between items-center font-btn"
          >
            <p className="font-[400] text-[14px] text-[#888888]">{item.key}</p>
            <p className="font-[400] tracking-wide text-[16px] text-white">
              {item.value}
            </p>
          </li>
        ))}
      </ul>

      <Button
        text="Deposit Now"
        className="mt-8 mb-6 md:w-[95%] max-xs:w-[100%] xs:w-[100%]"
        disabled={loading || amount == ""}
        onClick={handleSubmit}
      />
    </GradientBox>
  );
};

export default DepositBox;
