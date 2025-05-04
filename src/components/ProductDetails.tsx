import React, { useEffect } from "react";
import Modal from "./Modal";
import { IoMdClose } from "react-icons/io";
import ProductsStore from "@/stores/products";
// import { useRouter } from "next/navigation";
import TableLoader from "./TableLoader";
import { IColumnType, Table } from "./Table";

interface Props {
  isOpen: boolean;
  product: number | string | null;
  onClose: () => void;
}

export default function ViewProductModal({ isOpen, product, onClose }: Props) {
  const {
    // products,
    // errorGetProducts,
    // loadingProducts,
    productDetails,

    // errorDynamicTable,
    // successDynamicTable,
    fetchDataDynamicTable,
    // errorGetProductDetails,
    loadingProductDetails,
    // dataPatchProduct,
    // loadingPatch,
    // errorPatch,
    // successPatch,
    // dataDeleteProduct,
    // loadingDelete,
    // errorDelete,
    // successDelete,
    // dataAddProduct,
    // loadingAddProduct,
    // errorAddProduct,
    // successAddProduct,
    // fetchDataProducts,
    fetchDataProductDetails,
    resetProductDetails,
    resetDynamicTable,
    // patchProduct,
    // deleteProduct,
    // addProduct,
  } = ProductsStore();

  useEffect(() => {
    // Fetch product details and dynamic table data when the modal opens
    // and the product ID is available
    if (isOpen && product) {
      fetchDataProductDetails(`/products/${product}/`);
      // fetchDataDynamicTable(`/products/${product}/dynamic`);
    }
    // Cleanup function to reset product details and dynamic table data
    return () => {
      resetProductDetails();
      resetDynamicTable();
    };
  }, [isOpen, product, fetchDataProductDetails, fetchDataDynamicTable]);
  //   if (product) {
  //     console.log("prod", product);
  //     fetchDataProductDetails(`/products/${product}/`);
  //     fetchDataDynamicTable(`/products/${product}/dynamic`);
  //   }
  // }, []);

  const transformData = (data: Record<string, string | string[]>) => {
    const keys = Object.keys(data);
    const length = Array.isArray(data[keys[0]])
      ? (data[keys[0]] as string[]).length
      : 1;

    const result = Array.from({ length }).map((_, index) => {
      const row: Record<string, string> = {};
      keys.forEach((key) => {
        const value = data[key];
        row[key] = Array.isArray(value) ? value[index] : (value as string);
      });
      return row;
    });

    return result;
  };

  // const transformedData = transformData(
  //   productDetails?.DynamicProduct[0]
  //     ? productDetails?.DynamicProduct[0]?.fields
  //     : {}
  // );

  const generateColumns = (
    data: Record<string, string[]>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): IColumnType<any>[] => {
    return Object.keys(data).map((key) => ({
      key,
      title: key.charAt(0).toUpperCase() + key.slice(1),
      renderTitle: () => (
        <span className="text-center">
          {key.charAt(0).toUpperCase() + key.slice(1)}
        </span>
      ),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, row: any) => (
        <span className="text-center">{row[key]}</span>
      ),
      width: 200,
    }));
  };

  // const dynamicColumns = generateColumns(
  //   productDetails?.DynamicProduct[0]?.fields
  //     ? productDetails?.DynamicProduct[0]?.fields
  //     : {}
  // );

  if (!isOpen || !product) return null;

  if (loadingProductDetails)
    return (
      <Modal className="h-[80vh]" onClose={onClose}>
        <div className="h-full flex justify-center flex-col items-center animate-pulse">
          <div className="w-16 h-16 border-4 border-red-700 border-dashed rounded-full animate-spin"></div>

          <p className="text-sm text-gray-400 mt-2">Loading, please wait...</p>
        </div>
      </Modal>
    );

  return (
    <Modal onClose={onClose}>
      <div className="max-h-[90vh] overflow-y-auto p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-black">Product Details</h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-black"
          >
            <IoMdClose />
          </button>
        </div>

        {/* Name */}
        <div>
          <label className="block font-medium mb-1">Name</label>
          <div className="border border-gray-300 p-2 rounded bg-gray-50">
            {productDetails?.name}
          </div>
        </div>

        <div className="flex space-x-2 justify-between items-center">
          <div className="w-1/2">
            <label className="block font-medium mb-1">Category</label>
            <div className="border border-gray-300 p-2 rounded bg-gray-50">
              {productDetails?.Category?.name}
            </div>
          </div>
          <div className="w-1/2">
            <label className="block font-medium mb-1">Sub categpry</label>
            <div className="border border-gray-300 p-2 rounded bg-gray-50">
              {productDetails?.SubCategory?.name}
            </div>
          </div>
        </div>

        {/* Bullets */}
        <div>
          <label className="block font-medium mb-1">Des tirets</label>
          {productDetails?.ListDescription?.length !== 0 ? (
            <ul className="px-[30px] border border-gray-300 py-2 rounded bg-gray-50 list-disc space-y-1">
              {productDetails?.ListDescription?.map(
                (bullet: { id: string; description: string }) => (
                  <li key={bullet.id}>{bullet.description}</li>
                )
              )}
            </ul>
          ) : (
            <div className="px-[10px] border border-gray-300 py-2 rounded bg-gray-50">
              no data found
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <div className="border border-gray-300 p-3 rounded bg-gray-50 whitespace-pre-wrap">
            {productDetails?.description}
          </div>
        </div>

        {/* Images */}
        {/* {productDetails?.images && productDetails?.images?.length > 0 && (
          <div>
            <label className="block font-medium mb-1">Images</label>
            <div className="flex flex-wrap gap-4">
              {productDetails?.images.map(
                (image: Blob | MediaSource, index: number) => (
                  <div
                    key={index}
                    className="w-24 h-24 border rounded overflow-hidden"
                  >
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Image ${index}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )
              )}
            </div>
          </div>
        )} */}

        {/* Table */}

        {loadingProductDetails ? (
          <TableLoader />
        ) : productDetails?.DynamicProduct?.length !== 0 ? (
          <Table
            data={transformData(productDetails?.DynamicProduct[0]?.fields)}
            columns={generateColumns(productDetails?.DynamicProduct[0]?.fields)}
          />
        ) : null}

        {/* Close Button */}
        {/* <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded"
          >
            Close
          </button>
        </div> */}
      </div>
    </Modal>
  );
}
