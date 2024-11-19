import React, { useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useBattleOfChains } from "@/hooks/useBattleOfChains";
import { ModalContext } from "@/context/ModalContext";
import { ModalState } from "@/context/ModalContext";
import { useUserAssetsByType } from "@/hooks/useUserAssetsByType";
import { useAccount } from "wagmi";

interface MultichainMintButtonProps {
  type: string;
  label: string;
  className?: string;
}

export const MultichainMintButton: React.FC<MultichainMintButtonProps> = ({
  type,
  label,
  className,
}) => {
  const { multichainMint, isConfirmed, writeError, isWritePending, hash } =
    useBattleOfChains();

  const { areButtonsDisabled, openModal, setModalState, setModalError } =
    useContext(ModalContext);

  const { address } = useAccount();

  // Determine the required asset type based on the mint type
  let requiredType = "";
  if (type === "0") {
    requiredType = "2"; // User needs at least one asset of type 2
  } else if (type === "1") {
    requiredType = "3"; // User needs at least one asset of type 3
  }

  // Fetch user's assets of the required type (for types 0 and 1)
  const {
    data: userAssetsData,
    loading: assetsLoading,
    error: assetsError,
  } = useUserAssetsByType(requiredType, address || "0x");

  // Conditionally fetch user's assets of the minting type (only for types 2 and 3)
  const mintedAssetsQuery =
    type === "2" || type === "3"
      ? useUserAssetsByType(type, address || "0x")
      : null;

  const mintedAssetsData = mintedAssetsQuery?.data;
  const mintedAssetsLoading = mintedAssetsQuery?.loading;
  const mintedAssetsError = mintedAssetsQuery?.error;

  const proceedWithMint = () => {
    openModal(async () => {
      setModalState("pending_signature");
      try {
        await multichainMint(type);
      } catch (err) {
        console.error("Error:", err);
        setModalState("transaction_error");
      }
    }, "mint_confirm" as ModalState);
  };

  const handleMint = () => {
    if (assetsLoading || mintedAssetsLoading) {
      // Optionally, you can disable the button or show a loading indicator
      return;
    }

    if (assetsError || mintedAssetsError) {
      // Handle error (e.g., show an error message)
      console.error("Error fetching assets:", assetsError || mintedAssetsError);
      return;
    }

    // Check if user already has an asset of the type they're minting (only for types 2 and 3)
    if (type === "2" || type === "3") {
      const hasMintedAsset =
        mintedAssetsData?.allAssets?.nodes &&
        mintedAssetsData.allAssets.nodes.length > 0;

      if (hasMintedAsset) {
        // Show factory_already_minted modal
        openModal(
          () => {
            proceedWithMint();
          },
          "factory_already_minted",
          { type }
        );
        return;
      }
    }

    // Check if the user has the required asset type when minting types 0 or 1
    if (requiredType) {
      const hasRequiredAsset =
        userAssetsData?.allAssets?.nodes &&
        userAssetsData.allAssets.nodes.length > 0;

      if (!hasRequiredAsset) {
        // Show warning modal
        openModal(
          () => {
            proceedWithMint();
          },
          requiredType === "2"
            ? "attack_factory_not_minted"
            : "defense_factory_not_minted"
        );
        return;
      }
    }

    proceedWithMint();
  };

  // Monitor transaction state and update modalState
  useEffect(() => {
    if (isConfirmed) {
      setModalState("transaction_mint_success");
    } else if (writeError) {
      console.error(writeError);
      setModalError(writeError.message);
      setModalState("transaction_error");
    } else if (!isWritePending && hash) {
      setModalState("minting");
    }
  }, [hash, isWritePending, isConfirmed, writeError, setModalState]);

  return (
    <div>
      <Button
        variant="default"
        size="sm"
        className={`bg-primary border-[1px] border-[#FE07DD] hover:bg-[#FE07DD] hover:text-black ${className}`}
        onClick={handleMint}
        disabled={
          areButtonsDisabled || assetsLoading || mintedAssetsLoading || false
        }
      >
        {`Mint ${label}`}
      </Button>
    </div>
  );
};
