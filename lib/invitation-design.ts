import type { InvitationEvent, InviteDesignElement } from "./types";

export function createInitialDesignElements(event: InvitationEvent, symbol: string): InviteDesignElement[] {
  return [
    { id: "design-symbol", type: "text", text: symbol, x: 50, y: 13, width: 28, fontFamily: "Georgia", fontSize: 30, color: event.primaryColor, align: "center" },
    { id: "design-kind", type: "text", sourceField: "kind", x: 50, y: 23, width: 82, fontFamily: "Arial", fontSize: 13, color: event.primaryColor, align: "center" },
    { id: "design-hosts", type: "text", sourceField: "hosts", x: 50, y: 37, width: 86, fontFamily: event.fontFamily || "Georgia", fontSize: 44, color: event.primaryColor, align: "center", borderColor: event.primaryColor, borderRadius: 0 },
    { id: "design-message", type: "text", sourceField: "message", x: 50, y: 53, width: 76, fontFamily: event.fontFamily || "Georgia", fontSize: 17, color: "#514753", align: "center" },
    { id: "design-datetime", type: "text", sourceField: "dateTime", x: 50, y: 66, width: 76, fontFamily: "Arial", fontSize: 15, color: "#514753", align: "center" },
    { id: "design-venue", type: "text", sourceField: "venue", x: 50, y: 76, width: 80, fontFamily: event.fontFamily || "Georgia", fontSize: 26, color: event.primaryColor, align: "center" },
    { id: "design-location", type: "text", sourceField: "location", x: 50, y: 85, width: 82, fontFamily: "Arial", fontSize: 13, color: "#514753", align: "center" }
  ];
}

export function getDesignElementText(element: InviteDesignElement, event: InvitationEvent): string {
  switch (element.sourceField) {
    case "kind": return event.kind;
    case "hosts": return event.hosts || event.title;
    case "message": return event.message;
    case "dateTime": {
      const date = event.date ? new Date(`${event.date}T12:00:00`).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" }) : "Data a definir";
      return `${date}${event.time ? ` · ${event.time}` : ""}`;
    }
    case "venue": return event.venue || "Celebração";
    case "location": return [event.address, event.city, event.state].filter(Boolean).join(", ");
    default: return element.text || "";
  }
}
