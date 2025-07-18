import React, { createContext, useContext, useState, ReactNode } from "react";

interface ConnectionContextType {
  isConnected: boolean;
  setIsConnected: (value: boolean) => void;
  connectedWallet: string;
  setConnectedWallet: (value: string) => void;
  user: any;
  setUser: (value: any) => void;
  referralCode: any;
  setReferralCode: (value: string) => void;
  currentAdapter: any | null;
  setCurrentAdapter: (value: any | null) => void;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export const ConnectionProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectedWallet, setConnectedWallet] = useState<string>('');
  const [user, setUser] = useState<any>(null);
  const [referralCode, setReferralCode] = useState<string>('');
  const [currentAdapter, setCurrentAdapter] = useState<any | null>(null);

  return (
    <ConnectionContext.Provider value={{ isConnected, setIsConnected, connectedWallet, setConnectedWallet, user, setUser, referralCode, setReferralCode, currentAdapter, setCurrentAdapter }}>
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error("useConnection must be used within a ConnectionProvider");
  }
  return context;
};
