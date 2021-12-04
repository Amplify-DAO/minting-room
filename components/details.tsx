import { ethers } from "ethers";
import { useDetailsStore } from "../stores";

interface DetailsProps {
  quantity: number;
  setQuantity: () => void;
  saleIsActive: boolean;
}

export default function Details({
  quantity,
  setQuantity,
  saleIsActive,
}: DetailsProps) {
  const { maxSupply, totalSupply, maticPrice, floorPrice } = useDetailsStore();
  const totalPrice = ethers.utils.formatEther(floorPrice) * quantity;

  if (!saleIsActive) {
    return null;
  }

  return (
    <>
      <div className="space-y-2">
        <p className="font-bold text-xl">Chapel Genensis</p>
        <div className="grid grid-cols-2 items-center text-sm leading-6 font-medium space-y-1">
          <p>Remaining Supply</p>
          <p>
            {maxSupply - totalSupply}/{maxSupply}
          </p>
          <p>Price</p>
          <p>
            {totalPrice} MATIC ($
            {(maticPrice * totalPrice).toFixed(2)})
          </p>
        </div>
      </div>
      <div>
        <label
          htmlFor="quantity"
          className="block text-sm font-medium text-gray-700"
        >
          Quantity
        </label>
        <select
          onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
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
    </>
  );
}
