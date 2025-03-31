import { Dispatch, ReactNode, SetStateAction } from "react";

export interface ModalProps {
  heading: string | ReactNode;
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  onClickPrimaryButton?: () => void;
  onClickSecondaryButton?: () => void;
  modalContent: React.ReactNode;
  children?: React.ReactNode;
  primaryButton?: React.ReactNode;
  secondaryButton?: React.ReactNode;
}
