import { LinkIcon, Share2, Download } from "lucide-react";

export default function ActionButtons({
  copyLink,
  shareLink,
  downloadImage,
  imageUrl,
}: {
  copyLink: () => void;
  shareLink: () => void;
  downloadImage: () => void;
  imageUrl?: string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
      <Button onClick={copyLink}>
        <LinkIcon /> Salin
      </Button>
      <Button onClick={shareLink}>
        <Share2 /> Bagikan
      </Button>
      {imageUrl && (
        <Button onClick={downloadImage}>
          <Download /> Unduh
        </Button>
      )}
    </div>
  );
}

function Button({
  children,
  onClick,
}: {
  children: any;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition cursor-pointer bg-[#ADF5FF] text-[#022F40] hover:bg-[#022F40] hover:text-white"
    >
      {children}
    </button>
  );
}
