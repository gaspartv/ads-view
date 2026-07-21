import { cookies, headers } from "next/headers";

export async function getAuthHeaders(includeContentType = true) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") || headersList.get("host") || "";
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const origin = host ? `${protocol}://${host}` : "";

  return {
    ...(token ? { Cookie: `access_token=${token}` } : {}),
    ...(includeContentType ? { "Content-Type": "application/json" } : {}),
    ...(origin ? { origin } : {}),
  };
}
