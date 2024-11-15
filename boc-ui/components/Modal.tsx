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
                You are about to mint assets on Ethereum, Polygon and Arbitrum
                in one single transaction via LAOS Network. This action will
                requires only a small gas fee on LAOS. No gas fees will be
                charged on any other chain.
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
                The transaction is being sent. Please wait until full finality
                is confirmed.
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
              The upgrade transaction was successfully sent. Please check your
              logs to confirm if your treasury had sufficient funds to complete
              the asset upgrade.
            </DialogDescription>
            <DialogFooter>
              <Button variant="default" onClick={closeModal}>
                Done
              </Button>
            </DialogFooter>
          </div>
        )}
        {modalState === "voting" && (
          <div className="flex flex-col items-center">
            <DialogHeader>
              <DialogTitle>Sending Vote Transaction</DialogTitle>
              <DialogDescription>
                <div className="mb-4"></div>
                The transaction is being sent. Please wait until full finality
                is confirmed.
              </DialogDescription>
            </DialogHeader>
          </div>
        )}
        {modalState === "transaction_vote_success" && (
          <div className="flex flex-col items-center">
            <DialogHeader>
              <DialogTitle>Vote Transaction Sent Successfully</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              The vote transaction was successfully sent.
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
        {modalState === "vote_confirm" && (
          <>
            <DialogHeader>
              <DialogTitle>Vote Action </DialogTitle>

              <DialogDescription>
                You're about to vote for your chain daily decision.
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
                Vote
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
        {/* Attack Confirmation Modal */}
        {modalState === "attack_confirm" && (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Attack</DialogTitle>
              <DialogDescription>
                You’re about to attack a user. Please confirm to proceed.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter style={{ justifyContent: "space-between" }}>
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button variant="default" onClick={onConfirm}>
                Confirm Attack
              </Button>
            </DialogFooter>
          </>
        )}
        {/* Attacking Modal */}
        {modalState === "attacking" && (
          <div className="flex flex-col items-center">
            <DialogHeader>
              <DialogTitle>Attack in Progress</DialogTitle>
              <DialogDescription>
                The attack transaction is being processed. Please wait until the
                transaction reaches full finality.
              </DialogDescription>
            </DialogHeader>
          </div>
        )}
        {/* Attack Success Modal */}
        {modalState === "transaction_attack_success" && (
          <div className="flex flex-col items-center">
            <DialogHeader>
              <DialogTitle>Attack Successful</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              The attack transaction was successfully completed.
            </DialogDescription>
            <DialogFooter>
              <Button variant="default" onClick={closeModal}>
                Done
              </Button>
            </DialogFooter>
          </div>
        )}
        {modalState === "join_confirm" && (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Join Home Chain</DialogTitle>
              <DialogDescription>
                You’re about to join a home chain. Please confirm to proceed.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter style={{ justifyContent: "space-between" }}>
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button variant="default" onClick={onConfirm}>
                Confirm Join
              </Button>
            </DialogFooter>
          </>
        )}
        {modalState === "joining" && (
          <div className="flex flex-col items-center">
            <DialogHeader>
              <DialogTitle>Joining Home Chain</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              The join transaction is being processed. Please wait until the
              transaction reaches full finality.
            </DialogDescription>
          </div>
        )}
        {modalState === "transaction_join_success" && (
          <div className="flex flex-col items-center">
            <DialogHeader>
              <DialogTitle>Successfully Joined Home Chain</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              You have successfully joined your chosen home chain.
            </DialogDescription>
            <DialogFooter>
              <Button variant="default" onClick={closeModal}>
                Done
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
