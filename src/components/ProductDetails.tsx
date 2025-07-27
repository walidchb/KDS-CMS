import React, { useEffect, useCallback } from "react";
import Modal from "./Modal";
import { IoMdClose } from "react-icons/io";
import ProductsStore from "@/stores/products";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
import TableLoader from "./TableLoader";
import { IColumnType, Table } from "./Table";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import useEmblaCarousel from "embla-carousel-react";

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

  console.log(productDetails);
  // const images = [
  //   `https://picsum.photos/200/300?random=5`,
  //   `https://picsum.photos/200/300?random=6`,
  //   `https://picsum.photos/200/300?random=7`,
  // ];

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
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
        {/* ref */}
        <div>
          <label className="block  font-bold mb-4">Ref</label>
          <div className="border border-gray-300 p-2 rounded bg-gray-50">
            {productDetails?.ref}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block  font-bold mb-4">Name</label>
          <div className="border border-gray-300 p-2 rounded bg-gray-50">
            {productDetails?.name}
          </div>
        </div>

        {/* spec name */}
        <div>
          <label className="block  font-bold mb-4">Spec Name</label>
          <div className="border border-gray-300 p-2 rounded bg-gray-50">
            {productDetails?.specName}
          </div>
        </div>

        <div className="flex space-x-2 justify-between items-center">
          <div className="w-1/2">
            <label className="block  font-bold mb-4">Category</label>
            <div className="border border-gray-300 p-2 rounded bg-gray-50">
              {productDetails?.Category?.name}
            </div>
          </div>
          <div className="w-1/2">
            <label className="block  font-bold mb-4">Sub categpry</label>
            <div className="border border-gray-300 p-2 rounded bg-gray-50">
              {productDetails?.SubCategory?.name}
            </div>
          </div>
        </div>

        {/* Bullets */}
        <div>
          <label className="block  font-bold mb-4">Des tirets</label>
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
          <label className="block  font-bold mb-4">Description</label>
          <div className="border border-gray-300 p-3 rounded bg-gray-50 whitespace-pre-wrap">
            {productDetails?.description}
          </div>
        </div>

        {/* Images */}
        {/* {productDetails?.images && productDetails?.images?.length > 0 && (
          <div>
            <label className="block  font-bold mb-4">Images</label>
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

        {/* ✅ Carousel with Embla Carousel starts here */}
        {productDetails?.ImageProduct?.length > 0 && (
          <div className="w-full h-[400px] bg-gray-300 relative">
            <div className="overflow-hidden h-full" ref={emblaRef}>
              <div className="flex h-full">
                {productDetails?.ImageProduct.map((src, index) => (
                  <div
                    className="min-w-full  h-full flex justify-center"
                    key={index}
                  >
                    {/* <Image
                    src={src?.image}
                    alt={`Slide ${index}`}
                    className="rounded-lg object-cover"
                  /> */}
                    <img
                      src={src?.image}
                      alt={`Slide ${index}`}
                      className="rounded-lg object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
            <button
              onClick={scrollPrev}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-white shadow rounded-full z-10"
            >
              <FaChevronLeft size={20} />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-white shadow rounded-full z-10"
            >
              <FaChevronRight size={20} />
            </button>
          </div>
        )}
        {/* ✅ Carousel ends here */}

        {/* characteristic images */}

        {productDetails?.customImages?.filter(
          (img) => img.customImage.type === 1
        ).length > 0 && (
          <label className="block  font-bold my-8">Characteristic Images</label>
        )}
        {productDetails?.customImages?.filter(
          (img) => img.customImage.type === 1
        ).length > 0 && (
          <div className="flex  flex-wrap flex-row gap-y-8 justify-start items-start">
            {productDetails?.customImages
              .filter((img) => img.customImage.type === 1)
              .map((img, index) => (
                <div
                  className="  mx-2 flex flex-col items-center justify-center"
                  key={index}
                >
                  <img
                    src={img.customImage.image}
                    alt={`Characteristic Image ${index}`}
                    className="rounded-lg h-32 w-32"
                  />
                  <div className="text-center mt-1">{img.customImage.name}</div>
                </div>
              ))}{" "}
          </div>
        )}

        {/* machine images */}
        {productDetails?.customImages?.filter(
          (img) => img.customImage.type === 1
        ).length > 0 && (
          <label className="block  font-bold my-8">Machine Images</label>
        )}
        {productDetails?.customImages?.length > 0 && (
          <div className="flex  flex-wrap flex-row gap-y-8 justify-start items-start">
            {productDetails?.customImages
              .filter((img) => img.customImage.type === 2)
              .map((img, index) => (
                <div
                  className="  mx-2 flex flex-col items-center justify-center"
                  key={index}
                >
                  <img
                    src={img.customImage.image}
                    alt={`Characteristic Image ${index}`}
                    className="rounded-lg h-32 w-32"
                  />
                  <div className="text-center mt-1">{img.customImage.name}</div>
                </div>
              ))}{" "}
          </div>
        )}

        {/* step one */}
        {productDetails?.stepOne && (
          <div>
            <label className="block  font-bold my-4">Step One :</label>
            <div>{productDetails?.stepOne}</div>
          </div>
        )}

        {/* step two */}
        {productDetails?.stepTwo && (
          <div>
            <label className="block  font-bold my-4">Step Two :</label>
            <div>{productDetails?.stepTwo}</div>
          </div>
        )}

        {/* step three */}
        {productDetails?.stepThree && (
          <div>
            <label className="block  font-bold my-4">Step Three :</label>
            <div>{productDetails?.stepThree}</div>
          </div>
        )}

        {/* step four */}
        {productDetails?.stepFour && (
          <div>
            <label className="block  font-bold my-4">Step Four :</label>
            <div>{productDetails?.stepFour}</div>
          </div>
        )}

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
