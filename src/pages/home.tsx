import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PageBackground from "../components/shared/page_background";
import { useCallback, useEffect } from "react";
import { checkParent_api } from "../apis/backendAPI";
import { useConnection } from "../context/connected_context";
import { toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { setReferralCode, user, isConnected, setUser, setIsConnected } = useConnection();

  const init = useCallback(async () => {
    const refparams = searchParams.get("ref") || "";
    if (refparams != "") {
      const checkData = await checkParent_api(refparams, 0)
      console.log(checkData)
      if (checkData?.flag) {
        setReferralCode(refparams);
      }
      else {
        setReferralCode('');
      }
    }
  }, []);

  useEffect(() => {
    init();
  }, [init])

  const handleClick = () => {
    if(user && isConnected) {
      navigate("/deposit-withdraw");
      return;
    } else {
      setUser(null);
      setIsConnected(false);
      navigate("/connect-wallet");
      return;      
    }
  }

  return (
    <PageBackground className="justify-center gap-1">
      <img
        src="/images/home/top_star.png"
        alt="MKC"
        className="absolute top-28 animate-pulse"
      />
      <img
        src="/images/home/left_frame.svg"
        alt="MKC"
        className="absolute top-24 left-1 animate-pulse"
      />
      <img
        src="/images/home/right_frame.svg"
        alt="MKC"
        className="absolute top-44 right-14 animate-pulse"
      />
      <h1 className="font-main text-[#FFFFFF] text-[48px] md:text-[64px] lg:text-[72px] font-[500] z-10">
        Members Only
      </h1>
      <div className="w-[100%] md:w-[511px] bg-[#1F2937] flex items-center justify-center px-4 rounded-xl h-[100px] z-10">
        <button
          onClick={handleClick}
          className="bg-[#30B0C7] text-white font-[500] flex items-center justify-center w-[100%] h-[60px] rounded-xl hover:bg-[#1A7B8C] transition duration-300 ease-in-out font-btn text-[16px] outline-none z-10"
        >
          Join community
        </button>
      </div>
    </PageBackground>
  );
};

export default Home;
