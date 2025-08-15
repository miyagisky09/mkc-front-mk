
export const TokenData = [
  {
    label: "BTC",
    value: "BTC",
    icon: "/images/vaults/dca/btc.svg",
  },
  {
    label: "ETH",
    value: "ETH",
    icon: "/images/vaults/dca/eth.svg",
  },
  {
    label: "HYPE",
    value: "HYPE",
    icon: "/images/vaults/dca/hype.png",
  },
  {
    label: "Tether Gold",
    value: "XAUT",
    icon: "/images/vaults/dca/xaut.png",
  },
  {
    label: "BNB",
    value: "BNB",
    icon: "/images/vaults/dca/bnb.svg",
  },
  {
    label: "SOL",
    value: "SOL",
    icon: "/images/vaults/dca/solana.svg",
  },
  {
    label: "DOGE",
    value: "DOGE",
    icon: "/images/vaults/dca/doge.svg",
  },
  {
    label: "TRX",
    value: "TRX",
    icon: "/images/vaults/dca/trx.svg",
  },
  {
    label: "SUI",
    value: "SUI",
    icon: "/images/vaults/dca/sui.svg",
  },
  {
    label: "LINK",
    value: "LINK",
    icon: "/images/vaults/dca/link.svg",
  },
  {
    label: "AVAX",
    value: "AVAX",
    icon: "/images/vaults/dca/avax.svg",
  },
  {
    label: "TON",
    value: "TON",
    icon: "/images/vaults/dca/ton.svg",
  },
  {
    label: "APT",
    value: "APT",
    icon: "/images/vaults/dca/apt.svg",
  },
];

export const DefaultVaultPlans: any = {
  Basic: {
    value: 1,
    apyRate: 0.2,
    icon: "/images/vaults/silver_vault.svg",
    balance: 0,
    earning: 0,
    lockPeriod: 0,
  },
  Premium: {
    value: 2,
    apyRate: 0.3,
    icon: "/images/vaults/gold_vault.svg",
    balance: 0,
    earning: 0,
    lockPeriod: 0,
  }
}

export const DefaultPEVaultPlans: any = {
  VLT2: {
    value: 1,
    apy: 1,
    icon: "/images/vaults/silver_vault.svg",
    balance: 0,
    earning: 0,
    lockPeriod: 0,
  },
  VLT3: {
    value: 2,
    apy: 1,
    icon: "/images/vaults/gold_vault.svg",
    balance: 0,
    earning: 0,
    lockPeriod: 0,
  }
}

export const VaultTransactionIcon: any = {
    "Vault Deposit": "/images/vaults/deposit.svg",
    "Vault Withdraw": "/images/vaults/withdrawal.svg",
    "Daily Earning": "/images/vaults/yield_reward.svg",
  };