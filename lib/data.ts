import type { InvitationEvent, Template, GuestResponse, GiftItem } from "./types";

export const templates: Template[] = [
 { id:"classic", name:"Casamento clássico", category:"Casamento", description:"Elegância atemporal em tons de marfim.", background:"#f7f1e6", accent:"#a88b59", symbol:"✦", image:"/images/casamento.jpg.jpg" },
 { id:"botanical", name:"Casamento botânico", category:"Casamento", description:"Verde-sálvia e delicadeza natural.", background:"#e7eee2", accent:"#536e55", symbol:"❀", image:"/images/botanico.jpg" },
 { id:"minimal", name:"Casamento minimalista", category:"Casamento", description:"Linhas limpas e visual contemporâneo.", background:"#f2f1ed", accent:"#555d54", symbol:"◇", image:"/images/minimalista.jpg" },
 { id:"modern", name:"Aniversário moderno", category:"Aniversário", description:"Uma celebração leve e cheia de energia.", background:"#f6e5db", accent:"#b56b4b", symbol:"✷", image:"/images/adulto.jpg" },
 { id:"kids", name:"Aniversário infantil", category:"Aniversário", description:"Cores suaves para um dia divertido.", background:"#e8eaf7", accent:"#747ab6", symbol:"★", image:"/images/infantil.jpg" },
 { id:"graduation", name:"Formatura elegante", category:"Formatura", description:"Um marco importante merece ser celebrado.", background:"#e6e8e2", accent:"#6b785f", symbol:"✧", image:"/images/formatura.jpg" }
 ,{ id:"shower", name:"Chá de bebê delicado", category:"Chá de bebê", description:"Uma celebração doce para receber uma nova vida.", background:"#f4e9e6", accent:"#ae7d75", symbol:"♡", image:"/images/infantil.jpg" }
 ,{ id:"anniversary", name:"Bodas especiais", category:"Bodas", description:"Uma história compartilhada merece ser celebrada.", background:"#f5eee2", accent:"#a88b59", symbol:"❀", image:"/images/casamento.jpg.jpg" }
 ,{ id:"custom", name:"Celebração personalizada", category:"Outro evento", description:"Um modelo versátil para momentos únicos.", background:"#e9eee6", accent:"#647d68", symbol:"✦", image:"/images/rustico.jpg" }
];

// Sugestões simbólicas locais: não representam produtos nem pagamentos reais.
const giftPacks: Record<string, GiftItem[]> = {
 wedding: [
  { id:"honeymoon", name:"Cota para a lua de mel", description:"Ajude os anfitriões a criar lembranças especiais na viagem.", value:150 },
  { id:"dinner", name:"Jantar especial", description:"Uma noite a dois para brindar esta nova etapa.", value:120 },
  { id:"outing", name:"Passeio a dois", description:"Uma experiência para aproveitar durante a viagem.", value:100 },
  { id:"home", name:"Um mimo para o novo lar", description:"Uma contribuição simbólica para a casa do casal.", value:90 },
  { id:"celebration", name:"Brinde à celebração", description:"Uma pequena cota para comemorar juntos.", value:60 }
 ],
 baby: [
  { id:"layette", name:"Enxoval do bebê", description:"Uma contribuição para as primeiras roupinhas.", value:100 },
  { id:"diapers", name:"Fraldas para os primeiros dias", description:"Ajude a preparar o cantinho do bebê.", value:80 },
  { id:"bath", name:"Hora do banho", description:"Itens simbólicos para um banho cheio de carinho.", value:70 },
  { id:"room", name:"Decoração do quartinho", description:"Uma contribuição para deixar o quarto ainda mais acolhedor.", value:120 },
  { id:"welcome", name:"Boas-vindas ao bebê", description:"Um presente simbólico para celebrar a chegada.", value:50 }
 ],
 birthday: [
  { id:"cake", name:"Bolo e docinhos", description:"Uma cota para adoçar a festa.", value:50 },
  { id:"dinner", name:"Jantar de comemoração", description:"Uma experiência gostosa para celebrar mais um ano.", value:100 },
  { id:"show", name:"Passeio ou show", description:"Ajude a planejar um programa especial.", value:120 },
  { id:"toast", name:"Brinde com amigos", description:"Uma contribuição simbólica para comemorar juntos.", value:60 },
  { id:"experience", name:"Uma experiência nova", description:"Um passeio ou atividade para guardar na memória.", value:90 }
 ],
 graduation: [
  { id:"dinner", name:"Jantar de formatura", description:"Uma noite especial para celebrar a conquista.", value:120 },
  { id:"trip", name:"Viagem depois da formatura", description:"Uma contribuição simbólica para a próxima aventura.", value:150 },
  { id:"books", name:"Novos caminhos", description:"Ajude a apoiar os próximos passos desta jornada.", value:100 },
  { id:"toast", name:"Brinde à conquista", description:"Uma cota para brindar esse grande momento.", value:60 }
 ],
 general: [
  { id:"dinner", name:"Jantar de comemoração", description:"Uma experiência especial para celebrar juntos.", value:100 },
  { id:"outing", name:"Passeio especial", description:"Uma contribuição simbólica para um dia diferente.", value:80 },
  { id:"toast", name:"Brinde à celebração", description:"Uma cota para comemorar este momento.", value:50 }
 ]
};

export function getGiftSuggestions(kind: string): GiftItem[] {
 const value = kind.toLowerCase();
 const pack = value.includes("casamento") || value.includes("bodas") ? giftPacks.wedding
  : value.includes("beb") ? giftPacks.baby
  : value.includes("anivers") ? giftPacks.birthday
  : value.includes("formatura") ? giftPacks.graduation
  : giftPacks.general;
 return pack.map(item => ({ ...item }));
}

export const demoEvents: InvitationEvent[] = [
 { id:"demo-casamento", slug:"marina-e-rafael", kind:"Casamento", title:"Nosso grande dia", hosts:"Marina & Rafael", date:"2027-05-22", time:"16:00", venue:"Villa das Oliveiras", address:"Estrada das Flores, 120", city:"Guararema", state:"SP", mapsUrl:"https://maps.google.com", message:"Com muito amor, queremos celebrar este momento especial ao lado de pessoas queridas.", templateId:"botanical", primaryColor:"#536e55", backgroundColor:"#f7f7ef", buttonText:"Confirmar presença", cover:"", status:"Publicado", createdAt:new Date().toISOString(), maxGuests:4 },
 { id:"demo-aniversario", slug:"aniversario-da-helena", kind:"Aniversário", title:"Uma festa especial", hosts:"Helena", date:"2026-12-12", time:"15:00", venue:"Espaço Jardim", address:"Rua das Acácias, 45", city:"Guararema", state:"SP", mapsUrl:"https://maps.google.com", message:"Prepare-se para uma tarde de alegria, carinho e boas memórias!", templateId:"modern", primaryColor:"#b56b4b", backgroundColor:"#fff7f2", buttonText:"Vou comemorar!", cover:"", status:"Publicado", createdAt:new Date().toISOString(), maxGuests:4 }
];

export const demoGuests: GuestResponse[] = [
 { id:"g1", eventId:"demo-casamento", name:"Camila Souza", phone:"", attending:true, people:2, companions:"André Souza", notes:"", respondedAt:new Date().toISOString(), source:"RSVP" },
 { id:"g2", eventId:"demo-casamento", name:"Pedro Lima", phone:"", attending:false, people:0, companions:"", notes:"", respondedAt:new Date().toISOString(), source:"RSVP" }
];
