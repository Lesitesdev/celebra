"use client";
import { demoEvents, demoGuests } from "./data";
import type { GuestResponse, InvitationEvent } from "./types";

const EVENTS_KEY = "celebra.events.v1";
const GUESTS_KEY = "celebra.guests.v1";

export function readEvents(): InvitationEvent[] {
  if (typeof window === "undefined") return demoEvents;
  try { const value = localStorage.getItem(EVENTS_KEY); return value ? JSON.parse(value) : (writeEvents(demoEvents), demoEvents); }
  catch { return demoEvents; }
}
export function writeEvents(events: InvitationEvent[]) { if (typeof window !== "undefined") localStorage.setItem(EVENTS_KEY, JSON.stringify(events)); }
export function readGuests(): GuestResponse[] {
  if (typeof window === "undefined") return demoGuests;
  try { const value = localStorage.getItem(GUESTS_KEY); return value ? JSON.parse(value) : (writeGuests(demoGuests), demoGuests); }
  catch { return demoGuests; }
}
export function writeGuests(guests: GuestResponse[]) { if (typeof window !== "undefined") localStorage.setItem(GUESTS_KEY, JSON.stringify(guests)); }
export function resetDemo() {
  if (typeof window !== "undefined") { localStorage.removeItem(EVENTS_KEY); localStorage.removeItem(GUESTS_KEY); }
}
export function saveEvent(event: InvitationEvent) {
  const events = readEvents(); const index = events.findIndex(e => e.id === event.id);
  if (index >= 0) events[index] = event; else events.unshift(event);
  writeEvents(events); return event;
}
export function getEvent(idOrSlug: string) { return readEvents().find(e => e.id === idOrSlug || e.slug === idOrSlug); }
export function getEventGuests(eventId: string) { return readGuests().filter(g => g.eventId === eventId); }
