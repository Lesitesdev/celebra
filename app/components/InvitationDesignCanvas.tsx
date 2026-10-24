"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import type { InvitationEvent, InviteDesignElement } from "@/lib/types";
import { getDesignElementText } from "@/lib/invitation-design";

type Props = {
  event: InvitationEvent;
  editable?: boolean;
  onChange?: (event: InvitationEvent) => void;
  device?: "mobile" | "desktop";
};

const fontChoices = [
  ["Georgia", "Elegante"], ["Arial", "Moderna"], ["Trebuchet MS", "Leve"],
  ["Courier New", "Clássica"], ["Palatino Linotype", "Editorial"]
];

export default function InvitationDesignCanvas({ event, editable = false, onChange, device = "desktop" }: Props) {
  const elements = event.designElements || [];
  const [selectedId, setSelectedId] = useState(elements[0]?.id || "");
  const [imageError, setImageError] = useState("");
  const stageRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<string | null>(null);
  const selected = elements.find(element => element.id === selectedId);

  useEffect(() => {
    if (!elements.some(element => element.id === selectedId)) setSelectedId(elements[0]?.id || "");
  }, [elements, selectedId]);

  function commit(next: InviteDesignElement[]) {
    onChange?.({ ...event, designElements: next });
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
        x: 50, y: 50, width: 30, align: "center", borderRadius: 8
      };
      commit([...elements, element]);
      setSelectedId(element.id);
    } catch (error) {
      setImageError(error instanceof Error ? error.message : "Não foi possível carregar essa imagem.");
    }
  }

  function startDrag(element: InviteDesignElement, e: PointerEvent<HTMLDivElement>) {
    if (!editable) return;
    e.preventDefault();
    e.stopPropagation();
    setSelectedId(element.id);
    dragging.current = element.id;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function drag(e: PointerEvent<HTMLDivElement>) {
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

  return <div className={`design-editor ${editable ? "is-editable" : "is-readonly"}`}>
    {editable && <aside className="design-inspector">
      <div className="design-inspector-heading"><div><span className="eyebrow">PERSONALIZAÇÃO</span><h3>Composição do convite</h3></div><span className="design-layer-count">{elements.length} elementos</span></div>
      <p className="muted design-instructions">Arraste cada bloco no convite para posicioná-lo. Selecione um bloco para editar seus detalhes.</p>
      <div className="design-add-actions"><button type="button" className="btn btn-light" onClick={addText}>＋ Adicionar texto</button><label className="btn btn-light design-image-button">＋ Adicionar imagem<input type="file" accept="image/*" onChange={e => { void addImage(e.target.files?.[0]); e.currentTarget.value = ""; }}/></label></div>
      {imageError && <p className="form-error" role="alert">{imageError}</p>}
      {selected ? <div className="design-controls">
        <div className="design-selected-title"><strong>{selected.type === "image" ? "Imagem selecionada" : "Texto selecionado"}</strong><div><button type="button" className="design-icon-button" aria-label="Enviar para trás" title="Enviar para trás" onClick={() => reorder(selected.id, -1)}>↓</button><button type="button" className="design-icon-button" aria-label="Trazer para frente" title="Trazer para frente" onClick={() => reorder(selected.id, 1)}>↑</button><button type="button" className="design-icon-button danger" aria-label="Remover elemento" title="Remover elemento" onClick={() => { commit(elements.filter(element => element.id !== selected.id)); setSelectedId(""); }}>×</button></div></div>
        {selected.type === "text" ? <>
          <label className="design-field design-field-full">Texto<textarea rows={3} value={getDesignElementText(selected, event)} onChange={e => update(selected.id, { text: e.target.value, sourceField: undefined })}/></label>
          <div className="design-field-row"><label className="design-field">Fonte<select value={selected.fontFamily || "Georgia"} onChange={e => update(selected.id, { fontFamily: e.target.value })}>{fontChoices.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label className="design-field">Alinhamento<select value={selected.align || "center"} onChange={e => update(selected.id, { align: e.target.value as InviteDesignElement["align"] })}><option value="left">Esquerda</option><option value="center">Centro</option><option value="right">Direita</option></select></label></div>
          <label className="design-field design-range">Tamanho da letra <strong>{selected.fontSize || 24}px</strong><input type="range" min="10" max="72" value={selected.fontSize || 24} onChange={e => update(selected.id, { fontSize: Number(e.target.value) })}/></label>
        </> : <label className="design-field design-field-full">Trocar imagem<input type="file" accept="image/*" onChange={e => { const file = e.target.files?.[0]; if (file) void readImage(file).then(image => update(selected.id, { image })).catch(error => setImageError(error instanceof Error ? error.message : "Não foi possível carregar essa imagem.")); e.currentTarget.value = ""; }}/></label>}
        <label className="design-field design-range">Largura do elemento <strong>{Math.round(selected.width)}%</strong><input type="range" min="10" max="95" value={selected.width} onChange={e => update(selected.id, { width: Number(e.target.value) })}/></label>
        <div className="design-position-fields"><label className="design-field">Posição horizontal<input type="number" min="0" max="100" value={Math.round(selected.x)} onChange={e => update(selected.id, { x: Math.max(0, Math.min(100, Number(e.target.value))) })}/></label><label className="design-field">Posição vertical<input type="number" min="0" max="100" value={Math.round(selected.y)} onChange={e => update(selected.id, { y: Math.max(0, Math.min(100, Number(e.target.value))) })}/></label></div>
        {selected.type === "text" && <label className="design-color-field"><span>Cor da letra</span><input type="color" value={selected.color || event.primaryColor} onChange={e => update(selected.id, { color: e.target.value })}/></label>}
        {selected.type === "text" && <label className="design-check"><input type="checkbox" checked={Boolean(selected.backgroundColor)} onChange={e => update(selected.id, { backgroundColor: e.target.checked ? "#fffaf0" : undefined })}/> Exibir quadro atrás do texto</label>}
        {selected.type === "text" && selected.backgroundColor && <><label className="design-color-field"><span>Cor do quadro</span><input type="color" value={selected.backgroundColor} onChange={e => update(selected.id, { backgroundColor: e.target.value })}/></label><label className="design-range">Arredondamento do quadro <strong>{selected.borderRadius || 0}px</strong><input type="range" min="0" max="32" value={selected.borderRadius || 0} onChange={e => update(selected.id, { borderRadius: Number(e.target.value) })}/></label></>}
        <label className="design-check"><input type="checkbox" checked={Boolean(selected.borderColor)} onChange={e => update(selected.id, { borderColor: e.target.checked ? event.primaryColor : undefined })}/> Exibir moldura no elemento</label>
        {selected.borderColor && <label className="design-color-field"><span>Cor da moldura</span><input type="color" value={selected.borderColor} onChange={e => update(selected.id, { borderColor: e.target.value })}/></label>}
      </div> : <div className="design-empty-selection">Selecione um elemento no convite para ajustar fonte, cor, tamanho e posição.</div>}
      <div className="design-layer-list"><strong>Camadas</strong>{elements.map((element, index) => <button type="button" key={element.id} className={element.id === selectedId ? "active" : ""} onClick={() => setSelectedId(element.id)}><span>{element.type === "image" ? "▧" : "T"}</span>{element.type === "image" ? `Imagem ${index + 1}` : getDesignElementText(element, event).slice(0, 27) || "Texto sem conteúdo"}</button>)}</div>
    </aside>}
    <div className="design-stage-wrap">
      {editable && <div className="design-stage-help">Prévia interativa <span>Arraste os textos e imagens para mover</span></div>}
      <article ref={stageRef} className={`design-stage ${editable ? "editing" : "public-invitation-card"}`} onPointerMove={drag} onPointerUp={() => { dragging.current = null; }} onPointerCancel={() => { dragging.current = null; }} style={{ maxWidth: device === "mobile" ? 390 : 720, backgroundColor: event.backgroundColor, backgroundImage: event.cover ? `linear-gradient(#18231d55,#18231d55),url("${event.cover}")` : undefined, borderColor: `${event.primaryColor}55` }}>
        {elements.map(element => <div key={element.id} className={`design-element ${element.type === "image" ? "image-element" : "text-element"} ${editable && selectedId === element.id ? "selected" : ""}`} onPointerDown={e => startDrag(element, e)} onClick={() => editable && setSelectedId(element.id)} onKeyDown={e => { if (!editable) return; const delta = e.shiftKey ? 5 : 1; const next = { ...element }; if (e.key === "ArrowLeft") next.x = Math.max(0, next.x - delta); else if (e.key === "ArrowRight") next.x = Math.min(100, next.x + delta); else if (e.key === "ArrowUp") next.y = Math.max(0, next.y - delta); else if (e.key === "ArrowDown") next.y = Math.min(100, next.y + delta); else return; e.preventDefault(); update(element.id, { x: next.x, y: next.y }); }} role={editable ? "button" : undefined} tabIndex={editable ? 0 : undefined} aria-label={editable ? `${element.type === "image" ? "Imagem" : "Texto"}: ${element.type === "text" ? getDesignElementText(element, event) : "arraste para posicionar"}` : undefined} style={{ left: `${element.x}%`, top: `${element.y}%`, width: `${element.width}%`, fontFamily: element.fontFamily || undefined, fontSize: element.fontSize ? `${element.fontSize}px` : undefined, color: element.color || undefined, textAlign: element.align || "center", backgroundColor: element.backgroundColor || "transparent", border: element.borderColor ? `1px solid ${element.borderColor}` : "1px solid transparent", borderRadius: element.borderRadius || 0 }}>
          {element.type === "image" ? <img src={element.image} alt="" draggable={false}/> : getDesignElementText(element, event)}
        </div>)}
        {editable && !elements.length && <div className="design-empty-canvas">Adicione um texto ou uma imagem para começar.</div>}
      </article>
      {editable && <p className="design-keyboard-hint">Dica: use as setas do teclado para mover o elemento selecionado com precisão.</p>}
    </div>
  </div>;
}
