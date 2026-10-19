"use client";
import Link from "next/link";
import { useEffect,useState } from "react";
import { readEvents,writeEvents } from "@/lib/storage";
import type { InvitationEvent } from "@/lib/types";
export default function EventsPage(){
 const [events,setEvents]=useState<InvitationEvent[]>([]);
 function refresh(){setEvents(readEvents());} useEffect(()=>{refresh();},[]);
 return <><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:15,flexWrap:"wrap"}}><div><div className="eyebrow">Organização</div><h1 className="serif" style={{fontSize:38,margin:"8px 0"}}>Meus eventos</h1><p className="muted">Crie, personalize e acompanhe cada celebração.</p></div><Link href="/painel/eventos/novo" className="btn btn-primary">＋ Criar evento</Link></div>
  <div style={{display:"grid",gap:12,marginTop:28}}>{events.map(e=><article className="card event-row" key={e.id}><div><span className="pill">{e.kind}</span><h3 style={{margin:"10px 0 5px"}}>{e.hosts||e.title}</h3><p className="muted" style={{fontSize:13,margin:0}}>{e.title} · {e.date?new Date(e.date+"T12:00:00").toLocaleDateString("pt-BR"):"Sem data"}</p></div><div style={{display:"flex",gap:8,flexWrap:"wrap"}}><Link className="btn btn-light" href={`/painel/eventos/${e.id}`}>Detalhes</Link><Link className="btn btn-primary" href={`/painel/eventos/${e.id}/editar-convite`}>Editar convite</Link><button className="btn btn-light" onClick={()=>{if(confirm("Excluir este evento?")){writeEvents(readEvents().filter(x=>x.id!==e.id));refresh();}}}>Excluir</button></div></article>)}</div>
 </>;
}
