"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { templates } from "@/lib/data";

export default function HeroModelCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const item = templates[active];
  const move = (step: number) => setActive(i => (i + step + templates.length) % templates.length);
  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setActive(i => (i + 1) % templates.length), 4500);
    return () => window.clearInterval(timer);
  }, [paused]);
  return <div className="hero-carousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false); }} aria-roledescription="carrossel" aria-label="Modelos de convite">
    <img className="hero-carousel-image" src={item.image} alt={`Modelo de convite: ${item.name}`} key={item.id} />
    <div className="hero-carousel-shade" />
    <div className="hero-carousel-topline"><span>CELEBRA <i>Â·</i> CONVITES DIGITAIS</span><span>{String(active + 1).padStart(2, "0")} <i>/</i> {String(templates.length).padStart(2, "0")}</span></div>
    <div className="hero-carousel-caption" aria-live="polite">
      <span className="hero-carousel-kicker">{item.category} <b>·</b> INSPIRAÇÃO PARA CELEBRAR</span>
      <h1 className="serif">Seu evento merece<br/>um convite <em>especial.</em></h1>
      <div className="hero-carousel-model"><span className="hero-carousel-symbol">{item.symbol}</span><div><h2 className="serif">{item.name}</h2><p>{item.description}</p></div></div>
      <div className="hero-carousel-actions"><Link className="btn btn-primary" href="/entrar">Criar meu convite <span aria-hidden="true">&#8594;</span></Link><Link className="btn btn-light" href={`/painel/eventos/novo?modelo=${encodeURIComponent(item.id)}`}>Usar este modelo</Link></div>
      <div className="hero-carousel-points"><span>&#10003; F&#225;cil de personalizar</span><span>&#10003; Compartilhe por link</span></div>
    </div>
    <button className="hero-carousel-arrow previous" onClick={() => move(-1)} aria-label="Modelo anterior"><ChevronLeft /></button>
    <button className="hero-carousel-arrow next" onClick={() => move(1)} aria-label={"Pr\u00f3ximo modelo"}><ChevronRight /></button>
    <div className="hero-carousel-dots" aria-label="Selecionar modelo">{templates.map((t, index) => <button key={t.id} className={index === active ? "selected" : ""} aria-label={`Mostrar ${t.name}`} aria-current={index === active ? "true" : undefined} onClick={() => setActive(index)} />)}</div>
  </div>;
}
