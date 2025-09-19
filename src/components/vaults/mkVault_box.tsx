import { useCallback, useEffect, useState } from "react";
import { useConnection } from "../../context/connected_context";
import { DefaultPEVaultPlans, VaultTransactionIcon } from "../../config/data";
import { getMkVaults } from "../../apis/backendAPI";
import { useLoadingContext } from "../../context/LoadingContext";
import TransactionHistoryTemplate from "./transaction_history";
import GradientBox from "../shared/gradient_box";
import MkDepositModal from "./mkVault/mk_deposit_modal";
import MkRunningVaultTemplate from "./mkVault/mk_running_template";
import MkWithdrawModal from "./mkVault/mk_withdraw_modal";

const MKVault_box = () => {
  const { user } = useConnection();
  const { loading, setLoading } = useLoadingContext();
  const [depositModal, setDepositModal] = useState<boolean>(false);
  const [withdrawModal, setWithdrawModal] = useState<boolean>(false);
  const [withdrawItem, setWithdrawItem] = useState<any>();

  const [apy, setApy] = useState<number>(0);
  const [period, setPeriod] = useState<number>(0);
  const [mkVaultTransactions, setMkVaultTransactions] = useState<any[]>([]);
  const [mkVaults, setMkVaults] = useState<any[]>([]);

  const init = useCallback(async () => {
    setLoading(true);
    const rdata = await getMkVaults(user.id);
    setLoading(false);
    if (rdata.mkVaults) {
      setMkVaults(rdata.mkVaults);
      setApy(rdata.apy);
      setPeriod(rdata.period);
      setMkVaultTransactions(rdata.mkVaultTransactions || []);
    }
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div className=" items-center w-full">
      <div className="flex flex-col gap-3 rounded-lg border border-[#4B535E] p-3">
        {/* show mk vault apy and lock period condition */}
        <GradientBox key={0} className="rounded-lg" outerClassName="rounded-lg">
          <div className="flex w-[100%] flex-col gap-1 md:items-end">
            <div className="w-[100%] flex flex-col gap-2 text-white md:self-start mt-1">
              <div className="flex justify-between">
                <p className="font-[400] text-[16px] text-[#aaaaaa]">APY</p>
                <p className="font-medium text-[16px]">{apy} %</p>
              </div>
            </div>
            <div className="w-[100%] flex flex-col gap-2 text-white md:self-start md:mt-3">
              <div className="flex justify-between">
                <p className="font-[400] text-[16px] text-[#aaaaaa]">
                  Required Lock Period
                </p>
                <p className="font-medium text-[16px]">{period} days</p>
              </div>
            </div>
            <div className="flex w-[100%] md:w-[30%] items-center justify-center mt-2 md:flex-col gap-4 md:gap-14">
              <button
                className={`w-[169px] h-[37px] rounded-lg font-btn text-[16px] font-medium flex items-center gap-1 justify-center bg-[#30B0C7] text-white`}
                onClick={() => setDepositModal(true)}
              >
                Deposit
              </button>
            </div>
          </div>
        </GradientBox>

        {/* Running status of mk vaults */}
        <div className="flex w-[100%] flex-col gap-2 md:gap-5 z-20 max-w-[905px] mt-2">
          <p className="text-white text-[18px] lg:text-[24px]">
            Runnding Status
          </p>
          <ul
            className="gap-4 w-[100%] flex flex-col max-h-[400px] overflow-y-auto scrollbar-thin
            [&::-webkit-scrollbar]:w-[8px]
            [&::-webkit-scrollbar-track]:rounded-full
            [&::-webkit-scrollbar-track]:bg-[#1E2532] 
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-[#30B0C7]/60 
            [&::-webkit-scrollbar-thumb:hover]:bg-[#30B0C7]/80
            dark:[&::-webkit-scrollbar-track]:bg-[#111827]
            dark:[&::-webkit-scrollbar-thumb]:bg-[#30B0C7]/60
            dark:[&::-webkit-scrollbar-thumb:hover]:bg-[#30B0C7]/80"
          >
            {mkVaults.length > 0 ? (
              mkVaults.map((vault: any, index) => (
                <MkRunningVaultTemplate
                  index={index}
                  vaultAmount={vault.vaultAmount}
                  profitAmount={vault.profitAmount}
                  duration={vault.lockPeriod}
                  requiredPeriod={period}
                  setWithdrawModal={setWithdrawModal}
                  setWithdrawItem={setWithdrawItem}
                  item={vault}
                />
              ))
            ) : (
              <p className="text-[#30B0C7] ms-5 text-[16px]">No data</p>
            )}
          </ul>
        </div>
      </div>

      {/* TRANSACTION HISTORY */}
      <div className="flex w-[100%] flex-col gap-2 md:gap-5 z-20 max-w-[905px] mt-2">
        <p className="text-white text-[18px] lg:text-[24px]">
          MK Vault Transactions
        </p>
        <ul
          className="gap-4 w-[100%] flex flex-wrap h-full max-h-[450px] overflow-y-auto scrollbar-thin
                [&::-webkit-scrollbar]:w-[8px]
                [&::-webkit-scrollbar-track]:rounded-full
                [&::-webkit-scrollbar-track]:bg-[#1E2532] 
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-thumb]:bg-[#30B0C7]/60 
                [&::-webkit-scrollbar-thumb:hover]:bg-[#30B0C7]/80
                dark:[&::-webkit-scrollbar-track]:bg-[#111827]
                dark:[&::-webkit-scrollbar-thumb]:bg-[#30B0C7]/60
                dark:[&::-webkit-scrollbar-thumb:hover]:bg-[#30B0C7]/80"
        >
          {mkVaultTransactions.length > 0 ? (
            mkVaultTransactions.map((transaction: any, index) => (
              <TransactionHistoryTemplate
                amount={transaction?.balance}
                date={transaction?.createdAt}
                icon={
                  VaultTransactionIcon[
                    (transaction.transactionType || "").replace("MK ", "")
                  ]
                }
                index={index}
                method={(transaction.transactionType || "").replace(
                  "MK Vault ",
                  ""
                )}
                status={transaction.status}
                key={index}
              />
            ))
          ) : (
            <p className="text-[#30B0C7] ms-5 text-[16px]">No data</p>
          )}
        </ul>
      </div>

      {depositModal && (
        <MkDepositModal
          apy={apy}
          setDepositModal={setDepositModal}
          setMkVaults={setMkVaults}
          setMkVaultTransactions={setMkVaultTransactions}
        />
      )}
      {withdrawModal && (
        <MkWithdrawModal
          vault={withdrawItem}
          setWithdrawModal={setWithdrawModal}
          setMkVaults={setMkVaults}
          setVaultTransactions={setMkVaultTransactions}
        />
      )}
    </div>
  );
};

export default MKVault_box;
