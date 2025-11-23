import React from "react";

export default function CategoryTabs({
  categories,
  activeCategory,
  setActiveCategory,
}: {
  categories: { id: string; label: string }[];
  activeCategory: string;
  setActiveCategory: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap justify-start gap-4 mb-10">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setActiveCategory(cat.id)}
          className={`px-8 py-3 rounded-lg text-base font-medium tracking-wide transition-all duration-200 ${
            activeCategory === cat.id
              ? "bg-[#022F40] text-white shadow-md"
              : "bg-white border border-gray-200 text-gray-700 hover:bg-[#ADF5FF]"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
