"use client";
import React, { useEffect, useState, Suspense, JSX } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";

import { IColumnType, Table } from "@/components/Table";
import ButtonWithIcon from "@/components/ButtonWithIcon";
import DeleteConfirmationModalImage from "@/components/DeleteConfirmationModalImage";
import AddImageModal from "@/components/AddImage";
import ImagesStore from "@/stores/images";
import TableLoader from "@/components/TableLoader";
import Pagination from "@/components/Pagination";
import SuccessFailerAlert from "@/components/AlertSuccessfailer";
// import InputWithIcon from "@/components/InputWithIcon";
// import { CiSearch } from "react-icons/ci";
import { useRouter, useSearchParams } from "next/navigation";
import ViewImageModal from "./ImageDetails";
import { FaRegEye } from "react-icons/fa";

interface ImageItem {
  id: string;
  name: string;
  type: number; // Assuming type is a number, adjust if necessary
  imageUrl: string;
}

export default function ImagesContent(): JSX.Element {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedImageToDelete, setSelectedImageToDelete] = useState<{
    id: string | null;
    name: string | null;
  }>({ id: null, name: "" });
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<
    number | string | null
  >(null);
  const [addModal, setAddModal] = useState(false);
  const [name, setName] = useState("");
  const [page, setPage] = useState(1);

  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    fetchDataImages,
    dataImages,
    loadingImages,
    successPatch,
    successDelete,
    successAddImage,
    errorAddImage,
    errorDelete,
    errorPatch,
    globalAlertNotification,
  } = ImagesStore();

  const updateQueryParams = (
    key: string,
    value: string | null,
    resetPage = false
  ) => {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (resetPage) params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  // const handleNameChange = (value: string | null) => {
  //   setName(value || "");
  // };

  // const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === "Enter") {
  //     updateQueryParams("name", name, true);
  //   }
  // };

  const handlePageChange = (page: number) => {
    setPage(page);
    updateQueryParams("page", page.toString());
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nameParam = params.get("name");
    const pageParam = params.get("page");

    setName(nameParam || "");
    setPage(pageParam ? parseInt(pageParam) : 1);

    fetchDataImages(
      `/customImages/pagination?page=${pageParam || 1}&name=${nameParam || ""}`
    );
  }, [searchParams.toString()]);

  useEffect(() => {
    if (successAddImage || successDelete || successPatch) {
      // console.log("donneeee");

      handleModalClose();
      fetchDataImages(`/customImages/pagination?page=${page}&name=${name}`);
    } else if (errorAddImage || errorDelete || errorPatch) {
      // Handle error case

      handleModalClose();
    }
  }, [
    successAddImage,
    successPatch,
    successDelete,
    errorAddImage,
    errorDelete,
    errorPatch,
  ]);

  const handleModalClose = () => {
    setAddModal(false);
    setShowDeleteModal(false);
    setSelectedImageToDelete({ id: null, name: "" });
    setIsDetailsModalOpen(false);
    setSelectedImageId(null);
    setName("");
  };

  const handleDeleteClick = (id: string, name: string) => {
    setSelectedImageToDelete({ id, name });
    setShowDeleteModal(true);
  };

  const handleAddImage = () => {
    setAddModal(true);
  };

  const handleViewClick = (image: ImageItem) => {
    // fetchDataProductDetails(`/products/${product.id}/dynamic`);
    setSelectedImageId(image.id);
    setIsDetailsModalOpen(true);
  };

  const imageColumns: IColumnType<ImageItem>[] = [
    {
      key: "name",
      title: "Name",
      renderTitle: () => <span className="text-center">Name</span>,
      render: (_, { name }) => <span className="text-center">{name}</span>,
    },
    {
      key: "type",
      title: "Type",
      renderTitle: () => <span className="text-center">Type</span>,
      render: (_, { type }) => (
        <span className="text-center capitalize">
          {type === 2 ? "machine" : type === 1 ? "characteristic" : "steps"}
        </span>
      ),
    },

    {
      key: "actions",
      title: "Actions",
      renderTitle: () => (
        <div className="flex justify-center gap-4">
          <div className="flex justify-center items-center">
            <span className="text-center">Actions</span>
          </div>
        </div>
      ),
      render: (_, image) => (
        <div className="flex justify-center gap-4">
          <div
            onClick={() => handleViewClick(image)}
            className="bg-green-200 flex justify-center items-center w-8 h-8 rounded-md"
          >
            <FaRegEye className="w-5 h-5 text-black cursor-pointer" />
          </div>
          <div
            onClick={() => handleDeleteClick(image.id, image.name)}
            className="bg-red-200 w-8 h-8 rounded-md flex justify-center items-center"
          >
            <IoTrashOutline className="text-red-500" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-gray-100 ">
        <div className=" flex shadow-2xl rounded-b-2xl overflow-hidden w-full ">
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
            className={`px-4 border-x-2 border-gray-400 cursor-pointer w-full h-[60px]  bg-gray-200 text-black`}
          >
            Categories / Sub-Categories
          </button>
          <button
            onClick={() => {
              router.replace("/customImages");
            }}
            className={`px-4 cursor-pointer w-full h-[60px] bg-red-500 text-white `}
          >
            Images
          </button>
        </div>
        <div className="p-10">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-3xl font-bold text-red-700">Images</h3>
            <div className="flex flex-wrap gap-2 items-center">
              <ButtonWithIcon
                className="bg-green-600 px-3 h-10 text-white"
                label="Add Image"
                icon={<IoMdAdd className="text-white" />}
                onClick={handleAddImage}
              />
            </div>
          </div>
          {loadingImages ? (
            <TableLoader />
          ) : (
            <Table data={dataImages?.data} columns={imageColumns} />
          )}
          <div className="mt-10 mb-20 flex justify-end">
            <Pagination
              totalPages={dataImages?.meta?.total}
              itemsPerPage={20}
              currentPage={page}
              onPageChange={handlePageChange}
            />
          </div>
          {dataImages?.data?.length === 0 && (
            <div className="text-center text-gray-500 mt-10">
              No images found.
            </div>
          )}

          <ViewImageModal
            isOpen={isDetailsModalOpen}
            image={selectedImageId}
            onClose={() => setIsDetailsModalOpen(false)}
          />
          <DeleteConfirmationModalImage
            isOpen={showDeleteModal}
            image={selectedImageToDelete}
            onClose={handleModalClose}
          />
          <AddImageModal isOpen={addModal} onClose={handleModalClose} />
          {globalAlertNotification.type && (
            <div className="absolute right-0 bottom-0 mr-6 mb-6">
              <SuccessFailerAlert
                message={globalAlertNotification.message}
                type={globalAlertNotification.type}
              />
            </div>
          )}
        </div>
      </div>
    </Suspense>
  );
}
