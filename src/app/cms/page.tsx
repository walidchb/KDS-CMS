"use client";
import React, { useState } from "react";
import CategoryContent from "../../components/CategoryContent";
import ProductsContent from "@/components/ProductsContent";

const CmsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"products" | "categories">(
    "products"
  );

  return (
    <div className="min-h-screen w-screen bg-gray-100">
      {/* Tabs */}
      <div className=" flex shadow-2xl rounded-b-2xl overflow-hidden w-full mb-4">
        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 cursor-pointer w-full h-[60px]   ${
            activeTab === "products"
              ? "bg-red-500 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`px-4 cursor-pointer w-full h-[60px]   ${
            activeTab === "categories"
              ? "bg-red-500 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          Categories / Sub-Categories
        </button>
      </div>

      {/* Content */}
      <div>
        {activeTab === "products" && <ProductsContent />}
        {activeTab === "categories" && <CategoryContent />}
      </div>
    </div>
  );
};

export default CmsPage;
