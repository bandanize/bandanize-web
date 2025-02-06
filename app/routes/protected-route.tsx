// Protected route example with user data fetching
import { useLoaderData } from "@remix-run/react";
import { requireAuth } from "~/utils/auth";
import { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  let token;
  try {
    token = requireAuth(request);
  } catch (error) {
    console.error("Authentication error:", error);
    return new Response(JSON.stringify({ message: "Authentication required" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  try {
    const response = await fetch("http://localhost:8080/v1/user/me", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const userData = await response.json();
    return new Response(JSON.stringify(userData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return new Response(JSON.stringify({ message: "Failed to fetch user data" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

type UserData = {
  username: string;
  name: string;
  email: string;
  image: string;
};

export default function ProtectedRoute() {
  const userData = useLoaderData<UserData>();

  return (
    <div>
      <h1>Welcome, {userData.name}!</h1>
    </div>
  );
}