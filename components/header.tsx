import { Button } from "../components";
import { useWalletStore } from "../stores";

export default function Header() {
  const { address, onboard, resetWallet } = useWalletStore();

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

  async function handleReset() {
    window.localStorage.removeItem("selectedWallet");
    resetWallet();

    await onboard.walletReset();
  }
  return (
    <header className="fixed top-0 w-full">
      {address && (
        <div className="flex justify-end items-center p-5">
          <span className="pr-5">{address}</span>
          <Button onClick={handleReset}>Disconnect</Button>
        </div>
      )}
    </header>
  );
}
