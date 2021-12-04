import { Button } from "../components";
import { useDetailsStore, useWalletStore } from "../stores";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import NFTAbi from "../abis/nft.json";

const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;

export default function Header() {
  const { address, onboard, resetWallet, wallet, network } = useWalletStore();
  const { owner, saleIsActive } = useDetailsStore();
  const isOwner = Boolean(
    address?.toLowerCase() === owner?.toString().toLowerCase()
  );
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    if (
      (window as any).ethereum &&
      network === parseInt(process.env.NEXT_PUBLIC_NETWORK_ID, 10) &&
      isOwner
    ) {
      fetchContractValues();
    }
  }, [wallet?.provider, address, network]);

  async function fetchContractValues() {
    try {
      const web3Provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );
      const signer = web3Provider.getSigner();
      const nftContract = new ethers.Contract(
        NFT_CONTRACT_ADDRESS,
        NFTAbi.abi,
        signer
      );
      const contractBalance = await nftContract.showBalance();
      setBalance(contractBalance.toString());
    } catch (e) {
      console.log(e);
    }
  }

  async function handleReset() {
    window.localStorage.removeItem("selectedWallet");
    resetWallet();

    await onboard.walletReset();
  }

  async function handleWithdraw() {
    const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;

    const web3Provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    const signer = web3Provider.getSigner();
    const nftContract = new ethers.Contract(
      NFT_CONTRACT_ADDRESS,
      NFTAbi.abi,
      signer
    );
    await nftContract.withdraw();
  }

  async function handleToggleSale() {
    const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;

    const web3Provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    const signer = web3Provider.getSigner();
    const nftContract = new ethers.Contract(
      NFT_CONTRACT_ADDRESS,
      NFTAbi.abi,
      signer
    );
    await nftContract.toggleSaleState();
  }

  return (
    <header className="w-full">
      {address && (
        <div className="flex justify-end items-center p-5">
          <span className="pr-5 text-white">
            {address.slice(0, 4)}...{address.slice(-4)}
          </span>
          <div className="grid grid-cols-auto grid-flow-col gap-2">
            <Button onClick={handleReset}>Disconnect</Button>
            {isOwner && (
              <>
                <Button onClick={handleWithdraw}>
                  Withdraw {balance && ethers.utils.formatEther(balance)}MATIC
                </Button>
                <Button onClick={handleToggleSale}>
                  {saleIsActive ? "Pause Sale" : "Start Sale"}
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
