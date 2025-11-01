import { ethers } from "ethers";
import WalletLockABI from "../abi/WalletLock.json";

export const CONTRACT_ADDRESS = "0xe4de670c8029815A462a69d502337c90163a74EC";

export const getContract = async (signerOrProvider) => {
  return new ethers.Contract(CONTRACT_ADDRESS, WalletLockABI, signerOrProvider);
};
