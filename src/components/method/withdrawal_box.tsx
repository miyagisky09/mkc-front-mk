import { useState } from "react";
import GradientBox from "../shared/gradient_box";
import Button from "../shared/button";
import { useConnection } from "../../context/connected_context";
import { useLoadingContext } from "../../context/LoadingContext";
import { withdrawFromMKWallet } from "../../apis/backendAPI";
import { toast } from "react-toastify";

const WithdrawalBox = ({
  setTransactions,
}: {
  setTransactions: (value: any[]) => void;
}) => {
  const { user, setUser, connectedWallet } = useConnection();
  const { loading, setLoading } = useLoadingContext();

  const [data, setData] = useState({
    amount: "",
    fee: "",
    receiveAmount: 0,
  });

  const depositInfo = [
    {
      key: "Exchange Amount",
      value: `${data.amount} USD`,
    },
    {
      key: "Withdraw Fee",
      value: `${data.fee} USD`,
    },
    {
      key: "Estimated Time",
      value: "3 days",
    },
  ];

  const max = user.mkBalance;

  const changeAmount = (value: string) => {
    let amount = value;
    // Allow empty input
    if (Number(value) === 0) {
      setData({ ...data, amount: "", fee: "", receiveAmount: 0 });
      return;
    }

    if (Number(value) > max) {
      amount = max;
    }

    // Allow only numeric input
    const feeData = Number(amount) * 0.02 + 10;
    const receiveData_number = Number(amount) - feeData;
    setData({
      ...data,
      amount,
      fee: feeData.toLocaleString(),
      receiveAmount: receiveData_number,
    });
  };

  const handleSubmit = async () => {
    if (Number(data.amount) < 20) {
      toast.info("Withdrawal amount should be more than 20");
      return;
    }
    setLoading(true);

    const rdata = await withdrawFromMKWallet(Number(data.amount), user.id);
    if (rdata.user) {
      setUser(rdata.user);
      setTransactions(rdata.user?.transaction);
    }

    setTimeout(() => setLoading(false), 1000);

    toast.success("Withdrawal Request is sent!");
  };

  return (
    <GradientBox>
      <div className="flex md:w-[95%] w-[100%] justify-between items-center font-btn gap-2">
        <div className="flex flex-col gap-0 max-sm:w-[70%]">
          <h2 className="font-[500] text-[34px] lg:text-[34px] text-white">
            Withdraw
          </h2>
          {/* <p className="font-[400] tracking-tighter text-[#888888] text-[16px] self-end">
                        Withdraw funds from MK wallet to your TRON wallet
                    </p> */}
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-[400] text-[#888888] text-[16px] self-end">
            Balance
          </p>
          <div className="flex items-center gap-1">
            <p className="font-[500] text-[20px] text-white whitespace-nowrap">
              {max} <span className="text-[14px]">USD</span>
            </p>
          </div>
        </div>
      </div>
      <label
        htmlFor="amount"
        className="md:w-[95%] w-[100%] mt-2 flex flex-col gap-1 relative"
      >
        <div className="flex w-[100%] self-center rounded-lg p-2 bg-[#1F2937]">
          <input
            type="number"
            autoFocus
            name="amount"
            id="amount"
            placeholder="Amount to withdraw"
            value={data.amount}
            onChange={(e) => changeAmount(e.target.value)}
            className="placeholder:text-[14px] font-[400] text-[16px] text-white bg-inherit placeholder:text-[#888888] rounded-lg outline-none px-2 w-[87%] font-btn"
          />
          <p
            className="font-medium text-[14px] text-[#32ADE6] flex items-center "
            onClick={() => changeAmount(user.mkBalance)}
          >
            MAX
          </p>
        </div>
      </label>
      <ul className="flex flex-col gap-3 md:w-[95%] w-[100%] justify-between items-center p-4 py-6 bg-[#1F2937] mt-2 rounded-xl">
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
        <li className="flex w-[100%] justify-between items-center font-btn mt-1">
          <p className="font-[500] text-[16px] text-white tracking-wide">
            You will receive
          </p>
          <p className="font-[500] tracking-wide text-[16px] text-[#32ADE6]">
            {data.receiveAmount.toLocaleString()} USDT
          </p>
        </li>
      </ul>

      <label
        htmlFor="address"
        className="w-[100%] mt-2 flex flex-col gap-1 md:w-[95%]"
      >
        <p className="font-[500] text-[18px] md:text-[20px] tracking-wide text-white">
          Receiving Address(USD-TRC-20)
        </p>
        <input
          type="text"
          autoFocus
          name="address"
          id="address"
          placeholder="Auto filled with connected Tron wallet address"
          readOnly
          value={connectedWallet}
          className="w-[100%] p-4 bg-[#1F2937] placeholder:text-[14px] font-[400] text-[16px] text-[#888] placeholder:text-[#888888] rounded-lg outline-none font-btn"
        />
      </label>

      <Button
        text="Withdraw Request"
        disabled={data.receiveAmount <= 0 || loading}
        className="mt-8 md:w-[95%] max-xs:w-[100%] xs:w-[100%] mb-6"
        onClick={handleSubmit}
      />
    </GradientBox>
  );
};

export default WithdrawalBox;
