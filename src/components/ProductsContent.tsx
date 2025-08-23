"use client";
import React, { JSX, useEffect, useState, Suspense } from "react";
import { CiEdit } from "react-icons/ci";
import { IoTrashOutline } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";

import { IoMdAdd } from "react-icons/io";
import { IColumnType, Table } from "@/components/Table";
import ButtonWithIcon from "@/components/ButtonWithIcon";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import ViewProductModal from "@/components/ProductDetails";
// import AddEditProductModal from "@/components/AddEditCatSubCat"; // You need to create this
import AddEditProductModal from "@/components/AddEditProduct";
import ProductsStore from "@/stores/products";
import TableLoader from "@/components/TableLoader";
import Dropdown from "@/components/DropDown";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/components/Pagination";
import SuccessFailerAlert from "@/components/AlertSuccessfailer";
import InputWithIcon from "@/components/InputWithIcon";
import NavigationTabs from "./NavBar";

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

  const [page, setpage] = useState(1);
  const searchParams = useSearchParams();

  const {
    fetchDataCategories,
    dataCategories,

    fetchDataSubcategories,
    dataSubcategories,

    Dataproducts,

    loadingProducts,

    successPatch,

    successDelete,

    successAddProduct,
    fetchDataProducts,

    globalAlertNotification,
  } = ProductsStore();

  const router = useRouter();
  // const searchParams = useSearchParams();
  // const pageParam = searchParams.get("page");

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login"); // redirect to login
  };

  const updateQueryParams = (
    key: string,
    value: string | null,
    resetPage: boolean = false
  ) => {
    const searchParams = new URLSearchParams(window.location.search);
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    if (resetPage) {
      params.set("page", "1"); // Always reset page when a filter changes
    }

    router.push(`?${params.toString()}`);
  };

  const [name, setName] = useState("");

  const handleNameChange = (value: string | null) => {
    setName(value || "");
    if (value === null || value === "") {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("page", "1");
      searchParams.delete("name");

      router.push(`?${searchParams.toString()}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateQueryParams("name", name, true); // reset page
    }
  };

  const handleCategoryChange = (value: string | null) => {
    const categoryId = dataCategories?.data.find(
      (category: { name: string }) => category.name === value
    )?.id;
    setSelectedCategory(categoryId);
    updateQueryParams("category", categoryId, true); // reset page
  };

  const handleSubCategoryChange = (value: string | null) => {
    const subCategoryId = dataSubcategories.find(
      (subcategory: { name: string }) => subcategory.name === value
    )?.id;
    setSelectedSubCategory(subCategoryId);
    updateQueryParams("subCategory", subCategoryId, true); // reset page
  };

  const handlePageChange = (page: number) => {
    setpage(page);
    updateQueryParams("page", page.toString());
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const pageParam = searchParams.get("page");
    setpage(pageParam ? parseInt(pageParam) : 1);
    const categoryParam = searchParams.get("category");
    const subCategoryParam = searchParams.get("subCategory");
    const nameParam = searchParams.get("name");

    setSelectedCategory(categoryParam || null);
    setSelectedSubCategory(subCategoryParam || null);
    setName(nameParam || "");

    const page = pageParam ? parseInt(pageParam) : 1;

    const query = `/products/pagination?page=${page}${
      categoryParam ? `&categoryId=${categoryParam}` : ""
    }${subCategoryParam ? `&subCategoryId=${subCategoryParam}` : ""}${
      name ? `&name=${nameParam}` : ``
    } `;

    fetchDataProducts(query);
  }, [searchParams.toString()]);

  useEffect(() => {
    fetchDataCategories("/categories/pagination");
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      console.log("cat", selectedCategory);
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
    // console.log("one");
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
        <span className="text-center">{Category?.name || "-"}</span>
      ),
    },
    {
      key: "subCategory",
      title: "Sous-catégorie",
      renderTitle: () => <span className="text-center">Sous-catégorie</span>,
      width: 200,
      render: (_, { SubCategory }) => (
        <span className="text-center">{SubCategory?.name || "-"}</span>
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

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const pageParam = searchParams.get("page");
    const categoryParam = searchParams.get("category");
    const subCategoryParam = searchParams.get("subCategory");

    setSelectedCategory(categoryParam || null);
    setSelectedSubCategory(subCategoryParam || null);

    const page = pageParam ? parseInt(pageParam) : 1;

    const query = `/products/pagination?page=${page}${
      categoryParam ? `&categoryId=${categoryParam}` : ""
    }${subCategoryParam ? `&subCategoryId=${subCategoryParam}` : ""}`;

    // console.log("add", successAddProduct);
    // console.log("delete", successDelete);
    // console.log("patch", successPatch);
    if (successAddProduct || successDelete || successPatch) {
      // console.log("kmlna");
      fetchDataProducts(query);
      handleModalClose();
    }
    // if (successPatch) {
    // fetchDataProducts(query);}
  }, [successAddProduct, successPatch, successDelete]);

  const handleModalClose = () => {
    setAddEditModal(false);
    setEditMode(false);
    setSelectedProductId(null);
    setShowDeleteModal(false);
    setselectedProductToDelete({ id: null, name: "" });
    setIsDetailsModalOpen(false);
  };
  // useEffect(() => {
  //   if (successAddProduct ) {
  //     fetchDataProducts(`/products/pagination?page=1&limit=20`);
  //     setAddEditModal(false);
  //   }
  // }, [successAddProduct, successPatch, successDelete]);

  return (
    <Suspense fallback={<div>.</div>}>
      <div className="min-h-screen w-screen bg-gray-100">
        {/* Tabs */}
        <NavigationTabs current="products" />

        {/* Content */}
        <div className="space-y-4 p-10 text-black">
          <div className="flex  flex-wrap justify-between items-center mb-10 w-full">
            <h3 className="text-4xl font-semibold text-red-700">Produits</h3>
            <div className="flex justify-center space-x-2 items-center flex-wrap">
              <InputWithIcon
                onKeyDown={handleKeyDown}
                // label="Search"
                icon={<CiSearch className="text-gray-600" />}
                placeholder={"Rechercher un produit..."}
                type="text"
                id="email"
                name="email"
                // className={` min-w-[300px] flex justify-center items-center  px-4 bg-white text-gray-600 border-[0.5px] border-gray-200 w-full sm:w-[48%] lg:w-[30%]  h-[40px]   rounded-full focus:ring-2 focus:outline-none
                // `}
                className="min-w-[300px]   w-full sm:w-[48%] lg:w-[30%]"
                value={name}
                onChange={(e: { target: { value: string | null } }) =>
                  handleNameChange(e.target.value)
                } // Replace setValue with onChange
              />

              <Dropdown
                className="min-w-[300px]  w-full sm:w-[48%] lg:w-[30%]"
                placeholder={"Catégorie"}
                items={
                  dataCategories?.data?.map(
                    (category: { name: string }) => category.name
                  ) || []
                }
                value={
                  dataCategories?.data?.find(
                    (category: { id: string }) =>
                      category.id === selectedCategory
                  )?.name
                }
                setValue={handleCategoryChange}
                onClear={() => {
                  setSelectedCategory(null);
                  setSelectedSubCategory(null);

                  router.push(`?page=${page}&&name=${name}`); // Reset to page 1 when category is cleared
                }}
              />
              {selectedCategory && dataSubcategories?.length != 0 && (
                <Dropdown
                  className="min-w-[300px]  w-full sm:w-[48%] lg:w-[30%]"
                  placeholder={"Sous-catégorie"}
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
                  // onClear={handleClear}
                />
              )}
            </div>
            <ButtonWithIcon
              className="bg-green-600 px-3 h-10 text-white"
              label="Ajouter un produit"
              icon={<IoMdAdd className="text-white" />}
              onClick={handleAddProduct}
            />
          </div>

          {loadingProducts ? (
            <TableLoader />
          ) : (
            <Table data={Dataproducts?.data} columns={productColumns} />
          )}
          <div className="mt-10 mb-20 flex  w-full justify-end">
            <Pagination
              totalPages={Dataproducts?.meta?.total}
              itemsPerPage={20}
              currentPage={page}
              onPageChange={handlePageChange}
            />
          </div>

          {Dataproducts?.data?.length === 0 && (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500 text-lg">No products available.</p>
            </div>
          )}

          <DeleteConfirmationModal
            isOpen={showDeleteModal}
            onClose={handleModalClose}
            isSubCategory={false}
            isProduct={true}
            product={selectedProductToDelete ?? undefined}
          />

          <AddEditProductModal
            dataCategories={dataCategories}
            // dataSubcategories={dataSubcategories}
            isOpen={addEditModal}
            isEdit={editMode}
            product={editMode ? selectedProductId : null}
            onClose={handleModalClose}
          />

          <ViewProductModal
            isOpen={isDetailsModalOpen}
            product={selectedProductId}
            onClose={() => setIsDetailsModalOpen(false)}
          />

          {globalAlertNotification.type !== null && (
            <div className="absolute right-0 bottom-0 mr-6 mb-6">
              <SuccessFailerAlert
                message={globalAlertNotification.message}
                type={globalAlertNotification.type}
              />
            </div>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </Suspense>
  );
}
