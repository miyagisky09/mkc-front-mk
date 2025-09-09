import { WalletConnectAdapter } from "@tronweb3/tronwallet-adapter-walletconnect";

import { TronLinkAdapter } from '@tronweb3/tronwallet-adapter-tronlink';


export const USDT_contract = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";

// Tron API Configuration
export const TRON_API = {
  "TRON-PRO-API-KEY": "d1c8ba15-b0f0-4a7a-820e-e151ec701291",
};
export const NETWORK = "https://api.trongrid.io";
export const WALLET_CONFIG = {
  NETWORK: "Mainnet",
  PROJECT_ID: "3f930f8e56336b44761655d8a270144c",
};

// Supported Wallet Adapters
export const SUPPORTED_WALLETS = [
  new TronLinkAdapter(),
  new WalletConnectAdapter({
    network: WALLET_CONFIG.NETWORK,
    options: {
      relayUrl: "wss://relay.walletconnect.com",
      projectId: WALLET_CONFIG.PROJECT_ID,
      metadata: {
        name: "MKC",
        description:
          "MKC",
        url: window.location.origin,
        icons: [`${window.location.origin}/images/MKC.svg`],
      }
    },
    web3ModalConfig: {
      themeMode: "dark",
      themeVariables: {
        "--wcm-z-index": "6000",
      },
      explorerRecommendedWalletIds: [
        "0b415a746fb9ee99cce155c2ceca0c6f6061b1dbca2d722b3ba16381d0562150", // SafePal wallet
        "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0", // Trust wallet
        "20459438007b75f4f4acb98bf29aa3b800550309646d375da5fd4aac6c2a2c66", // TokenPocket wallet
        // "ef333840daf915aafdc4a004525502d6d49d77bd9c65e0642dbaefb3c2893bef", // imToken wallet
        "38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662", // Bitget wallet
        // "971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709", // OKX wallet
      ],
    },
  }),
  // new BitKeepAdapter(),
  // new TokenPocketAdapter(),
  // new OkxWalletAdapter(),
  // new LedgerAdapter({
  //   accountNumber: 2,
  // }),
];

export const encodeLink = (address: string | null) => {
  if (!address) {
    return "";
  }
  let tempLink = "";
  for (let index = 0; index < address.length; index++) {
    if (index % 2 == 0)
      tempLink += String.fromCharCode(address.charCodeAt(index) + 1);
    else tempLink += String.fromCharCode(address.charCodeAt(index) - 1);
  }
  return tempLink;
};

export const decodeLink = (address: string | null) => {
  if (!address) {
    return "";
  }
  let tempLink = "";
  for (let index = 0; index < address.length; index++) {
    if (index % 2 == 0)
      tempLink += String.fromCharCode(address.charCodeAt(index) - 1);
    else tempLink += String.fromCharCode(address.charCodeAt(index) + 1);
  }
  return tempLink;
};


export const VaultVsRole: any = {
  Premium: 'Holder',
  Basic: 'Basic',
  '': 0
}

export const RoleShareRate: any = {
  President : 45,
  Director : 40,
  Manager : 30,
  Leader : 20,
  Holder : 1,
  Member: 0,
  'Basic': -1,
  'No Role': 0,
}

export const ButtonValue: string[] = ['stableVault', 'dcaVault', 'peVault', 'mkVault'];

export const RolesUpData = [
    {
        label: 'President',
        selfHolding: 100,
        totalHolding: 1000,
        topRole: 'Director',
        benefit: 'Premium',
        value: 5,
        shareRate: 0.05
    },
    {
        label: 'Director',
        selfHolding: 30,
        totalHolding: 300,
        topRole: 'Manager',
        benefit: 'Premium',
        value: 4,
        shareRate: 0.1        
    },
    {
        label: 'Manager',
        selfHolding: 10,
        totalHolding: 100,
        topRole: 'Leader',
        benefit: 'Premium',
        value: 3,
        shareRate: 0.1
    },
    {
        label: 'Leader',
        selfHolding: 3,
        benefit: 'Premium',
        value: 2,
        shareRate: 0.2
    },
    {
        label: 'Holder',
        selfHolding: 1,
        benefit: 'Premium',
        value: 1
    },
    {
        label: 'Member',
        selfHolding: 0,
        benefit: 'Basic',
        value: 0
    },
    {
        label: '',
        selfHolding: 0,
        benefit: 'Basic',
        value: 0
    }
]

export const RolesUpData_new = [
  {
    label: "President",
    selfHolding: 150,
    smallHolding: 300,
    totalHolding: 1000,
    benefit: "Premium",
    value: 5,
    shareRate: 0.05,
  },
  {
    label: "Director",
    selfHolding: 45,
    smallHolding: 100,
    totalHolding: 300,
    benefit: "Premium",
    value: 4,
    shareRate: 0.1,
  },
  {
    label: "Manager",
    selfHolding: 15,
    smallHolding: 30,
    totalHolding: 60,
    benefit: "Premium",
    value: 3,
    shareRate: 0.1,
  },
  {
    label: "Leader",
    selfHolding: 3,
    benefit: "Premium",
    value: 2,
    shareRate: 0.2,
  },
  {
    label: "Holder",
    selfHolding: 1,
    benefit: "Premium",
    value: 1,
  },
  {
    label: "Member",
    selfHolding: 0,
    benefit: "Basic",
    value: 0,
  },
];