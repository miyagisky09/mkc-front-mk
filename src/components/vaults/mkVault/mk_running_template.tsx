import { FaBan } from "react-icons/fa";

interface Props {
  setWithdrawModal: (value: boolean) => void;
  setWithdrawItem: (value: any) => void;
  index: number;
  vaultAmount: number;
  profitAmount: number;
  duration: number;
  requiredPeriod: number;
  item: any;
}

const MkRunningVaultTemplate = ({
  index,
  vaultAmount,
  profitAmount,
  duration,
  requiredPeriod,
  item,
  setWithdrawModal,
  setWithdrawItem,
}: Props) => {
  return (
    <div
      className="flex flex-col gap-3 border rounded-lg border-[#4B535E] p-2 mb-2"
      key={index}
    >
      <div className="flex flex-col gap-1 text-[#30B0C7] text-[14px]">
        <div className="flex justify-between items-center">
          <p className="text-[#888888]">Locked Amount</p>
          <p>{vaultAmount.toFixed(2)} USD</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-[#888888]">Profit</p>
          <p>{profitAmount.toFixed(2)} USD</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-[#888888]">Duration</p>
          <p>{duration} days</p>
        </div>
        <div className="flex justify-center gap-2">
          <button
            className={`w-[50%] rounded-lg py-1 text-[#FF5C5C] text-[16px] flex items-center gap-1 justify-center ${
              duration >= requiredPeriod
                ? "bg-[#300404]"
                : "bg-[#4c2f2f] text-[#855f5f]"
            }`}
            onClick={() => {
              setWithdrawItem(item);
              setWithdrawModal(true);
            }}
            disabled={requiredPeriod > duration}
          >
            {requiredPeriod > duration && <FaBan />}
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
};

export default MkRunningVaultTemplate;
