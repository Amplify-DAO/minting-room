import type { NextPage } from "next";
import { useEffect } from "react";
import { Header, Minter } from "../components";
import { addNetwork, NETWORK_ID, readyToTransact } from "../helpers";
import { initOnboard } from "../services";
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
  } = useWalletStore();

  useEffect(() => {
    if (wallet?.provider) {
      addNetwork(NETWORK_ID);
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
  }, []);

  useEffect(() => {
    const previouslySelectedWallet =
      window.localStorage.getItem("selectedWallet");

    if (previouslySelectedWallet && onboard) {
      readyToTransact(onboard, previouslySelectedWallet);
    }
  }, [onboard]);

  return (
    <div
      className="bg-cover"
      style={{
        backgroundImage: "url('images/background.png')",
        minHeight: "100vh",
      }}
    >
      <div className="relative z-10 py-5">
        <Header />
        <div className="flex flex-col h-full sm:px-2">
          <Minter />
        </div>
      </div>
    </div>
  );
};

export default Home;
