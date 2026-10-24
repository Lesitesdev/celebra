"use client";

const COLORS = [
  { name: "Vinho", value: "#913c58" },
  { name: "Rosa", value: "#c34e6b" },
  { name: "Coral", value: "#e57e8f" },
  { name: "Pêssego", value: "#f2b49b" },
  { name: "Laranja", value: "#e39c35" },
  { name: "Amarelo", value: "#f5c95f" },
  { name: "Lilás", value: "#9b83c9" },
  { name: "Roxo", value: "#705891" },
  { name: "Azul", value: "#5a77a8" },
  { name: "Turquesa", value: "#4c9d91" },
  { name: "Verde", value: "#6f8f58" },
  { name: "Verde escuro", value: "#345e52" },
  { name: "Marrom", value: "#76584a" },
  { name: "Grafite", value: "#3f4654" },
  { name: "Creme", value: "#fff8ef" },
  { name: "Branco", value: "#ffffff" },
];

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export default function ColorSwatches({ label, value, onChange }: Props) {
  const selectedColor = value.toLowerCase();
  const isPreset = COLORS.some(color => color.value === selectedColor);

  return <div className="color-swatches-field">
    <div className="color-swatches-heading"><span>{label}</span><code>{value.toUpperCase()}</code></div>
    <div className="color-swatches" role="group" aria-label={label}>
      {COLORS.map(color => <button key={color.value} type="button" className="color-swatch" style={{ backgroundColor: color.value }} title={color.name} aria-label={`${color.name} ${color.value}`} aria-pressed={selectedColor === color.value} onClick={() => onChange(color.value)}>
        {selectedColor === color.value && <span className="color-swatch-check" aria-hidden="true">✓</span>}
      </button>)}
      <label className={`color-swatch color-swatch-custom ${!isPreset ? "is-selected" : ""}`} title="Escolher outra cor" aria-label="Escolher outra cor">
        <span aria-hidden="true">＋</span>
        <input type="color" value={value} onChange={event => onChange(event.target.value)} aria-label={`Escolher outra cor para ${label}`} />
      </label>
    </div>
  </div>;
}
