import React from "react";
import Modal from "./Modal";
import { TbCancel } from "react-icons/tb";
import ButtonWithIcon from "./buttonWithIcon";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubCategory?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isSubCategory = false,
}) => {
  if (!isOpen) return null;

  return (
    <Modal className="w-auto" onClose={onClose}>
      <div className="mb-3 flex items-center">
        <TbCancel className="text-red-700 mr-2 text-xl" />
        <h1 className="font-inter text-lg font-medium text-red-700">
          Suppression
        </h1>
      </div>

      <p className="text-gray-800 font-inter text-md font-normal my-4">
        {`Confirmez-vous la suppression de ${
          isSubCategory ? "la sous-catégorie" : "la catégorie"
        } ?`}
      </p>

      <div className="flex justify-end space-x-2">
        <ButtonWithIcon
          label="Oui, Confirmer"
          className="bg-white text-red-700 h-10"
          onClick={onConfirm}
        />
        <ButtonWithIcon
          label="Retour"
          className="bg-red-700 text-white h-10"
          onClick={onClose}
        />
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
