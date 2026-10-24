"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { InvitationEvent, InviteDesignElement } from "@/lib/types";
import { getDesignElementText } from "@/lib/invitation-design";
import ColorSwatches from "@/app/components/ColorSwatches";

type Props = {
  event: InvitationEvent;
  editable?: boolean;
  onChange?: (event: InvitationEvent) => void;
  device?: "mobile" | "desktop";
};

export default function InvitationDesignCanvas({ event, editable = false, onChange, device = "desktop" }: Props) {
  const elements = event.designElements || [];
  const displayElements = editable ? elements : elements.filter(element => element.type === "text");
  const publicPhoto = !editable ? event.cover || elements.find(element => element.type === "image")?.image : undefined;
  const [selectedId, setSelectedId] = useState(elements[0]?.id || "");
  const [imageError, setImageError] = useState("");
  const stageRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<string | null>(null);
  const resizing = useRef<{ id: string; x: number; y: number; width: number; fontSize: number; startHeight: number; stageWidth: number } | null>(null);
  const selected = elements.find(element => element.id === selectedId);

  useEffect(() => {
    if (!elements.some(element => element.id === selectedId)) setSelectedId(elements[0]?.id || "");
  }, [elements, selectedId]);

  function commit(next: InviteDesignElement[]) {
    onChange?.({ ...event, designElements: next });
  }

  function updateTypography(patch: Partial<NonNullable<InvitationEvent["typography"]>>) {
    onChange?.({ ...event, typography: { fontFamily: event.typography?.fontFamily || event.fontFamily || "Georgia", scale: event.typography?.scale ?? 1, ...event.typography, ...patch } });
  }

  function update(id: string, patch: Partial<InviteDesignElement>) {
    commit(elements.map(element => element.id === id ? { ...element, ...patch } : element));
  }

  function addText() {
    const element: InviteDesignElement = {
      id: crypto.randomUUID(), type: "text", text: "Digite seu texto", x: 50, y: 50,
      width: 68, fontFamily: "Georgia", fontSize: 24, color: event.primaryColor, align: "center"
    };
    commit([...elements, element]);
    setSelectedId(element.id);
  }

  async function readImage(file?: File): Promise<string> {
    if (!file) return "";
    setImageError("");
    if (!file.type.startsWith("image/")) throw new Error("Escolha um arquivo de imagem.");
    if (file.size > 10 * 1024 * 1024) throw new Error("A imagem precisa ter até 10 MB.");
    const url = URL.createObjectURL(file);
    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const loaded = new Image();
        loaded.onload = () => resolve(loaded);
        loaded.onerror = () => reject(new Error("Não foi possível abrir essa imagem."));
        loaded.src = url;
      });
      const scale = Math.min(1, 1200 / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL("image/jpeg", .82);
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  async function addImage(file?: File) {
    if (!file) return;
    setImageError("");
    try {
      const image = await readImage(file);
      const element: InviteDesignElement = {
        id: crypto.randomUUID(), type: "image", image,
        x: 50, y: 50, width: 30, align: "center", borderRadius: 8, imageFit: "contain"
      };
      commit([...elements, element]);
      setSelectedId(element.id);
    } catch (error) {
      setImageError(error instanceof Error ? error.message : "Não foi possível carregar essa imagem.");
    }
  }

  function startDrag(element: InviteDesignElement, e: ReactPointerEvent<HTMLDivElement>) {
    if (!editable) return;
    e.preventDefault();
    e.stopPropagation();
    setSelectedId(element.id);
    if (element.fullBleed) return;
    dragging.current = element.id;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function startResize(element: InviteDesignElement, e: ReactPointerEvent<HTMLButtonElement>) {
    if (!editable) return;
    e.preventDefault();
    e.stopPropagation();
    const stage = stageRef.current?.getBoundingClientRect();
    const box = e.currentTarget.parentElement?.getBoundingClientRect();
    if (!stage || !box) return;
    setSelectedId(element.id);
    dragging.current = null;
    resizing.current = {
      id: element.id, x: e.clientX, y: e.clientY, width: element.width,
      fontSize: element.fontSize || 24,
      startHeight: element.height || box.height, stageWidth: stage.width
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function drag(e: ReactPointerEvent<HTMLDivElement>) {
    const resize = resizing.current;
    if (resize) {
      const deltaX = e.clientX - resize.x;
      const deltaY = e.clientY - resize.y;
      const element = elements.find(item => item.id === resize.id);
      const patch: Partial<InviteDesignElement> = {
        width: Math.max(10, Math.min(95, resize.width + deltaX / resize.stageWidth * 100)),
        height: Math.max(36, Math.min(520, resize.startHeight + deltaY))
      };
      if (element?.type === "text") patch.fontSize = Math.max(10, Math.min(96, resize.fontSize + (deltaX + deltaY) / 20));
      update(resize.id, patch);
      return;
    }
    const id = dragging.current;
    const rect = stageRef.current?.getBoundingClientRect();
    if (!id || !rect) return;
    update(id, {
      x: Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))
    });
  }

  function reorder(id: string, direction: -1 | 1) {
    const current = elements.findIndex(element => element.id === id);
    const target = current + direction;
    if (current < 0 || target < 0 || target >= elements.length) return;
    const next = [...elements];
    [next[current], next[target]] = [next[target], next[current]];
    commit(next);
  }

  function moveLayer(id: string, destination: "back" | "front") {
    const index = elements.findIndex(element => element.id === id);
    if (index < 0) return;
    const next = [...elements];
    const [element] = next.splice(index, 1);
    next.splice(destination === "back" ? 0 : next.length, 0, element);
    commit(next);
  }

  function toggleFullBleedImage(element: InviteDesignElement) {
    if (element.type !== "image") return;
    if (element.fullBleed) {
      update(element.id, { fullBleed: false, width: 34, height: 220, x: 50, y: 50 });
      return;
    }
    const next = elements.map(item => item.id === element.id
      ? { ...item, fullBleed: true, width: 100, height: undefined, imageFit: "cover" as const, x: 50, y: 50 }
      : item);
    const image = next.find(item => item.id === element.id)!;
    commit([image, ...next.filter(item => item.id !== element.id)]);
  }

  return <div className={`design-editor ${editable ? "is-editable" : "is-readonly"}`}>
    {editable && <aside className="design-inspector">
      <div className="design-inspector-heading"><div><span className="eyebrow">PERSONALIZAÇÃO</span><h3>Composição do convite</h3></div><span className="design-layer-count">{elements.length} elementos</span></div>
      <p className="muted design-instructions">Arraste cada bloco no convite para posicioná-lo. Selecione um bloco para editar seus detalhes.</p>
      <div className="design-add-actions"><button type="button" className="btn btn-light" onClick={addText}>＋ Adicionar texto</button><label className="btn btn-light design-image-button">＋ Adicionar imagem<input type="file" accept="image/*" onChange={e => { void addImage(e.target.files?.[0]); e.currentTarget.value = ""; }}/></label></div>
      {imageError && <p className="form-error" role="alert">{imageError}</p>}
      <section className="design-global-typography" aria-label="Estilo de todos os textos">
        <div><span className="eyebrow">CONVITE INTEIRO</span><h4>Estilo de todos os textos</h4><p>Uma alteração aqui atualiza todas as letras do convite.</p></div>
        <label className="design-field">Fonte<select value={event.typography?.fontFamily || event.fontFamily || "Georgia"} onChange={e => updateTypography({ fontFamily: e.target.value })}><option value="Georgia">Elegante (Georgia)</option><option value="Arial">Moderna (Arial)</option><option value="Trebuchet MS">Leve (Trebuchet)</option><option value="Courier New">Clássica (Courier)</option><option value="Palatino Linotype">Editorial (Palatino)</option></select></label>
        <label className="design-field design-range">Tamanho geral das letras <strong>{Math.round((event.typography?.scale ?? 1) * 100)}%</strong><input type="range" min="75" max="150" value={Math.round((event.typography?.scale ?? 1) * 100)} onChange={e => updateTypography({ scale: Number(e.target.value) / 100 })}/></label>
        <div className="design-global-color"><ColorSwatches label="Cor de todas as letras" value={event.typography?.color || event.primaryColor} onChange={color => updateTypography({ color })}/>{event.typography?.color && <button type="button" onClick={() => updateTypography({ color: undefined })}>Usar cores do modelo</button>}</div>
        <label className="design-check"><input type="checkbox" checked={Boolean(event.typography?.outlineWidth)} onChange={e => updateTypography({ outlineWidth: e.target.checked ? 1.5 : 0, outlineColor: event.typography?.outlineColor || "#ffffff" })}/> Adicionar borda ao redor das letras</label>
        {Boolean(event.typography?.outlineWidth) && <><ColorSwatches label="Cor da borda das letras" value={event.typography?.outlineColor || "#ffffff"} onChange={color => updateTypography({ outlineColor: color })}/><label className="design-field design-range">Espessura da borda <strong>{(event.typography?.outlineWidth || 1.5).toFixed(1)}px</strong><input type="range" min="0.5" max="4" step="0.5" value={event.typography?.outlineWidth || 1.5} onChange={e => updateTypography({ outlineWidth: Number(e.target.value) })}/></label></>}
      </section>
      {selected ? <div className="design-controls">
        <div className="design-selected-title"><strong>{selected.type === "image" ? "Imagem selecionada" : "Texto selecionado"}</strong><div><button type="button" className="design-icon-button" aria-label="Enviar para trás" title="Enviar para trás" onClick={() => moveLayer(selected.id, "back")}>↓</button><button type="button" className="design-icon-button" aria-label="Trazer para frente" title="Trazer para frente" onClick={() => moveLayer(selected.id, "front")}>↑</button><button type="button" className="design-icon-button danger" aria-label="Remover elemento" title="Remover elemento" onClick={() => { commit(elements.filter(element => element.id !== selected.id)); setSelectedId(""); }}>×</button></div></div>
        {selected.type === "text" ? <>
          <label className="design-field design-field-full">Texto<textarea rows={3} value={getDesignElementText(selected, event)} onChange={e => update(selected.id, { text: e.target.value, sourceField: undefined })}/></label>
          <label className="design-field">Alinhamento<select value={selected.align || "center"} onChange={e => update(selected.id, { align: e.target.value as InviteDesignElement["align"] })}><option value="left">Esquerda</option><option value="center">Centro</option><option value="right">Direita</option></select></label>
          <label className="design-field design-range">Tamanho base deste bloco <strong>{selected.fontSize || 24}px</strong><input type="range" min="10" max="96" value={selected.fontSize || 24} onChange={e => update(selected.id, { fontSize: Number(e.target.value) })}/></label>
        </> : <>
          <label className="design-field design-field-full">Trocar imagem<input type="file" accept="image/*" onChange={e => { const file = e.target.files?.[0]; if (file) void readImage(file).then(image => update(selected.id, { image })).catch(error => setImageError(error instanceof Error ? error.message : "Não foi possível carregar essa imagem.")); e.currentTarget.value = ""; }}/></label>
          <button type="button" className={`design-background-action ${selected.fullBleed ? "active" : ""}`} onClick={() => toggleFullBleedImage(selected)}>{selected.fullBleed ? "Imagem preenchendo o convite — remover modo fundo" : "Usar imagem como fundo (100% do convite)"}</button>
          <p className="design-control-hint">A imagem cobre toda a página e fica atrás dos textos. Use a lista Camadas para selecionar e editar textos sobre ela.</p>
          {!selected.fullBleed && <label className="design-field design-field-full">Ajuste da imagem<select value={selected.imageFit || "contain"} onChange={e => update(selected.id, { imageFit: e.target.value as "cover" | "contain" })}><option value="contain">Mostrar a foto inteira</option><option value="cover">Preencher quadro (pode cortar as bordas)</option></select></label>}
        </>}
        {!selected.fullBleed && <label className="design-field design-range">Largura do elemento <strong>{Math.round(selected.width)}%</strong><input type="range" min="10" max="95" value={selected.width} onChange={e => update(selected.id, { width: Number(e.target.value) })}/></label>}
        {!selected.fullBleed && <label className="design-field design-range">{selected.type === "image" ? "Altura da imagem" : "Altura mínima do quadro"} <strong>{Math.round(selected.height || 80)}px</strong><input type="range" min="36" max="520" value={selected.height || 80} onChange={e => update(selected.id, { height: Number(e.target.value) })}/></label>}
        {!selected.fullBleed && <div className="design-position-fields"><label className="design-field">Posição horizontal<input type="number" min="0" max="100" value={Math.round(selected.x)} onChange={e => update(selected.id, { x: Math.max(0, Math.min(100, Number(e.target.value))) })}/></label><label className="design-field">Posição vertical<input type="number" min="0" max="100" value={Math.round(selected.y)} onChange={e => update(selected.id, { y: Math.max(0, Math.min(100, Number(e.target.value))) })}/></label></div>}
        {selected.type === "text" && <label className="design-check"><input type="checkbox" checked={Boolean(selected.backgroundColor)} onChange={e => update(selected.id, { backgroundColor: e.target.checked ? "#fffaf0" : undefined })}/> Exibir quadro atrás do texto</label>}
        {selected.type === "text" && selected.backgroundColor && <><ColorSwatches label="Cor do quadro" value={selected.backgroundColor} onChange={color => update(selected.id, { backgroundColor: color })}/><label className="design-range">Arredondamento do quadro <strong>{selected.borderRadius || 0}px</strong><input type="range" min="0" max="32" value={selected.borderRadius || 0} onChange={e => update(selected.id, { borderRadius: Number(e.target.value) })}/></label></>}
        <label className="design-check"><input type="checkbox" checked={Boolean(selected.borderColor)} onChange={e => update(selected.id, { borderColor: e.target.checked ? event.primaryColor : undefined })}/> Exibir moldura no elemento</label>
        {selected.borderColor && <ColorSwatches label="Cor da moldura" value={selected.borderColor} onChange={color => update(selected.id, { borderColor: color })}/>}
      </div> : <div className="design-empty-selection">Selecione um elemento no convite para ajustar fonte, cor, tamanho e posição.</div>}
      <div className="design-layer-list"><strong>Camadas <small>(fundo primeiro, frente por último)</small></strong>{elements.map((element, index) => <button type="button" key={element.id} className={element.id === selectedId ? "active" : ""} onClick={() => setSelectedId(element.id)}><span>{element.type === "image" ? "▧" : "T"}</span>{element.type === "image" ? element.fullBleed ? "Foto de fundo · 100%" : `Imagem ${index + 1}` : getDesignElementText(element, event).slice(0, 27) || "Texto sem conteúdo"}</button>)}</div>
    </aside>}
    <div className="design-stage-wrap">
      {editable && <div className="design-stage-help">Prévia interativa <span>Arraste os elementos para mover; use os controles para redimensionar e organizar as camadas</span></div>}
      <article ref={stageRef} className={`design-stage ${editable ? "editing" : "public-invitation-card"}`} onPointerMove={drag} onPointerUp={() => { dragging.current = null; resizing.current = null; }} onPointerCancel={() => { dragging.current = null; resizing.current = null; }} style={{ maxWidth: device === "mobile" ? 390 : 720, backgroundColor: event.backgroundColor, borderColor: `${event.primaryColor}55` }}>
        {!editable && publicPhoto && <div className="design-public-photo" aria-hidden="true"><img className="design-public-photo-blur" src={publicPhoto} alt=""/><img className="design-public-photo-fit" src={publicPhoto} alt=""/></div>}
        <div className={!editable ? "design-public-content" : undefined}>
        {displayElements.map((element, index) => <div key={element.id} className={`design-element ${element.type === "image" ? "image-element" : "text-element"} ${element.fullBleed ? "full-bleed-image" : ""} ${editable && selectedId === element.id ? "selected" : ""}`} onPointerDown={e => startDrag(element, e)} onClick={() => editable && setSelectedId(element.id)} onKeyDown={e => { if (!editable) return; const delta = e.shiftKey ? 5 : 1; const next = { ...element }; if (e.key === "ArrowLeft") next.x = Math.max(0, next.x - delta); else if (e.key === "ArrowRight") next.x = Math.min(100, next.x + delta); else if (e.key === "ArrowUp") next.y = Math.max(0, next.y - delta); else if (e.key === "ArrowDown") next.y = Math.min(100, next.y + delta); else return; e.preventDefault(); update(element.id, { x: next.x, y: next.y }); }} role={editable ? "button" : undefined} tabIndex={editable ? 0 : undefined} aria-label={editable ? `${element.type === "image" ? "Imagem" : "Texto"}: ${element.type === "text" ? getDesignElementText(element, event) : "arraste para posicionar"}` : undefined} style={{ left: element.fullBleed ? 0 : `${element.x}%`, top: element.fullBleed ? 0 : `${element.y}%`, width: element.fullBleed ? "100%" : `${element.width}%`, height: element.fullBleed ? "100%" : undefined, transform: element.fullBleed ? "none" : undefined, zIndex: index + 1, minHeight: !element.fullBleed && element.height ? `${element.height}px` : undefined, fontFamily: element.type === "text" ? event.typography?.fontFamily || event.fontFamily || element.fontFamily || undefined : undefined, fontSize: element.type === "text" && element.fontSize ? `${element.fontSize * (event.typography?.scale ?? 1)}px` : undefined, color: element.type === "text" ? event.typography?.color || element.color || undefined : undefined, WebkitTextStroke: element.type === "text" && event.typography?.outlineWidth ? `${event.typography.outlineWidth}px ${event.typography.outlineColor || "#ffffff"}` : undefined, paintOrder: "stroke fill", textAlign: element.align || "center", justifyContent: element.align === "left" ? "flex-start" : element.align === "right" ? "flex-end" : "center", backgroundColor: element.backgroundColor || "transparent", border: element.borderColor ? `1px solid ${element.borderColor}` : "1px solid transparent", borderRadius: element.fullBleed ? 0 : element.borderRadius || 0 }}>
          {element.type === "image" ? <img src={element.image} alt="" draggable={false} style={element.fullBleed ? { width: "100%", height: "100%", objectFit: "cover" } : element.height ? { height: `${element.height}px`, objectFit: element.imageFit || "contain" } : { objectFit: element.imageFit || "contain" }}/> : getDesignElementText(element, event)}
          {editable && selectedId === element.id && !element.fullBleed && <button type="button" className="design-resize-handle" aria-label="Arraste para aumentar ou diminuir o elemento" title="Arraste para redimensionar" onPointerDown={e => startResize(element, e)} />}
        </div>)}
        </div>
        {editable && !elements.length && <div className="design-empty-canvas">Adicione um texto ou uma imagem para começar.</div>}
      </article>
      {editable && <p className="design-keyboard-hint">Dica: use as setas do teclado para mover o elemento selecionado com precisão.</p>}
    </div>
  </div>;
}
