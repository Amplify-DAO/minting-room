import create from "zustand";

type WalletState = {
  address: string;
  network: string;
  balance: string;
  wallet: object;
  onboard: any;
  notify: any;
  setAddress: (item?: string) => void;
  setNetwork: (item: string) => void;
  setBalance: (item: string) => void;
  setWallet: (item?: string) => void;
  setOnboard: (item?: object) => void;
  setNotify: (item?: object) => void;
  resetWallet: () => void;
};

export default create<WalletState>((set: any) => ({
  onboard: null,
  notify: null,
  address: "",
  network: "",
  balance: "",
  wallet: {},
  setNotify: (item) => set({ notify: item }),
  setAddress: (item) => set({ address: item }),
  setNetwork: (item) => set({ network: item }),
  setBalance: (item) => set({ balance: item }),
  setWallet: (item) => set({ wallet: item }),
  setOnboard: (item) => set({ onboard: item }),
  resetWallet: () => set({ address: "", network: "", balance: "", wallet: {} }),
}));
