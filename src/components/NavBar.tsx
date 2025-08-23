"use client";
import { useRouter } from "next/navigation";

interface NavigationTabsProps {
  current: "products" | "categories" | "images";
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({ current }) => {
  const router = useRouter();

  const tabs = [
    { id: "products", label: "Produits", path: "/products" },
    {
      id: "categories",
      label: "Catégories / Sous-Catégories",
      path: "/categories",
    },
    { id: "images", label: "Images", path: "/customImages" },
  ];

  return (
    <div className="flex shadow-2xl rounded-b-2xl overflow-hidden w-full mb-4">
      {tabs.map((tab) => {
        const isActive = current === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => router.replace(tab.path)}
            className={`px-4 cursor-pointer w-full h-[60px] ${
              isActive
                ? "bg-red-500 text-white border-x-2 border-gray-400"
                : "bg-gray-200 text-black"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default NavigationTabs;
