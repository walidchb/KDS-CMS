"use client";
import React, { JSX, useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import {
  IoTrashOutline,
  IoChevronDownOutline,
  IoChevronUpOutline,
} from "react-icons/io5";
import { IColumnType, Table } from "@/components/Table";
import { useRouter } from "next/navigation";

import ButtonWithIcon from "@/components/ButtonWithIcon";
import { IoMdAdd } from "react-icons/io";
import AddEditCatSubCat from "@/components/AddEditCatSubCat";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import CategoryStore from "@/stores/category";
import SuccessFailerAlert from "@/components/AlertSuccessfailer";

interface SubCategory {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  subCategories: SubCategory[];
}

export default function CategoryContent(): JSX.Element {
  const router = useRouter();

  const [openCategories, setOpenCategories] = useState<number[]>([]);
  const [editMode, setEditMode] = useState(true);
  const [subMode, setSubMode] = useState(true);
  const [selectedItemCategory, setSelectedItemCategory] = useState<{
    categoryId: string | number | null;
    categoryName: string | null;
  }>({ categoryId: null, categoryName: "" });
  const [selectedItemSubCategory, setSelectedItemSubCategory] = useState<{
    categoryId: string | number | null;
    subCategoryId: string | number | null;
    subCategoryName: string | null;
  }>({ categoryId: null, subCategoryId: null, subCategoryName: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);

  const {
    // Categories
    dataCategories,
    loadingCategories,

    // Subcategories
    dataSubcategories,
    loadingSubcategories,

    // CRUD states for Categories

    successAddCategory,

    successDeleteCategory,

    successPatchCategory,

    // CRUD states for Subcategories

    successAddSubcategory,

    successDeleteSubcategory,

    successPatchSubcategory,

    // Methods
    fetchCategories,
    fetchSubcategories,

    resetAllStates,
    globalAlertNotification,
  } = CategoryStore();

  const toggleCategory = (id: number) => {
    setOpenCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };

  const handleEditCategory = (categoryId: number | string, name: string) => {
    setEditMode(true);
    setSubMode(false);
    setSelectedItemCategory({
      categoryId: categoryId,
      categoryName: name,
    });
    // setSelectedItem({ id: categoryId, name: name });
    setShowAddEditModal(true);
  };

  const handleEditSub = (subId: number | number | null, name: string) => {
    setEditMode(true);
    setSubMode(true);
    const categoryId =
      dataSubcategories.find((sub: { id: number | null }) => sub.id === subId)
        ?.Category.id || null;
    setSelectedItemSubCategory({
      categoryId,
      subCategoryId: subId,
      subCategoryName: name,
    });

    setShowAddEditModal(true);
  };

  const handleDeleteSub = (subId: number | string | null, name: string) => {
    setSubMode(true);
    setSelectedItemSubCategory({
      categoryId: null,
      subCategoryId: subId,
      subCategoryName: name,
    });
    // setSelectedItem({ id: subId, name: name });
    setShowDeleteModal(true);
  };

  const fetchData: () => void = () => {
    fetchCategories("/categories"); // Replace with your real endpoint
    fetchSubcategories("/subcategories/"); // Replace with your real endpoint
  };

  useEffect(() => {
    fetchData();
    return () => {
      resetAllStates();
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groupedData: Category[] = dataCategories.map((category: any) => {
    const subCategories = dataSubcategories
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((sub: any) => sub.Category.id === category.id)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((sub: any) => ({
        id: sub.id,
        name: sub.name,
      }));

    return {
      id: category.id,
      name: category.name,
      subCategories,
    };
  });

  // Columns typed according to your IColumnType pattern
  const subCategoryColumns: IColumnType<SubCategory>[] = [
    {
      key: "name",
      title: "Nom",
      renderTitle: () => (
        <span className="flex justify-center items-center">Nom</span>
      ),
      width: 200,
      render: (_, { name }) => (
        <span className="flex justify-center items-center">{name}</span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      renderTitle: () => (
        <span className="flex justify-center items-center">Actions</span>
      ),
      width: 100,
      render: (_, { id, name }) => (
        <div className="flex justify-center items-center gap-4">
          <div
            onClick={() => handleEditSub(id, name)}
            className="bg-blue-200 flex justify-center items-center w-8 h-8 rounded-md"
          >
            <CiEdit className="w-5 h-5 text-black cursor-pointer" />
          </div>

          <div
            onClick={() => handleDeleteSub(id, name)}
            className="bg-red-200 flex justify-center items-center w-8 h-8 rounded-md"
          >
            <IoTrashOutline className="w-5 h-5 text-red-500 cursor-pointer" />
          </div>
        </div>
      ),
    },
  ];

  // const [isSubCategory, setIsSubCategory] = useState(false);

  const handleAddSubCategory = (categoryId: number) => {
    setEditMode(false);
    setSubMode(true);

    setSelectedItemSubCategory({
      categoryId: categoryId,
      subCategoryId: null,
      subCategoryName: "",
    });
    setShowAddEditModal(true);
  };

  const handleDeleteCategory = (categoryId: number, name: string) => () => {
    setEditMode(false);
    setSubMode(false);
    setSelectedItemCategory({
      categoryId: categoryId,
      categoryName: name,
    });
    setShowDeleteModal(true);
  };

  const handleAddCategory = () => {
    setEditMode(false);
    setSubMode(false);
    setSelectedItemCategory({
      categoryId: null,
      categoryName: "",
    });
    setShowAddEditModal(true);
  };

  useEffect(() => {
    if (
      successAddCategory ||
      successDeleteCategory ||
      successPatchCategory ||
      successAddSubcategory ||
      successDeleteSubcategory ||
      successPatchSubcategory
    ) {
      fetchData();
      handleModalClose();
    }
  }, [
    successAddCategory,
    successDeleteCategory,
    successPatchCategory,
    successAddSubcategory,
    successDeleteSubcategory,
    successPatchSubcategory,
  ]);

  const handleModalClose: () => void = () => {
    setShowDeleteModal(false);
    setShowAddEditModal(false);
    setSelectedItemCategory({
      categoryId: null,
      categoryName: "",
    });
    setSelectedItemSubCategory({
      categoryId: null,
      subCategoryId: null,
      subCategoryName: "",
    });
    setEditMode(false);
    setSubMode(false);
  };

  return (
    <div className="min-h-screen w-screen bg-gray-100">
      {/* Tabs */}
      <div className=" flex shadow-2xl rounded-b-2xl overflow-hidden w-full mb-4">
        <button
          onClick={() => {
            router.replace("/products");
          }}
          className={`px-4 cursor-pointer w-full h-[60px] bg-gray-200 text-black`}
        >
          Products
        </button>
        <button
          onClick={() => {
            router.replace("/categories");
          }}
          className={`px-4 border-x-2 border-gray-400 cursor-pointer w-full h-[60px]  bg-red-500 text-white`}
        >
          Categories / Sub-Categories
        </button>
        <button
          onClick={() => {
            router.replace("/customImages");
          }}
          className={`px-4 cursor-pointer w-full h-[60px]  bg-gray-200 text-black`}
        >
          Images
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4  p-10 text-black">
        <div className="flex justify-between items-center  mb-10 w-full">
          <h3 className="text-4xl  font-semibold text-red-700">
            Categories and Sub categories
          </h3>
          <ButtonWithIcon
            className="bg-gray-600 px-2 h-10 text-white"
            label="Add category"
            icon={<IoMdAdd className="text-white" />}
            onClick={() => handleAddCategory()}
          />
        </div>

        {loadingCategories && (
          <div className="h-full flex justify-center flex-col items-center animate-pulse">
            <div className="w-16 h-16 border-4 border-red-700 border-dashed rounded-full animate-spin"></div>

            <p className="text-sm text-gray-400 mt-2">
              Loading, please wait...
            </p>
          </div>
        )}

        {!loadingCategories &&
          !loadingSubcategories &&
          groupedData?.map((category) => (
            <div
              key={category.id}
              className="border flex flex-col justify-start bg-white items-center w-full border-gray-300 rounded-lg"
            >
              <div
                className="flex  w-full justify-between items-center p-4 cursor-pointer"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="flex items-center gap-2">
                  {openCategories.includes(category.id) ? (
                    <IoChevronUpOutline className="w-5 h-5" />
                  ) : (
                    <IoChevronDownOutline className="w-5 h-5" />
                  )}
                  <h3 className="font-medium">{category.name}</h3>
                </div>
                <div className="flex  justify-start items-center  gap-4">
                  <ButtonWithIcon
                    className="bg-blue-500 px-2 h-10 text-white"
                    label="Add Sub-category"
                    icon={<IoMdAdd className="text-white" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddSubCategory(category.id);
                    }}
                  />
                  <div
                    className="bg-purple-100 flex justify-center items-center w-8 h-8 rounded-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditCategory(category.id, category.name);
                    }}
                  >
                    <CiEdit className="w-5 h-5 text-black cursor-pointer" />
                  </div>
                  <div
                    onClick={handleDeleteCategory(category.id, category.name)}
                    className="bg-red-100 flex justify-center items-center w-8 h-8 rounded-md"
                  >
                    <IoTrashOutline className="w-5 h-5 cursor-pointer" />
                  </div>
                </div>
              </div>

              {openCategories.includes(category.id) && (
                <div className="p-4  w-[80%]">
                  <Table
                    data={category.subCategories}
                    columns={subCategoryColumns}
                  />
                </div>
              )}
            </div>
          ))}

        {groupedData?.length === 0 &&
          !loadingCategories &&
          !loadingSubcategories && (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500 text-lg">No categories available.</p>
            </div>
          )}

        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={handleModalClose}
          isSubCategory={subMode}
          selectedItem={
            !subMode ? selectedItemCategory : selectedItemSubCategory
          }
        />

        <AddEditCatSubCat
          isOpen={showAddEditModal}
          onClose={handleModalClose}
          isEdit={editMode}
          isSubCategory={subMode}
          selectedItem={
            !subMode ? selectedItemCategory : selectedItemSubCategory
          }
        />

        {globalAlertNotification.type !== null && (
          <div className="absolute right-0 bottom-0 mr-6 mb-6">
            <SuccessFailerAlert
              message={globalAlertNotification.message}
              type={globalAlertNotification.type}
            />
          </div>
        )}
      </div>
    </div>
  );
}
