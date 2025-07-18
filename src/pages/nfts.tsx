import { GoArrowUpRight } from "react-icons/go";
import MintBox from "../components/nfts/mint_box";
import NFTCarousel from "../components/nfts/nft_carousel";
import PageBackground from "../components/shared/page_background";
import { Link } from "react-router-dom";
import { useConnection } from "../context/connected_context";
import truncateMiddle from "../utils/truncate_text";
import { useCallback, useEffect, useState } from "react";
import { getNftData } from "../apis/backendAPI";

const NFTs = () => {
  const { user, setUser } = useConnection();
  const [copied, setCopied] = useState<boolean>(false);
  const [nftArray, setNftArray] = useState<any []>([]);
  const [nftPrice, setftPrice] = useState<number>(0);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const mintBoxData = {
    nft_title: "Magic Kitties Collection",
    nft_description: "Part of the Ethereal Beings Collection",
    current_price: nftPrice,
  };

  const getNft = useCallback(async () => {
    const rdata = await getNftData(user.id);
    if(rdata.user) {
      setNftArray(rdata.user?.nft || []);
      setftPrice(rdata.nftPrice);
    }
  }, [])

  useEffect(() => {
    getNft()
  }, [getNft])

  useEffect(() => {
    setNftArray(user?.nft || [])
  }, [user])

  return (
    <PageBackground className="text-white gap-6 md:gap-10">
      <section className="flex flex-col w-[100%] gap-3 items-center justify-center z-30 max-w-[621px]">
        <h1 className="font-main text-[36px] md:text-[54px] lg:text-[64px] xl:text-[72px] font-bold text-white text-center leading-tight">
          Exclusive NFT Collection
        </h1>
        {/* Show Wallet card */}
        <section className="rounded-xl bg-gradient-to-b from-[#168DBC] to-[#653D83] w-[100%] font-btn max-w-[905px] z-20">
          <div className="backdrop-brightness-50 flex flex-col w-[100%] rounded-xl gap-0 h-[100%]">
            <div className="rounded-l-xl w-[150px] md:w-[50%] h-[60px] md:h-[80px] rounded-b-none relative truncate z-20 clip-diagonal bg-[#1F2937] p-3 pr-10 text-white" />
            <button
              onClick={() => copyToClipboard(user.mkWalletID)}
              className="absolute cursor-pointer top-3 max-md:left-4 md:right-4 md:top-10 z-20 font-[400] text-[14px] lg:text-[20px] tracking-wide max-w-[250px] text-white truncate flex items-center gap-2"
            >
              <span className="text-[#30B0C7]">Wallet</span>
              <span className="truncate max-w-[150px]">
                {copied ? "Copied!" : truncateMiddle(user.mkWalletID, 12)}
              </span>
            </button>
            <div className="flex w-[100%] flex-col items-center md:items-start justify-center gap-0 z-20 text-white font-btn px-4 md:px-8 -translate-y-4 md:-translate-y-10">
              <p className="font-[300] text-[16px] lg:text-[20px] tracking-tight">
                Total balance
              </p>
              <h1 className="font-medium text-[32px] xs:text-[44px] tracking-wide -translate-y-2">
                {Number(user.mkBalance).toLocaleString()}{" "}
                <span className="text-[24px] xs:text-[28px]">USD</span>
              </h1>
            </div>
            <div className="w-[100%] flex items-center md:justify-evenly justify-center md:gap-4 gap-2 flex-col xs:flex-row px-4 -translate-y-4 md:px-8  md:-translate-y-8">
              <Link
                to={"/deposit-withdraw"}
                className="max-xs:w-[100%] h-[40px] flex items-center justify-center bg-[#1F2937] gap-2 rounded-full px-2"
              >
                <img src="/images/vaults/deposit.svg" alt="MKC" />
                <p className="text-[16px] font-medium text-[#30B0C7]">
                  Deposit
                </p>
                <GoArrowUpRight className="text-[16px] text-white" />
              </Link>
              <Link
                to={"/vaults"}
                className="max-xs:w-[100%] h-[40px] flex items-center justify-center bg-[#1F2937] gap-2 rounded-full px-2"
              >
                <img src="/images/dice.svg" alt="MKC" />
                <p className="text-[16px] font-medium text-[#30B0C7]">
                  View Vaults
                </p>
                <GoArrowUpRight className="text-[16px] text-white" />
              </Link>
            </div>
          </div>
        </section>
        <p className="font-normal text-[16px] text-[#888888] text-center mt-5">
          Unlock premium benefits and join an elite community with our unique
          NFT collection. Each piece grants special access and privilege
        </p>
      </section>

      <ul className="w-[100%] flex flex-col gap-3 md:items-center">
        {
          <MintBox
            key={0}
            current_price={mintBoxData.current_price}
            index={0}
            nft_title={mintBoxData.nft_title}
            setUser={setUser}
          />
        }
      </ul>

      <NFTCarousel nftArray={nftArray} />
    </PageBackground>
  );
};

export default NFTs;
