import api from "@/lib/axios";

export async function fetchKamusData() {
  try {
    const res = await api.get("/public/kamus");
    return res.data?.data || [];
  } catch (err) {
    console.error("Failed to fetch dictionary data:", err);
    throw err;
  }
}

export async function fetchKamusDetail(id: string) {
  try {
    const res = await api.get(`/public/kamus/${id}`);
    if (!res.data || !res.data.success) {
      throw new Error("Gagal memuat data");
    }
    return res.data.data;
  } catch (err) {
    console.error("Failed to fetch dictionary detail:", err);
    throw err;
  }
}
