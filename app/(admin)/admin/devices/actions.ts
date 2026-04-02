"use server";

import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_API_URL;

async function getToken() {
  const token = (await cookies()).get("token");
  return token?.value ?? "";
}

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function fetchDevicesAction() {
  const token = await getToken();
  const res = await fetch(`${API}/devices`, {
    cache: "no-store",
    headers: authHeaders(token),
  });
  if (!res.ok) return { success: false, data: [] };
  const json = await res.json();
  return { success: true, data: json.data ?? [] };
}

export async function createDeviceAction(data: {
  name: string;
  threshold: number;
  relayThreshold: number;
}) {
  const token = await getToken();
  const res = await fetch(`${API}/devices`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateDeviceAction(
  id: number,
  data: { name: string; threshold: number; relayThreshold: number }
) {
  const token = await getToken();
  const res = await fetch(`${API}/devices/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteDeviceAction(id: number) {
  const token = await getToken();
  const res = await fetch(`${API}/devices/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  return res.json();
}
