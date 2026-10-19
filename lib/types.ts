export type EventStatus = "Rascunho" | "Publicado";
export type EventKind = "Casamento" | "Aniversário" | "Formatura" | "Chá de bebê" | "Bodas" | "Outro evento";
export type InvitationEvent = {
  id: string; slug: string; kind: EventKind; title: string; hosts: string; date: string; time: string;
  venue: string; address: string; city: string; state: string; mapsUrl: string; message: string;
  templateId: string; primaryColor: string; backgroundColor: string; buttonText: string;
  cover: string; status: EventStatus; createdAt: string; maxGuests: number;
};
export type GuestResponse = {
  id: string; eventId: string; name: string; phone: string; attending: boolean; people: number;
  companions: string; notes: string; respondedAt: string; source: "RSVP" | "Manual";
};
export type Template = { id: string; name: string; category: string; description: string; background: string; accent: string; symbol: string; image: string };
