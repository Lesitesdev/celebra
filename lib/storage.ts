"use client";
import type { GuestResponse, InvitationEvent } from "./types";

const EVENTS_KEY = "celebra.events.v1";
const GUESTS_KEY = "celebra.guests.v1";

function currentOwnerScope() {
  if (typeof window === "undefined") return "anonymous";
  try {
    const accounts = JSON.parse(localStorage.getItem("celebra.auth.accounts") || "[]");
    const accountId = Array.isArray(accounts) ? accounts[0]?.accountId : undefined;
    if (typeof accountId === "string" && accountId) return accountId;
    const user = JSON.parse(localStorage.getItem("celebra.auth.user") || "null");
    if (user?.id) return String(user.id);
    if (user?.email) return String(user.email).trim().toLowerCase();
  } catch { /* Mantém os dados inválidos no espaço anônimo. */ }
  return "anonymous";
}

function scopedKey(key: string) { return `${key}.${currentOwnerScope()}`; }

export function readEvents(): InvitationEvent[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(scopedKey(EVENTS_KEY)) || "[]"); }
  catch { return []; }
}
export function writeEvents(events: InvitationEvent[]) {
  if (typeof window === "undefined") return;
  const accountId = currentOwnerScope();
  localStorage.setItem(scopedKey(EVENTS_KEY), JSON.stringify(events.map(event => ({ ...event, accountId }))));
}
export function readGuests(): GuestResponse[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(scopedKey(GUESTS_KEY)) || "[]"); }
  catch { return []; }
}
export function writeGuests(guests: GuestResponse[]) {
  if (typeof window !== "undefined") localStorage.setItem(scopedKey(GUESTS_KEY), JSON.stringify(guests));
}
export function resetDemo() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(scopedKey(EVENTS_KEY));
    localStorage.removeItem(scopedKey(GUESTS_KEY));
  }
}
export function saveEvent(event: InvitationEvent) {
  const events = readEvents(); const index = events.findIndex(e => e.id === event.id);
  if (index >= 0) events[index] = event; else events.unshift(event);
  writeEvents(events); return event;
}
export function getEvent(idOrSlug: string) { return readEvents().find(e => e.id === idOrSlug || e.slug === idOrSlug); }
export function getEventGuests(eventId: string) { return readGuests().filter(g => g.eventId === eventId); }
