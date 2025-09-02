import { useCallback, useContext, useEffect, useState } from "react";
import ConnectWalletOne from "../components/connect_wallet/connect_wallet_one";
import ConnectWalletTwo from "../components/connect_wallet/connect_wallet_two";
import SuccessConnection from "../components/connect_wallet/success_connection";
import PageBackground from "../components/shared/page_background";
import { SUPPORTED_WALLETS, USDT_contract } from "../config";
import {
  Adapter,
  WalletNotFoundError,
} from "@tronweb3/tronwallet-abstract-adapter";
import { useLoadingContext } from "../context/LoadingContext";
import { useConnection } from "../context/connected_context";
import { tronWeb } from "../service/tronweb";
import { findUser, getAdminWallet, createMKWallet } from "../apis/backendAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ConnectWallet = () => {
  const navigate = useNavigate();
  const { setLoading } = useLoadingContext();
  const {
    isConnected,
    setIsConnected,
    setConnectedWallet,
    referralCode,
    setUser,
    user,
    currentAdapter,
    setCurrentAdapter,
  } = useConnection();
  const [walletID, setWalletID] = useState<string>("");
  const [trxModalStatus, setTrxModalStatus] = useState(false);

  type WalletState = {
    isConnected: boolean;
    address: string | null; // Allow strings or null.
    usdtBalance: number; // Ensure the type matches balance.
    tronBalance: number; // Ensure the type matches balance.
    walletName: string | null; // Allow strings or null.
  };

  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    usdtBalance: 0,
    tronBalance: 0,
    walletName: null,
  });

  tronWeb.setAddress(USDT_contract);

  const getTronWalletBalance = async (address: string) => {
    try {
      const balance = await tronWeb.trx.getBalance(address);
      const contract = await tronWeb.contract().at(USDT_contract);

      const usdtbalance = await contract.balanceOf(address).call();
      return [
        parseFloat(tronWeb.fromSun(balance).toString()),
        parseFloat(tronWeb.fromSun(usdtbalance).toString()),
      ];
    } catch (error) {
      console.error("Error getting balance:", error);
      return [0, 0];
    }
  };

  const connectWallet = async (adapter: Adapter): Promise<boolean> => {
    setLoading(true);
    try {
      if (!adapter.readyState) {
        throw new Error(`${adapter.name} is not installed`);
      }

      if (adapter.connecting) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      try {
        await adapter.connect();
      } catch (err) {
        if (err instanceof WalletNotFoundError) {
          window.open(adapter.url, "_blank");
          throw new Error(`Please install ${adapter.name}`);
        }
        throw err;
      }
      if (adapter.address) {
        const balance = await getTronWalletBalance(adapter.address);

        setWalletState({
          isConnected: true,
          address: adapter.address,
          tronBalance: balance[0],
          usdtBalance: balance[1],
          walletName: adapter.name,
        });
        setConnectedWallet(adapter.address);

        const userData: any = await findUser(adapter.address);
        if (userData?.user) {
          setUser(userData.user);
          setLoading(false);
          setIsConnected(true);
          setCurrentAdapter(adapter);
          navigate("/deposit-withdraw");
          return true;
        }

        // if (referralCode == "") {
        //   toast.info("Activation Code is not Correct!");
        //   // await disconnectWallet();
        //   setIsConnected(false);
        //   setLoading(false);
        //   return false;
        // }
        setIsConnected(true);

        setCurrentAdapter(adapter);
        // await disconnectWallet();

        setLoading(false);
        return true;
      }
      throw new Error("No public key found");
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error connecting wallet:", err);
        setLoading(false);
        throw err;
      }
      throw new Error("Unknown error occurred");
    }
  };

  const disconnectWallet = useCallback(async () => {
    if (currentAdapter) {
      try {
        await currentAdapter.disconnect();
        setCurrentAdapter(null);
        setWalletState({
          isConnected: false,
          address: null,
          tronBalance: 0,
          usdtBalance: 0,
          walletName: null,
        });
        console.log("Wallet disconnected successfully");
      } catch (err) {
        console.error("Error disconnecting wallet:", err);
      }
    }
  }, [currentAdapter]);

  const tokenCheck = async () => {
    if (walletID.length < 3 || walletID.length > 12) {
      toast.info("Wallet ID length should be between 3 and 12");
      return;
    }
    try {
      setLoading(true);
      const walletAddress = currentAdapter.address;

      console.log(walletAddress);
      if (walletAddress) {
        console.log(walletAddress);
        const rdata: any = await createMKWallet(
          walletAddress,
          referralCode,
          walletID
        );
        if (rdata?.flag) {
          setUser(rdata.user);
          navigate("/deposit-withdraw");
        } else {
          setUser(null);
          toast.info(rdata.message);
        }
        setLoading(false);
      } else {
        console.log("error");
      }
    } catch (error) {
      console.log("Error connecting wallet:", error);
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <PageBackground className="justify-center gap-6 md:gap-10">
      {!isConnected ? (
        <ConnectWalletOne
          referralCode={referralCode}
          onClick={() => connectWallet(SUPPORTED_WALLETS[1])}
          key={0}
        />
      ) : (
        <ConnectWalletTwo
          onClick={() => tokenCheck()}
          key={0}
          setWalletID={setWalletID}
          walletID={walletID}
        />
      )}
    </PageBackground>
  );
};

export default ConnectWallet;
