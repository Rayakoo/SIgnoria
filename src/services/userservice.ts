import api from "../lib/axios";

export async function getProfile(token?: string) {
  try {
    const res = await api.get(`users/me`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    console.error("Failed to fetch profile:", error);
    return null;
  }
}

export async function getUserById(userId: string, token?: string) {
  try {
    const res = await api.get(`users/${userId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    console.error("Failed to fetch user by ID:", error);
    return null;
  }
}