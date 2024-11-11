import React, { useContext } from "react";
import { ModalContext } from "@/context/ModalContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import mintAnimation from "@/public/animations/mint_animation.gif";
import Image from "next/image";
import { useNftTypes } from "@/hooks/useNftTypes"; // Import the hook

const Modal: React.FC = () => {
  const { isModalOpen, closeModal, onConfirm, modalState, modalData } =
    useContext(ModalContext);
  const { loading, error, nftTypes } = useNftTypes(); // Fetch asset names

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading asset names: {error.message}</div>;

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent showCloseButton={false}>
        {modalState === "mint_confirm" && (
          <>
            <DialogHeader>
              <DialogTitle>Multichain Atomic Mint</DialogTitle>
              <DialogDescription>
                <div className="mb-4">
                  <Image
                    src={mintAnimation}
                    alt="Multi-chain mint"
                    width={300}
                    className="mx-auto"
                  />
                </div>
                You're about to create assets on Ethereum, Polygon and Arbitrum
                in one single transaction via LAOS Network.
              </DialogDescription>
              <DialogDescription>
                This action will require only a small gas fee on LAOS. No gas
                fees will be charged on any other chain.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button className="mb-2" variant="default" onClick={onConfirm}>
                Mint Now
              </Button>
            </DialogFooter>
          </>
        )}{" "}
        {modalState === "minting" && (
          <div className="flex flex-col items-center">
            <DialogHeader>
              <DialogTitle>Multichain Atomic Mint in Progrees</DialogTitle>
              <DialogDescription>
                <div className="mb-4">
                  <Image
                    src={mintAnimation}
                    alt="Multi-chain mint"
                    width={300}
                    className="mx-auto"
                  />
                </div>
                You are about to mint assets on Ethereum, Polygon and Arbitrum in one single transaction via LAOS Network.
                This action will requires only a small gas fee on LAOS. No gas fees will be charged on any other chain.
              </DialogDescription>
            </DialogHeader>
          </div>
        )}
        {modalState === "transaction_mint_success" && (
          <div className="flex flex-col items-center">
            <DialogHeader>
              <DialogTitle>Multichain Atomic Mint Successful</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Assets have been minted successfully.
            </DialogDescription>
            <DialogFooter>
              <Button variant="default" onClick={closeModal}>
                Done
              </Button>
            </DialogFooter>
          </div>
        )}
        {modalState === "upgrading" && (
          <div className="flex flex-col items-center">
            <DialogHeader>
              <DialogTitle>Sending Asset Upgrade Transaction</DialogTitle>
              <DialogDescription>
                <div className="mb-4"></div>
                The transaction is being sent. Please wait until
                full finality is confirmed.
              </DialogDescription>
            </DialogHeader>
          </div>
        )}
        {modalState === "transaction_upgrade_success" && (
          <div className="flex flex-col items-center">
            <DialogHeader>
              <DialogTitle>Upgrade Transaction Sent Successfully</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              The upgrade transaction was successfully sent.
              Please check your logs to confirm if your treasury
              had sufficient funds to complete the asset upgrade. 
            </DialogDescription>
            <DialogFooter>
              <Button variant="default" onClick={closeModal}>
                Done
              </Button>
            </DialogFooter>
          </div>
        )}
        {modalState === "transaction_error" && (
          <div className="flex flex-col items-center">
            <DialogHeader>
              <DialogTitle>Oops, Something Went Wrong</DialogTitle>
            </DialogHeader>
            <DialogFooter>
              <Button variant="secondary" onClick={closeModal}>
                Close
              </Button>
            </DialogFooter>
          </div>
        )}
        {modalState === "upgrade_confirm" && (
          <>
            <DialogHeader>
              <DialogTitle>Asset Upgrade </DialogTitle>

              <DialogDescription>
                You're about to upgrade an asset.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                className="mb-2"
                variant="default"
                onClick={() => {
                  if (onConfirm) {
                    onConfirm();
                  }
                }}
              >
                Upgrade
              </Button>
            </DialogFooter>
          </>
        )}
        {modalState === "pending_signature" && (
          <div className="flex flex-col items-center">
            <DialogHeader>
              <DialogTitle>Waiting for Confirmation</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Please confirm the transaction in your wallet.{" "}
            </DialogDescription>
          </div>
        )}
        {modalState === "attack_factory_not_minted" && (
          <>
            <DialogHeader>
              <DialogTitle>Warning</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              You currently have no {nftTypes["2"] || "type 2 assets"}. Remember
              that newly minted assets will adopt the level of your{" "}
              {nftTypes["2"]}. It’s recommended to first mint an {nftTypes["2"]}
              ; otherwise, new assets will default to level 0.
            </DialogDescription>
            <DialogFooter style={{ justifyContent: "space-between" }}>
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button variant="default" onClick={onConfirm}>
                Proceed
              </Button>
            </DialogFooter>
          </>
        )}
        {modalState === "defense_factory_not_minted" && (
          <>
            <DialogHeader>
              <DialogTitle>Warning</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              You currently have no {nftTypes["3"] || "type 3 assets"}. Remember
              that newly minted assets will adopt the level of your{" "}
              {nftTypes["3"]}. It’s recommended to first mint a {nftTypes["3"]};
              otherwise, new assets will default to level 0.
            </DialogDescription>
            <DialogFooter style={{ justifyContent: "space-between" }}>
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button variant="default" onClick={onConfirm}>
                Proceed
              </Button>
            </DialogFooter>
          </>
        )}
        {modalState === "factory_already_minted" && (
          <>
            <DialogHeader>
              <DialogTitle>Notice</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              {`You already have ${
                /^[AEIOUaeiou]/.test(
                  nftTypes[modalData?.type] || modalData?.type
                )
                  ? "an"
                  : "a"
              } ${
                nftTypes[modalData?.type] || modalData?.type
              }. When minting assets, only the highest-level corresponding factory will be used.`}
            </DialogDescription>
            <DialogFooter style={{ justifyContent: "space-between" }}>
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button variant="default" onClick={onConfirm}>
                Proceed
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
