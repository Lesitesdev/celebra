"use client";
import { useEffect,useMemo,useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getEvent,readGuests,writeGuests } from "@/lib/storage";
import type { GuestResponse,InvitationEvent } from "@/lib/types";
export default function GuestsPage(){
 const params=useParams<{id:string}>();const [event,setEvent]=useState<InvitationEvent|undefined>();const [guests,setGuests]=useState<GuestResponse[]>([]);const [query,setQuery]=useState("");const [status,setStatus]=useState("Todos");const [name,setName]=useState("");const [phone,setPhone]=useState("");
 function refresh(){const e=getEvent(params.id);setEvent(e);if(e)setGuests(readGuests().filter(g=>g.eventId===e.id));}
 useEffect(()=>{refresh();},[params.id]);
 const filtered=useMemo(()=>guests.filter(g=>(g.name.toLowerCase().includes(query.toLowerCase()))&&(status==="Todos"||(status==="Confirmados"&&g.attending)||(status==="Recusados"&&!g.attending))),[guests,query,status]);
 if(!event)return <p>Evento não encontrado.</p>;
 const confirmed=guests.filter(g=>g.attending).reduce((s,g)=>s+g.people,0);
 function update(list:GuestResponse[]){writeGuests([...readGuests().filter(g=>g.eventId!==event!.id),...list]);setGuests(list);}
 function add(){if(!name.trim())return;update([{id:crypto.randomUUID(),eventId:event!.id,name:name.trim(),phone,attending:false,people:0,companions:"",notes:"",respondedAt:new Date().toISOString(),source:"Manual"},...guests]);setName("");setPhone("");}
 return <><Link href={`/painel/eventos/${event.id}`} style={{fontSize:13,color:"#647d68"}}>← Voltar ao evento</Link><h1 className="serif" style={{fontSize:36,margin:"10px 0"}}>Convidados e confirmações</h1><p className="muted">{event.hosts} · {event.title}</p>
  <div className="stats-grid" style={{marginTop:22}}>{[{l:"Respostas",v:guests.filter(g=>g.source==="RSVP").length},{l:"Pessoas confirmadas",v:confirmed},{l:"Recusas",v:guests.filter(g=>!g.attending&&g.source==="RSVP").length}].map(x=><div className="card stat-card" key={x.l}><span className="muted">{x.l}</span><strong>{x.v}</strong></div>)}</div>
  <div className="card" style={{padding:20,marginTop:22}}><h2 style={{marginTop:0,fontSize:18}}>Adicionar convidado manualmente</h2><div className="guest-add-grid"><div className="field" style={{margin:0}}><label>Nome completo</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Nome do convidado"/></div><div className="field" style={{margin:0}}><label>Telefone (opcional)</label><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="(11) 99999-9999"/></div><button className="btn btn-primary" onClick={add}>Adicionar</button></div></div>
  <div className="guest-filters" style={{display:"flex",gap:10,flexWrap:"wrap",margin:"22px 0"}}><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar por nome" style={{padding:12,border:"1px solid #dfe5dc",borderRadius:12}}/><select value={status} onChange={e=>setStatus(e.target.value)} style={{padding:12,border:"1px solid #dfe5dc",borderRadius:12}}><option>Todos</option><option>Confirmados</option><option>Recusados</option></select><button className="btn btn-light" onClick={()=>{navigator.clipboard?.writeText(`${location.origin}/convite/${event.slug}`);alert("Link copiado, se permitido pelo navegador.");}}>Copiar link do convite</button></div>
  <div className="card table-wrap" style={{padding:10}}><table><thead><tr><th>Convidado</th><th>Telefone</th><th>Status</th><th>Pessoas</th><th>Origem</th><th>Ação</th></tr></thead><tbody>{filtered.map(g=><tr key={g.id}><td><strong>{g.name}</strong><div className="muted" style={{fontSize:11}}>{g.respondedAt?new Date(g.respondedAt).toLocaleDateString("pt-BR"):""}</div></td><td>{g.phone||"—"}</td><td><span className={`pill ${!g.attending?"draft":""}`}>{g.source==="Manual"?"Pendente":g.attending?"Confirmado":"Recusado"}</span></td><td>{g.attending?g.people:0}</td><td>{g.source==="RSVP"?"Formulário público":"Manual"}</td><td><button className="btn btn-light" style={{padding:"7px 10px"}} onClick={()=>{if(confirm(`Remover ${g.name}?`))update(guests.filter(x=>x.id!==g.id));}}>Remover</button></td></tr>)}</tbody></table>{filtered.length===0&&<p className="muted" style={{padding:20}}>Nenhum convidado encontrado.</p>}</div>
 </>;
}
