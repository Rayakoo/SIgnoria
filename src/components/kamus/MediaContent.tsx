import Image from "next/image";

export default function MediaContent({
  tab,
  videoUrl,
  imageUrl,
  setZoomOpen,
}: {
  tab: string;
  videoUrl?: string;
  imageUrl?: string;
  setZoomOpen: (open: boolean) => void;
}) {
  return (
    <>
      {tab === "video" && videoUrl ? (
        <video
          src={videoUrl}
          controls
          className="rounded-lg w-full aspect-video bg-gray-100"
        />
      ) : (
        imageUrl && (
          <div
            className="relative group cursor-pointer"
            onClick={() => setZoomOpen(true)}
          >
            <Image
              src={imageUrl}
              alt="Media"
              width={1280}
              height={720}
              className="rounded-lg h-full object-fit"
              unoptimized
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition">
              <span className="text-white text-sm opacity-0 group-hover:opacity-100">
                Klik untuk perbesar
              </span>
            </div>
          </div>
        )
      )}
    </>
  );
}
