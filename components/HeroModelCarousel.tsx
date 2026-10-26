"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { templates } from "@/lib/data";

const heroCopy: Record<string, { title: string; description: string; action: string }> = {
  Casamento: {
    title: "Seu grande dia merece um convite inesquecível.",
    description: "Um convite elegante, personalizado com a história de vocês e pronto para compartilhar com quem faz parte desse momento.",
    action: "Criar meu convite",
  },
  Aniversário: {
    title: "Uma comemoração especial começa pelo convite.",
    description: "Escolha seu estilo, adicione suas fotos e transforme seu aniversário em um convite cheio de personalidade.",
    action: "Personalizar meu convite",
  },
  Formatura: {
    title: "Você conquistou muito. Celebre à altura.",
    description: "Compartilhe sua conquista com um convite digital moderno, personalizado e fácil de enviar.",
    action: "Encontrar meu modelo",
  },
  "Chá de bebê": {
    title: "Um momento cheio de amor merece ser compartilhado.",
    description: "Crie um convite delicado, organize as confirmações e compartilhe sua alegria com a família e os amigos.",
    action: "Criar meu convite",
  },
};

export default function HeroModelCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const item = templates[active];
  const copy = heroCopy[item.category] || {
    title: "Toda celebração merece um convite especial.",
    description: item.description,
    action: "Criar meu convite",
  };
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
      <h1 className="serif">{copy.title}</h1>
      <div className="hero-carousel-model"><span className="hero-carousel-symbol">{item.symbol}</span><div><h2 className="serif">{item.name}</h2><p>{copy.description}</p></div></div>
      <div className="hero-carousel-actions"><Link className="btn btn-primary" href="/entrar">{copy.action} <span aria-hidden="true">&#8594;</span></Link><Link className="btn btn-light" href={`/painel/eventos/novo?modelo=${encodeURIComponent(item.id)}`}>Usar este modelo</Link></div>
      <div className="hero-carousel-points"><span>&#10003; F&#225;cil de personalizar</span><span>&#10003; Compartilhe por link</span></div>
    </div>
    <button className="hero-carousel-arrow previous" onClick={() => move(-1)} aria-label="Modelo anterior"><ChevronLeft /></button>
    <button className="hero-carousel-arrow next" onClick={() => move(1)} aria-label={"Pr\u00f3ximo modelo"}><ChevronRight /></button>
    <div className="hero-carousel-dots" aria-label="Selecionar modelo">{templates.map((t, index) => <button key={t.id} className={index === active ? "selected" : ""} aria-label={`Mostrar ${t.name}`} aria-current={index === active ? "true" : undefined} onClick={() => setActive(index)} />)}</div>
  </div>;
}
