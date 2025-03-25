import React, { useState, useEffect } from "react";
import Modal from "./Modal"; // Your reusable modal wrapper
import { IoMdAdd } from "react-icons/io";
import { IoTrashOutline } from "react-icons/io5";
import ProductsStore from "@/stores/products";

interface Props {
  isOpen?: boolean;
  isEdit: boolean;
  product: string | number | null;
  onClose: () => void;
}

export default function AddEditProductModal({
  isOpen,
  isEdit,
  product,
  onClose,
}: Props) {
  const [name, setName] = useState("");
  const [bullets, setBullets] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [table, setTable] = useState<string[][]>([[""]]);
  const [images, setImages] = useState<File[]>([]);
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
  useEffect(() => {
    if (productDetails) {
      setName(productDetails?.name);
      setBullets(productDetails?.bullets || []);
      setDescription(productDetails?.description || "");
      setTable(
        productDetails?.table?.length > 0 ? productDetails?.table : [[""]]
      );
      setImages(productDetails?.images || []);
    } else {
      setName("");
      setBullets([]);
      setDescription("");
      setTable([[""]]);
      setImages([]);
    }
  }, [productDetails, isOpen]);

  const handleBulletChange = (index: number, value: string) => {
    const updated = [...bullets];
    updated[index] = value;
    setBullets(updated);
  };

  const addBullet = () => {
    setBullets([...bullets, ""]);
  };

  const removeBullet = (index: number) => {
    const updated = [...bullets];
    updated.splice(index, 1);
    setBullets(updated);
  };

  const handleCellChange = (row: number, col: number, value: string) => {
    const updated = [...table];
    updated[row][col] = value;
    setTable(updated);
  };

  const addRow = () => {
    const cols = table[0]?.length || 1;
    setTable([...table, Array(cols).fill("")]);
  };

  const addCol = () => {
    setTable(table.map((row) => [...row, ""]));
  };

  const removeRow = (rowIndex: number) => {
    if (table.length > 1) {
      const updated = [...table];
      updated.splice(rowIndex, 1);
      setTable(updated);
    }
  };

  const removeCol = (colIndex: number) => {
    if (table[0].length > 1) {
      const updated = table.map((row) => {
        const newRow = [...row];
        newRow.splice(colIndex, 1);
        return newRow;
      });
      setTable(updated);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setImages([...images, ...Array.from(files)]);
    }
  };

  const removeImage = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const handleSubmit = () => {
    console.log({
      name,
      bullets,
      description,
      table,
      images,
    });
  };

  if (!isOpen || !product) return null;

  return (
    <Modal onClose={onClose}>
      <div className="max-h-[90vh] overflow-y-auto p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-black">
          {isEdit ? "Edit Product" : "Add Product"}
        </h2>

        {/* Name */}
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Enter product name"
          />
        </div>

        {/* Bullets */}
        <div>
          <label className="block font-medium mb-1">Des tirets</label>
          {bullets?.map((bullet, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <input
                value={bullet}
                onChange={(e) => handleBulletChange(i, e.target.value)}
                className="flex-1 border border-gray-300 p-2 rounded"
                placeholder={`Tiret ${i + 1}`}
              />
              <IoTrashOutline
                onClick={() => removeBullet(i)}
                className="text-red-500 cursor-pointer"
              />
            </div>
          ))}
          <button
            onClick={addBullet}
            className="text-sm text-blue-600 flex items-center gap-1 mt-2"
          >
            <IoMdAdd /> Add Tiret
          </button>
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded min-h-[100px]"
            placeholder="Enter product description"
          />
        </div>

        {/* Images */}
        <div>
          <label className="block font-medium mb-1">Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="mb-2"
          />
          <div className="flex flex-wrap gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative w-24 h-24 border rounded overflow-hidden"
              >
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Table */}
        <div>
          <label className="block font-medium  mb-2">Table</label>
          <div className="overflow-auto">
            <table className="min-w-full border border-gray-300 text-center">
              <thead>
                <tr className="h-[30px]">
                  {table[0].map((_, colIndex) => (
                    <th key={colIndex} className="relative p-2">
                      <button
                        onClick={() => removeCol(colIndex)}
                        className="absolute top-1 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                      >
                        ✕
                      </button>
                    </th>
                  ))}
                  <th />
                </tr>
              </thead>
              <tbody>
                {table.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, colIndex) => (
                      <td key={colIndex} className="border border-gray-300 p-2">
                        <input
                          value={cell}
                          onChange={(e) =>
                            handleCellChange(rowIndex, colIndex, e.target.value)
                          }
                          className="w-full border border-gray-200 p-1 rounded"
                        />
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => removeRow(rowIndex)}
                        className="text-red-500 text-xs"
                      >
                        Remove Row
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-4 mt-2">
            <button
              onClick={addRow}
              className="text-sm text-green-600 flex items-center gap-1"
            >
              <IoMdAdd /> Add Row
            </button>
            <button
              onClick={addCol}
              className="text-sm text-green-600 flex items-center gap-1"
            >
              <IoMdAdd /> Add Column
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {isEdit ? "Save Changes" : "Add Product"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
