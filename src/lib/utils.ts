import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { CasinoStatus } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Returns true if the given ISO timestamp falls on or after today's midnight
// in the America/New_York timezone.
export function isCollectedTodayNY(iso?: string | null): boolean {
  if (!iso) return false;
  try {
    const nowNY = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const startNY = new Date(nowNY);
    startNY.setHours(0, 0, 0, 0);
    const tsNY = new Date(new Date(iso).toLocaleString('en-US', { timeZone: 'America/New_York' }));
    return tsNY.getTime() >= startNY.getTime();
  } catch {
    return false;
  }
}

export function effectiveStatusForToday(status: CasinoStatus, lastCollectedAt?: string | null): CasinoStatus {
  // If marked collected, but not today in NY -> treat as Registered (can collect daily)
  if (status === CasinoStatus.CollectedToday) {
    return isCollectedTodayNY(lastCollectedAt) ? CasinoStatus.CollectedToday : CasinoStatus.Registered;
  }
  // If just registered today (we store last_collected_at at registration),
  // lock the card as collected for the rest of the day.
  if (status === CasinoStatus.Registered && isCollectedTodayNY(lastCollectedAt)) {
    return CasinoStatus.CollectedToday;
  }
  return status;
}

// Try to open a new tab without stealing focus from the current tab.
// Not guaranteed in every browser, but uses multiple hints to improve odds.
export function openInBackground(url: string) {
  try {
    // Open handle first, then navigate — often keeps focus in current tab
    const newWin = window.open('', '_blank');
    if (newWin) {
      try { newWin.opener = null; } catch {}
      try { newWin.location.href = url; } catch { newWin.location.assign(url); }
      try { newWin.blur(); } catch {}
    } else {
      window.open(url, '_blank', 'noopener');
    }
  } catch {
    window.open(url, '_blank');
  }
  // Attempt to restore focus to our tab
  try { window.focus(); } catch {}
  setTimeout(() => { try { window.focus(); } catch {} }, 50);
  setTimeout(() => { try { if (!document.hasFocus()) window.focus(); } catch {} }, 200);
}

// Pre-open a background tab synchronously within the click handler
// to maximize chances the browser keeps focus on the current tab.
// Caller can later set `win.location.href = url` when ready.
export function preOpenBackground(): Window | null {
  try {
    const win = window.open('', '_blank');
    if (win) {
      try { win.opener = null; } catch {}
      try { win.blur(); } catch {}
    }
    try { window.focus(); } catch {}
    return win;
  } catch {
    return null;
  }
}
