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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          Welcome, {userData.username}!
        </h1>
        <div className="flex flex-col items-center">
          <img
            src={`${userData.image}`}
            alt={`${userData.username}'s profile`}
            className="w-24 h-24 rounded-full mb-4"
          />
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            <strong>Name:</strong> {userData.name}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Email:</strong> {userData.email}
          </p>
        </div>
      </div>
    </div>
  );
}