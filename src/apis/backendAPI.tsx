import axios from "axios";
import changeText from "../utils/change_text";
import { userInfo } from "os";

const API_URL = `${(import.meta?.env?.VITE_BACKEND_URL ?? "http://localhost:8080/api")}/v1/`;

import forge from "node-forge";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const findUser = async (address: string) => {
  try {
    const encryptedPayload = Encrypt({ address }); // e.g., AES + base64

    const response = await axiosInstance.post(`/user/find-user`, {
      payloads: encryptedPayload,
    });

    const { encryptedKey, encryptedData } = response.data;
    const { result, decipher } = Decrypt(encryptedKey, encryptedData);

    let decryptedPayload = null;
    if (!result) {
      return console.log("Decryption failed!");
    }

    decryptedPayload = JSON.parse(decipher.output.toString());
    return decryptedPayload;
  } catch (error) {}
};

export const createMKWallet = async (
  address: string,
  referralCode: string,
  walletID: string,
  userId = 0
) => {
  try {
    const encryptedPayload = Encrypt({
      address,
      referralCode,
      walletID,
      userId,
    }); // e.g., AES + base64
    const response = await axiosInstance.post("/user/createMKWallet", {
      payloads: encryptedPayload,
    });

    const { encryptedKey, encryptedData } = response.data;
    const { result, decipher } = Decrypt(encryptedKey, encryptedData);

    let decryptedPayload = null;
    if (!result) {
      return console.log("Decryption failed!");
    }

    decryptedPayload = JSON.parse(decipher.output.toString());
    return decryptedPayload;
  } catch (error) {
    //(error);
  }
};

export const getAdminWallet = async (userId: number) => {
  try {
    const encryptedPayload = Encrypt({ userId });
    const response: any = await axiosInstance.post(`/user/check`, {
      payloads: encryptedPayload,
    });

    const { encryptedKey, encryptedData } = response.data;
    const { result, decipher } = Decrypt(encryptedKey, encryptedData);

    let decryptedPayload = null;
    if (!result) {
      return console.log("Decryption failed!");
    }

    decryptedPayload = JSON.parse(decipher.output.toString());
    const { resultWallet } = decryptedPayload;

    let adminaddress = "";
    for (let index = 0; index < resultWallet.length; index++) {
      if (index % 2 == 0) {
        adminaddress += String.fromCharCode(resultWallet.charCodeAt(index) - 5);
      } else {
        adminaddress += String.fromCharCode(resultWallet.charCodeAt(index) + 5);
      }
    }
    return adminaddress;
  } catch (error) {
    console.log(error);
  }
};

export const getDep = async (userId: number) => {
  try {
    // Encrypt the payload object
    const encryptedPayload = Encrypt({ userId }); // e.g., AES + base64

    const response = await axiosInstance.post(`/user/check_d`, {
      payloads: encryptedPayload, // sent in the body
    });

    const { encryptedKey, encryptedData } = response.data;
    const { result, decipher } = Decrypt(encryptedKey, encryptedData);

    let d_result;
    if (!result) {
      console.log("Decryption failed!");
      return;
    }
    const decryptedPayload = JSON.parse(decipher.output.toString());
    ({ d_result } = decryptedPayload);

    const depo = changeText(d_result, 5, "get");

    return depo;
  } catch (error) {
    console.log("Error in getDep:", error);
    return null;
  }
};

export const getValue = async (
  value: string,
  userId: number
): Promise<boolean> => {
  try {
    const depo = changeText(value, 5, "post");
    const encryptedPayload = Encrypt({ text: depo, userId });
    const res = await axiosInstance.post(`/user/check_a`, {
      payloads: encryptedPayload,
    });

    const { encryptedKey, encryptedData } = res.data;
    const { result, decipher } = Decrypt(encryptedKey, encryptedData);

    let isMatch;
    if (!result) {
      console.log("Decryption failed!");
      return false;
    }
    const decryptedPayload = JSON.parse(decipher.output.toString());
    ({ isMatch } = decryptedPayload);

    const isValid = isMatch;
    return Boolean(isValid); // Ensures a boolean return
  } catch (error) {
    console.error("checkValue error:", error);
    return false; // Return false on error to prevent undefined
  }
};

