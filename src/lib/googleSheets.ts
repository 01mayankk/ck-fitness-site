// src/lib/googleSheets.ts

const SCRIPT_URL = process.env.NEXT_PUBLIC_SHEETS_SCRIPT_URL || "";

export async function fetchPosts() {
  if (!SCRIPT_URL) return [];
  try {
    const res = await fetch(`${SCRIPT_URL}?action=getPosts`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.error ? [] : data;
  } catch (error) {
    return [];
  }
}

export async function savePost(post: any, password: string) {
  if (!SCRIPT_URL) return { error: "Missing configuration" };
  try {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({ action: "savePost", password, post }),
    });
    return await res.json();
  } catch (error) {
    return { error: "Failed to save" };
  }
}

export async function logMember(memberData: {
  name: string;
  email: string;
  phone: string;
  plan: string;
  amount: number;
  expiryDate: string;
  paymentId?: string;
}) {
  if (!SCRIPT_URL) return { error: "Missing configuration" };
  try {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({ action: "addMember", ...memberData }),
    });
    return await res.json();
  } catch (error) {
    return { error: "Failed to log entry" };
  }
}

// === NEW ANALYTICS TRACKING ===

export async function logAnalytics(type: "view" | "click", details: string) {
  if (!SCRIPT_URL) return;
  // Fire and forget, don't await to avoid blocking UI
  fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({ action: "logAnalytics", type, details }),
  }).catch(() => {});
}

export async function getAnalytics(password: string) {
  if (!SCRIPT_URL) return { totalViews: 0, totalClicks: 0, recentViews: 0 };
  try {
    const res = await fetch(`${SCRIPT_URL}?action=getAnalytics&password=${encodeURIComponent(password)}`);
    if (!res.ok) return { totalViews: 0, totalClicks: 0, recentViews: 0 };
    return await res.json();
  } catch (error) {
    return { totalViews: 0, totalClicks: 0, recentViews: 0 };
  }
}
