import Notify from "bnc-notify";

const networkId = parseInt(process.env.NEXT_PUBLIC_NETWORK_ID || "80001", 10);
const dappId = process.env.NEXT_PUBLIC_BNC_API_KEY;

export default function initNotify() {
  return Notify({
    dappId,
    networkId,
    onerror: (error) => console.log(`Notify error: ${error.message}`),
  });
}
