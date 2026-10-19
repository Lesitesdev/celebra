import type { InvitationEvent, Template, GuestResponse } from "./types";

export const templates: Template[] = [
 { id:"classic", name:"Casamento clássico", category:"Casamento", description:"Elegância atemporal em tons de marfim.", background:"#f7f1e6", accent:"#a88b59", symbol:"✦", image:"/images/casamento.jpg.jpg" },
 { id:"botanical", name:"Casamento botânico", category:"Casamento", description:"Verde-sálvia e delicadeza natural.", background:"#e7eee2", accent:"#536e55", symbol:"❀", image:"/images/botanico.jpg" },
 { id:"minimal", name:"Casamento minimalista", category:"Casamento", description:"Linhas limpas e visual contemporâneo.", background:"#f2f1ed", accent:"#555d54", symbol:"◇", image:"/images/minimalista.jpg" },
 { id:"modern", name:"Aniversário moderno", category:"Aniversário", description:"Uma celebração leve e cheia de energia.", background:"#f6e5db", accent:"#b56b4b", symbol:"✷", image:"/images/adulto.jpg" },
 { id:"kids", name:"Aniversário infantil", category:"Aniversário", description:"Cores suaves para um dia divertido.", background:"#e8eaf7", accent:"#747ab6", symbol:"★", image:"/images/infantil.jpg" },
 { id:"graduation", name:"Formatura elegante", category:"Formatura", description:"Um marco importante merece ser celebrado.", background:"#e6e8e2", accent:"#6b785f", symbol:"✧", image:"/images/formatura.jpg" }
];

export const demoEvents: InvitationEvent[] = [
 { id:"demo-casamento", slug:"marina-e-rafael", kind:"Casamento", title:"Nosso grande dia", hosts:"Marina & Rafael", date:"2027-05-22", time:"16:00", venue:"Villa das Oliveiras", address:"Estrada das Flores, 120", city:"Guararema", state:"SP", mapsUrl:"https://maps.google.com", message:"Com muito amor, queremos celebrar este momento especial ao lado de pessoas queridas.", templateId:"botanical", primaryColor:"#536e55", backgroundColor:"#f7f7ef", buttonText:"Confirmar presença", cover:"", status:"Publicado", createdAt:new Date().toISOString(), maxGuests:4 },
 { id:"demo-aniversario", slug:"aniversario-da-helena", kind:"Aniversário", title:"Uma festa especial", hosts:"Helena", date:"2026-12-12", time:"15:00", venue:"Espaço Jardim", address:"Rua das Acácias, 45", city:"Guararema", state:"SP", mapsUrl:"https://maps.google.com", message:"Prepare-se para uma tarde de alegria, carinho e boas memórias!", templateId:"modern", primaryColor:"#b56b4b", backgroundColor:"#fff7f2", buttonText:"Vou comemorar!", cover:"", status:"Publicado", createdAt:new Date().toISOString(), maxGuests:4 }
];

export const demoGuests: GuestResponse[] = [
 { id:"g1", eventId:"demo-casamento", name:"Camila Souza", phone:"", attending:true, people:2, companions:"André Souza", notes:"", respondedAt:new Date().toISOString(), source:"RSVP" },
 { id:"g2", eventId:"demo-casamento", name:"Pedro Lima", phone:"", attending:false, people:0, companions:"", notes:"", respondedAt:new Date().toISOString(), source:"RSVP" }
];
