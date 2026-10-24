"use client";
import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { templates } from "@/lib/data";

export default function ModelCarousel() {
  const rail = useRef<HTMLDivElement>(null);
  const move = (direction: number) => rail.current?.scrollBy({ left: direction * Math.max(280, rail.current.clientWidth * .72), behavior: "smooth" });
  return <div className="carousel-wrap">
    <div className="carousel-controls"><button className="btn btn-light" aria-label="Modelos anteriores" onClick={() => move(-1)}><ChevronLeft /></button><button className="btn btn-light" aria-label="Próximos modelos" onClick={() => move(1)}><ChevronRight /></button></div>
    <div className="model-carousel" ref={rail} aria-label="Modelos de convite" tabIndex={0}>
      {templates.map((item) => <article className="card carousel-card" key={item.id}>
        <div className="carousel-image" style={{ backgroundColor: item.background }}><img src={item.image} alt={`Exemplo de convite: ${item.name}`} /><span>{item.category}</span></div>
        <div className="carousel-copy"><h3 className="serif">{item.name}</h3><p className="muted">{item.description}</p><Link className="btn btn-primary" href={`/painel/eventos/novo?modelo=${encodeURIComponent(item.id)}`}>Escolher modelo</Link></div>
      </article>)}
    </div><div className="carousel-dots" aria-hidden="true">{templates.map((item, i) => <button key={item.id} aria-label={`Ir ao modelo ${i + 1}`} onClick={() => rail.current?.children[i]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" })} />)}</div>
  </div>;
}
