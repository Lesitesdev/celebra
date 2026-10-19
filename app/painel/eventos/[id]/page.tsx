"use client";
import Link from "next/link";
import { useEffect,useState } from "react";
import { useParams } from "next/navigation";
import { getEvent,getEventGuests } from "@/lib/storage";
import type { InvitationEvent,GuestResponse } from "@/lib/types";
export default function EventDetailPage(){
 const params=useParams<{id:string}>();const [event,setEvent]=useState<InvitationEvent|undefined>();const [guests,setGuests]=useState<GuestResponse[]>([]);
 useEffect(()=>{const e=getEvent(params.id);setEvent(e);if(e)setGuests(getEventGuests(e.id));},[params.id]);
 if(!event)return <div className="card" style={{padding:30}}>Evento não encontrado. <Link href="/painel/eventos">Voltar aos eventos</Link></div>;
 const confirmed=guests.filter(g=>g.attending).reduce((s,g)=>s+g.people,0);
 return <><Link href="/painel/eventos" style={{fontSize:13,color:"#647d68"}}>← Meus eventos</Link><div style={{display:"flex",justifyContent:"space-between",alignItems:"start",gap:20,flexWrap:"wrap",marginTop:18}}><div><span className="pill">{event.kind}</span><h1 className="serif" style={{fontSize:38,margin:"10px 0"}}>{event.hosts}</h1><p className="muted">{event.title} · {new Date(event.date+"T12:00:00").toLocaleDateString("pt-BR")} às {event.time}</p></div><Link className="btn btn-primary" href={`/painel/eventos/${event.id}/editar-convite`}>Personalizar convite</Link></div>
  <div className="stats-grid" style={{marginTop:25}}>{[{l:"Status",v:event.status},{l:"Respostas",v:guests.length},{l:"Pessoas confirmadas",v:confirmed}].map(x=><div className="card stat-card" key={x.l}><span className="muted">{x.l}</span><strong style={{fontSize:26}}>{x.v}</strong></div>)}</div>
  <div className="card" style={{padding:24,marginTop:25}}><h2 style={{marginTop:0}}>Ações do evento</h2><div style={{display:"flex",gap:12,flexWrap:"wrap"}}><Link className="btn btn-light" href={`/painel/eventos/${event.id}/convidados`}>Gerenciar convidados</Link><Link className="btn btn-light" href={`/convite/${event.slug}`}>Abrir convite público</Link><Link className="btn btn-light" href={`/painel/eventos/${event.id}/editar`}>Editar informações</Link></div><p className="muted" style={{fontSize:12,marginTop:18}}>O convite público só fica visível quando o evento estiver publicado.</p></div>
 </>;
}
