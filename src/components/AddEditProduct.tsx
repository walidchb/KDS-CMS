"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";
import { useState, useEffect, useRef } from "react";
import Modal from "./Modal";
import { IoMdAdd } from "react-icons/io";
import { IoTrashOutline } from "react-icons/io5";
import ProductsStore from "@/stores/products";
import Dropdown from "./DropDown";
import ButtonWithIcon from "./ButtonWithIcon";
import CustomImagesStore from "@/stores/customImages";
import { FaFileDownload } from "react-icons/fa";

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

interface TableData {
  id: string;
  name: string;
  data: string[][];
}

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
  const [specName, setSpecName] = useState("");
  const [ref, setRef] = useState("");
  const [bullets, setBullets] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [tables, setTables] = useState<TableData[]>([
    { id: "1", name: "Table 1", data: [["Header 1"]] },
  ]);
  const [images, setImages] = useState<ImageType[]>([]);
  const [TechnicalSheet, setTechnicalSheet] = useState<File | string | null>(
    null
  );

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null
  );

  const [selectedCharacteristicImages, setSelectedCharacteristicImages] =
    useState<string[]>([]);
  const [selectedMachineImages, setSelectedMachineImages] = useState<string[]>(
    []
  );
  const [selectedStepsImages, setSelectedStepsImages] = useState<string[]>([]);

  const { dataCustomImages, fetchDataCustomImages } = CustomImagesStore();

  useEffect(() => {
    if (isOpen) {
      fetchDataCustomImages("/customImages");
    }
  }, [isOpen]);

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
      fetchDataSubcategories(`/subcategories/${selectedCategory}/category`);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (productDetails) {
      setName(productDetails?.name || "");
      setRef(productDetails?.ref || "");
      setSpecName(productDetails?.specName || "");
      setDescription(productDetails?.description || "");
      setSelectedCategory(productDetails?.Category?.id || null);
      setSelectedSubCategory(productDetails?.SubCategory?.id || null);
      setBullets(
        productDetails?.ListDescription?.map((item: any) => item.description) ||
          []
      );
      setImages(
        productDetails?.ImageProduct?.map((img: any) => img.image) || []
      );
      setSelectedCharacteristicImages(
        productDetails?.customImages
          ?.filter((img: any) => img.customImage.type === 1)
          .map((img: any) => img.customImage.id) || []
      );
      setSelectedMachineImages(
        productDetails?.customImages
          ?.filter((img: any) => img.customImage.type === 2)
          .map((img: any) => img.customImage.id) || []
      );

      setSelectedStepsImages(
        productDetails?.customImages
          ?.filter((img: any) => img.customImage.type === 3)
          .map((img: any) => img.customImage.id) || []
      );

      setTechnicalSheet(productDetails?.technicalSheet || null);

      if (productDetails?.DynamicProduct?.length > 0) {
        const tablesData: TableData[] = productDetails.DynamicProduct.map(
          (dynamicProduct: any, index: number) => {
            const fields: Record<string, string[] | string> =
              dynamicProduct.fields;

            if (fields) {
              const headers = Object.keys(fields);
              let numRows = 0;

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

              return {
                id: (index + 1).toString(),
                name: `Table ${index + 1}`,
                data: formattedTable,
              };
            }

            return {
              id: (index + 1).toString(),
              name: `Table ${index + 1}`,
              data: [["Header 1"]],
            };
          }
        );

        setTables(tablesData);
      } else {
        setTables([{ id: "1", name: "Table 1", data: [["Header 1"]] }]);
      }
    } else {
      setName("");
      setBullets([]);
      setDescription("");
      setTables([{ id: "1", name: "Table 1", data: [["Header 1"]] }]);
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

  const handleCellChange = (
    tableId: string,
    row: number,
    col: number,
    value: string
  ) => {
    setTables(
      tables.map((table) => {
        if (table.id === tableId) {
          const updated = [...table.data];
          updated[row][col] = value;
          return { ...table, data: updated };
        }
        return table;
      })
    );
  };

  const addRow = (tableId: string) => {
    setTables(
      tables.map((table) => {
        if (table.id === tableId) {
          const cols = table.data[0]?.length || 1;
          return { ...table, data: [...table.data, Array(cols).fill("")] };
        }
        return table;
      })
    );
  };

  const addCol = (tableId: string) => {
    setTables(
      tables.map((table) => {
        if (table.id === tableId) {
          return { ...table, data: table.data.map((row) => [...row, ""]) };
        }
        return table;
      })
    );
  };

  const removeRow = (tableId: string, rowIndex: number) => {
    setTables(
      tables.map((table) => {
        if (table.id === tableId && table.data.length > 1) {
          const updated = [...table.data];
          updated.splice(rowIndex, 1);
          return { ...table, data: updated };
        }
        return table;
      })
    );
  };

  const removeCol = (tableId: string, colIndex: number) => {
    setTables(
      tables.map((table) => {
        if (table.id === tableId && table.data[0].length > 1) {
          const updated = table.data.map((row) => {
            const newRow = [...row];
            newRow.splice(colIndex, 1);
            return newRow;
          });
          return { ...table, data: updated };
        }
        return table;
      })
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setImages([...images, ...Array.from(files)]);
    }
  };

  const handleTechnicalSheetChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (files) {
      if (files.length > 0 && files[0].size > 0) {
        setTechnicalSheet(files[0]);
      } else {
        setTechnicalSheet(null);
      }
    }
  };

  const removeImage = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const toggleImageSelection = (id: string, type: number) => {
    if (type === 1) {
      setSelectedCharacteristicImages((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    } else if (type === 2) {
      setSelectedMachineImages((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    } else if (type === 3) {
      setSelectedStepsImages((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    }
  };

  const handleSubmit = () => {
    const formdata = new FormData();

    if (images.length > 0) {
      images.forEach((image) => {
        if (image instanceof File) {
          formdata.append("images", image);
        }
      });
    }

    const existingImages = images.filter((image) => typeof image === "string");
    if (existingImages.length > 0) {
      formdata.append("existingImages", JSON.stringify(existingImages));
    }

    if (selectedCategory) {
      formdata.append("categoryId", selectedCategory);
    }
    if (selectedSubCategory) {
      formdata.append("subCategoryId", selectedSubCategory);
    }

    if (bullets.length > 0) {
      formdata.append("listDescription", JSON.stringify(bullets));
    }

    if (tables.length > 0) {
      const tablesData = tables.map((table) => {
        if (table.data.length > 1) {
          const fields: Record<string, string[]> = {};
          const headers = table.data[0];

          for (let i = 1; i < table.data.length; i++) {
            const row = table.data[i];
            headers.forEach((header, index) => {
              if (!fields[header]) {
                fields[header] = [];
              }
              fields[header].push(row[index] || "");
            });
          }

          return { fields };
        }
        return { fields: {} };
      });

      formdata.append("tables", JSON.stringify(tablesData));
    }

    formdata.append("name", name);
    formdata.append("description", description);
    formdata.append("specName", specName);
    formdata.append("ref", ref);
    formdata.append(
      "characteristicImages",
      JSON.stringify(selectedCharacteristicImages)
    );
    formdata.append("machineImages", JSON.stringify(selectedMachineImages));
    formdata.append("stepsImages", JSON.stringify(selectedStepsImages));
    formdata.append("technicalSheet", TechnicalSheet || "");

    if (isEdit) {
      patchProduct(`/products/${product}/`, formdata);
    } else {
      addProduct(`/products`, formdata);
    }
  };

  async function downloadFile(url: string, filename: string) {
    const response = await fetch(url);
    const blob = await response.blob();

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(link.href);
  }

  const addTable = () => {
    const newId = (tables.length + 1).toString();
    setTables([
      ...tables,
      {
        id: newId,
        name: `Table ${tables.length + 1}`,
        data: [["Header 1"]],
      },
    ]);
  };

  const removeTable = (tableId: string) => {
    if (tables.length > 1) {
      setTables(tables.filter((table) => table.id !== tableId));
    }
  };

  const updateTableName = (tableId: string, newName: string) => {
    setTables(
      tables.map((table) =>
        table.id === tableId ? { ...table, name: newName } : table
      )
    );
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const technicalSheetInputRef = useRef<HTMLInputElement | null>(null);

  const handleClickImageRef = () => {
    fileInputRef.current?.click();
  };

  const handleClickTechnicalSheetRef = () => {
    technicalSheetInputRef.current?.click();
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

          <p className="text-sm text-gray-400 mt-2">
            Chargement, veuillez patienter...
          </p>
        </div>
      </Modal>
    );

  return (
    <Modal onClose={onClose}>
      <div className="max-h-[90vh] overflow-y-auto p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-black">
          {isEdit ? "Modifier le produit" : "Ajouter un produit"}
        </h2>

        <div>
          <label className="block font-medium mb-1">Référence</label>
          <input
            value={ref}
            onChange={(e) => setRef(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Entrez la référence du produit"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Nom</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Entrez le nom du produit"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Nom spécifique</label>
          <input
            value={specName}
            onChange={(e) => setSpecName(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Entrez le nom spécifique du produit"
          />
        </div>

        <div className="flex justify-start items-center gap-4 flex-wrap">
          <Dropdown
            className="min-w-[300px] w-full sm:w-[48%] lg:w-[30%]"
            placeholder="Catégorie"
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

        <div>
          <label className="block font-medium mb-1">Specifications</label>
          {bullets.map((bullet, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <input
                value={bullet}
                onChange={(e) => handleBulletChange(i, e.target.value)}
                className="flex-1 border border-gray-300 p-2 rounded"
                placeholder={`specification ${i + 1}`}
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
            <IoMdAdd /> Ajouter une specification
          </button>
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded min-h-[100px]"
            placeholder="Entrez la description du produit"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Images</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="mb-2 hidden"
          />

          <button
            type="button"
            onClick={handleClickImageRef}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Ajouter photo(s)
          </button>
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

        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block font-medium">Tableaux</label>
            <button
              onClick={addTable}
              className="text-sm text-green-600 flex items-center gap-1 px-3 py-1 border border-green-600 rounded"
            >
              <IoMdAdd /> Ajouter un tableau
            </button>
          </div>

          {tables.map((table) => (
            <div
              key={table.id}
              className="border border-gray-200 rounded-lg p-4 mb-4"
            >
              <div className="flex justify-between items-center mb-3">
                <input
                  value={table.name}
                  onChange={(e) => updateTableName(table.id, e.target.value)}
                  className="font-medium text-lg border-b border-gray-300 bg-transparent focus:outline-none focus:border-blue-500"
                  placeholder="Table name"
                />
                {tables.length > 1 && (
                  <button
                    onClick={() => removeTable(table.id)}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm"
                  >
                    <IoTrashOutline /> Supprimer le tableau
                  </button>
                )}
              </div>

              <div className="overflow-auto rounded-md">
                <table className="min-w-full text-center">
                  <thead>
                    <tr className="h-[30px]">
                      {table.data[0].map((header, colIndex) => (
                        <th key={colIndex} className="relative p-2">
                          <button
                            onClick={() => removeCol(table.id, colIndex)}
                            className="bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                          >
                            ✕
                          </button>
                        </th>
                      ))}
                      <th className="p-2" />
                    </tr>
                  </thead>

                  <tbody>
                    {table.data.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, colIndex) => (
                          <td
                            key={colIndex}
                            className={`${
                              rowIndex === 0
                                ? "bg-blue-200"
                                : "border border-gray-300"
                            } p-2`}
                          >
                            <input
                              value={cell}
                              onChange={(e) =>
                                handleCellChange(
                                  table.id,
                                  rowIndex,
                                  colIndex,
                                  e.target.value
                                )
                              }
                              className="w-full border border-gray-200 p-1 rounded"
                            />
                          </td>
                        ))}
                        <td>
                          <button
                            onClick={() => removeRow(table.id, rowIndex)}
                            className="ml-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-4 mt-2">
                <button
                  onClick={() => addRow(table.id)}
                  className="text-sm text-green-600 flex items-center gap-1"
                >
                  <IoMdAdd /> Ajouter une ligne
                </button>
                <button
                  onClick={() => addCol(table.id)}
                  className="text-sm text-green-600 flex items-center gap-1"
                >
                  <IoMdAdd /> Ajouter une colonne
                </button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <label className="block font-medium mb-1">
            Sélectionner les images caractéristiques
          </label>
          <div className="flex flex-wrap gap-3">
            {dataCustomImages
              ?.filter((img: any) => img.type === 1)
              .map((img: any) => (
                <div
                  key={img.id}
                  onClick={() => toggleImageSelection(img.id, 1)}
                  className={`cursor-pointer flex flex-col justify-center items-center border-2 rounded w-32 h-32 ${
                    selectedCharacteristicImages.includes(img.id)
                      ? "border-blue-600"
                      : "border-gray-300"
                  }`}
                >
                  <img
                    src={img.image || "/placeholder.svg"}
                    alt="characteristic"
                    className="w-24 h-24 object-cover"
                  />
                  <span className="block text-center">{img.name}</span>
                </div>
              ))}
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">
            Sélectionner les images des étapes
          </label>
          <div className="flex flex-wrap gap-3">
            {dataCustomImages
              ?.filter((img: any) => img.type === 3)
              .map((img: any) => (
                <div
                  key={img.id}
                  onClick={() => toggleImageSelection(img.id, 3)}
                  className={`cursor-pointer flex flex-col justify-center items-center border-2 rounded w-32 h-32 ${
                    selectedStepsImages.includes(img.id)
                      ? "border-blue-600"
                      : "border-gray-300"
                  }`}
                >
                  <img
                    src={img.image || "/placeholder.svg"}
                    alt="characteristic"
                    className="w-24 h-24 object-cover"
                  />
                  <span className="block text-center">{img.name}</span>
                </div>
              ))}
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1 mt-4">
            Sélectionner les images des machines
          </label>
          <div className="flex flex-wrap gap-3">
            {dataCustomImages
              ?.filter((img: any) => img.type === 2)
              .map((img: any) => (
                <div
                  key={img.id}
                  onClick={() => toggleImageSelection(img.id, 2)}
                  className={`text-black cursor-pointer border-2 rounded w-24 h-24 overflow-hidden ${
                    selectedMachineImages.includes(img.id)
                      ? "border-blue-600"
                      : "border-gray-300"
                  }`}
                >
                  <img
                    src={img.image || "/placeholder.svg"}
                    alt="machine"
                    className="w-full h-full object-cover"
                  />
                  <span>{img.name}</span>
                </div>
              ))}
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Fiche technique</label>
          {TechnicalSheet && typeof TechnicalSheet === "string" ? (
            <div
              onClick={() => {
                if (typeof productDetails.technicalSheet === "string") {
                  downloadFile(
                    productDetails.technicalSheet,
                    "technical_sheet.pdf"
                  );
                }
              }}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <FaFileDownload />
              <span>Télécharger la fiche technique</span>
            </div>
          ) : null}

          <input
            ref={technicalSheetInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleTechnicalSheetChange}
            className="mb-2 hidden"
          />

          <button
            type="button"
            onClick={handleClickTechnicalSheetRef}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Ajouter la fiche technique
          </button>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded"
          >
            Annuler
          </button>
          <ButtonWithIcon
            onClick={handleSubmit}
            label={
              isEdit ? "Enregistrer les modifications" : "Ajouter un produit"
            }
            className="px-4 py-2 bg-blue-600 text-white rounded"
            loading={loadingAddProduct || loadingPatch}
          />
        </div>
      </div>
    </Modal>
  );
}
