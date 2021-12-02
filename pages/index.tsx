import type { NextPage } from "next";
import { useEffect } from "react";
import { Header } from "../components";
import { initOnboard, initNotify } from "../services";
import { useWalletStore } from "../stores";

const Home: NextPage = () => {
  const {
    onboard,
    setAddress,
    setNetwork,
    setBalance,
    setWallet,
    setOnboard,
    setNotify,
  } = useWalletStore();

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
    setNotify(initNotify());
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
    <div>
      <Header />
    </div>
  );
};

export default Home;
