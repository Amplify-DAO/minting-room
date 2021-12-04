import { ExternalLinkIcon } from "@heroicons/react/outline";
import { Button } from "../components";
import { useWalletStore } from "../stores";
import useTranslation from "next-translate/useTranslation";

interface MintingStatusProps {
  receipt: any;
  isMinting: boolean;
  handleMint: () => void;
  saleIsActive: boolean;
}

const networkID = parseInt(process.env.NEXT_PUBLIC_NETWORK_ID ?? "1", 10);

export default function MintingStatus({
  receipt,
  isMinting,
  handleMint,
  saleIsActive,
}: MintingStatusProps) {
  const { network } = useWalletStore();
  const { t } = useTranslation("common");
  const wrongNetwork = parseInt(network, 10) !== networkID;

  if (wrongNetwork) {
    return null;
  }

  if (!saleIsActive) {
    return (
      <>
        <p>{t("minting.pre_sale_1")}</p>
        <p>{t("minting.pre_sale_2")}</p>
        <p>{t("minting.pre_sale_3")}</p>
      </>
    );
  }

  if (receipt) {
    return (
      <Button>
        <a
          href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL}/tx/${receipt.transactionHash}`}
          target="_blank"
          rel="noreferrer"
        >
          {t("minting.view_transaction_button")}
        </a>
        <ExternalLinkIcon className="h-6 w-6 pl-2" />
      </Button>
    );
  }

  return (
    <Button onClick={handleMint} disabled={isMinting}>
      {isMinting ? t("minting.is_minting_button") : t("minting.mint_button")}
    </Button>
  );
}
