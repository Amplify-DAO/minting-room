import type { NextPage } from "next";
import { useEffect } from "react";
import { Header, Minter } from "../components";
import { initOnboard, initNotify } from "../services";
import { useWalletStore } from "../stores";

const Home: NextPage = () => {
  const {
    onboard,
    wallet,
    setAddress,
    setNetwork,
    setBalance,
    setWallet,
    setOnboard,
    setNotify,
  } = useWalletStore();

  async function addNetwork() {
    const params = [
      {
        chainId: "0x13881",
        chainName: "Matic(Polygon) Testnet Mumbai",
        nativeCurrency: {
          name: "MATIC",
          symbol: "MATIC",
          decimals: 18,
        },
        rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
        blockExplorerUrls: ["https://mumbai.polygonscan.com"],
      },
    ];
    if ((window as any).ethereum) {
      (window as any).ethereum.request({
        method: "wallet_addEthereumChain",
        params,
      });
    }
  }

  useEffect(() => {
    if (wallet?.provider) {
      addNetwork();
    }
  }, [wallet]);

  useEffect(() => {
    const onboard = initOnboard({
      address: setAddress,
      network: setNetwork,
      balance: setBalance,
      wallet: (wallet: any) => {
        if (wallet.provider) {
          setWallet(wallet);
          window.localStorage.setItem("selectedWallet", wallet.name);
        } else {
          setWallet();
        }
      },
    });

    setOnboard(onboard);
    //@TODO
    // setNotify(initNotify());
  }, []);

  useEffect(() => {
    const previouslySelectedWallet =
      window.localStorage.getItem("selectedWallet");

    if (previouslySelectedWallet && onboard) {
      readyToTransact(previouslySelectedWallet);
    }
  }, [onboard]);

  async function readyToTransact(previouslySelectedWallet: any) {
    if (onboard) {
      await onboard.walletSelect(previouslySelectedWallet);
      await onboard.walletCheck();
    }
  }

  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <Header />
      <Minter />
    </div>
  );
};

export default Home;
