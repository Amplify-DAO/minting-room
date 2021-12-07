import { Button } from "../components";
import { useDetailsStore, useWalletStore } from "../stores";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import NFTAbi from "../abis/nft.json";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import toast from "react-hot-toast";

const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
const networkID = parseInt(process.env.NEXT_PUBLIC_NETWORK_ID ?? "1", 10);

export default function Header() {
  const { address, onboard, resetWallet, wallet, network } = useWalletStore();
  const { owner, saleIsActive, setSaleIsActive } = useDetailsStore();

  const [pendingSaleState, setPendingSaleState] = useState(false);
  const [pendingWithdraw, setPendingWithdraw] = useState(false);
  const [balance, setBalance] = useState(null);

  const { t } = useTranslation("common");

  const isOwner = Boolean(
    address?.toLowerCase() === owner?.toString().toLowerCase()
  );

  useEffect(() => {
    fetchContractValues();
  }, [pendingSaleState, pendingWithdraw]);

  useEffect(() => {
    if (
      (window as any).ethereum &&
      parseInt(network, 10) === networkID &&
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
      setBalance(
        await nftContract.functions.showBalance().then((res) => res.toString())
      );

      setSaleIsActive(
        await nftContract.functions.saleIsActive().then((res) => res[0])
      );
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
    setPendingWithdraw(true);
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
    const tx = await nftContract.withdraw();

    const pendingToast = toast.loading("Withdrawing MATIC...", {
      icon: "⛏",
      position: "bottom-right",
      className: "font-semibold tracking-tight",
    });

    await tx.wait();

    toast.dismiss(pendingToast);

    toast.success("Withdraw successful!", {
      duration: 5000,
      icon: "🚀",
      position: "bottom-right",
      className: "font-semibold tracking-tight",
    });

    setPendingWithdraw(false);
  }

  async function handleToggleSale() {
    setPendingSaleState(true);
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
    const tx = await nftContract.toggleSaleState();

    const pendingToast = toast.loading("Toggling sale state...", {
      icon: "⛏",
      position: "bottom-right",
      className: "font-semibold tracking-tight",
    });

    await tx.wait();

    toast.dismiss(pendingToast);

    toast.success("Success!", {
      duration: 5000,
      icon: "🚀",
      position: "bottom-right",
      className: "font-semibold tracking-tight",
    });

    setPendingSaleState(false);
  }

  return (
    <header className="w-full">
      <div className="flex justify-between items-center p-5 sm:py-0 sm:px-20">
        <div className="flex items-center">
          <Image
            className="hidden sm:block"
            src="/images/icon.png"
            width={115}
            height={128}
          />
          <p className="hidden xl:block font-audiowide pl-24 uppercase text-white font-bold text-2xl tracking-widest">
            {t("header.tagline")}
          </p>
        </div>
        <div className="flex justify-between items-center">
          {address && (
            <>
              <span className="font-audiowide tracking-wide pr-5 text-white">
                {address.slice(0, 4)}...{address.slice(-4)}
              </span>
              <div className="grid grid-cols-auto grid-flow-col gap-2">
                <Button onClick={handleReset}>
                  {t("wallet.disconnect_button")}
                </Button>
                {isOwner && (
                  <>
                    <Button
                      isLoading={pendingWithdraw}
                      onClick={handleWithdraw}
                    >
                      {pendingWithdraw
                        ? t("transactions.pending_withdraw")
                        : t("admin.withdraw_button", {
                            amount:
                              balance && ethers.utils.formatEther(balance),
                            currency: "MATIC",
                          })}
                    </Button>
                    <Button
                      isLoading={pendingSaleState}
                      onClick={handleToggleSale}
                    >
                      {pendingSaleState
                        ? t("transactions.pending_sale_state")
                        : saleIsActive
                        ? t("admin.pause_sale_button")
                        : t("admin.start_sale_button")}
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
