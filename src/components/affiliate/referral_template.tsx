import React, { useState } from "react";
import { format } from "date-fns";
import truncateMiddle from "../../utils/truncate_text";
import { RiArrowDropDownLine } from "react-icons/ri";
import { motion } from "motion/react";


interface Props {
  registration_date: Date;
  walletID: string;
  address: string;
  role: string;
  self_holding: number;
  total_holding: number;
  position: number;
  index: number;
  orgWalletID: string;
}

const ReferraTemplate = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<boolean>(false) 
  const [itemCopied, setItemCopied] = useState<boolean>(false) 

  const data = [
    { key:1, label: "Role", value: props.role || 'No Role' },
    { key:2, label: "Position in Team", value: props.position == 0 ? 'Left' : props.position == 1 ? 'Right' : '' },
    { key:3, label: "Self Holding", value: `${props.self_holding} NFT${props.self_holding > 1 ? 's' : ''}` },
    { key:4, label: "Parent in Team", value: props.orgWalletID },
  ];

  const copyToClipboard = async (text: string, type: number) => {
    await navigator.clipboard.writeText(text);

    if (type == 0) {
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    }
    else {
      console.log(type)
      setItemCopied(true)
      setTimeout(() => setItemCopied(false), 3000)
    }

};

  return (
    <li
      key={props.index}
      className="w-full bg-[#1F2937] rounded-xl px-4 py-3 text-white font-btn"
    >
      <button
        className="w-full flex justify-between items-center text-left"
        onClick={() => setOpen(!open)}
      >
        <div className="flex flex-col gap-1">
          <p className="text-[16px] font-normal text-[#32ADE6]">
            Registered at {format(props.registration_date, "MMM dd, yyyy")}
          </p>
          <p className="text-[16px] font-normal" onClick={() => copyToClipboard(props.walletID, 0)}>
            {copied ? "Copied!" : truncateMiddle(props.walletID, 20, 8)}
          </p>
        </div>
        <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.5 }}>
            <RiArrowDropDownLine className="text-white text-[44px]" />
        </motion.div>
      </button>

      {open && (
        <ul className="mt-4 w-full grid grid-cols-2">
          {data.map((item, index) => (
            <li key={index} className="px-2 box-border mb-2">
              <p className="text-[16px] font-normal text-[#888888]">{item.label}</p>
              <p className="text-[16px] font-[500]" onClick={item.key == 4 ? () => copyToClipboard(item.value, 4) : undefined}>
                {item.key != 4 ? item.value: itemCopied ? 'Copied!' : truncateMiddle(item.value, 12, 5)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default ReferraTemplate;
