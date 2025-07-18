import { useEffect, useRef, useState } from "react";
import NftTemplate from "./nft_template";
import { useConnection } from "../../context/connected_context";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

export default function NFTCarousel({ nftArray }: { nftArray: any[] }) {
  const { user } = useConnection();
  const [carouselKey, setCarouselKey] = useState(0);

  const [isLargeScreen, setIsLargeScreen] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)"); // lg breakpoint

    const handleResize = () => setIsLargeScreen(mediaQuery.matches);

    handleResize();

    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  useEffect(() => {
    // Wait for nftArray to update, then change key to remount Splide
    if (nftArray.length > 0) {
      console.log("more than 1");
      setCarouselKey(1);
    }
    console.log(nftArray);
  }, [nftArray]);

  return (
    <section className="w-full flex flex-col gap-6 z-30 md:w-[100%] lg:w-[800px]">
      <div className="flex justify-between px-3 mt-5 items-end">
        <h3 className="font-btn text-[28px] font-medium text-white text-center leading-tight">
          My NFTs
        </h3>
        <p className="text-[18px]">
          {nftArray.length} Holding{nftArray.length > 1 ? "s" : ""}{" "}
        </p>
      </div>

      {nftArray.length > 0 ? (
        <Splide
          key={carouselKey}
          options={{
            type: "slide",
            // perPage: isLargeScreen ? 2 : 1,
            // perMove: 1,
            pagination: false,
          }}
          hasTrack={false}
          aria-label="..."
        >
          <div className="custom-wrapper">
            <SplideTrack>
              {nftArray.map((nft: any, index: number) => (
                <SplideSlide
                  key={index}
                  className="w-full flex-shrink-0 flex items-center justify-center md:w-[48%]"
                >
                  <NftTemplate
                    image={`${window.location.origin.includes('magic-kitties.web.app') ? '' : 'https://magic-kitties.web.app'}/nfts/${nft.nftNumber}.png`}
                    isPurchased={true}
                    name={`Magic Kitties #${nft.nftNumber}`}
                  />
                </SplideSlide>
              ))}
            </SplideTrack>

            <div
              className={`splide__arrows mt-10 ${
                user.nftAmount <= 1 ? "hidden" : ""
              }`}
            />
          </div>
        </Splide>
      ) : null}
    </section>
  );
}
