import Link from "next/link";
import type { Template } from "@/lib/types";
export default function ModelCard({ item, action = "browse" }: { item: Template; action?: "browse" | "select" }) {
 const href = action === "select" ? `/painel/eventos/novo?modelo=${item.id}` : `/modelos?modelo=${item.id}`;
 return <article className="card" style={{padding:12}}>
  <div className="model-preview" style={{backgroundColor:item.background}}>
   <img className="model-preview-image" src={item.image} alt={`Imagem de exemplo: ${item.name}`} />
   <div className="model-preview-content">
    <span className="model-preview-symbol" style={{color:item.accent}}>{item.symbol}</span><small style={{color:item.accent}}>{item.category}</small>
    <h3 style={{color:item.accent}}>{item.name.includes("Anivers") ? "Vamos celebrar" : item.category === "Formatura" ? "Uma conquista" : "Juntos para sempre"}</h3>
    <small style={{color:item.accent}}>UM DIA ESPECIAL</small>
   </div>
  </div>
  <div style={{padding:"14px 6px 5px"}}><h3 style={{fontSize:17,fontWeight:800,margin:"0 0 7px"}}>{item.name}</h3><p className="muted" style={{fontSize:13,lineHeight:1.5,minHeight:40,margin:"0 0 15px"}}>{item.description}</p>
   <Link className="btn btn-primary" style={{width:"100%"}} href={href}>{action === "select" ? "Usar este modelo" : "Visualizar modelo"}</Link>
  </div>
 </article>;
}
