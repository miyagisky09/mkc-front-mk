import { RoleShareRate } from "../../config";
import { format } from "date-fns";

interface Props {
    number_of_nft: number;
    role: string;
    amount: string;
    index: number;
    createdAt: Date;
}

const BonusTemplate = ({ amount, index, number_of_nft, role, createdAt }: Props) => {
    return (
        <li
            key={index}
            className="flex w-[100%] flex-col gap-2 text-white font-btn rounded-xl bg-[#1F2937] py-2 px-4">
            <div className="flex w-[100%] items-center justify-between">
                <h3 className="font-normal text-[20px]">
                    {`${number_of_nft} NFT${number_of_nft > 1 ? 's' : ''} Minted`} 
                </h3>
                <p className="w-[78px] h-[29px] rounded-lg bg-[#1A3947] flex items-center justify-center text-[#32ADE6] fon-normal text-[14px]">
                    {RoleShareRate[role]}%
                </p>
            </div>
            
            <p className="font-medium text-[14px] text-[#FFCC00]">
                {role}
            </p>

            <div className="gap-2 flex flex-col">
                <div className="flex justify-between">
                    {/* <p className="font-[400] text-[14px] text-[#888888]">
                        {holding_condition}
                    </p> */}
                    <p className="font-[400] text-[14px] text-[#888888]">
                        Shared amount
                    </p>
                    <p className="font-[400] text-[14px] text-[#888888]">
                        {amount} USD
                    </p>
                </div>

                <div className="flex justify-between">
                <p className="font-[400] text-[14px] text-[#888888]">
                        Earned Date
                    </p>
                    <p className="font-[400] text-[14px] text-[#888888]">
                        {format(createdAt, "MMM dd, yyyy hh:mm")}
                    </p>
                </div>
            </div>
        </li>
    )
}

export default BonusTemplate