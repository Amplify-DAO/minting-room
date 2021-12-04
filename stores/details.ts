import create from "zustand";

type NFTDetailsState = {
  owner: string;
  totalSupply: number;
  floorPrice: number;
  saleIsActive: boolean;
  maxSupply: number;
  maticPrice: number;
  setMaticPrice: (item?: number) => void;
  setFloorPrice: (item?: number) => void;
  setTotalSupply: (item?: number) => void;
  setMaxSupply: (item?: number) => void;
  setOwner: (item?: string) => void;
  setSaleIsActive: (item?: boolean) => void;
  resetDetails: () => void;
};

export default create<NFTDetailsState>((set: any) => ({
  owner: "",
  totalSupply: 0,
  floorPrice: 0,
  saleIsActive: false,
  maxSupply: 0,
  maticPrice: 0,
  setMaticPrice: (item) => set({ maticPrice: item }),
  setFloorPrice: (item) => set({ floorPrice: item }),
  setTotalSupply: (item) => set({ totalSupply: item }),
  setMaxSupply: (item) => set({ maxSupply: item }),
  setSaleIsActive: (item) => set({ saleIsActive: item }),
  setOwner: (item) => set({ owner: item }),
  resetDetails: () => set({ owner: "", saleIsActive: "" }),
}));
