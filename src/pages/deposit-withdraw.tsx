import { GoArrowUpRight } from "react-icons/go";
import { Link } from "react-router-dom";
import truncateMiddle from "../utils/truncate_text";
import { useCallback, useEffect, useState } from "react";
import PageBackground from "../components/shared/page_background";
import DepositBox from "../components/method/deposit_box";
import TransactionTemplate from "../components/method/transaction_template";
import WithdrawalBox from "../components/method/withdrawal_box";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useConnection } from "../context/connected_context";
import { findUser } from "../apis/backendAPI";
import { useLoadingContext } from "../context/LoadingContext";
import { RiExchangeDollarFill } from "react-icons/ri";
import TransferBalance from "../components/wallet/transfer";
import { CgArrowTopRight } from "react-icons/cg";
import { FiRefreshCcw } from "react-icons/fi";

const Deposit = () => {
  const { setLoading } = useLoadingContext();
  const { user, setUser, connectedWallet } = useConnection();
  const [transactions, setTransactions] = useState<any[]>(
    user.transaction || []
  );
  const [methodIndex, setMethodIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [transferModal, setTransferModal] = useState<boolean>(false);

  const methodList = [
    <DepositBox setTransactions={setTransactions} key={0} />,
    <WithdrawalBox setTransactions={setTransactions} key={1} />,
  ];

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);

    setCopied(true);

    setTimeout(() => setCopied(false), 3000);
  };

  const init = useCallback(async () => {
    setLoading(true);
    const rdata = await findUser(connectedWallet);
    if (rdata.user) {
      setUser(rdata.user);
      setTransactions(rdata.user.transaction);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    init();
  }, []);

  const handleRefresh = () => {
    init();
  };

  return (
    <PageBackground className="gap-6 md:gap-10">
      {/* TOTAL BALANCE */}
      <section className="rounded-xl bg-gradient-to-b from-[#168DBC] to-[#653D83] w-[100%] font-btn max-w-[905px] z-20">
        <div className="backdrop-brightness-50 flex flex-col w-[100%] rounded-xl gap-0 h-[100%]">
          <div className="rounded-l-xl w-[150px] md:w-[50%] h-[70px] md:h-[100px] rounded-b-none relative truncate z-20 clip-diagonal bg-[#1F2937] p-3 pr-10 text-white" />
          <button
            onClick={() => copyToClipboard(user.mkWalletID)}
            className="absolute cursor-pointer top-3 max-md:left-4 md:right-4 md:top-14 z-20 font-[400] text-[14px] lg:text-[20px] tracking-wide max-w-[250px] text-white truncate flex items-center gap-2"
          >
            <span className="text-[#30B0C7]">Wallet</span>
            <span className="truncate max-w-[150px]">
              {copied ? "Copied!" : truncateMiddle(user.mkWalletID, 12)}
            </span>
          </button>
          <div className="flex w-[100%] flex-col items-center md:items-start justify-center gap-0 z-20 text-white font-btn px-4 md:px-8 -translate-y-4 md:-translate-y-10">
            <p className="font-[300] text-[16px] lg:text-[20px] tracking-tight">
              Total balance
            </p>
            <div className="flex gap-2 items-center">
              <p className="font-medium text-[32px] xs:text-[44px] tracking-wide ">
                {Number(user.mkBalance).toLocaleString()}{" "}
                <span className="text-[24px] xs:text-[30px]">USD</span>
              </p>
              <button
                className="rounded-full bg-[#403E4E] p-2 mt-2"
                onClick={handleRefresh}
              >
                <FiRefreshCcw className="text-[#30B0C7] " />
              </button>
            </div>
          </div>
          <div className="w-[100%] flex items-center md:justify-start justify-between md:gap-4 text-[#30B0C7] flex-row px-4 -translate-y-4 md:px-8  md:-translate-y-8">
            <Link
              to={"/nfts"}
              className="flex flex-col items-center justify-center gap-1"
            >
              <div className="flex items-center justify-center w-[30px] h-[30px]">
                <img src="/images/cookie.svg" alt="MKC" />
              </div>
              <div className="flex items-center bg-[#403E4E] rounded-xl px-3">
                <p className="text-[16px] font-medium">NFT</p>
                <CgArrowTopRight className="text-[16px]" />
              </div>
            </Link>
            <Link
              to={"/vaults"}
              className="flex flex-col items-center justify-center gap-1"
            >
              <div className="flex items-center justify-center w-[30px] h-[30px]">
                <img src="/images/dice.svg" alt="MKC" />
              </div>
              <div className="flex items-center bg-[#403E4E] rounded-xl px-3">
                <p className="text-[16px] font-medium">Vaults</p>
                <CgArrowTopRight className="text-[16px]" />
              </div>
            </Link>
            <button
              className="flex flex-col items-center justify-center gap-1"
              onClick={() => setTransferModal(true)}
            >
              <div className="flex items-center justify-center w-[30px] h-[30px]">
                <RiExchangeDollarFill width={"30px"} />
              </div>
              <p className="text-[16px] font-medium bg-[#403E4E] rounded-xl px-3">
                Transfer
              </p>
            </button>
          </div>
        </div>
      </section>

      {/* DEPOSIT AND WITHDRAWAL */}
      <section className="w-[100%] lg:w-[905px] items-start flex self-center z-30 flex-col gap-3 md:gap-6">
        <div className="w-full h-[70px] md:w-fit flex items-center justify-between sm:gap-4 bg-[#1F2937] rounded-full z-20 font-btn px-2 sm:px-4 relative overflow-hidden">
          <LayoutGroup>
            {[0, 1].map((i) => (
              <div
                key={i}
                className="relative max-md:w-[50%] flex justify-center "
              >
                {methodIndex === i && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute top-0 left-0 right-0 w-full h-full bg-[#30B0C7] rounded-full z-0"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <button
                  onClick={() => setMethodIndex(i)}
                  className="relative md:w-[170px] z-10 h-[42px] text-[16px] font-btn font-[400] tracking-tight flex items-center text-white rounded-full justify-center"
                >
                  {i === 0 ? "Deposit" : "Withdraw"}
                </button>
              </div>
            ))}
          </LayoutGroup>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={methodIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-[100%] flex items-center justify-center min-h-[300px]"
          >
            {methodList[methodIndex]}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* TRANSACTION */}
      <section className="flex w-[100%] flex-col gap-4 md:gap-6 z-20 font-btn max-w-[905px]">
        <h3 className="font-btn font-[500] text-[24px] lf:text-[34px] text-white">
          Transaction History
        </h3>
        <ul
          className="flex flex-col w-[100%] gap-3  h-[400px] overflow-y-auto   scrollbar-thin
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
          {transactions.length > 0 ? (
            transactions.map((transaction, index) => (
              <TransactionTemplate
                index={index}
                amount={transaction.balance}
                currency={"USD"}
                date={transaction.createdAt}
                location={transaction.transactionType}
                positive={transaction.isPositive}
                status={transaction.status}
                key={index}
                note={transaction.note || ""}
              />
            ))
          ) : (
            <p className="text-[#30B0C7] ms-5 text-[16px]">No data</p>
          )}
        </ul>
      </section>

      {transferModal && (
        <AnimatePresence mode="wait">
          <motion.div
            key={1}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-[100%] flex items-start justify-center min-h-[300px]"
          >
            <TransferBalance
              user={user}
              setUser={setUser}
              setTransactions={setTransactions}
              setTransferModal={setTransferModal}
            />
          </motion.div>
        </AnimatePresence>
      )}
    </PageBackground>
  );
};

export default Deposit;
