import React from "react";
// import { useTranslations } from "next-intl";
// import "../styles/tailwind.css";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  itemsPerPage,
  onPageChange,
}) => {
  const pages = Array.from(
    { length: Math.ceil(totalPages / itemsPerPage) },
    (_, i) => i + 1
  );
  // const t = useTranslations("");
  const displayStartPage = Math.max(1, currentPage - 2);
  const displayEndPage = Math.min(currentPage + 2, pages.length);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalPages);

  return (
    <div className="flex justify-end space-x-2 items-center mt-4">
      <div className="text-gray-500 font-inter text-sm font-normal">
        {"Showing"} {startIndex}-{endIndex} {"of"} {totalPages}
      </div>
      <ul className="flex space-x-2">
        {currentPage > 1 && (
          <li
            className="cursor-pointer bg-white w-8 h-8 text-red-500 text-inter text-sm font-medium border border-red-300 hover:bg-red-50 hover:text-red-600 hover:border-0 rounded p-2 flex justify-center items-center"
            onClick={() => onPageChange(currentPage - 1)}
          >
            &lt;
          </li>
        )}
        {pages.slice(displayStartPage - 1, displayEndPage).map((page) => (
          <li
            key={page}
            className={`cursor-pointer ${
              page === currentPage
                ? "w-8 h-8 text-red-600 text-inter text-sm font-medium bg-red-50 rounded p-2 flex justify-center items-center"
                : "w-8 h-8 text-red-500 text-inter text-sm font-medium border border-red-300 bg-white hover:bg-red-50 hover:text-red-600 hover:border-0 rounded p-2 flex justify-center items-center"
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </li>
        ))}
        {currentPage < pages.length && (
          <li
            className="cursor-pointer bg-white w-8 h-8 text-red-500 text-inter text-sm font-medium border border-red-300 hover:bg-red-50 hover:text-red-600 hover:border-0 rounded p-2 flex justify-center items-center"
            onClick={() => onPageChange(currentPage + 1)}
          >
            &gt;
          </li>
        )}
      </ul>
    </div>
  );
};

export default Pagination;
