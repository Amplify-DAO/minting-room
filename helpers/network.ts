import networks from "./networkParams.json";

const NETWORK_ID = parseInt(process.env.NEXT_PUBLIC_NETWORK_ID ?? "1", 10);

async function addNetwork(networkID: number) {
  let params;
  switch (networkID) {
    case 80001:
      params = networks?.polygon_mumbai;
      break;
    case 137:
      params = networks?.polygon_mainnet;
      break;
    default:
      params = networks?.polygon_mumbai;
  }

  if ((window as any).ethereum) {
    (window as any).ethereum.request({
      method: "wallet_addEthereumChain",
      params,
    });
  }
}

export { addNetwork, NETWORK_ID };
