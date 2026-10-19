"use client";
import { useMemo, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import ModelCard from "@/components/ModelCard";
import { templates } from "@/lib/data";
export default function ModelsPage() {
 const [category,setCategory] = useState("Todos"); const [query,setQuery] = useState("");
 const filtered = useMemo(()=>templates.filter(t=>(category==="Todos"||t.category===category)&&(t.name.toLowerCase().includes(query.toLowerCase())||t.description.toLowerCase().includes(query.toLowerCase()))),[category,query]);
 return <><SiteHeader/><main className="container" style={{padding:"55px 0 80px"}}><div className="eyebrow">Galeria Celebra</div><h1 className="serif" style={{fontSize:46,margin:"12px 0"}}>Modelos para celebrar</h1><p className="muted" style={{lineHeight:1.7,maxWidth:600}}>Explore os estilos e escolha o ponto de partida perfeito para o seu convite.</p>
  <div style={{display:"flex",gap:10,flexWrap:"wrap",margin:"28px 0 24px"}}>{["Todos","Casamento","Aniversário","Formatura"].map(c=><button key={c} className={`btn ${category===c?"btn-primary":"btn-light"}`} onClick={()=>setCategory(c)}>{c}</button>)}<input aria-label="Buscar modelo" placeholder="Buscar modelo..." value={query} onChange={e=>setQuery(e.target.value)} style={{padding:"12px 16px",borderRadius:999,border:"1px solid #dfe5dc",marginLeft:"auto",minWidth:190}}/></div>
  <div className="models-grid">{filtered.map(t=><ModelCard item={t} action="select" key={t.id}/>)}</div>{filtered.length===0&&<p className="muted">Nenhum modelo encontrado. Tente outra busca.</p>}
 </main></>;
}
