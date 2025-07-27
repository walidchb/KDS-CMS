import React from "react";
import Modal from "./Modal";
import { TbCancel } from "react-icons/tb";
import ButtonWithIcon from "@/components/ButtonWithIcon";
import ImagesStore from "@/stores/images"; // Ensure this is the correct path

interface DeleteConfirmationModalImageProps {
  isOpen: boolean;
  onClose: () => void;
  image?: {
    id: string | null;
    name: string | null;
  };
}

const DeleteConfirmationModalImage: React.FC<
  DeleteConfirmationModalImageProps
> = ({ isOpen, onClose, image }) => {
  const { deleteImage, loadingDelete } = ImagesStore();

  const handleDelete = () => {
    if (image?.id) {
      deleteImage(`/customImages/${image.id}/`);
    }
  };

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
        {`Confirmez-vous la suppression de l'image :`}
        <span className="font-semibold">{image?.name}</span> ?
      </p>

      <div className="flex justify-end space-x-2">
        <ButtonWithIcon
          loading={loadingDelete}
          label="Oui, Confirmer"
          className="bg-white text-red-700 h-10 mr-6"
          onClick={handleDelete}
        />
        <ButtonWithIcon
          label="Retour"
          className="bg-red-700 px-2 text-white h-10"
          onClick={onClose}
        />
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModalImage;
