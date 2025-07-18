import { useCallback, useEffect, useState } from "react";
import GradientBox from "../components/shared/gradient_box";
import PageBackground from "../components/shared/page_background";
import { IoCopySharp } from "react-icons/io5";
import { RiLightbulbLine } from "react-icons/ri";
import BonusTemplate from "../components/affiliate/bonus_template";
import { FiSearch } from "react-icons/fi";
import ReferraTemplate from "../components/affiliate/referral_template";
import { useConnection } from "../context/connected_context";
import truncateMiddle from "../utils/truncate_text";
import { getAAffiliateData, getDirectReferrals } from "../apis/backendAPI";
import MyCard from "../components/affiliate/myCard";
import { useLoadingContext } from "../context/LoadingContext";
import RoleUpCard from "../components/affiliate/roleUpCard";

const Affiliate = () => {
  const { user } = useConnection();
  const { setLoading } = useLoadingContext();
  const referralLink = `${window.location.origin}?ref=${user.referralCode}`;
  const [copied, setCopied] = useState<boolean>(false);

  const [search, setSearch] = useState<string>("");
  const [referrals, setReferrals] = useState<any[]>([]);
  const [tempReferrals, setTempReferrals] = useState<any[]>([]);
  const [shareBonus, setShareBonus] = useState<any[]>([]);
  const [orgChildren, setOrgchildren] = useState<any[]>([]);

  const changeSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (value == "") {
      setReferrals(tempReferrals);
      return;
    }

    const result = referrals.filter((item: any) =>
      item.mkWalletID.toUpperCase().includes(value.toUpperCase())
    );
    setReferrals(result);
  };

  const init = useCallback(async () => {
    setLoading(true);
    const rdata = await getAAffiliateData(user.id);
    if (rdata.referrals) {
      setReferrals(rdata.referrals);
      setTempReferrals(rdata.referrals);
    }
    if (rdata.shareBonusData) {
      setShareBonus(rdata.shareBonusData);
    }
    if (rdata.orgChildren) {
      setOrgchildren(rdata.orgChildren);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    init();
  }, []);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);

    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <PageBackground className="gap-6 md:gap-10">
      <MyCard user={user} orgChildren={orgChildren} />

      {/* Role Up Condition */}
      <RoleUpCard user={user} orgChildren={orgChildren} />

      {/* AFFILIATE LINK */}
      <GradientBox>
        <h2 className="font-medium text-white text-[20px] self-start py-4 md:px-8">
          Your Referral Link
        </h2>

        <div className="flex w-[100%] md:w-[95%] text-white items-center justify-between rounded-xl p-2 bg-[#1F2937] px-4">
          <p className="text-[14px] font-[400] w-[85%] truncate">
            {copied ? "Copied!" : truncateMiddle(referralLink, 40, 0)}
          </p>
          <button
            className="outline-none"
            onClick={() => copyToClipboard(referralLink)}
          >
            <IoCopySharp className="text-[24px] text-white" />
          </button>
        </div>

        <div className="flex w-[100%] text-white mt-4 items-center justify-between md:w-[95%] md:pb-4">
          <div className="flex flex-col gap-2 items-start">
            <p className="text-[20px] font-medium">or Scan QR Code</p>
            <div className="text-[#30B0C7] flex items-center gap-2">
              <RiLightbulbLine className="text-[24px]" />
              <p className="font-normal text-[16px] ">Easy and Instant</p>
            </div>
          </div>
          <img
            src={`https://quickchart.io/chart?chs=500x500&cht=qr&chl=${referralLink}&choe=UTF-8`}
            alt="Your affiliate code"
            className="w-[126px] h-[126px]"
          />
        </div>
      </GradientBox>

      {/* BONUS */}
      {/* <GradientBox className="flex w-[100%] flex-col gap-3 z-20 max-w-[905px]">
        <h2 className="font-medium text-white text-[24px] self-start py-4 md:px-8">
          Share Bonuses
        </h2>
        <ul
          className="flex w-[100%] flex-col gap-3 h-full max-h-[450px] overflow-y-auto   scrollbar-thin
                    [&::-webkit-scrollbar]:w-[8px]
                    [&::-webkit-scrollbar-track]:rounded-full
                    [&::-webkit-scrollbar-track]:bg-[#1E2532] 
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    [&::-webkit-scrollbar-thumb]:bg-[#30B0C7]/60 
                    [&::-webkit-scrollbar-thumb:hover]:bg-[#30B0C7]/80
                    dark:[&::-webkit-scrollbar-track]:bg-[#111827]
                    dark:[&::-webkit-scrollbar-thumb]:bg-[#30B0C7]/60
                    dark:[&::-webkit-scrollbar-thumb:hover]:bg-[#30B0C7]/80 mb-5 md:w-[95%]"
        >
          {shareBonus.length > 0 ? (
            shareBonus.map((bonus: any, index: number) => (
              <BonusTemplate
                amount={bonus.bonusAmount}
                index={index}
                number_of_nft={bonus.nftAmount}
                role={bonus.role}
                createdAt={bonus.createdAt}
                key={index}
              />
            ))
          ) : (
            <p className="text-[#30B0C7] ms-5 text-[16px]">No data</p>
          )}
        </ul>
      </GradientBox> */}

      {/* DIRECT REFERRALS */}
      <GradientBox className="flex w-[100%] flex-col gap-3 z-20 text-white max-w-[905px]">
        <h2 className="font-medium text-white text-[24px] py-4 md:px-8 self-start">
          Direct Referrals
        </h2>
        <div className="flex w-[100%] md:w-[95%] text-white items-center justify-between rounded-xl py-3 bg-[#1F2937] mb-2 px-4">
          <button type="button">
            <FiSearch className="text-[24px] text-white" />
          </button>
          <input
            type="text"
            autoFocus
            value={search}
            onChange={changeSearch}
            placeholder="Search by Wallet ID"
            name="search"
            id="search"
            className="w-[95%] text-[16px] bg-inherit outline-none px-2 placeholder:text-[#888888]"
          />
        </div>
        <ul
          className="flex w-[100%] flex-col gap-3 text-white h-full max-h-[450px] overflow-y-auto scrollbar-thin
                    [&::-webkit-scrollbar]:w-[8px]
                    [&::-webkit-scrollbar-track]:rounded-full
                    [&::-webkit-scrollbar-track]:bg-[#1E2532] 
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    [&::-webkit-scrollbar-thumb]:bg-[#30B0C7]/60 
                    [&::-webkit-scrollbar-thumb:hover]:bg-[#30B0C7]/80
                    dark:[&::-webkit-scrollbar-track]:bg-[#111827]
                    dark:[&::-webkit-scrollbar-thumb]:bg-[#30B0C7]/60
                    dark:[&::-webkit-scrollbar-thumb:hover]:bg-[#30B0C7]/80 md:w-[95%] mb-8"
        >
          {referrals.length > 0 ? (
            referrals.map((referral, index) => (
              <ReferraTemplate
                index={index}
                registration_date={referral.createdAt}
                role={referral.role}
                self_holding={referral.nftAmount}
                total_holding={referral.totalNftAmount}
                address={referral.walletAddress}
                walletID={referral.mkWalletID}
                position={referral.position}
                orgWalletID={referral?.orgParent?.mkWalletID}
                key={index}
              />
            ))
          ) : (
            <p className="text-[#30B0C7] ms-5 text-[16px]">No data</p>
          )}
        </ul>
      </GradientBox>
    </PageBackground>
  );
};

export default Affiliate;
