"use client";
import { useEffect,useState } from "react";
import { useParams,useRouter } from "next/navigation";
import Link from "next/link";
import { getEvent,saveEvent } from "@/lib/storage";
import type { InvitationEvent } from "@/lib/types";
export default function EditEventPage(){
 const params=useParams<{id:string}>();const router=useRouter();const [event,setEvent]=useState<InvitationEvent|undefined>();
 useEffect(()=>setEvent(getEvent(params.id)),[params.id]);
 if(!event)return <p>Evento não encontrado.</p>;
 const update=(key:keyof InvitationEvent,value:string)=>setEvent({...event,[key]:value});
 function save(){saveEvent(event);router.push(`/painel/eventos/${event.id}`);}
 return <><Link href={`/painel/eventos/${event.id}`} style={{color:"#647d68",fontSize:13}}>← Voltar ao evento</Link><h1 className="serif" style={{fontSize:36}}>Editar informações</h1><div className="card form-panel" style={{maxWidth:720}}>{([["title","Nome do evento"],["hosts","Anfitriões"],["date","Data"],["time","Horário"],["venue","Local"],["address","Endereço"],["city","Cidade"],["state","Estado"],["mapsUrl","Link do mapa"],["message","Mensagem"]] as [keyof InvitationEvent,string][]).map(([key,label])=><div className="field" key={key}><label>{label}</label>{key==="message"?<textarea rows={3} value={String(event[key])} onChange={e=>update(key,e.target.value)}/>:<input type={key==="date"?"date":key==="time"?"time":key==="mapsUrl"?"url":"text"} value={String(event[key]??"")} onChange={e=>update(key,e.target.value)}/>}</div>)}<button className="btn btn-primary" onClick={save}>Salvar informações</button></div></>;
}
