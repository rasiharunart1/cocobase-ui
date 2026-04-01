"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

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

// ===================== DEVICE =====================

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

export async function createDeviceAction(name: string, threshold: number, relayThreshold: number) {
  const token = await getToken();
  const res = await fetch(`${API}/devices`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ name, threshold, relayThreshold }),
  });
  const json = await res.json();
  return json;
}

export async function updateThresholdsAction(
  deviceId: number,
  threshold: number,
  relayThreshold: number
) {
  const token = await getToken();
  const res = await fetch(`${API}/devices/${deviceId}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify({ threshold, relayThreshold }),
  });
  const json = await res.json();
  return json;
}

export async function deleteDeviceAction(deviceId: number) {
  const token = await getToken();
  const res = await fetch(`${API}/devices/${deviceId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  const json = await res.json();
  return json;
}

// ===================== LOGS =====================

export async function fetchLogsAction(deviceId: number) {
  const token = await getToken();
  const res = await fetch(`${API}/iot/loadcell/logs/${deviceId}`, {
    cache: "no-store",
    headers: authHeaders(token),
  });
  if (!res.ok) return { success: false, data: [] };
  const json = await res.json();
  return { success: true, data: json.data ?? [] };
}

export async function fetchLatestWeightAction(deviceId: number) {
  const token = await getToken();
  const res = await fetch(`${API}/iot/loadcell/latest/${deviceId}`, {
    cache: "no-store",
    headers: authHeaders(token),
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data ?? null;
}

export async function verifyPackingAction(logId: number, petaniId: number) {
  const token = await getToken();
  const res = await fetch(`${API}/iot/logs/verify/${logId}`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ petaniId }),
  });
  const json = await res.json();
  return json;
}

export async function deleteLogAction(logId: number) {
  const token = await getToken();
  const res = await fetch(`${API}/iot/logs/${logId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  const json = await res.json();
  return json;
}

export async function resetLogsAction(deviceId: number) {
  const token = await getToken();
  const res = await fetch(`${API}/iot/logs/reset/${deviceId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  const json = await res.json();
  return json;
}

// ===================== COMMANDS =====================

export async function sendCommandAction(
  deviceId: number,
  type: string,
  value?: number
) {
  const token = await getToken();
  const res = await fetch(`${API}/iot/commands/${deviceId}`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ type, value }),
  });
  const json = await res.json();
  return json;
}
