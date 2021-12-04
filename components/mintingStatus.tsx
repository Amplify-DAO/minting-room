import { ExternalLinkIcon } from "@heroicons/react/outline";
import { Button } from "../components";
import { useWalletStore } from "../stores";

interface MintingStatusProps {
  receipt: any;
  isMinting: boolean;
  handleMint: () => void;
  saleIsActive: boolean;
}

export default function MintingStatus({
  receipt,
  isMinting,
  handleMint,
  saleIsActive,
}: MintingStatusProps) {
  const { network } = useWalletStore();
  const wrongNetwork =
    parseInt(network, 10) !== parseInt(process.env.NEXT_PUBLIC_NETWORK_ID, 10);

  if (wrongNetwork) {
    return null;
  }

  if (!saleIsActive) {
    return <p>Coming soon...</p>;
  }

  if (receipt) {
    return (
      <Button>
        <a
          href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL}/tx/${receipt.transactionHash}`}
          target="_blank"
          rel="noreferrer"
        >
          View transaction
        </a>
        <ExternalLinkIcon className="h-6 w-6 pl-2" />
      </Button>
    );
  }

  return (
    <Button onClick={handleMint} disabled={isMinting}>
      {isMinting ? "Minting NFT..." : "Mint"}
    </Button>
  );
}
