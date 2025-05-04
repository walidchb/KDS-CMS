import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { IoMdAdd } from "react-icons/io";
import { IoTrashOutline } from "react-icons/io5";
import ProductsStore from "@/stores/products";
import Dropdown from "./DropDown";
import ButtonWithIcon from "./ButtonWithIcon";

interface Props {
  isOpen?: boolean;
  isEdit: boolean;
  product: string | number | null;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataCategories?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataSubcategories?: any;
}

type ImageType = File | string;

export default function AddEditProductModal({
  // dataCategories,
  // dataSubcategories,
  isOpen,
  isEdit,
  product,
  onClose,
}: Props) {
  const [loader, setloader] = useState(true);
  const [name, setName] = useState("");
  const [bullets, setBullets] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [table, setTable] = useState<string[][]>([[""]]);
  const [images, setImages] = useState<ImageType[]>([]);

  const {
    fetchDataCategories,
    dataCategories,
    loadingCategories,

    fetchDataSubcategories,
    dataSubcategories,
    loadingSubcategories,

    loadingProducts,
    productDetails,
    successProductDetails,

    loadingProductDetails,

    loadingPatch,

    loadingAddProduct,

    fetchDataProductDetails,
    patchProduct,

    addProduct,
    resetProductDetails,
    resetDynamicTable,
  } = ProductsStore();

  useEffect(() => {
    if (isOpen && product) {
      fetchDataProductDetails(`/products/${product}/`);
    } else if (isOpen && !product) {
      fetchDataCategories("/categories/pagination");
    }
    return () => {
      resetProductDetails();
      resetDynamicTable();
    };
  }, [
    isOpen,
    product,
    fetchDataProductDetails,
    resetProductDetails,
    resetDynamicTable,
  ]);

  useEffect(() => {
    if (successProductDetails) {
      setloader(false);
    }
  }, [successProductDetails]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null
  );

  const handleCategoryChange = (value: string | null) => {
    const found = dataCategories?.data?.find(
      (cat: { name: string }) => cat.name === value
    );
    setSelectedCategory(found?.id || null);
  };

  const handleSubCategoryChange = (value: string | null) => {
    const found = dataSubcategories?.find(
      (sub: { name: string }) => sub.name === value
    );
    setSelectedSubCategory(found?.id || null);
  };

  const handleClearSubCategory = () => {
    setSelectedSubCategory(null);
  };
  const handleClearCategory = () => {
    setSelectedCategory(null);
  };

  useEffect(() => {
    if (selectedCategory) {
      // console.log("lkjhg");
      fetchDataSubcategories(`/subcategories/${selectedCategory}/category`);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (productDetails) {
      setName(productDetails?.name || "");
      setDescription(productDetails?.description || "");
      setSelectedCategory(productDetails?.Category?.id || null);
      setSelectedSubCategory(productDetails?.SubCategory?.id || null);
      setBullets(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        productDetails?.ListDescription?.map((item: any) => item.description) ||
          []
      );
      setImages(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        productDetails?.ImageProduct?.map((img: any) => img.image) || []
      );

      if (productDetails?.DynamicProduct?.length > 0) {
        const fields: Record<string, string[] | string> =
          productDetails.DynamicProduct[0].fields;

        if (fields) {
          const headers = Object.keys(fields);
          let numRows = 0;

          // First, normalize all values to arrays
          const normalizedFields: Record<string, string[]> = {};

          headers.forEach((header) => {
            const value = fields[header];
            if (Array.isArray(value)) {
              normalizedFields[header] = value;
            } else if (typeof value === "string") {
              normalizedFields[header] = [value];
            } else {
              normalizedFields[header] = [""];
            }
          });

          numRows = normalizedFields[headers[0]]?.length || 0;

          const formattedTable: string[][] = [];
          formattedTable.push(headers);

          for (let i = 0; i < numRows; i++) {
            const row = headers.map(
              (header) => normalizedFields[header][i] || ""
            );
            formattedTable.push(row);
          }

          setTable(formattedTable);
        }
      } else {
        setTable([[""]]);
      }
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

  const addBullet = () => setBullets([...bullets, ""]);
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

  const addCol = () => setTable(table.map((row) => [...row, ""]));

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
    const formdata = new FormData();

    // if ()

    if (images.length > 0) {
      console.log("image");
      images.forEach((image) => {
        if (image instanceof File) {
          console.log(image);
          formdata.append("images", image);
        }
      });
    }

    if (selectedCategory) {
      formdata.append("categoryId", selectedCategory);
    }
    if (selectedSubCategory) {
      formdata.append("subCategoryId", selectedSubCategory);
    }

    if (bullets.length > 0) {
      // bullets.forEach((bullet) => {
      formdata.append("listDescription", JSON.stringify(bullets));
      // });
    }

    if (table.length > 1) {
      const fields: Record<string, string[]> = {};
      const headers = table[0];

      for (let i = 1; i < table.length; i++) {
        const row = table[i];
        headers.forEach((header, index) => {
          if (!fields[header]) {
            fields[header] = [];
          }
          fields[header].push(row[index] || "");
        });
      }

      formdata.append("fields", JSON.stringify(fields));
    }
    formdata.append("name", name);
    formdata.append("description", description);
    // console.log(JSON.stringify(formdata));
    for (const [key, value] of formdata.entries()) {
      console.log(`${key}:`, value);
    }

    if (isEdit) {
      console.log("ediiiit");
      console.log(product);
      patchProduct(`/products/${product}/`, formdata);
    } else {
      addProduct(`/products`, formdata);
    }
  };

  if (!isOpen && !product) return null;

  if (
    (isEdit && loader) ||
    loadingCategories ||
    loadingSubcategories ||
    loadingProducts ||
    loadingProductDetails
  )
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

        {/* Category */}
        <div className="flex justify-start items-center gap-4 flex-wrap">
          <Dropdown
            className="min-w-[300px] w-full sm:w-[48%] lg:w-[30%]"
            placeholder="Category"
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
            onClear={handleClearCategory}
          />

          {selectedCategory && (
            <Dropdown
              className="min-w-[300px] w-full sm:w-[48%] lg:w-[30%]"
              placeholder="Sous-catégorie"
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
              onClear={handleClearSubCategory}
            />
          )}
        </div>

        {/* Bullets */}
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
                  src={
                    typeof image === "string"
                      ? image
                      : URL.createObjectURL(image)
                  }
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

        {/* Table */}
        <div>
          <label className="block font-medium mb-2">Table</label>
          <div className="overflow-auto rounded-md">
            <table className="min-w-full  text-center">
              <thead>
                <tr className="h-[30px] ">
                  {table[0].map((header, colIndex) => (
                    <th key={colIndex} className="relative p-">
                      {/* {header} */}
                      <button
                        onClick={() => removeCol(colIndex)}
                        className=" bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                      >
                        ✕
                      </button>
                    </th>
                  ))}
                  <th className="p-2 " />
                </tr>
              </thead>

              <tbody>
                {table.map((row, rowIndex) => (
                  <tr className={``} key={rowIndex}>
                    {row.map((cell, colIndex) => (
                      <td
                        key={colIndex}
                        className={`${
                          rowIndex === 0
                            ? "bg-blue-200"
                            : "border border-gray-300"
                        }  p-2`}
                      >
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
                        className="ml-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                      >
                        ✕
                      </button>
                      {/* <button
                        
                        className="text-red-500 text-xs"
                      >
                        Remove Row
                      </button> */}
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
          <ButtonWithIcon
            onClick={handleSubmit}
            label={isEdit ? "Save Changes" : "Add Product"}
            className="px-4 py-2 bg-blue-600 text-white rounded"
            loading={loadingAddProduct || loadingPatch}
          />
        </div>
      </div>
    </Modal>
  );
}
