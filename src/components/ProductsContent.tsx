import React, { JSX, useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { IoTrashOutline } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa";

import { IoMdAdd } from "react-icons/io";
import { IColumnType, Table } from "./Table";
import ButtonWithIcon from "./buttonWithIcon";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import ViewProductModal from "./ProductDetails";
// import AddEditProductModal from "./AddEditCatSubCat"; // You need to create this
import AddEditProductModal from "./AddEditProduct";
import ProductsStore from "@/stores/products";
import TableLoader from "./TableLoader";
import Dropdown from "./DropDown";
import { useRouter, useSearchParams } from "next/navigation";

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  ListDescription: string[];
  Category: {
    id: string;
    name: string;
  };
  SubCategory: {
    id: string;
    name: string;
  };
}

export default function ProductsContent(): JSX.Element {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProductToDelete, setselectedProductToDelete] = useState<{
    id: string | number | null;
    name: string | null;
  }>({ id: null, name: "" });
  const [selectedProductId, setSelectedProductId] = useState<
    number | string | null
  >(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [addEditModal, setAddEditModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null
  );

  const {
    fetchDataCategories,
    dataCategories,
    loadingCategories,
    errorGetCategories,
    fetchDataSubcategories,
    dataSubcategories,
    loadingSubcategories,
    errorGetSubcategories,
    Dataproducts,
    errorGetProducts,
    loadingProducts,
    productDetails,
    errorGetProductDetails,
    loadingProductDetails,
    dataPatchProduct,
    loadingPatch,
    errorPatch,
    successPatch,
    dataDeleteProduct,
    loadingDelete,
    errorDelete,
    successDelete,
    dataAddProduct,
    loadingAddProduct,
    errorAddProduct,
    successAddProduct,
    fetchDataProducts,
    fetchDataProductDetails,
    patchProduct,
    deleteProduct,
    addProduct,
  } = ProductsStore();

  const router = useRouter();
  const searchParams = useSearchParams();

  const updateQueryParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`?${params.toString()}`);
  };

  const handleCategoryChange = (value: string | null) => {
    const categoryId = dataCategories?.data.find(
      (category: { name: string }) => category.name === value
    )?.id;
    setSelectedCategory(categoryId);
    updateQueryParams("category", categoryId);
  };

  const handleSubCategoryChange = (value: string | null) => {
    const subCategoryId = dataSubcategories.find(
      (subcategory: { name: string }) => subcategory.name === value
    )?.id;
    setSelectedSubCategory(subCategoryId);
    updateQueryParams("subCategory", subCategoryId);
  };

  const handlePageChange = (page: number) => {
    updateQueryParams("page", page.toString());
  };

  useEffect(() => {
    const pageParam = searchParams.get("page");
    const categoryParam = searchParams.get("category");
    const subCategoryParam = searchParams.get("subCategory");

    setSelectedCategory(categoryParam || null);
    setSelectedSubCategory(subCategoryParam || null);

    const page = pageParam ? parseInt(pageParam) : 1;

    const query = `/products/pagination?page=${page}${
      categoryParam ? `&categoryId=${categoryParam}` : ""
    }${subCategoryParam ? `&subCategoryId=${subCategoryParam}` : ""}`;

    fetchDataProducts(query);
  }, [searchParams]);
  // useEffect(() => {
  //   console.log(selectedItem);
  // }, [selectedItem]);

  useEffect(() => {
    // const categoryParam = searchParams.get("category");

    fetchDataCategories("/categories/pagination");

    // fetchDataSubcategories("/subcategories/pagination");
    fetchDataProducts(`/products/pagination?page=1&limit=20`);
  }, [router]);

  useEffect(() => {
    if (selectedCategory) {
      fetchDataSubcategories(`/subcategories/${selectedCategory}/category`);
    }
  }, [selectedCategory]);

  // useEffect(() => {
  //   console.log("data prdycsdk");
  //   console.log(Dataproducts.data);
  // }, [Dataproducts]);

  const handleDeleteClick = (id: number | string, name: string) => {
    setselectedProductToDelete({ id: id, name: name });
    setShowDeleteModal(true);
  };

  const handleViewClick = (product: Product) => {
    // fetchDataProductDetails(`/products/${product.id}/dynamic`);
    setSelectedProductId(product.id);
    setIsDetailsModalOpen(true);
  };

  const handleEditClick = (product: Product) => {
    setEditMode(true);
    setSelectedProductId(product.id);

    setAddEditModal(true);
  };

  const handleAddProduct = () => {
    setEditMode(false);
    // setSelectedProduct(null);
    setAddEditModal(true);
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
      render: (_, { Category }) => (
        <span className="text-center">{Category.name}</span>
      ),
    },
    {
      key: "subCategory",
      title: "Sous-catégorie",
      renderTitle: () => <span className="text-center">Sous-catégorie</span>,
      width: 200,
      render: (_, { SubCategory }) => (
        <span className="text-center">{SubCategory.name}</span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      renderTitle: () => (
        <span className="flex justify-center items-center">Actions</span>
      ),
      width: 100,
      render: (_, product) => (
        <div className="flex justify-center items-center gap-4">
          <div
            onClick={() => handleViewClick(product)}
            className="bg-green-200 flex justify-center items-center w-8 h-8 rounded-md"
          >
            <FaRegEye className="w-5 h-5 text-black cursor-pointer" />
          </div>
          <div
            onClick={() => handleEditClick(product)}
            className="bg-blue-200 flex justify-center items-center w-8 h-8 rounded-md"
          >
            <CiEdit className="w-5 h-5 text-black cursor-pointer" />
          </div>
          <div
            onClick={() => handleDeleteClick(product.id, product.name)}
            className="bg-red-200 flex justify-center items-center w-8 h-8 rounded-md"
          >
            <IoTrashOutline className="w-5 h-5 text-red-500 cursor-pointer" />
          </div>
        </div>
      ),
    },
  ];

  const handleClear = () => {
    console.log("Selection cleared!");
  };

  return (
    <div className="space-y-4 p-10 text-black">
      <div className="flex  flex-wrap justify-between items-center mb-10 w-full">
        <h3 className="text-4xl font-semibold text-red-700">Products</h3>
        <div className="flex justify-center space-x-2 items-center flex-wrap">
          <Dropdown
            className="min-w-[300px]  w-full sm:w-[48%] lg:w-[30%]"
            placeholder={"Category"}
            items={
              dataCategories?.data?.map(
                (category: { name: string }) => category.name
              ) || []
            }
            value={
              dataCategories?.data?.find(
                (category: { id: string }) => category.id === selectedCategory
              )?.name
            }
            setValue={handleCategoryChange}
            onClear={handleClear}
          />
          {dataSubcategories?.length != 0 ? (
            <Dropdown
              className="min-w-[300px]  w-full sm:w-[48%] lg:w-[30%]"
              placeholder={"sous-catégorie"}
              items={
                dataSubcategories?.map(
                  (subcategory: { name: string }) => subcategory.name
                ) || []
              }
              value={
                dataSubcategories?.find(
                  (subcategory: { id: string }) =>
                    subcategory.id === selectedSubCategory
                )?.name
              }
              setValue={handleSubCategoryChange}
              onClear={handleClear}
            />
          ) : null}
        </div>
        <ButtonWithIcon
          className="bg-green-600 px-3 h-10 text-white"
          label="Add Product"
          icon={<IoMdAdd className="text-white" />}
          onClick={handleAddProduct}
        />
      </div>

      {loadingProducts ? (
        <TableLoader />
      ) : (
        <Table data={Dataproducts?.data} columns={productColumns} />
      )}

      {Dataproducts?.data?.length === 0 && (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500 text-lg">No products available.</p>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        isSubCategory={false}
        isProduct={true}
        name={selectedProductToDelete?.name}
      />

      <AddEditProductModal
        isOpen={addEditModal}
        isEdit={editMode}
        product={selectedProductId}
        onClose={() => setAddEditModal(false)}
      />

      <ViewProductModal
        isOpen={isDetailsModalOpen}
        product={selectedProductId}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </div>
  );
}
