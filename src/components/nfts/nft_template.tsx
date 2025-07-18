import { useRef } from "react";

interface Props {
  image: string;
  name: string;
  isPurchased: boolean;
}

const NftTemplate = (props: Props) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startPress = () => {
    timerRef.current = setTimeout(() => {
      downloadImage();
    }, 1500);
  };

  const cancelPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const downloadImage = async () => {
    const link = document.createElement("a");
    link.href = props.image;
    link.download = `${props.name || "nft-image"}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <>
      <div className="w-[90%] xs:w-[340px] p-4 xs:h-[390px] flex flex-col gap-4 rounded-xl backdrop-blur-2xl justify-center items-center flex-shrink-0 border border-[#888888]">
        <img
          src={props.image}
          alt={props.name}
          className="w-[283px] h-[290px] xs:h-[308px]"
          onMouseDown={startPress}
          onMouseUp={cancelPress}
          onMouseLeave={cancelPress}
          onTouchStart={startPress}
          onTouchEnd={cancelPress}
        />
        <div className="flex justify-between items-center w-[100%]">
          <p className="text-[12px] md:text-[14px] font-normal uppercase font-btn">
            {props.name}
          </p>
          {props.isPurchased && (
            <p className="w-[83px] h[23px] rounded-md box-border p-1 flex items-center justify-center text-[10px] md:text-[14px] font-normal text-[#32ADE6] border border-[#32ADE6]">
              Purchased
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default NftTemplate;
