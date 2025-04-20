import React from "react";

const TableLoader: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <div className="animate-pulse space-y-4">
        <div className="min-w-full w-full whitespace-nowrap divide-gray-300 rounded-lg overflow-hidden">
          <div className="bg-blue-100 border border-gray-300 p-3 animate-pulse">
            <div className="w-40 h-6 bg-gray-300 rounded-lg"></div>
          </div>
        </div>

        <div className="min-w-full w-full whitespace-nowrap divide-gray-300 rounded-lg overflow-hidden">
          <div className="border border-gray-300 animate-pulse">
            <div className="p-3">
              <div className="w-32 h-5 bg-gray-300 rounded-lg mb-1"></div>
              <div className="w-24 h-5 bg-gray-300 rounded-lg"></div>
            </div>
          </div>
        </div>
        <div className="min-w-full w-full whitespace-nowrap divide-gray-300 rounded-lg overflow-hidden">
          <div className="border border-gray-300 animate-pulse">
            <div className="p-3">
              <div className="w-32 h-5 bg-gray-300 rounded-lg mb-1"></div>
              <div className="w-24 h-5 bg-gray-300 rounded-lg"></div>
            </div>
          </div>
        </div>
        {/* <div className="min-w-full w-full whitespace-nowrap divide-gray-300 rounded-lg overflow-hidden">
          <div className="border border-gray-300 animate-pulse">
            <div className="p-3">
              <div className="w-32 h-5 bg-gray-300 rounded-lg mb-1"></div>
              <div className="w-24 h-5 bg-gray-300 rounded-lg"></div>
            </div>
          </div>
        </div>
        <div className="min-w-full w-full whitespace-nowrap divide-gray-300 rounded-lg overflow-hidden">
          <div className="border border-gray-300 animate-pulse">
            <div className="p-3">
              <div className="w-32 h-5 bg-gray-300 rounded-lg mb-1"></div>
              <div className="w-24 h-5 bg-gray-300 rounded-lg"></div>
            </div>
          </div>
        </div>
        <div className="min-w-full w-full whitespace-nowrap divide-gray-300 rounded-lg overflow-hidden">
          <div className="border border-gray-300 animate-pulse">
            <div className="p-3">
              <div className="w-32 h-5 bg-gray-300 rounded-lg mb-1"></div>
              <div className="w-24 h-5 bg-gray-300 rounded-lg"></div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default TableLoader;
