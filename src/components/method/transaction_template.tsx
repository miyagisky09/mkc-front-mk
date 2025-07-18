import { format } from "date-fns";

interface Props {
  date: string;
  amount: string;
  positive: boolean;
  status: string;
  currency: string;
  location: string;
  index: number;
  note: string;
}

const TransactionTemplate = ({
  amount,
  date,
  location,
  positive,
  status,
  index,
  currency,
  note
}: Props) => {
  return (
    <li
      key={index}
      className="w-[100%] flex flex-col gap-3 bg-[#1F2937] rounded-lg shadow-md font-btn text-[#FFFFFF] p-3 md:px-6 md:py-4"
    >
      <div className="flex w-[100%] items-center justify-between">
        <p className="text-[14px] md:text-[16px] font-[400] text-[#888888]">
          {format(new Date(date), "MMM dd, yyyy")}
        </p>
        <p
          className={`w-[78px] h-[29px] rounded-md flex items-center justify-center ${
            status === "Pending"
              ? "bg-[#413205] text-[#FFC107]"
              : status === "Completed"
              ? "bg-[#1e3919] text-[#24e32c]"
              : "bg-[#300404] text-[#FF5C5C]"
          } text-[14px] font-[400] tracking-tighter`}
        >
          {status}
        </p>
      </div>
      <div className="flex w-[100%] items-end justify-between">
        <h4
          className={`font-[500] text-[22px] ${
            status == "Rejected" ? "text-[#7385a9]" : positive ? "text-[#FFFFFF]" : "text-[#FF3B30]"
          }`}
        >
          {status == "Rejected" ? "±" : positive ? "+" : "-"}
          {Number(amount).toLocaleString()}{" "}
          <span className="text-[18px]">{currency}</span>
        </h4>
        <p className="text-[14px] md:text-[16px] font-[400] text-[#32ADE6]">
          {location} {location == "Transfer" ? ` - ${note}` : "" }
        </p>
      </div>
    </li>
  );
};

export default TransactionTemplate;
