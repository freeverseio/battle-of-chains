import { ConnectKitButton } from "connectkit";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";

export const ConnectButton = () => {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName }) => {
        return (
          <button
            onClick={show}
            className="
              text-xl
              border  
              cursor-pointer 
              relative 
              inline-block 
              px-6 
              py-1.5 
              text-white 
              font-medium 
              rounded-full 
              transition-all 
              duration-200 
              ease-in-out
              hover:text-card-foreground
              hover:border-accent-foreground

            "
          >
            <div className="flex items-center justify-between gap-x-2">
              <MdOutlineAccountBalanceWallet />
              {isConnected ? ensName ?? truncatedAddress : "Connect Wallet"}
            </div>
          </button>
        );
      }}
    </ConnectKitButton.Custom>
  );
};
