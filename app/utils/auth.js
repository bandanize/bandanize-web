import { redirect } from "@remix-run/node";

export function requireAuth(request) {
  let token;

  if (typeof window !== "undefined") {
    // Client Side
    token = localStorage.getItem("token");
  } else {
    // Server Side
    const cookieHeader = request.headers.get("Cookie");
    if (cookieHeader) {
      const cookies = Object.fromEntries(cookieHeader.split("; ").map(c => c.split("=")));
      token = cookies.token;
    }
  }

  if (!token) {
    throw redirect("/login");
  }

  return token;
}