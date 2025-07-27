import React, { useEffect } from "react";
import Modal from "./Modal";
import { IoMdClose } from "react-icons/io";
import ImagesStore from "@/stores/images";

interface Props {
  isOpen: boolean;
  image: number | string | null;
  onClose: () => void;
}

export default function ViewImageModal({ isOpen, image, onClose }: Props) {
  const { imageDetails, fetchDataImageDetails, resetImageDetails } =
    ImagesStore();

  useEffect(() => {
    if (isOpen && image) {
      fetchDataImageDetails(`/customImages/${image}/`);
    }
    return () => {
      resetImageDetails();
    };
  }, [isOpen, image, fetchDataImageDetails, resetImageDetails]);

  if (!isOpen || !image) return null;

  return (
    <Modal onClose={onClose}>
      <div className="max-h-[90vh] overflow-y-auto p-6 space-y-4 text-black">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-black">Image Details</h2>
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
            {imageDetails?.name || "N/A"}
          </div>
        </div>

        {/* Type */}
        <div>
          <label className="block font-medium mb-1">Type</label>
          <div className="border border-gray-300 p-2 rounded bg-gray-50">
            {imageDetails?.type || "N/A"}
          </div>
        </div>

        {/* Image */}
        {imageDetails?.image ? (
          <div>
            <label className="block font-medium mb-1">Image</label>
            <div className="w-full flex justify-center">
              <img
                src={imageDetails.image}
                alt={imageDetails.name}
                className="max-w-full h-auto rounded border"
              />
            </div>
          </div>
        ) : (
          <div className="text-gray-400">No image available</div>
        )}
      </div>
    </Modal>
  );
}
