"use client";

export async function apiGet(path) {
  const r = await fetch(path, { credentials: "include" });
  if (!r.ok) throw new Error(`GET ${path} failed: ${r.status}`);
  return r.json();
}

export async function apiPost(path, body) {
  const r = await fetch(path, {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    const err = new Error(data.error || `POST ${path} failed`);
    err.status = r.status;
    err.code = data.code;
    throw err;
  }
  return data;
}

export async function apiPatch(path, body) {
  const r = await fetch(path, {
    method: "PATCH",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    const err = new Error(data.error || `PATCH ${path} failed`);
    err.status = r.status;
    err.code = data.code;
    throw err;
  }
  return data;
}