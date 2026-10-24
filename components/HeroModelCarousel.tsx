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
    <div className="hero-carousel-caption" aria-live="polite"><span>{item.category}</span><h2 className="serif">{item.name}</h2><p>{item.description}</p><Link className="btn btn-light" href={`/painel/eventos/novo?modelo=${encodeURIComponent(item.id)}`}>Escolher modelo</Link></div>
    <button className="hero-carousel-arrow previous" onClick={() => move(-1)} aria-label="Modelo anterior"><ChevronLeft /></button>
    <button className="hero-carousel-arrow next" onClick={() => move(1)} aria-label="Próximo modelo"><ChevronRight /></button>
    <div className="hero-carousel-dots" aria-label="Selecionar modelo">{templates.map((t, index) => <button key={t.id} className={index === active ? "selected" : ""} aria-label={`Mostrar ${t.name}`} aria-current={index === active ? "true" : undefined} onClick={() => setActive(index)} />)}</div>
  </div>;
}
