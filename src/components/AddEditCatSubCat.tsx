import React, { useState } from "react";
import Modal from "./Modal";
import { TbEdit } from "react-icons/tb";
import ButtonWithIcon from "./buttonWithIcon";

import CategoryStore from "@/stores/category";

interface AddEditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  isSubCategory: boolean;
  selectedItem: {
    categoryId?: string | number | null;
    subCategoryId?: string | number | null;
    categoryName?: string | null;
    subCategoryName?: string | null;
  };
}

const AddEditCategoryModal: React.FC<AddEditCategoryModalProps> = ({
  isOpen,
  onClose,
  isEdit,
  isSubCategory,
  selectedItem,
}) => {
  const {
    // Categories
    dataCategories,
    loadingCategories,
    errorCategories,
    successCategories,

    // Subcategories
    dataSubcategories,
    loadingSubcategories,
    errorSubcategories,
    successSubcategories,

    // CRUD states for Categories
    dataAddCategory,
    loadingAddCategory,
    errorAddCategory,
    successAddCategory,

    dataDeleteCategory,
    loadingDeleteCategory,
    errorDeleteCategory,
    successDeleteCategory,

    dataPatchCategory,
    loadingPatchCategory,
    errorPatchCategory,
    successPatchCategory,

    // CRUD states for Subcategories
    dataAddSubcategory,
    loadingAddSubcategory,
    errorAddSubcategory,
    successAddSubcategory,

    dataDeleteSubcategory,
    loadingDeleteSubcategory,
    errorDeleteSubcategory,
    successDeleteSubcategory,

    dataPatchSubcategory,
    loadingPatchSubcategory,
    errorPatchSubcategory,
    successPatchSubcategory,

    // Methods
    fetchCategories,
    fetchSubcategories,
    addCategory,
    deleteCategory,
    patchCategory,
    addSubcategory,
    deleteSubcategory,
    patchSubcategory,
  } = CategoryStore();
  const [name, setName] = useState(
    isSubCategory
      ? selectedItem?.subCategoryName
      : selectedItem?.categoryName || ""
  );

  const handleSubmit = () => {
    if (isSubCategory) {
      if (isEdit) {
        // Logic to edit the subcategory
        patchSubcategory(`/subcategories/${selectedItem?.subCategoryId}/`, {
          name,
          categoryId: selectedItem?.categoryId,
        });
      } else {
        addSubcategory(`/subcategories/`, {
          name,
          categoryId: selectedItem?.categoryId,
        });
      }
    } else {
      if (isEdit) {
        // Logic to edit the category or subcategory
        patchCategory(`/categories/${selectedItem?.categoryId}/`, {
          name,
        });
      } else {
        addCategory(`/categories`, {
          name,
        });
      }
    }
    onClose();
  };

  // Reset name when modal closes or opens
  React.useEffect(() => {
    setName(
      isSubCategory
        ? selectedItem?.subCategoryName
        : selectedItem?.categoryName || ""
    );
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
