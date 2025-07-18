import { format } from "date-fns";
import { TokenData } from "../../../config/data";

interface Props {
  icon: string;
  method: string;
  amount: number;
  date: Date;
  status: string;
  index: number;
  token: string;
}

const DCATransactionTemplate = (props: Props) => {
  const tokenicon = TokenData.filter(
    (item: any) => item.value == props?.token
  )[0].icon;
  return (
    <li
      className="w-[100%] md:w-[48%] flex justify-between items-start gap-2 bg-[#1F2937] rounded-lg font-btn p-2 text-white"
      key={props.index}
    >
      <div className="flex gap-4 items-start w-full">
        <div
          className={`flex items-center justify-center w-[38px] h-[35px] rounded-full ${
            props.method === "Withdrawal" ? "bg-[#300404]" : "bg-[#1A3947]"
          }`}
        >
          <img
            src={props.icon}
            alt={props.method}
            className="w-[24px] h-[24px]"
          />
        </div>

        <div className="flex items-start flex-col gap-2 w-full">
          <div className="flex justify-between items-center w-full">
            <h4 className="text-[16px]">{props.method}</h4>
            <p
              className={`w-[86px] h-[29px] rounded-md flex items-center justify-center ${
                props.status === "Pending"
                  ? "bg-[#413205] text-[#FFC107]"
                  : "bg-[#1e3919] text-[#24e32c]"
              } text-[14px] font-[400] tracking-tighter`}
            >
              {props.status}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 w-full">
            <div className="flex gap-2 items-center">
              <img src={tokenicon} className="w-[25px] h-[25px]" alt="" />
              <p>{props.token}</p>
            </div>
            <p className="font-medium text-[16px]">
              {props.method === "Withdraw" ? "-" : "+"}
              {Number(props.amount).toLocaleString()}{" "}
              <span className="text-[12px]">USDT</span>
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 w-full">
            <p className="text-[14px] font-[400] text-[#888888]">
              {format(props.date, "MMM dd, yyyy")}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
};

export default DCATransactionTemplate;
