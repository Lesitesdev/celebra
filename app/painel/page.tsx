"use client";
import Link from "next/link";
import { useEffect,useState } from "react";
import { readEvents,readGuests,resetDemo } from "@/lib/storage";
import type { InvitationEvent,GuestResponse } from "@/lib/types";
export default function DashboardPage() {
 const [events,setEvents]=useState<InvitationEvent[]>([]); const [guests,setGuests]=useState<GuestResponse[]>([]);
 function refresh(){setEvents(readEvents());setGuests(readGuests());}
 useEffect(()=>{refresh();},[]);
 const published=events.filter(e=>e.status==="Publicado").length; const attending=guests.filter(g=>g.attending).reduce((sum,g)=>sum+g.people,0);
 return <><div style={{display:"flex",justifyContent:"space-between",gap:20,alignItems:"start",flexWrap:"wrap"}}><div><div className="eyebrow">Seu espaço de celebração</div><h1 className="serif" style={{fontSize:38,margin:"8px 0"}}>Visão geral</h1><p className="muted">Acompanhe seus eventos e confirmações em um só lugar.</p></div><Link href="/painel/eventos/novo" className="btn btn-primary">＋ Criar novo evento</Link></div>
  <div className="stats-grid" style={{marginTop:28}}>{[{label:"Eventos criados",value:events.length},{label:"Eventos publicados",value:published},{label:"Respostas recebidas",value:guests.length},{label:"Pessoas confirmadas",value:attending}].map(s=><div className="card stat-card" key={s.label}><span className="muted" style={{fontSize:13}}>{s.label}</span><strong>{s.value}</strong><span style={{fontSize:12,color:"#789078"}}>Na demonstração</span></div>)}</div>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"35px 0 15px"}}><h2 style={{fontSize:20,margin:0}}>Seus eventos</h2><Link href="/painel/eventos" style={{fontSize:13,color:"#48624f",fontWeight:700}}>Ver todos →</Link></div>
  {events.length===0?<div className="card" style={{padding:40,textAlign:"center"}}><h3>Vamos criar sua primeira celebração?</h3><p className="muted">Comece escolhendo o tipo de evento e um modelo.</p><Link href="/painel/eventos/novo" className="btn btn-primary">Criar meu primeiro evento</Link></div>:
  <div style={{display:"grid",gap:12}}>{events.slice(0,5).map(e=><article className="card event-row" key={e.id}><div><span className="pill">{e.kind}</span><h3 style={{margin:"10px 0 5px"}}>{e.hosts||e.title}</h3><p className="muted" style={{fontSize:13,margin:0}}>{e.date?new Date(e.date+"T12:00:00").toLocaleDateString("pt-BR"):"Data a definir"} · {e.venue||"Local a definir"}</p></div><div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span className={`pill ${e.status==="Rascunho"?"draft":""}`}>{e.status}</span><Link className="btn btn-light" href={`/painel/eventos/${e.id}`} style={{padding:"9px 14px"}}>Gerenciar</Link></div></article>)}</div>}
  <div style={{marginTop:24,display:"flex",justifyContent:"space-between",gap:15,flexWrap:"wrap"}}><p className="muted" style={{fontSize:12}}>Os dados são locais e não sincronizam entre dispositivos.</p><button className="btn btn-light" onClick={()=>{if(confirm("Restaurar os dados de demonstração? Isso apagará as alterações locais.")){resetDemo();refresh();}}}>Restaurar demonstração</button></div>
 </>;
}
