import HeroSection from "../components/main/herosection";
import Workshop from "../components/main/workshop";
import { cookies } from "next/headers";
import { getProfile } from "@/services/userservice";

export default async function Home() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("access_token")?.value || "";
  let user = null;

  if (token) {
    user = await getProfile(token);
  }

  return (
    <div>
      {user ? <Workshop /> : <HeroSection />}
    </div>
  );
}

