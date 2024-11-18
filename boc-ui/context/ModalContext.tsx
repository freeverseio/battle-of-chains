// context/ModalContext.tsx
import React, { createContext, useState, ReactNode } from "react";

export type ModalState =
  | "idle"
  | "mint_confirm"
  | "vote_confirm"
  | "attack_confirm"
  | "join_confirm"
  | "minting"
  | "voting"
  | "attacking"
  | "joining"
  | "pending_signature"
  | "transaction_upgrade_success"
  | "defense_factory_not_minted"
  | "attack_factory_not_minted"
  | "factory_already_minted"
  | "transaction_error"
  | "upgrade_confirm"
  | "upgrading"
  | "transaction_vote_success"
  | "transaction_mint_success"
  | "transaction_join_success"
  | "transaction_attack_success";
type TransactionStatus = "idle" | "pending" | "success" | "error";

interface ModalContextType {
  isModalOpen: boolean;
  openModal: (onConfirm: () => void, state: ModalState, data?: any) => void;
  closeModal: () => void;
  areButtonsDisabled: boolean;
  onConfirm?: () => void;
  modalState: ModalState;
  setModalState: React.Dispatch<React.SetStateAction<ModalState>>;
  transactionStatus: TransactionStatus;
  setTransactionStatus: React.Dispatch<React.SetStateAction<TransactionStatus>>;
  modalData?: any;
  setModalData: React.Dispatch<React.SetStateAction<any>>;
  modalError?: string;
  setModalError: React.Dispatch<React.SetStateAction<string>>;
}

export const ModalContext = createContext<ModalContextType>({
  isModalOpen: false,
  openModal: () => {},
  closeModal: () => {},
  areButtonsDisabled: false,
  modalState: "idle",
  setModalState: () => {},
  transactionStatus: "idle",
  setTransactionStatus: () => {},
  setModalData: () => {},
  setModalError: () => {},
});

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [areButtonsDisabled, setButtonsDisabled] = useState<boolean>(false);
  const [onConfirm, setOnConfirm] = useState<() => void>();
  const [modalState, setModalState] = useState<ModalState>("idle");
  const [transactionStatus, setTransactionStatus] =
    useState<TransactionStatus>("idle");
  const [modalData, setModalData] = useState<any>(null);
  const [modalError, setModalError] = useState<string>("");

  const openModal = (
    confirmCallback: () => void,
    state: ModalState,
    data?: any
  ) => {
    setModalOpen(true);
    setButtonsDisabled(true);
    setOnConfirm(() => confirmCallback);
    setModalState(state);
    setTransactionStatus("idle");
    setModalData(data || null);
  };

  const closeModal = () => {
    setModalOpen(false);
    setButtonsDisabled(false);
    setOnConfirm(undefined);
    setModalState("idle");
    setTransactionStatus("idle");
    setModalData(null);
  };

  return (
    <ModalContext.Provider
      value={{
        isModalOpen,
        openModal,
        closeModal,
        areButtonsDisabled,
        onConfirm,
        modalState,
        setModalState,
        transactionStatus,
        setTransactionStatus,
        modalData,
        setModalData,
        modalError,
        setModalError,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