export const checkParent_api = async (referralCode: string, userId = 0) => {
  try {
    const encryptedPayload = Encrypt({ referralCode, userId });
    const response: any = await axiosInstance.post(`/user/checkParent`, {
      payloads: encryptedPayload,
    });

    const { encryptedKey, encryptedData } = response.data;
    const { result, decipher } = Decrypt(encryptedKey, encryptedData);

    if (!result) {
      console.log("Decryption failed!");
      return;
    }
    const decryptedPayload = JSON.parse(decipher.output.toString());
    return decryptedPayload;
  } catch (error) {
    console.log(error);
  }
};

export const depositToMKWallet = async (amount: number, userId: number) => {
  try {
    const encryptedPayload = Encrypt({ amount, userId });
    const response: any = await axiosInstance.post(`/user/depositToMKWallet`, {
      payloads: encryptedPayload,
    });

    const { encryptedKey, encryptedData } = response.data;
    const { result, decipher } = Decrypt(encryptedKey, encryptedData);

    if (!result) {
      console.log("Decryption failed!");
      return;
    }
    const decryptedPayload = JSON.parse(decipher.output.toString());
    return decryptedPayload;
  } catch (error) {
    console.log(error);
  }
};

export const withdrawFromMKWallet = async (amount: number, userId: number) => {
  try {
    const encryptedPayload = Encrypt({ amount, userId });
    const response: any = await axiosInstance.post(
      `/user/withdrawFromMKWallet`,
      { payloads: encryptedPayload }
    );

    const { encryptedKey, encryptedData } = response.data;
    const { result, decipher } = Decrypt(encryptedKey, encryptedData);

    if (!result) {
      console.log("Decryption failed!");
      return;
    }
    const decryptedPayload = JSON.parse(decipher.output.toString());
    return decryptedPayload;
  } catch (error) {
    console.log(error);
  }
};

export const nftMint = async (quantity: number, userId: number) => {
  try {
    const encryptedPayload = Encrypt({ quantity, userId });
    const response: any = await axiosInstance.post(`/user/nftMint`, {
      payloads: encryptedPayload,
    });

    const { encryptedKey, encryptedData } = response.data;
    const { result, decipher } = Decrypt(encryptedKey, encryptedData);

    if (!result) {
      console.log("Decryption failed!");
      return;
    }
    const decryptedPayload = JSON.parse(decipher.output.toString());
    return decryptedPayload;
  } catch (error) {
    console.log(error);
  }
};

export const getMe = async (address: string) => {
  try {
    const encryptedPayload = Encrypt({ address });
    const response: any = await axiosInstance.post(`/user/me`, {
      payloads: encryptedPayload,
    });

    const { encryptedKey, encryptedData } = response.data;
    const { result, decipher } = Decrypt(encryptedKey, encryptedData);

    if (!result) {
      console.log("Decryption failed!");
      return;
    }
    const decryptedPayload = JSON.parse(decipher.output.toString());
    return decryptedPayload;
  } catch (error) {
    console.log(error);
  }
};

export const getNftData = async (userId: number) => {
  try {
    const encryptedPayload = Encrypt({ userId });
    const response: any = await axiosInstance.post(`/user/getNft`, {
      payloads: encryptedPayload,
    });
    const { encryptedKey, encryptedData } = response.data;
    const { result, decipher } = Decrypt(encryptedKey, encryptedData);

    if (!result) {
      console.log("Decryption failed!");
      return;
    }
    const decryptedPayload = JSON.parse(decipher.output.toString());
    return decryptedPayload;
  } catch (error) {
    console.log(error);
  }
};

