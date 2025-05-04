import React from "react";
import Modal from "./Modal";
import { TbCancel } from "react-icons/tb";
import ButtonWithIcon from "./buttonWithIcon";
import CategoryStore from "@/stores/category";
import ProductsStore from "@/stores/products"; // Ensure this is the correct path to ProductsStore

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product?: any;
  isSubCategory?: boolean;
  isProduct?: boolean;
  selectedItem?: {
    categoryId?: string | number | null;
    subCategoryId?: string | number | null;
    categoryName?: string | null;
    subCategoryName?: string | null;
  };
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  product,
  isSubCategory = false,
  selectedItem,
  isProduct = false,
}) => {
  const { deleteProduct, loadingDelete } = ProductsStore();
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

  const handleDelete: () => void = () => {
    // Handle the delete action here
    if (isSubCategory) {
      // handle delete sub catefory
      deleteSubcategory(`/subcategories/${selectedItem?.subCategoryId}/`);
    } else if (isProduct) {
      deleteProduct(`/products/${product?.id}/`);
    } else {
      // handle delete category
      deleteCategory(`/categories/${selectedItem?.categoryId}/`);
    }
    // onClose();
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
        {`Confirmez-vous la suppression de ${
          isProduct
            ? "le produit: "
            : isSubCategory
            ? "la sous-catégorie : "
            : "la catégorie: "
        } `}{" "}
        <span className="font-semibold">
          {isSubCategory
            ? selectedItem?.subCategoryName
            : isProduct
            ? product?.name
            : selectedItem?.categoryName}
        </span>{" "}
        {`?`}
      </p>

      <div className="flex justify-end space-x-2">
        <ButtonWithIcon
          loading={
            loadingDeleteCategory || loadingDeleteSubcategory || loadingDelete
          }
          label="Oui, Confirmer"
          className={`bg-white  text-red-700 h-10 mr-6`}
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

export default DeleteConfirmationModal;
