import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoMenuSharp } from "react-icons/io5";
import Menu from "./menu";
import { useConnection } from "../../context/connected_context";
import truncateMiddle from "../../utils/truncate_text";

type Props = {};

const DesktopNavBar = () => {
  const { isConnected, connectedWallet } = useConnection();
  const [copied, setCopied] = useState<boolean>(false);

  const [menu, setMenu] = useState<boolean>(false);

  const path = useLocation();

  const links = [
    {
      text: "Wallet",
      link: "/deposit-withdraw",
    },
    {
      text: "NFT",
      link: "/nfts",
    },
    {
      text: "Vault",
      link: "/vaults",
    },
  ];

  useEffect(() => {
    setMenu(false);
    window.scrollTo({
      behavior: "instant",
      top: 0,
    });
  }, [path.pathname]);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);

    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <nav className="w-[100%] fixed top-0 left-0 flex items-center justify-center px-8 py-6 z-40 backdrop-blur-lg box-border font-btn">
      <div className="w-[100%] flex items-center justify-between xl:max-w-[1258px] font-btn">
        <Link to={"/"}>
          <img src="/images/MKC.svg" alt="MKC" className="w-[141px] h-[54px]" />
        </Link>
        <ul className="flex gap-6 items-center">
          {links.map((data) => (
            <Link
              to={data.link}
              key={data.text}
              className={`text-[16px] font-[400] font-btn ${
                path.pathname === data.link
                  ? " text-[#30B0C7]"
                  : "text-[#FFFFFF]"
              }`}
            >
              {data.text}
            </Link>
          ))}
          <Link
            to={"/affiliate"}
            className={`text-[16px] font-[400] font-btn ${
              path.pathname === "/affiliate"
                ? " text-[#30B0C7]"
                : "text-[#FFFFFF]"
            }`}
          >
            Affiliate
          </Link>
          <Link
            to={"/concierge"}
            className={`text-[16px] font-[400] font-btn ${
              path.pathname === "/affiliate"
                ? " text-[#30B0C7]"
                : "text-[#FFFFFF]"
            }`}
          >
            Concierge
          </Link>
        </ul>
        <>
          {isConnected ? (
            <div>
              <div className="flex items-center gap-2">
                <div className="w-[20px] h-[20px] rounded-full bg-[#30B0C7]" />
                <p className="text-[20px] font-btn font-[400] text-[#FFFFFF]">
                  Connected
                </p>
              </div>
              <div>
                <div className="text-[13px] text-center font-btn font-[400] text-white cursor-pointer" onClick={() => copyToClipboard(connectedWallet)}>
                  {copied ? "Copied!" : truncateMiddle(connectedWallet, 20, 8)}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-[20px] h-[20px] rounded-full bg-[#FA574C]" />
              <p className="text-[20px] font-btn font-[400] text-[#FFFFFF]">
                Not connected
              </p>
            </div>
          )}
        </>
      </div>
    </nav>
  );
};

export default DesktopNavBar;
