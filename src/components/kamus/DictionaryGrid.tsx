import DictionaryCard from "./DictionaryCard";

export default function DictionaryGrid({
  items,
}: {
  items: any[];
}) {
  if (items.length === 0) {
    return (
      <div className="col-span-full text-center text-gray-400 py-20 text-sm">
        Tidak ada data untuk kategori ini.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <DictionaryCard key={item.id} item={item} />
      ))}
    </div>
  );
}
