import { useState, useEffect } from "react";
import PageBackground from "../components/shared/page_background";
import GradientBox from "../components/shared/gradient_box";
import { useConnection } from "../context/connected_context";
import { useLoadingContext } from "../context/LoadingContext";
import { submitConciergeApplication } from "../apis/backendAPI";
import truncateMiddle from "../utils/truncate_text";

const Concierge = () => {
  const { isConnected, connectedWallet, user } = useConnection();
  const { setLoading } = useLoadingContext();
  const [email, setEmail] = useState("");
  const [inquiry, setInquiry] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user || !isConnected) {
      setError("Please connect your wallet to submit an application.");
      return;
    }

    if (!user.nftAmount || user.nftAmount <= 0) {
      setError("Only NFT holders can submit an application.");
      return;
    }

    if (!email || !inquiry) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      await submitConciergeApplication(
        user.walletAddress,
        user.id,
        email,
        inquiry,
        "Pending"
      );
      setSuccess("Application submitted successfully!");
      setEmail("");
      setInquiry("");
    } catch (err) {
      setError("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageBackground className="gap-6 md:gap-10">
      <GradientBox className="flex w-[100%] flex-col gap-3 z-20 max-w-[905px]">
        <h2 className="font-medium text-white text-[24px] self-start py-4 md:px-8">
          Concierge Application
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-[100%] md:w-[95%] text-white px-4 pb-4"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="walletAddress" className="text-[16px] font-medium">
              Wallet Address
            </label>
            <input
              type="text"
              id="walletAddress"
              value={truncateMiddle(connectedWallet, 20, 8) || "Not connected"}
              disabled
              className="w-full p-2 bg-[#1F2937] rounded-xl text-[16px] outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="id" className="text-[16px] font-medium">
              ID
            </label>
            <input
              type="text"
              id="id"
              value={user?.mkWalletID || "Not connected"}
              disabled
              className="w-full p-2 bg-[#1F2937] rounded-xl text-[16px] outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-[16px] font-medium">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-2 bg-[#1F2937] rounded-xl text-[16px] outline-none placeholder:text-[#888888]"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="inquiry" className="text-[16px] font-medium">
              Inquiry Details *
            </label>
            <textarea
              id="inquiry"
              value={inquiry}
              onChange={(e) => setInquiry(e.target.value)}
              placeholder="Describe your inquiry"
              className="w-full p-2 bg-[#1F2937] rounded-xl text-[16px] outline-none placeholder:text-[#888888] min-h-[150px]"
            />
          </div>
          {error && <p className="text-red-500 text-[16px]">{error}</p>}
          {success && <p className="text-[#30B0C7] text-[16px]">{success}</p>}
          <button
            type="submit"
            disabled={!user || !isConnected || Number(user.nftAmount) <= 0}
            className={`w-full p-3 rounded-xl text-[16px] font-medium ${
              user && isConnected && Number(user.nftAmount) > 0
                ? "bg-[#30B0C7] hover:bg-[#30B0C7]/80"
                : "bg-gray-500 cursor-not-allowed"
            } text-white`}
          >
            Submit Application
          </button>
        </form>
      </GradientBox>
    </PageBackground>
  );
};

export default Concierge;