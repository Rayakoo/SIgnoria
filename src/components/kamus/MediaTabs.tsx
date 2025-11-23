import { VideoIcon, ImageIcon } from "lucide-react";

export default function MediaTabs({
  tab,
  setTab,
  hasVideo,
}: {
  tab: string;
  setTab: (tab: string) => void;
  hasVideo: boolean;
}) {
  return (
    <div className="flex gap-2 mb-3">
      <button
        onClick={() => setTab("video")}
        disabled={!hasVideo}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition cursor-pointer ${
          tab === "video"
            ? "bg-[#022F40] text-white"
            : "bg-gray-100 text-gray-700 hover:bg-[#ADF5FF]"
        } ${!hasVideo && "opacity-50 cursor-not-allowed"}`}
      >
        <VideoIcon className="size-4" /> Video
      </button>
      <button
        onClick={() => setTab("image")}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition cursor-pointer ${
          tab === "image"
            ? "bg-[#022F40] text-white"
            : "bg-gray-100 text-gray-700 hover:bg-[#ADF5FF]"
        }`}
      >
        <ImageIcon className="size-4" /> Gambar
      </button>
    </div>
  );
}
