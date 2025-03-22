import React, { JSX, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { IoTrashOutline } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { IColumnType, Table } from "./Table";
import ButtonWithIcon from "./buttonWithIcon";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
// import AddEditProductModal from "./AddEditCatSubCat"; // You need to create this
import AddEditProductModal from "./AddEditProduct";

interface Product {
  id: number;
  name: string;
  category: string;
  subCategory: string;
}

interface ProductProps {
  id?: number;
  name: string;
  bullets: string[];
  description: string;
  table: string[][];
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Product 1",
    category: "Category A",
    subCategory: "Sub A1",
  },
  {
    id: 2,
    name: "Product 2",
    category: "Category B",
    subCategory: "Sub B1",
  },
];

export default function ProductsContent(): JSX.Element {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  const [modalOpen, setModalOpen] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductProps | null>(
    null
  );

  const handleDeleteClick = (id: number) => {
    setSelectedProductId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    setProducts((prev) => prev.filter((p) => p.id !== selectedProductId));
    setShowDeleteModal(false);
  };

  const handleEditClick = (product: Product) => {
    setEditMode(true);
    setSelectedProduct({
      id: product.id,
      name: product.name,
      bullets: [], // Provide default or actual values
      description: "", // Provide default or actual values
      table: [], // Provide default or actual values
    });
    setModalOpen(true);
  };

  const handleAddProduct = () => {
    setEditMode(false);
    setSelectedProduct(null);
    setModalOpen(true);
  };

  const handleSave = (newProduct: Product) => {
    if (editMode) {
      setProducts((prev) =>
        prev.map((p) => (p.id === newProduct.id ? newProduct : p))
      );
    } else {
      setProducts((prev) => [
        ...prev,
        { ...newProduct, id: Date.now() }, // Temporary ID
      ]);
    }
    setModalOpen(false);
  };

  const productColumns: IColumnType<Product>[] = [
    {
      key: "name",
      title: "Nom",
      renderTitle: () => <span className="text-center">Nom</span>,
      width: 200,
      render: (_, { name }) => <span className="text-center">{name}</span>,
    },
    {
      key: "category",
      title: "Catégorie",
      renderTitle: () => <span className="text-center">Catégorie</span>,
      width: 200,
      render: (_, { category }) => (
        <span className="text-center">{category}</span>
      ),
    },
    {
      key: "subCategory",
      title: "Sous-catégorie",
      renderTitle: () => <span className="text-center">Sous-catégorie</span>,
      width: 200,
      render: (_, { subCategory }) => (
        <span className="text-center">{subCategory}</span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      renderTitle: () => <span className="text-center">Actions</span>,
      width: 100,
      render: (_, product) => (
        <div className="flex justify-center items-center gap-4">
          <div
            onClick={() => handleEditClick(product)}
            className="bg-blue-200 flex justify-center items-center w-8 h-8 rounded-md"
          >
            <CiEdit className="w-5 h-5 text-black cursor-pointer" />
          </div>
          <div
            onClick={() => handleDeleteClick(product.id)}
            className="bg-red-200 flex justify-center items-center w-8 h-8 rounded-md"
          >
            <IoTrashOutline className="w-5 h-5 text-red-500 cursor-pointer" />
          </div>
        </div>
      ),
    },
  ];

  const handleSaveProduct = (newProduct: Product) => {
    if (editMode) {
      // Update product
      setProducts((prev) =>
        prev.map((p) => (p.id === newProduct.id ? newProduct : p))
      );
    } else {
      // Add product
      setProducts((prev) => [...prev, { ...newProduct, id: Date.now() }]);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-4 p-10 text-black">
      <div className="flex justify-between items-center mb-10 w-full">
        <h3 className="text-4xl font-semibold text-red-700">Products</h3>
        <ButtonWithIcon
          className="bg-green-600 px-3 h-10 text-white"
          label="Add Product"
          icon={<IoMdAdd className="text-white" />}
          onClick={handleAddProduct}
        />
      </div>

      <Table data={products} columns={productColumns} />

      {products.length === 0 && (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500 text-lg">No products available.</p>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isSubCategory={false}
      />

      <AddEditProductModal
        isOpen={false}
        isEdit={editMode}
        product={selectedProduct}
        onClose={() => setModalOpen(false)}
        // onSubmit={handleSaveProduct}
      />
    </div>
  );
}
