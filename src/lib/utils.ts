import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { CasinoStatus } from "./types";
import type { Casino, UserCasino } from "./types";

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

// Unified calculations for totals and collected values across SC/GC.
// Ensures HeaderStats and DailyTrackerHeader remain consistent.
export function computeBonusTotals(casinos: Casino[], userCasinos: UserCasino[]) {
  const findUC = (casinoId: string) => userCasinos.find((u) => u.casino_id === casinoId);

  let scCollected = 0;
  let scTotal = 0;
  let scCardsCollected = 0;
  let scCardsTotal = 0;

  let gcCollected = 0;
  let gcTotal = 0;
  let gcCardsCollected = 0;
  let gcCardsTotal = 0;

  for (const casino of casinos) {
    const uc = findUC(casino.id);
    const rawStatus = (uc?.status as CasinoStatus) ?? CasinoStatus.NotRegistered;
    const statusToday = uc ? effectiveStatusForToday(rawStatus, uc.last_collected_at) : rawStatus;

    // Amounts available today (denominator)
    const scAvail = statusToday === CasinoStatus.NotRegistered ? (casino.welcome_sc ?? 0) : (casino.daily_sc ?? 0);
    const gcAvail = statusToday === CasinoStatus.NotRegistered ? (casino.welcome_gc ?? 0) : (casino.daily_gc ?? 0);
    scTotal += scAvail;
    gcTotal += gcAvail;
    if (scAvail > 0) scCardsTotal += 1;
    if (gcAvail > 0) gcCardsTotal += 1;

    // Amounts collected today (numerator)
    if (statusToday === CasinoStatus.CollectedToday && uc) {
      const collectedIsWelcome = rawStatus === CasinoStatus.Registered; // first-day collect after registration
      scCollected += collectedIsWelcome ? (casino.welcome_sc ?? 0) : (casino.daily_sc ?? 0);
      gcCollected += collectedIsWelcome ? (casino.welcome_gc ?? 0) : (casino.daily_gc ?? 0);
      if ((collectedIsWelcome ? (casino.welcome_sc ?? 0) : (casino.daily_sc ?? 0)) > 0) scCardsCollected += 1;
      if ((collectedIsWelcome ? (casino.welcome_gc ?? 0) : (casino.daily_gc ?? 0)) > 0) gcCardsCollected += 1;
    }
  }

  return {
    scCollected,
    scTotal,
    scCardsCollected,
    scCardsTotal,
    gcCollected,
    gcTotal,
    gcCardsCollected,
    gcCardsTotal,
  };
}