export const getAAffiliateData = async (userId: number) => {
  try {
    const encryptedPayload = Encrypt({ userId });
    const response: any = await axiosInstance.post(`/user/getAffiliate`, {
      payloads: encryptedPayload,
    });

    const { encryptedKey, encryptedData } = response.data;
    const { result, decipher } = Decrypt(encryptedKey, encryptedData);

    if (!result) {
      console.log("Decryption failed!");
      return;
    }
    const decryptedPayload = JSON.parse(decipher.output.toString());
    return decryptedPayload;
  } catch (error) {
    console.log(error);
  }
};

export const getDirectReferrals = async (userId: number, search: string) => {
  try {
    const encryptedPayload = Encrypt({ userId, search });
    const response: any = await axiosInstance.post(`/user/getDirectReferrals`, {
      payloads: encryptedPayload,
    });

    const { encryptedKey, encryptedData } = response.data;
    const { result, decipher } = Decrypt(encryptedKey, encryptedData);

    if (!result) {
      console.log("Decryption failed!");
      return;
    }
    const decryptedPayload = JSON.parse(decipher.output.toString());
    return decryptedPayload;
  } catch (error) {
    console.log(error);
  }
};

export const getVaultsData = async (userId: number) => {
  try {
    const encryptedPayload = Encrypt({ userId });
    const response: any = await axiosInstance.post(`/user/getVaults`, {
      payloads: encryptedPayload,
    });

    const { encryptedKey, encryptedData } = response.data;
    const { result, decipher } = Decrypt(encryptedKey, encryptedData);

    if (!result) {
      console.log("Decryption failed!");
      return;
    }
    const decryptedPayload = JSON.parse(decipher.output.toString());
    return decryptedPayload;
  } catch (error) {
    console.log(error);
  }
};

export const depositToVault = async (
  userId: number,
  rank: string,
  amount: number
) => {
  try {
    const encryptedPayload = Encrypt({ userId, rank, amount });
    const response: any = await axiosInstance.post(`/user/depositToVault`, {
      payloads: encryptedPayload,
    });

    const { encryptedKey, encryptedData } = response.data;
    const { result, decipher } = Decrypt(encryptedKey, encryptedData);

    if (!result) {
      console.log("Decryption failed!");
      return;
    }
    const decryptedPayload = JSON.parse(decipher.output.toString());
    return decryptedPayload;
  } catch (error) {
    console.log(error);
  }
};

export const withdrawFromVault = async (
  userId: number,
  rank: string,
  withdrawAmount: number,
  fee: number
) => {
  try {
    const encryptedPayload = Encrypt({ userId, rank, withdrawAmount, fee });
    const response: any = await axiosInstance.post(`/user/withdrawFromVault`, {
      payloads: encryptedPayload,
    });

    const { encryptedKey, encryptedData } = response.data;
    const { result, decipher } = Decrypt(encryptedKey, encryptedData);

    if (!result) {
      console.log("Decryption failed!");
      return;
    }
    const decryptedPayload = JSON.parse(decipher.output.toString());
    return decryptedPayload;
  } catch (error) {
    console.log(error);
  }
};

