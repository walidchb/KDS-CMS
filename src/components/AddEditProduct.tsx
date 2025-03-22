import React, { useState, useEffect } from "react";
import Modal from "./Modal"; // Your reusable modal wrapper
import { IoMdAdd } from "react-icons/io";
import { IoTrashOutline } from "react-icons/io5";

interface ProductProps {
  id?: number;
  name: string;
  bullets: string[];
  description: string;
  table: string[][];
}

interface Props {
  isOpen?: boolean;
  isEdit: boolean;
  product: ProductProps | null;
  onClose: () => void;
  onSubmit?: (product: ProductProps) => void;
}

export default function AddEditProductModal({
  isOpen,
  isEdit,
  product,
  onClose,
  onSubmit,
}: Props) {
  const [name, setName] = useState("");
  const [bullets, setBullets] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [table, setTable] = useState<string[][]>([[""]]); // At least 1x1 table

  useEffect(() => {
    if (product) {
      setName(product.name);
      setBullets(product.bullets || []);
      setDescription(product.description || "");
      setTable(product.table.length > 0 ? product.table : [[""]]);
    } else {
      setName("");
      setBullets([]);
      setDescription("");
      setTable([[""]]);
    }
  }, [product, isOpen]);

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

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        id: product?.id,
        name,
        bullets,
        description,
        table,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <div className="p-6 space-y-4">
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

        {/* Bullets / Tirets */}
        <div>
          <label className="block font-medium mb-1">Des tirets</label>
          {bullets.map((bullet, i) => (
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

        {/* Dynamic Table */}
        <div>
          <label className="block font-medium  mb-2">Table</label>
          <div className="overflow-auto">
            <table className="min-w-full border border-gray-300 text-center">
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
