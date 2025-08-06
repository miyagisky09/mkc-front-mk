import { useCallback, useEffect, useState } from "react";
import { ButtonValue, RoleShareRate, VaultVsRole } from "../../config";
import VaultsTemplate from "./vault_template";
import PEDepositModal from "./peVault/pe_deposit_modal";
import PEWithdrawModal from "./peVault/pe_withdraw_modal";
import { useConnection } from "../../context/connected_context";
import { DefaultPEVaultPlans, VaultTransactionIcon } from "../../config/data";
import { getPEVaults } from "../../apis/backendAPI";
import { useLoadingContext } from "../../context/LoadingContext";
import TransactionHistoryTemplate from "./transaction_history";

const PEVault_box = () => {
  const { user } = useConnection();
  const { loading, setLoading } = useLoadingContext();
  const [rank, setRank] = useState<string>("");
  const [depositModal, setDepositModal] = useState<boolean>(false);
  const [withdrawModal, setWithdrawModal] = useState<boolean>(false);

  const [peVaultPlans, setPeVaultPlans] = useState<any>(DefaultPEVaultPlans);
  const [apyObject, setApyObject] = useState<any>({});
  const [periodObject, setPeriodObject] = useState<any>({});
  const [peVaultTransactions, setPeVaultTransactions] = useState<any[]>([]);

  const init = useCallback(async () => {
    setLoading(true);
    const rdata = await getPEVaults(user.id);
    setLoading(false);
    if (rdata.peVaults) {
        rdata.peVaults.map((vault: any, index: number) => {
        setPeVaultPlans((prev: any) => ({
          ...prev,
          [vault.rank]: {
            ...prev[vault.rank],
            balance: vault.vaultAmount,
            earning: vault.profitAmount,
            lockPeriod: vault.lockPeriod,
          },
        }));
      });
      setApyObject(rdata.apyObject);
      setPeriodObject(rdata.periodObject);
      setPeVaultTransactions(rdata.peVaultTransactions || []);
    }

  }, []);

  useEffect(() => {
    init();
  }, [init])

  return (
    <div className="flex flex-col gap-3 items-center w-full">
      <ul
        className="gap-4 w-[100%] flex flex-col overflow-y-auto scrollbar-thin
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
        {Object.keys(peVaultPlans).map((key: any, index: number) => (
          <VaultsTemplate
            index={index}
            apy={apyObject[key]}
            balance={peVaultPlans[key].balance}
            earning={peVaultPlans[key].earning}
            icon={peVaultPlans[key].icon}
            lock_period={peVaultPlans[key]?.lockPeriod || 0}
            title={key}
            key={index}
            locked={RoleShareRate[VaultVsRole[key]] > RoleShareRate[user.role]}
            setRank={setRank}
            setDepositModal={setDepositModal}
            setWithdrawModal={setWithdrawModal}
            withdrawDisabled={(peVaultPlans[key]?.lockPeriod || 0) < periodObject[key]}
            peLockRequired={periodObject[key]}
            depositDisabled={true}
          />
        ))}
      </ul>

      {/* TRANSACTION HISTORY */}
      <div className="flex w-[100%] flex-col gap-2 md:gap-5 z-20 max-w-[905px] mt-2">
        <p className="font-medium text-white text-[20px] lg:text-[28px]">
          PE Vault Transactions
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
          {peVaultTransactions.length > 0 ? (
            peVaultTransactions.map((transaction: any, index) => (
              <TransactionHistoryTemplate
                amount={transaction?.balance}
                date={transaction?.createdAt}
                icon={VaultTransactionIcon[(transaction.transactionType || "").replace("PE ", "")]}
                index={index}
                method={(transaction.transactionType || "").replace(
                  "PE Vault ",
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
        <PEDepositModal
          vault={rank}
          apy={apyObject[rank]}
          setDepositModal={setDepositModal}
          setPeVaultPlans={setPeVaultPlans}
          setPeVaultTransactions={setPeVaultTransactions}
        />
      )}
      {withdrawModal && (
        <PEWithdrawModal
          vault={rank}
          currentData={peVaultPlans[rank]}
          setWithdrawModal={setWithdrawModal}
          setVaultPlans={setPeVaultPlans}
          setVaultTransactions={setPeVaultTransactions}
          defaultVaultPlans={DefaultPEVaultPlans}
        />
      )}
    </div>
  );
};

export default PEVault_box;
