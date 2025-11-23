import api from "../lib/axios";
import Cookies from "js-cookie";


export async function signup({
  email,
  username,
  password,
}: {
  email: string;
  username: string;
  password: string;
}) {
  try {
    const res = await api.post(`/auth/register`, { email, username, password });
    return res.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Gagal mendaftar");
  }
}

export async function signin({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const res = await api.post(
      `/auth/login`,
      { email, password },
      { withCredentials: true }
    );
    const data = res.data;


    if (data.access_token) {
      Cookies.set("access_token", data.access_token, {
        expires: 7,
        path: "/",
        sameSite: "None", // Allow cross-site usage
        secure: true, // Ensure HTTPS is used
      });
    }
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Gagal login");
  }
}

export async function signInWithGoogle(id_token: string) {
  try {
    const res = await api.post(
      `/signin/google`,
      { id_token },
      { withCredentials: true }
    );
    const data = res.data;
    console.log("Google signin response:", data);


    if (data.access_token) {
      Cookies.set("access_token", data.access_token, {
        expires: 7,
        path: "/",
        sameSite: "None", // Allow cross-site usage
        secure: true, // Ensure HTTPS is used
      });
    }
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Gagal login dengan Google");
  }
}

export async function logout() {
  try {
    await api.post("/auth/logout"); // Call the logout endpoint
  } catch (error) {
    console.error("Failed to logout:", error);
  } finally {
    // Ensure the cookie is removed with the same attributes used when setting it
    Cookies.remove("access_token", {
      path: "/", // Match the path used when setting the cookie
      sameSite: "None", // Match the SameSite attribute
      secure: true, // Match the Secure attribute
    });
    Cookies.remove("username");
    Cookies.remove("api_token");
    Cookies.remove("token");
    Cookies.remove("g_state");
    sessionStorage.removeItem("token");
  }
}