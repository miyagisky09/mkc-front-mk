import { useCallback, useEffect, useState } from "react";
import PageBackground from "../components/shared/page_background";
import DepositModal from "../components/vaults/deposit_modal";
import TransactionHistoryTemplate from "../components/vaults/transaction_history";
import VaultsTemplate from "../components/vaults/vault_template";
import { useConnection } from "../context/connected_context";
import { getVaultsData } from "../apis/backendAPI";
import { useLoadingContext } from "../context/LoadingContext";
import { ButtonValue, RoleShareRate, VaultVsRole } from "../config";
import WithdrawModal from "../components/vaults/withdraw_modal";
import MyCard from "../components/affiliate/myCard";
import { AnimatePresence, motion } from "motion/react";
import StableVault_box from "../components/vaults/stableVault_box";
import DCAVault_box from "../components/vaults/dcaVault_box";
import PEVault_box from "../components/vaults/peVault_box";
import MKVault_box from "../components/vaults/mkVault_box";
import { DefaultVaultPlans, VaultTransactionIcon } from "../config/data";
import {
  createTheme,
  FormControl,
  ListItemText,
  MenuItem,
  Select,
  ThemeProvider,
} from "@mui/material";

const Vaults = () => {
  const { user } = useConnection();
  const { setLoading } = useLoadingContext();
  const [apyObject, setApyObject] = useState<any>({});
  const [vaultPlans, setVaultPlans] = useState<any>(DefaultVaultPlans);
  const [vaultTransactions, setVaultTransactions] = useState<any[]>([]);
  const [orgChildren, setOrgchildren] = useState<any[]>([]);

  const init = useCallback(async () => {
    setLoading(true);
    const rdata = await getVaultsData(user.id);
    if (rdata.vaults) {
      rdata.vaults.map((vault: any, index: number) => {
        setVaultPlans((prev: any) => ({
          ...prev,
          [vault.rank]: {
            ...prev[vault.rank],
            balance: vault.vaultAmount,
            earning: vault.profitAmount,
            lockPeriod: vault.lockPeriod,
          },
        }));
      });
    }
    if (rdata.vaultTransactions) {
      setVaultTransactions(rdata.vaultTransactions);
    }
    if (rdata.apyObject) {
      setApyObject(rdata.apyObject);
    }
    if (rdata.orgChildren) {
      setOrgchildren(rdata.orgChildren);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    init();
  }, []);

  const [depositModal, setDepositModal] = useState<boolean>(false);
  const [withdrawModal, setWithdrawModal] = useState<boolean>(false);

  const [rank, setRank] = useState<string>("");
  const [vaultType, setVaultType] = useState<string>(ButtonValue[0]);
  const [motionKey, setMotionKey] = useState<number>(0);

  const handleClick = (e: any) => {
    setVaultType(e.target.value);
    const index = ButtonValue.map((item) => item).indexOf(e.target.value);
    setMotionKey(index);
  };

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  return (
    <PageBackground className="gap-6 md:gap-10">
      {/* HEADER */}
      <MyCard user={user} orgChildren={orgChildren} />

      {/* AVAILABLE VAULTS */}
      <section className="flex w-[100%] flex-col gap-3 md:gap-5 z-20 max-w-[905px] mt-3">
        <h2 className="font-medium text-white text-[20px] lg:text-[28px]">
          Available Vaults
        </h2>
        <ThemeProvider theme={darkTheme}>
          <FormControl fullWidth size="small">
            <Select
              value={vaultType}
              onChange={(e) => handleClick(e)}
              sx={{ background: "#1b1f2bff", borderRadius: 3, mb: 1 }}
            >
              <MenuItem value={ButtonValue[0]}>
                <div className="flex gap-3">
                  <ListItemText>Stable Vault</ListItemText>
                </div>
              </MenuItem>
              <MenuItem value={ButtonValue[1]}>
                <div className="flex gap-3">
                  <ListItemText>DCA Vault</ListItemText>
                </div>
              </MenuItem>
              <MenuItem value={ButtonValue[2]}>
                <div className="flex gap-3">
                  <ListItemText>PE Vault</ListItemText>
                </div>
              </MenuItem>
              <MenuItem value={ButtonValue[3]}>
                <div className="flex gap-3">
                  <ListItemText>MK Vault</ListItemText>
                </div>
              </MenuItem>
            </Select>
          </FormControl>
        </ThemeProvider>

        <AnimatePresence mode="wait">
          <motion.div
            key={motionKey}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-[100%] flex items-start justify-center min-h-[300px]"
          >
            {vaultType == ButtonValue[0] ? (
              <StableVault_box
                user={user}
                vaultPlans={vaultPlans}
                vaultType={vaultType}
                apyObject={apyObject}
                setRank={setRank}
                setWithdrawModal={setWithdrawModal}
                setDepositModal={setDepositModal}
              />
            ) : vaultType == ButtonValue[1] ? (
              <DCAVault_box />
            ) : vaultType == ButtonValue[2] ? (
              <PEVault_box />
            ) : (
              // <p className="text-white">Under maintenance</p>
              <MKVault_box />
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* TRANSACTION HISTORY */}
      <section
        className={`flex w-[100%] flex-col gap-3 md:gap-5 z-20 max-w-[905px] ${
          vaultType == ButtonValue[0] ? "" : "hidden  "
        }`}
      >
        <h2 className="font-medium text-white text-[24px] lg:text-[28px]">
          Vault Transactions
        </h2>
        <ul
          className="gap-4 w-[100%] flex flex-wrap h-full max-h-[400px] overflow-y-auto scrollbar-thin
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
          {vaultTransactions.length > 0 ? (
            vaultTransactions.map((transaction: any, index) => (
              <TransactionHistoryTemplate
                amount={transaction?.balance}
                date={transaction?.createdAt}
                icon={VaultTransactionIcon[transaction.transactionType]}
                index={index}
                method={(transaction.transactionType || "").replace(
                  "Vault ",
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
      </section>
      {depositModal && (
        <DepositModal
          vault={rank}
          apy={apyObject[rank]}
          setDepositModal={setDepositModal}
          setVaultPlans={setVaultPlans}
          setVaultTransactions={setVaultTransactions}
        />
      )}
      {withdrawModal && (
        <WithdrawModal
          vault={rank}
          currentData={vaultPlans[rank]}
          setWithdrawModal={setWithdrawModal}
          setVaultPlans={setVaultPlans}
          setVaultTransactions={setVaultTransactions}
          defaultVaultPlans={DefaultVaultPlans}
        />
      )}
    </PageBackground>
  );
};

export default Vaults;
