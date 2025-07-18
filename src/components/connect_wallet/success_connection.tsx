import { Link } from "react-router-dom";
import GradientBox from "../shared/gradient_box";
import { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useConnection } from "../../context/connected_context";


const SuccessConnection = () => {
    const { setIsConnected } = useConnection()

    useEffect(() => setIsConnected(true), [])

    return (
        <GradientBox>
            <h3 className="text-[14px] xs:text-base md:text-lg font-medium text-white font-btn flex items-center gap-2">
                Your wallet was created successfully
                <FaCheckCircle className="text-[#32ADE6] text-xl" />
            </h3>
            <Link to={'/deposit-withdraw'} 
                className="w-[100%] mt-4 h-[40px] bg-[#30B0C7] rounded-lg text-[16px] font-btn font-[500] text-[#FFFFFF] hover:bg-[#1A7B8C] transition duration-300 ease-in-out outline-none flex items-center justify-center py-3">
                Deposit USDT
            </Link>

            <Link to={'/nfts'} 
                className="w-[100%] mt-2 h-[40px] bg-inherit rounded-lg text-[16px] font-btn font-[500] text-[#FFFFFF] transition duration-300 ease-in-out outline-none flex items-center justify-center">
                Go to Dashboard
            </Link>
        </GradientBox>
    )
  };
  
export default SuccessConnection;  