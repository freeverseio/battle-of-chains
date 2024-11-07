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
        )}
        {modalState === "attack_factory_not_minted" && (
          <>
            <DialogHeader>
              <DialogTitle>Warning</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              You have no assets of type {nftTypes["2"] || "2"}. You can proceed
              to mint, but the assets will not be very strong.
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
              You have no assets of type {nftTypes["3"] || "3"}. You can proceed
              to mint, but the assets will not be very strong.
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
              {`You already have an asset of type ${
                nftTypes[modalData?.type] || modalData?.type
              }. When minting, it will only consider your asset of highest level.`}
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
