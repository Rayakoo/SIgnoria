"use client";

import { useState, useEffect } from "react";
import { fetchKamusData } from "@/services/kamusservice";
import CategoryTabs from "@/components/kamus/CategoryTabs";
import DictionaryGrid from "@/components/kamus/DictionaryGrid";

export default function DictionaryPage() {
  const [activeCategory, setActiveCategory] = useState("abjad");
  const [kamusData, setKamusData] = useState({
    abjad: [],
    imbuhan: [],
    angka: [],
    kosakata: [],
  });
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKamus = async () => {
      try {
        const allData = await fetchKamusData();

        const abjad = allData.filter((i) => i.category === "ALPHABET");
        const imbuhan = allData.filter((i) => i.category === "IMBUHAN");
        const angka = allData.filter((i) => i.category === "NUMBERS");
        const kosakata = allData.filter((i) => i.category === "KOSAKATA");

        setKamusData({ abjad, imbuhan, angka, kosakata });
        setFilteredData(abjad); // Default to the first category
      } catch (err) {
        console.error("Failed to fetch dictionary data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchKamus();
  }, []);

  useEffect(() => {
    const filtered = kamusData[activeCategory].filter((item) =>
      item.word_text.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchQuery, activeCategory, kamusData]);

  const categories = [
    { id: "abjad", label: "Abjad" },
    { id: "imbuhan", label: "Imbuhan" },
    { id: "angka", label: "Angka" },
    { id: "kosakata", label: "Kosakata" },
  ];

  return (
    <div className="min-h-screen bg-white px-6 py-10 font-poppins transition-all duration-300">
      {/* Header Tabs */}
      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {/* Search Bar */}
      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Cari kata..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ADF5FF]"
        />
      </div>

      {/* Section Label */}
      <div className="relative mb-8 mt-7 text-center">
        <div className="border-t-2 border-[#022F40] w-full"></div>
      
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center text-gray-400 py-20 text-sm">
          Memuat data kamus...
        </div>
      ) : (
        <DictionaryGrid items={filteredData} />
      )}
    </div>
  );
}
