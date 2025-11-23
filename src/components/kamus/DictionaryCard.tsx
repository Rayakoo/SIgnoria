import Link from "next/link";

export default function DictionaryCard({ item }: { item: any }) {
  return (
    <Link href={`/kelas/dictionary/${item.id}`} key={item.id}>
      <div className="group bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between h-full">
        {/* Header */}
        <div>
          <p className="font-semibold text-[#022F40] text-lg mb-2 group-hover:text-[#ADF5FF] transition-colors">
            {item.word_text}
          </p>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {item.definition}
          </p>
        </div>

        {/* Footer */}
        {item.video_url && (
          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
            <span className="text-xs text-gray-400">Materi Video</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                window.open(item.video_url, "_blank", "noopener,noreferrer");
              }}
              className="text-sm text-[#2563eb] hover:text-[#1d4ed8] font-medium transition-colors"
            >
              Lihat
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}