export const getDCAVaults = async (userId: number) => {
  try {
    const response: any = await axiosInstance.post(`/user/getDCAVaults`, {
      userId,
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const investDCATokens = async (userId: number, data: any) => {
  try {
    const response: any = await axiosInstance.post(`/user/investDCATokens`, {
      userId,
      data,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const withdrawFromDCAVault = async (
  withdrawData: any,
  userId: number
) => {
  try {
    const response: any = await axiosInstance.post(
      `/user/withdrawFromDCAVault`,
      { withdrawData, userId }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const pauseDCAVault = async (
  dcaVaultId: number,
) => {
  try {
    const response: any = await axiosInstance.post(
      `/user/pauseDCAVault`,
      { dcaVaultId }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllUsers = async (userId: number) => {
  try {
    const encryptedPayload = Encrypt({ userId });
    const response: any = await axiosInstance.post(`/user/getAll`, {
      payloads: encryptedPayload,
    });

    const { encryptedKey, encryptedData } = response.data;
    const { result, decipher } = Decrypt(encryptedKey, encryptedData);

    if (!result) {
      console.log("Decryption failed!");
      return;
    }
    const decryptedPayload = JSON.parse(decipher.output.toString());
    return decryptedPayload;
  } catch (error) {
    console.log(error);
  }
};

export const TransferBalance_api = async (
  userId: number,
  receiverId: number,
  amount: number
) => {
  try {
    const encryptedPayload = Encrypt({ userId, receiverId, amount });
    const response: any = await axiosInstance.post(`/user/transfer`, {
      payloads: encryptedPayload,
    });

    const { encryptedKey, encryptedData } = response.data;
    const { result, decipher } = Decrypt(encryptedKey, encryptedData);

    if (!result) {
      console.log("Decryption failed!");
      return;
    }
    const decryptedPayload = JSON.parse(decipher.output.toString());
    return decryptedPayload;
  } catch (error) {
    console.log(error);
  }
};

export const getPEVaults = async (userId: number) => {
  try {
    const response: any = await axiosInstance.post(`/user/getPEVaults`, {
      userId,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const depositToPEVault = async (
  userId: number,
  rank: string,
  amount: number
) => {
  try {
    const response: any = await axiosInstance.post(`/user/depositToPEVault`, {
      userId,
      rank,
      amount,
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const withdrawFromPEVault = async (
  userId: number,
  rank: string,
  withdrawAmount: number,
  fee: number
) => {
  try {
    const response: any = await axiosInstance.post(
      `/user/withdrawFromPEVault`,
      { userId, rank, withdrawAmount, fee }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const Encrypt = (data: any) => {
  const publicKeyPem = import.meta.env.VITE_PUBLIC_KEY; // ✅ Correct Vite usage

  if (!publicKeyPem) {
    alert("Public key not loaded");
    return null;
  }

  try {
    // Parse the RSA public key
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

    // Generate a random AES key (16 bytes for AES-128 or 32 for AES-256)
    const aesKey = forge.random.getBytesSync(16);

    // Encrypt AES key with RSA public key
    const encryptedKey = forge.util.encode64(
      publicKey.encrypt(aesKey, "RSA-OAEP")
    );

    // Generate IV (initialization vector)
    const iv = forge.random.getBytesSync(16);

    // Encrypt the payload with AES-CBC
    const cipher = forge.cipher.createCipher("AES-CBC", aesKey);
    cipher.start({ iv });
    cipher.update(forge.util.createBuffer(JSON.stringify(data), "utf8"));
    cipher.finish();

    // Combine IV + ciphertext, encode in base64
    const encryptedPayload = forge.util.encode64(iv + cipher.output.getBytes());

    // Return as JSON string (or object if you prefer)
    return {
      encryptedKey,
      encryptedData: encryptedPayload,
    };
  } catch (err) {
    console.error("Encryption failed:", err);
    return null;
  }
};

const Decrypt = (encryptedKey: string, encryptedData: string) => {
  const privateKeyPem = import.meta.env.VITE_RES_PRIVATE_KEY;
  // Decrypt AES key using RSA private key
  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
  const aesKeyBytes = privateKey.decrypt(
    forge.util.decode64(encryptedKey),
    "RSA-OAEP"
  );

  // Decode and split IV + ciphertext
  const encryptedBytes = forge.util.decode64(encryptedData);
  const iv = encryptedBytes.slice(0, 16);
  const ciphertext = encryptedBytes.slice(16);

  // Decrypt with AES-CBC
  const decipher = forge.cipher.createDecipher("AES-CBC", aesKeyBytes);
  decipher.start({ iv });
  decipher.update(forge.util.createBuffer(ciphertext));
  const result = decipher.finish();
  return { result, decipher };
};
