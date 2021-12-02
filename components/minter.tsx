import { ethers } from "ethers";
import { BigNumber } from "@ethersproject/bignumber";
import SwagAbi from "../abis/swag.json";
import { Button } from "../components";
import { useWalletStore } from "../stores";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;

function formatRevert(message: string) {
  return message.split("reverted: ")[1];
}

export default function Minter() {
  const { address, onboard, wallet } = useWalletStore();
  const [isMinting, setMinting] = useState(false);
  const [maxSupply, setMaxSupply] = useState(0);
  const [amountSold, setAmountSold] = useState(0);
  const [saleIsActive, setSaleIsActive] = useState(false);
  const [price, setPrice] = useState(0);
  const [maticPrice, setMaticPrice] = useState(0);
  const [receipt, setReceipt] = useState();
  const [quantity, setQuantity] = useState(1);

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
    if ((window as any).ethereum) {
      fetchContractValues();
      fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd"
      )
        .then((res) => res.json())
        .then((res) => setMaticPrice(res["matic-network"].usd));
    }
  }, [wallet?.provider, isMinting]);

  async function fetchContractValues() {
    const web3Provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    const signer = web3Provider.getSigner();
    const nftContract = new ethers.Contract(
      NFT_CONTRACT_ADDRESS,
      SwagAbi.abi,
      signer
    );

    setMaxSupply(await nftContract.functions.maxSupply());
    setAmountSold(await nftContract.functions.totalSupply());
    setPrice(await nftContract.functions.floorPrice());
  }

  async function handleMint() {
    await onboard.walletCheck();
    setMinting(true);
    try {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const value = BigNumber.from(quantity).mul(price.toString());

      const signer = web3Provider.getSigner();
      const nftContract = new ethers.Contract(
        NFT_CONTRACT_ADDRESS,
        SwagAbi.abi,
        signer
      );

      const tx = await nftContract.mintToken(
        "https://gateway.pinata.cloud/ipfs/QmQnqD4fw2uHkeM3W4ubZ2TMmqsrBg3hzJR77nSkUkBbdh",
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

      console.log(receipt);

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

  const totalPrice = ethers.utils.formatEther(price.toString()) * quantity;

  return (
    <div className="p-5 px-10 md:w-2/4 lg:w-2/3 xl:w-2/6 mx-auto bg-gradient-to-b from-chapel-orange-500 via-chapel-orange-200 to-chapel-yellow-200 rounded-3xl shadow-xl bg-opacity-75">
      <div>
        <div className="space-y-4">
          <div className="relative">
            <div className="aspect-h-1 aspect-w-1">
              <img
                className="object-cover h-full w-full "
                src="/images/nft.png"
                alt=""
              />
            </div>
          </div>

          {address && (
            <div className="space-y-2">
              <p className="font-bold text-xl">Chapel</p>
              <div className="grid grid-cols-2 items-center text-sm leading-6 font-medium space-y-1">
                <p>Remaining Supply</p>
                <p>
                  {maxSupply.toString() - amountSold.toString()}/
                  {maxSupply.toString()}
                </p>
                <p>Price</p>
                <p>
                  {totalPrice} MATIC ($
                  {maticPrice * totalPrice})
                </p>
              </div>
            </div>
          )}
          {receipt ? (
            <Button disabled={isMinting}>
              <a
                href={`https://mumbai.polygonscan.com/tx/${receipt.transactionHash}`}
                target="_blank"
                rel="noreferrer"
              >
                View transaction
              </a>
            </Button>
          ) : address ? (
            <>
              <div>
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700"
                >
                  Quantity
                </label>
                <select
                  onChange={(e) => setQuantity(e.target.value)}
                  id="quantity"
                  name="quantity"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                </select>
              </div>
              <Button onClick={handleMint} disabled={isMinting}>
                {isMinting ? "Minting NFT..." : "Mint"}
              </Button>
            </>
          ) : (
            <div className="flex justify-center">
              <Button onClick={handleOnboard}>Connect wallet</Button>
            </div>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
}
