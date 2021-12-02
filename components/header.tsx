import { useWalletStore } from "../stores";

export default function Header() {
  const { address, onboard, resetWallet } = useWalletStore();

  async function handleOnboard() {
    if (onboard) {
      await onboard.walletSelect();
      await onboard.walletCheck();
    }
  }

  async function handleReset() {
    window.localStorage.removeItem("selectedWallet");
    resetWallet();

    await onboard.walletReset();
  }
  return (
    <header>
      {address ? (
        <div className="wallet">
          <span>{address}</span>
          <button onClick={handleReset}>Disconnect</button>
        </div>
      ) : (
        <button onClick={handleOnboard}>Connect Wallet</button>
      )}
    </header>
  );
}
