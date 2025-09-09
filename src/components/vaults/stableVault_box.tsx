import { ButtonValue, RoleShareRate, VaultVsRole } from "../../config";
import VaultsTemplate from "./vault_template";

interface Props {
  vaultType: string;
  vaultPlans: any [];
  apyObject: any;
  user: any;
  setRank: (value: string) => void
  setDepositModal: (value: boolean) => void
  setWithdrawModal: (value: boolean) => void
}

const StableVault_box = ({ vaultType, vaultPlans, apyObject, user, setRank, setDepositModal, setWithdrawModal }: Props) => {

  return (
    <ul className="gap-4 w-[100%] flex flex-col h-[600px] md:h-[400px] overflow-y-auto   scrollbar-thin
    [&::-webkit-scrollbar]:w-[8px]
    [&::-webkit-scrollbar-track]:rounded-full
    [&::-webkit-scrollbar-track]:bg-[#1E2532] 
    [&::-webkit-scrollbar-thumb]:rounded-full
    [&::-webkit-scrollbar-thumb]:bg-[#30B0C7]/60 
    [&::-webkit-scrollbar-thumb:hover]:bg-[#30B0C7]/80
    dark:[&::-webkit-scrollbar-track]:bg-[#111827]
    dark:[&::-webkit-scrollbar-thumb]:bg-[#30B0C7]/60
    dark:[&::-webkit-scrollbar-thumb:hover]:bg-[#30B0C7]/80"
  >
    {vaultType == ButtonValue[0] && Object.keys(vaultPlans).map((key: any, index: number) => (
      <VaultsTemplate
        index={index}
        apy={apyObject[key]}
        balance={vaultPlans[key].balance}
        earning={vaultPlans[key].earning}
        icon={vaultPlans[key].icon}
        lock_period={vaultPlans[key]?.lockPeriod || 0}
        title={key}
        key={index}
        locked={
          RoleShareRate[VaultVsRole[key]] > RoleShareRate[user.role]
        }
        setRank={setRank}
        setDepositModal={setDepositModal}
        setWithdrawModal={setWithdrawModal}
      />
    ))}
  </ul>
  );
};

export default StableVault_box;
