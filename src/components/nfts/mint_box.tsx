import { useState } from "react";
import GradientBox from "../shared/gradient_box";
import { GrSubtract, GrAdd } from "react-icons/gr";
import Button from "../shared/button";
import { toast } from "react-toastify";
import { useLoadingContext } from "../../context/LoadingContext";
import { useConnection } from "../../context/connected_context";
import { nftMint } from "../../apis/backendAPI";

interface Props {
  nft_title: string;
  current_price: number;
  index: number;
  setUser: (value: any) => void;
}

const MintBox = (props: Props) => {
  const { setLoading } = useLoadingContext();
  const { user } = useConnection();

  const [quantity, setQuantity] = useState<number>(1);

  const IncreaseQuantity = () => setQuantity((prev) => prev + 1);

  const DecreaseQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numeric input
    console.log(Number(event.target.value));
    if (!isNaN(Number(event.target.value))) {
      setQuantity(Number(event.target.value));
    }
  };

  const handleSubmit = async () => {
    if (quantity == 0) {
      toast.info("Quantity should be more than 1");
      return;
    }
    if (quantity * props.current_price > user.mkBalance) {
      toast.info("Your balance is insufficient");
      return;
    }
    setLoading(true);

    const rdata = await nftMint(quantity, user.id);
    if (rdata.user) {
      props.setUser(rdata.user);
    }
    if (!rdata.isMintAll) {
      toast.info(
        `Only ${rdata.realQuantity} NFTs were created due to conflicts.`
      );
    }
    setLoading(false);
  };

  return (
    <div key={props.index} className="md:w-[100%] md:max-w-[573px]">
      <GradientBox className="gap-4 self-center">
        <h2 className="font-medium text-[24px]">{props.nft_title}</h2>
        <form className="flex bg-[#1F2937] rounded-lg p-6 pb-8 flex-col gap-3 w-[95%] mt-2">
          <div className="w-[100%] items-center justify-between flex">
            <p className="text-[14px] font-normal text-[#888888]">
              Current price
            </p>
            <p className="text-white font-medium text-[16px]">
              {props.current_price.toLocaleString()}{" "}
              <span className="text-[12px]">USD</span>
            </p>
          </div>

          <div className="w-[100%] items-center justify-between flex">
            <p className="text-[14px] font-normal text-[#888888]">Quantity</p>
            <div className="bg-[#171725] w-[110px] h-[40px] items-center justify-between flex p-2 box-border rounded-lg">
              <GrSubtract
                className="text-[16px] text-white cursor-pointer"
                onClick={DecreaseQuantity}
              />
              <input
                type="text"
                value={quantity}
                onChange={handleChange}
                className="bg-transparent border-none text-white font-medium text-[16px] focus:outline-none w-[80%] text-center"
              />
              <GrAdd
                className="text-[16px] cursor-pointer text-white"
                onClick={IncreaseQuantity}
              />
            </div>
          </div>

          <div className="w-[100%] items-center justify-between flex">
            <p className="text-[14px] font-normal text-[#888888]">
              Total price
            </p>
            <p className="text-white font-medium text-[16px]">
              {(props.current_price * quantity).toLocaleString()}{" "}
              <span className="text-[12px]">USD</span>
            </p>
          </div>
        </form>
        <Button
          onClick={handleSubmit}
          text="Mint"
          className="mb-6 my-2  md:w-[95%] max-xs:w-[100%] xs:w-[100%] shadow-lg"
        />
      </GradientBox>
    </div>
  );
};

export default MintBox;
