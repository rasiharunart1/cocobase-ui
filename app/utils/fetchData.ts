"use server";
import { cookies } from "next/headers";

export async function getData({
  path,
  currentPage,
  limit,
  search,
  status,
}: {
  path: string;
  currentPage?: number;
  limit?: number;
  search?: string;
  status?: string;
}) {
  const token = (await cookies()).get("token");

  // Construct query parameters, filtering out undefined/null/empty string values
  const queryParams = new URLSearchParams();
  if (search) queryParams.append("search", search);
  if (status) queryParams.append("status", status);
  if (currentPage) queryParams.append("page", currentPage.toString());
  if (limit) queryParams.append("limit", limit.toString());

  const queryString = queryParams.toString();
  const url = `${process.env.NEXT_PUBLIC_API_URL}${path}${queryString ? `?${queryString}` : ""}`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token?.value}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error(`Fetch error: ${res.status} ${res.statusText} for ${url}`);
      return null;
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("fetchData error:", error);
    return null;
  }
}


export async function getDataNoQuery({
  path,
}: {
  path: string;
}) {
  const token = (await cookies()).get("token");
  const url = `${process.env.NEXT_PUBLIC_API_URL}${path}?limit=100`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token?.value}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error(`Fetch error: ${res.status} ${res.statusText} for ${url}`);
      return null;
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("fetchDataNoQuery error:", error);
    return null;
  }
}
