import { useCallback, useEffect, useState } from "react";
import { TokenData } from "../../../config/data";
import axios from "axios";
import { useLoadingContext } from "../../../context/LoadingContext";

interface Props {
  user: any;
  dcaData: any[];
  setWithdrawItem: (value: any) => void;
  setOpenWithdraw: (value: boolean) => void;
}

const RunningStatus = ({ user, dcaData, setWithdrawItem, setOpenWithdraw }: Props) => {
  const { setLoading } = useLoadingContext();
  const [tokens, setTokens] = useState<string[]>([]);
  const [tokenPrices, setTokenPrices] = useState<any>({});

  const [totalTokenUSD, setTotalTokenUSD] = useState<number>(0);
  const [totalRemainingAmount, setTotalRemainingAmount] = useState<number>(0);

  useEffect(() => {
    if (dcaData.length > 0) {
      const uniqueTokens = [...new Set(dcaData.map((item) => item.token))];
      setTokens(uniqueTokens);
    }
  }, []);

  const getTokenPrices = useCallback(async () => {
    setLoading(true);
    if (tokens.length > 0) {
      const response = await axios.get(
        `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${tokens.toString()}&tsyms=USD`
      );
      const { data } = response;
      setTokenPrices(data.RAW);

      const prices = data.RAW;
      let totalTokenUSD = 0;
      let totalRemainingAmount = 0;
      dcaData.map((item: any) => {
        totalRemainingAmount += item.investAmount - item.purchasedAmount;
        totalTokenUSD += Number(
          Number(item.tokenAmount) * prices[item.token]?.USD?.PRICE
        );
      });
      setTotalRemainingAmount(totalRemainingAmount);
      setTotalTokenUSD(totalTokenUSD);
    }

    setLoading(false);
  }, [tokens]);

  useEffect(() => {
    getTokenPrices();
  }, [getTokenPrices]);

  return (
    <div className="overflow-scroll">
      <div className="max-h-[500px] h-full">
        <div className="flex flex-col w-full px-1 mb-3 text-[#30B0C7] text-[16px]">
          <div className="flex justify-between items-center">
            <p className="text-[14px]">Total Token</p>
            <p className="text-white">{totalTokenUSD.toFixed(3)} USD</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-[14px]">Total Remaining</p>
            <p className="text-white">{totalRemainingAmount.toFixed(2)} USD</p>
          </div>
        </div>
        {dcaData.map((item: any, index: number) => {
          const icon = TokenData.filter(
            (token: any) => token.value == item.token
          )[0].icon;
          const remainingAmount = item.investAmount - item.purchasedAmount;
          const tokenUSD = tokenPrices
            ? Number(
                Number(item.tokenAmount) * tokenPrices[item.token]?.USD?.PRICE
              )
            : 0;
          const profit = tokenUSD - item.purchasedAmount;
          item.profit = profit.toFixed(3);
          return (
            <div
              className="flex flex-col gap-3 border rounded-lg border-[#4B535E] p-2 mb-2"
              key={index}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center justify-start gap-2">
                  <img src={icon} width={25} alt="icon" />
                  <p className="text-white">{item.token}</p>
                </div>
                <p
                  className={`text-[12px] w-[78px] h-[25px] rounded-md flex items-center justify-center ${
                    item.staus == "Completed"
                      ? "bg-[#1e3919] text-[#24e32c]"
                      : "bg-[#413205] text-[#FFC107]"
                  }`}
                >
                  {item.status}
                </p>
              </div>

              <div className="flex flex-col gap-1 text-[#30B0C7] text-[14px]">
                <div className="flex justify-between items-center">
                  <p className="text-[#888888]">Invest Amount</p>
                  <p>{item.investAmount} USD</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[#888888]">Token Amount</p>
                  <p>{`${item.tokenAmount.toFixed(4)} ${item.token}`}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[#888888]">Token USD</p>
                  <p>{tokenUSD.toFixed(3)}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[#888888]">Remaining Amount</p>
                  <p>{remainingAmount}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[#888888]">Profit</p>
                  <p
                    className={`flex items-center ${
                      profit >= 0 ? "text-[#24e32c]" : "text-[#FF5C5C]"
                    }`}
                  >{`${profit > 0 ? "+" : ""} ${profit.toFixed(3)}`}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[#888888]">Total Period</p>
                  <p>{item.period} days</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[#888888]">Purchase Cycle</p>
                  <p>{item.cycle} days</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[#888888]">Duration</p>
                  <p>{item.lockPeriod} days</p>
                </div>
                <button
                  className={`rounded-lg py-1 text-[#FF5C5C] text-[16px] flex items-end justify-center ${
                    item.lockPeriod > 0
                      ? "bg-[#300404]"
                      : "bg-[#4c2f2f] text-[#855f5f]"
                  }`}
                  onClick={() => {
                    setWithdrawItem(item);
                    setOpenWithdraw(true);
                  }}
                  disabled={item.lock_period == 0}
                >
                  Withdraw
                </button>
              </div>
            </div>
          );
        })}
        {!dcaData.length && (
          <p className="text-white flex justify-center">No Running Tokens</p>
        )}
      </div>
    </div>
  );
};

export default RunningStatus;
