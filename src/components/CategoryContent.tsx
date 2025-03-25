import React, { JSX, useState } from "react";
import { CiEdit } from "react-icons/ci";
import {
  IoTrashOutline,
  IoChevronDownOutline,
  IoChevronUpOutline,
} from "react-icons/io5";
import { IColumnType, Table } from "./Table";
import ButtonWithIcon from "./ButtonWithIcon";
import { IoMdAdd } from "react-icons/io";
import AddEditCatSubCat from "./AddEditCatSubCat";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface SubCategory {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  subCategories: SubCategory[];
}

const mockData: Category[] = [
  {
    id: 1,
    name: "Category 1",
    subCategories: [
      { id: 11, name: "Sub 1.1" },
      { id: 12, name: "Sub 1.2" },
    ],
  },
  {
    id: 2,
    name: "Category 2",
    subCategories: [
      { id: 21, name: "Sub 2.1" },
      { id: 22, name: "Sub 2.2" },
    ],
  },
];

export default function CategoryContent(): JSX.Element {
  const [openCategories, setOpenCategories] = useState<number[]>([]);
  const [editMode, setEditMode] = useState(true);
  const [subMode, setSubMode] = useState(true);
  const [selectedItem, setSelectedItem] = useState<{
    id: string | number | null;
    name: string | null;
  }>({ id: null, name: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const toggleCategory = (id: number) => {
    setOpenCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };

  const handleEditCategory = (categoryId: number | string, name: string) => {
    setEditMode(true);
    setSubMode(false);
    setSelectedItem({ id: categoryId, name: name });
    setShowAddEditModal(true);
  };

  const handleEditSub = (subId: number | number | null, name: string) => {
    setEditMode(true);
    setSubMode(true);
    setSelectedItem({ id: subId, name: name });
    setShowAddEditModal(true);
  };

  const handleDeleteSub = (subId: number | string | null, name: string) => {
    setSubMode(true);
    setSelectedItem({ id: subId, name: name });
    setShowDeleteModal(true);
  };

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
    setSelectedItem({ id: categoryId, name: "" });
    setShowAddEditModal(true);
  };

  const handleDeleteCategory = (categoryId: number, name: string) => () => {
    setEditMode(false);
    setSubMode(false);
    setSelectedItem({ id: categoryId, name: name });
    setShowDeleteModal(true);
  };

  const handleAddCategory = () => {
    setEditMode(false);
    setSubMode(false);
    setSelectedItem({ id: null, name: "" });
    setShowAddEditModal(true);
  };

  return (
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
      {mockData.map((category) => (
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

      {mockData.length === 0 && (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500 text-lg">No categories available.</p>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setSelectedItem({ id: null, name: "" });
          setShowDeleteModal(false);
        }}
        isSubCategory={subMode}
        name={selectedItem?.name}
      />

      <AddEditCatSubCat
        isOpen={showAddEditModal}
        onClose={() => {
          setSelectedItem({ id: null, name: "" });
          setShowAddEditModal(false);
        }}
        isEdit={editMode}
        isSubCategory={subMode}
        selectedItem={selectedItem}
      />
    </div>
  );
}
