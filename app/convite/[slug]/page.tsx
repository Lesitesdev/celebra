"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { getEvent } from "@/lib/storage";
import { templates } from "@/lib/data";
import type { InvitationEvent } from "@/lib/types";
import InvitationDesignCanvas from "@/app/components/InvitationDesignCanvas";

export default function PublicInvitePage() {
  const { slug } = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const isPreview = searchParams.get("preview") === "1";
  const [event, setEvent] = useState<InvitationEvent>(); const [loaded, setLoaded] = useState(false);
  const [canReturnToEditor, setCanReturnToEditor] = useState(false);
  useEffect(() => {
    const savedEvent = getEvent(slug);
    setEvent(savedEvent);
    let isOwner = false;
    try {
      const accounts = JSON.parse(localStorage.getItem("celebra.auth.accounts") || "[]");
      const accountId = Array.isArray(accounts) ? accounts[0]?.accountId : undefined;
      const user = JSON.parse(localStorage.getItem("celebra.auth.user") || "null");
      isOwner = Boolean(savedEvent && ((savedEvent.accountId && savedEvent.accountId === accountId) || (savedEvent.accountId && (savedEvent.accountId === user?.id || savedEvent.accountId === user?.email)) || (!savedEvent.accountId && user)));
    } catch { isOwner = false; }
    setCanReturnToEditor(isPreview || isOwner);
    setLoaded(true);
  }, [slug, isPreview]);
  if (!loaded) return <main className="invite-state">Carregando convite…</main>;
  if (!event || (event.status !== "Publicado" && !isPreview)) return <main className="invite-state"><section className="card invite-state-card"><span className="logo">celebra<span>.</span></span><h1 className="serif">Este convite não está disponível</h1><p className="muted">O link pode estar incorreto ou o convite ainda não foi publicado.</p><Link href="/" className="btn btn-primary">Conhecer o Celebra</Link></section></main>;
  const model = templates.find(t => t.id === event.templateId) || templates[0];
  const invitePhoto = event.cover || event.designElements?.find(element => element.type === "image")?.image;
  return <main className="public-page public-page-fullscreen public-page-has-design" style={{ "--event-accent": event.primaryColor, "--event-background": event.backgroundColor, backgroundColor: event.backgroundColor, ...(invitePhoto ? { backgroundImage: `linear-gradient(#17141b45,#17141b45),url("${invitePhoto}")`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" } : {}) } as React.CSSProperties}>
    <div className="public-wrap">
      {canReturnToEditor && <Link href={`/painel/eventos/${event.id}/editar-convite`} className="public-preview-return-float">&#8592; Voltar &#224; edi&#231;&#227;o</Link>}
      {event.designElements ? <InvitationDesignCanvas event={event} /> : <article className="invite-card public-invitation-card" style={{ backgroundColor: event.backgroundColor, borderColor: `${event.primaryColor}55`, backgroundImage: event.cover ? `linear-gradient(#18231d55,#18231d55),url("${event.cover}")` : undefined, backgroundSize: "cover", backgroundPosition: "center", minHeight: event.cover ? 640 : undefined }}>
        <div className="invite-content" style={{ left: `${(event.textPosition || { x: 50, y: 50 }).x}%`, top: `${(event.textPosition || { x: 50, y: 50 }).y}%`, fontFamily: event.fontFamily || "Georgia" }}><span className="invite-symbol" style={{ color: event.primaryColor }}>{model.symbol}</span><div className="eyebrow" style={{ color: event.primaryColor }}>{event.kind}</div><h1 className="serif" style={{ color: event.primaryColor }}>{event.hosts || event.title}</h1><p className="invite-message">{event.message}</p><div className="invite-divider" style={{ background: event.primaryColor }} /><p className="invite-date">{new Date(`${event.date}T12:00:00`).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })} · {event.time}</p><h2 className="serif invite-venue">{event.venue || "Celebração"}</h2><p className="muted">{[event.address, event.city, event.state].filter(Boolean).join(", ")}</p></div>
      </article>}
      {isPreview && event.status !== "Publicado" && <p className="notice" style={{marginTop:14}}>Prévia privada deste rascunho neste navegador.</p>}
      <nav className="invite-actions" aria-label="Opções do convite">
        <Link href={`/convite/${event.slug}/presentes${isPreview?"?preview=1":""}`} className="invite-action"><span>🎁</span><strong>Lista de presentes</strong><small>Veja sugestões para celebrar</small></Link>
        <Link href={`/convite/${event.slug}/confirmar-presenca${isPreview?"?preview=1":""}`} className="invite-action"><span>✓</span><strong>Confirmar presença</strong><small>Responda ao convite</small></Link>
        <Link href={`/convite/${event.slug}/como-chegar${isPreview?"?preview=1":""}`} className="invite-action"><span>⌖</span><strong>Como chegar</strong><small>Veja o endereço e a rota</small></Link>
      </nav><p className="muted invite-footer">Feito com Celebra · Convites digitais</p>
      <footer className="public-invite-footer">

        <p>Gostou deste convite? <Link href="/entrar">Crie o seu no Celebra</Link></p>
        <Link href="/" className="public-footer-brand">celebra<span>.</span></Link>
      </footer>
    </div>
  </main>;
}
