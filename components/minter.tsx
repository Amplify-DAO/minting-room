import { BigNumber } from "@ethersproject/bignumber";
import { Html, useProgress, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { ethers } from "ethers";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState, Suspense } from "react";
import toast, { Toaster } from "react-hot-toast";

import NFTAbi from "../abis/nft.json";
import { Button, Details, MintingStatus, NFTModel } from "../components";
import { useDetailsStore, useWalletStore } from "../stores";

const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;

function formatRevert(message: string) {
  if (message.startsWith("err:")) {
    return "You do not have enough funds in your wallet.";
  } else {
    // e.g. reverted: CHPL: <message>
    return message.split(":")[2];
  }
}

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress}%</Html>;
}

export default function Minter() {
  const { address, onboard, wallet, network } = useWalletStore();
  const [quantity, setQuantity] = useState(1);
  const { t } = useTranslation("common");

  const {
    saleIsActive,
    floorPrice,
    setOwner,
    setSaleIsActive,
    setMaxSupply,
    setFloorPrice,
    setTotalSupply,
    setMaticPrice,
  } = useDetailsStore();

  const [isMinting, setMinting] = useState(false);
  const [receipt, setReceipt] = useState();
  const [isLoading, setLoading] = useState(true);

  async function handleOnboard() {
    try {
      if (onboard) {
        await onboard.walletSelect();
        await onboard.walletCheck();
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (
      (window as any).ethereum &&
      network === parseInt(process.env.NEXT_PUBLIC_NETWORK_ID, 10)
    ) {
      fetchContractValues();
      fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd"
      )
        .then((res) => res.json())
        .then((res) => setMaticPrice(res["matic-network"].usd));
    }
  }, [wallet?.provider, isMinting, address, network]);

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
      setMaxSupply(
        await nftContract.functions.maxSupply().then((res) => res.toString())
      );
      setTotalSupply(
        await nftContract.functions.totalSupply().then((res) => res.toString())
      );
      setFloorPrice(
        await nftContract.functions.floorPrice().then((res) => res.toString())
      );
      setSaleIsActive(
        await nftContract.functions.saleIsActive().then((res) => res[0])
      );

      setOwner(
        await nftContract.functions.owner().then((res) => res.toString())
      );
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  }

  async function handleMint() {
    await onboard.walletCheck();
    setMinting(true);
    try {
      const value = BigNumber.from(quantity).mul(floorPrice.toString());
      const web3Provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );
      const signer = web3Provider.getSigner();
      const nftContract = new ethers.Contract(
        NFT_CONTRACT_ADDRESS,
        NFTAbi.abi,
        signer
      );

      const tx = await nftContract.mintToken(
        process.env.NEXT_PUBLIC_TOKEN_URI,
        quantity,
        {
          value,
        }
      );

      const pendingToast = toast.loading("Minting NFT...", {
        icon: "⛏",
        position: "bottom-right",
        className: "font-semibold tracking-tight",
      });

      const receipt = await tx.wait();

      setMinting(false);
      setReceipt(receipt);

      toast.dismiss(pendingToast);

      toast.success("NFT Successful Minted!", {
        duration: 5000,
        icon: "🚀",
        position: "bottom-right",
        className: "font-semibold tracking-tight",
      });
    } catch (e) {
      console.log({ e });
      setMinting(false);

      if (e?.data?.message) {
        return toast.error(formatRevert(e.data.message), {
          position: "bottom-right",
          className: "font-semibold tracking-tight",
        });
      }

      if (e?.message) {
        toast.error(e.message, {
          position: "bottom-right",
          className: "font-semibold tracking-tight",
        });
      }
    }
  }

  return (
    <div className="p-10 md:w-2/4 ring-white ring-8 ring-opacity-10 lg:w-2/6 xl:w-2/6 h-min-content mx-auto bg-gradient-to-b from-chapel-orange-500 via-chapel-orange-200 to-chapel-yellow-200 rounded-3xl shadow-xl bg-opacity-75">
      <div className="space-y-4 h-full">
        <div className="relative h-2/3 md:h-96">
          <Canvas>
            <OrbitControls autoRotate autoRotateSpeed={2} enablePan={true} />
            <Suspense fallback={<Loader />}>
              <NFTModel scale={[3, 5, 3]} />
            </Suspense>
          </Canvas>
        </div>
        {!isLoading && (
          <Details
            saleIsActive={saleIsActive}
            quantity={quantity}
            setQuantity={setQuantity}
          />
        )}
        {address && !isLoading ? (
          <MintingStatus
            handleMint={handleMint}
            isMinting={isMinting}
            receipt={receipt}
            saleIsActive={saleIsActive}
          />
        ) : (
          <div className="text-center">
            <Button onClick={handleOnboard}>
              {t("wallet.connect_button")}
            </Button>
          </div>
        )}
      </div>

      <Toaster />
    </div>
  );
}
