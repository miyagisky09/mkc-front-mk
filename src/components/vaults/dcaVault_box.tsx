import {
  Box,
  createTheme,
  FormControl,
  ListItemText,
  MenuItem,
  Select,
  Tab,
  ThemeProvider,
} from "@mui/material";
import GradientBox from "../shared/gradient_box";
import { useCallback, useEffect, useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Investment from "./dca/investment";
import { getDCAVaults } from "../../apis/backendAPI";
import { useConnection } from "../../context/connected_context";
import { useLoadingContext } from "../../context/LoadingContext";
import RunningStatus from "./dca/runndingStatus";
import DCATransactionTemplate from "./dca/transaction_history";
import DCAWithdrawModal from "./dca/dca_withdraw_modal";

const transactionIcon: any = {
  "DCA Deposit": "/images/vaults/deposit.svg",
  "DCA Withdraw": "/images/vaults/withdrawal.svg",
  "Daily Earning": "/images/vaults/yield_reward.svg",
};

const DCAVault_box = () => {
  const { setLoading } = useLoadingContext();
  const { user, setUser } = useConnection();
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const [type, setType] = useState<string>("individual");
  const [tabValue, setTabValue] = useState("1");

  const [dcaData, setDcaData] = useState<any[]>([]);
  const [dcaTransactions, setDcaTransactions] = useState<any[]>([]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const init = useCallback(async () => {
    setLoading(true);
    const rdata = await getDCAVaults(user.id);
    if (rdata.dcaVaultData) {
      setDcaData(rdata.dcaVaultData);
      setDcaTransactions(rdata.dcaVaultTransactions);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  const [openWithdraw, setOpenWithdraw] = useState<boolean>(false);
  const [withdrawProfit, setWithdrawProfit] = useState<number>(0);
  const [withdrawItem, setWithdrawItem] = useState<any>({});

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <div className="flex flex-col gap-5 items-center w-full">
          <GradientBox>
            <div className="flex flex-col gap-5 w-full">
              <FormControl fullWidth size="small">
                <p className="text-[#D1D5DB] mb-1">Select Type</p>
                <Select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  sx={{ background: "#181F33", borderRadius: 3 }}
                >
                  <MenuItem value="individual">
                    <div className="flex gap-3">
                      <img
                        src="/images/vaults/dca/tokens.svg"
                        alt="tokens"
                        height={20}
                      />
                      <ListItemText>Individual Tokens</ListItemText>
                    </div>
                  </MenuItem>
                  {/* <MenuItem value="coinindex50" sx={{ width: "100%" }} disabled={user.nftAmount == 0}>
                    <div className="flex gap-3 w-100 items-center">
                      <img
                        src="/images/vaults/dca/coinbase.svg"
                        alt=""
                        width={30}
                      />
                      <ListItemText>Coinbase 50 index</ListItemText>
                    </div>
                  </MenuItem> */}
                </Select>
              </FormControl>

              <div className={`${type == "individual" ? "block" : "hidden"}`}>
                <TabContext value={tabValue}>
                  <Box
                    sx={{
                      bgcolor: "#181F33",
                      borderBottom: 1,
                      borderColor: "divider",
                      borderTopRightRadius: 15,
                      borderTopLeftRadius: 15,
                    }}
                  >
                    <TabList
                      variant="fullWidth"
                      onChange={handleTabChange}
                      aria-label="lab API tabs example"
                    >
                      <Tab
                        sx={{ fontSize: 14, p: 0, textTransform: 'capitalize' }}
                        label="Investment"
                        value="1"
                      />
                      <Tab
                        sx={{ fontSize: 14, p: 0, textTransform: 'capitalize' }}
                        label="Running Status"
                        value="2"
                      />
                    </TabList>
                  </Box>
                  <TabPanel sx={{ background: "#1F2937", p: 2 }} value="1">
                    <Investment
                      user={user}
                      setUser={setUser}
                      setDcaData={setDcaData}
                      setDcaTransactions={setDcaTransactions}
                    />
                  </TabPanel>
                  <TabPanel sx={{ background: "#1F2937", p: 2 }} value="2">
                    <RunningStatus
                      user={user}
                      dcaData={dcaData}
                      setOpenWithdraw={setOpenWithdraw}
                      setWithdrawItem={setWithdrawItem}
                    />
                  </TabPanel>
                </TabContext>
              </div>

              <div className={`${type == "coinindex50" ? "block" : "hidden"}`}>
                <p className="text-white">Upcoming soon</p>
              </div>
            </div>
          </GradientBox>
          <div
            className={`flex w-[100%] flex-col gap-2 md:gap-5 z-20 max-w-[905px]`}
          >
            <p className="font-medium text-white text-[20px] lg:text-[28px]">
              DCA Vault Transactions
            </p>
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
              {dcaTransactions.length > 0 ? (
                dcaTransactions.map((transaction: any, index: number) => (
                  <DCATransactionTemplate
                    token={(transaction.note || "").replace("dca-", "")}
                    amount={transaction?.balance}
                    date={transaction?.createdAt}
                    icon={transactionIcon[transaction.transactionType]}
                    index={index}
                    method={(transaction.transactionType || "").replace(
                      "DCA ",
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
        </div>
        {openWithdraw && (
        <DCAWithdrawModal
          withdrawItem={withdrawItem}
          setDcaData={setDcaData}
          setDcaTransactions={setDcaTransactions}
          setOpenWithdraw={setOpenWithdraw}
        />
      )}
      </ThemeProvider>
    </>
  );
};

export default DCAVault_box;
