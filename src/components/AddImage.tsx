import React, { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
// import { IoMdAdd } from "react-icons/io";
// import { IoTrashOutline } from "react-icons/io5";
import ButtonWithIcon from "./ButtonWithIcon";
import ImagesStore from "@/stores/images";

interface Props {
  isOpen?: boolean;
  onClose: () => void;
}

type ImageType = File | string;

export default function AddImageModal({ isOpen, onClose }: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState("machine");
  const [images, setImages] = useState<ImageType[]>([]);

  const { addImage, successAddImage, errorAddImage, loadingAddImage } =
    ImagesStore();

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
    formdata.append("name", name);
    formdata.append(
      "type",
      type === "characteristic" ? "1" : type === "machine" ? "2" : "3"
    );

    images.forEach((image) => {
      if (image instanceof File) {
        formdata.append("file", image);
      }
    });

    addImage(`/customImages`, formdata);
  };

  useEffect(() => {
    if (successAddImage || errorAddImage) {
      setName("");
      setType("machine");
      setImages([]);
    }
  }, [successAddImage, errorAddImage]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClickImageRef = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <div className="max-h-[90vh] overflow-y-auto p-6 space-y-4 text-black">
        <h2 className="text-2xl font-semibold text-black">Ajouter une image</h2>

        <div>
          <label className="block font-medium mb-1">Nom</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Enter image name"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          >
            <option value="machine">Machine</option>
            <option value="characteristic">Characteristic</option>
            <option value="steps">Steps</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Image</label>
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

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded"
          >
            Annuler
          </button>
          <ButtonWithIcon
            loading={loadingAddImage}
            onClick={handleSubmit}
            label="Ajouter une image"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          />
        </div>
      </div>
    </Modal>
  );
}
