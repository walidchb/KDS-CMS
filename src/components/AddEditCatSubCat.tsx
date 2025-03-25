import React, { useState } from "react";
import Modal from "./Modal";
import { TbEdit } from "react-icons/tb";
import ButtonWithIcon from "./buttonWithIcon";

interface AddEditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  isSubCategory: boolean;
  selectedItem: {
    id: string | number | null;
    name: string | null;
  };
}

const AddEditCategoryModal: React.FC<AddEditCategoryModalProps> = ({
  isOpen,
  onClose,
  isEdit,
  isSubCategory,
  selectedItem,
}) => {
  const [name, setName] = useState(selectedItem?.name || "");

  const handleSubmit = () => {
    console.log(name);
    onClose();
  };

  // Reset name when modal closes or opens
  React.useEffect(() => {
    setName(selectedItem?.name || "");
  }, [selectedItem, isOpen]);

  if (!isOpen) return null;

  return (
    <Modal className="w-auto" onClose={onClose}>
      <div className="mb-3 flex items-center">
        <TbEdit className="text-blue-700 mr-2 text-xl" />
        <h1 className="font-inter text-lg font-medium text-blue-700">
          {isEdit ? `Modifier` : `Ajouter`}{" "}
          {isSubCategory ? "une sous-catégorie" : "une catégorie"}
        </h1>
      </div>

      <p className="text-gray-800 font-inter text-md font-normal my-2">
        {isEdit
          ? `Veuillez modifier le nom de ${
              isSubCategory ? "la sous-catégorie" : "la catégorie"
            }.`
          : `Veuillez renseigner le nom de ${
              isSubCategory ? "la sous-catégorie" : "la catégorie"
            } à ajouter.`}
      </p>

      <input
        type="text"
        placeholder="Nom"
        className="w-full border border-blue-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500 my-4"
        value={name || ""}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="flex justify-end space-x-2 mt-4">
        <ButtonWithIcon
          label="Annuler"
          className="bg-white text-blue-700   px-2"
          onClick={onClose}
        />
        <ButtonWithIcon
          label={isEdit ? "Enregistrer" : "Ajouter"}
          className="bg-blue-700 text-white h-10 px-2"
          onClick={handleSubmit}
        />
      </div>
    </Modal>
  );
};

export default AddEditCategoryModal;
