import React from "react";
import Modal from "./Modal";
import { IoMdClose } from "react-icons/io";
import ProductsStore from "@/stores/products";

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
    // errorGetProductDetails,
    // loadingProductDetails,
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
    // fetchDataProductDetails,
    // patchProduct,
    // deleteProduct,
    // addProduct,
  } = ProductsStore();

  if (!isOpen || !product) return null;

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

        {/* Bullets */}
        <div>
          <label className="block font-medium mb-1">Des tirets</label>
          <ul className="list-disc pl-5 space-y-1">
            {productDetails?.bullets?.map((bullet: string, i: number) => (
              <li key={i}>{bullet}</li>
            ))}
          </ul>
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <div className="border border-gray-300 p-3 rounded bg-gray-50 whitespace-pre-wrap">
            {productDetails?.description}
          </div>
        </div>

        {/* Images */}
        {productDetails?.images && productDetails?.images.length > 0 && (
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
        )}

        {/* Table */}
        <div>
          <label className="block font-medium mb-2">Table</label>
          <div className="overflow-auto">
            <table className="min-w-full border border-gray-300 text-center">
              <tbody>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {productDetails?.table?.map((row: any[], rowIndex: number) => (
                  <tr key={rowIndex}>
                    {row.map((cell, colIndex: number) => (
                      <td
                        key={colIndex}
                        className="border border-gray-300 px-3 py-2 bg-gray-50"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
