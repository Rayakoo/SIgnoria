export default function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#ADF5FF] rounded-lg bg-[#022F40] px-3 py-2">
      <p className="text-xs text-[#ADF5FF]">{label}</p>
      <p className="text-sm font-medium text-white">{value}</p>
    </div>
  );
}
