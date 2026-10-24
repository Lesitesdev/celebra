"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { ArrowLeft, PartyPopper, Sparkles } from "lucide-react";

type AccountType = "INDIVIDUAL" | "BUFFET";
type AuthResult = { accessToken: string; user: { fullName: string }; accounts: { accountId: string; accountType: AccountType; accountName: string }[] };
const API_URL = (process.env.NEXT_PUBLIC_CELEBRA_API_URL || "http://localhost:8080").replace(/\/$/, "");
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

async function readResponse(response: Response) {
  const raw = await response.text();
  try { return raw ? JSON.parse(raw) : {}; }
  catch { return {}; }
}

function readableConnectionError(error: unknown) {
  if (error instanceof TypeError) return "Não foi possível conectar à API do Celebra. Inicie o backend na porta 8080 e tente novamente.";
  return error instanceof Error ? error.message : "Ocorreu um erro inesperado. Tente novamente.";
}

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [accountType, setAccountType] = useState<AccountType>("INDIVIDUAL");
  const [busy, setBusy] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !googleReady || !window.google?.accounts?.id) return;
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response) => { void submitGoogle(response.credential); },
    });
    const button = document.getElementById("google-signin-button");
    if (button) { button.replaceChildren(); window.google.accounts.id.renderButton(button, { theme: "outline", size: "large", shape: "pill", text: mode === "register" ? "signup_with" : "signin_with", width: Math.min(360, button.clientWidth || 360), locale: "pt_BR" }); }
  }, [mode, googleReady]);

  async function finishLogin(result: AuthResult) {
    localStorage.setItem("celebra.auth.token", result.accessToken);
    localStorage.setItem("celebra.auth.user", JSON.stringify(result.user));
    localStorage.setItem("celebra.auth.accounts", JSON.stringify(result.accounts));
    window.location.assign(new URLSearchParams(window.location.search).get("next") === "/admin" ? "/admin" : "/painel");
  }

  async function submitGoogle(credential: string) {
    setBusy(true); setError(""); setNotice("");
    try {
      const response = await fetch(`${API_URL}/api/auth/google`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ credential }) });
      const data = await readResponse(response);
      if (!response.ok) throw new Error(data.message || data.detail || "Não foi possível entrar com Google.");
      await finishLogin(data);
    } catch (e) { setError(readableConnectionError(e)); setBusy(false); }
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    const values = new FormData(event.currentTarget);
    const password = String(values.get("password") || "");
    if (mode === "register" && password.length < 12) {
      setError("Sua senha precisa ter pelo menos 12 caracteres.");
      setBusy(false);
      return;
    }
    const body = mode === "login"
      ? { email: values.get("email"), password }
      : { email: values.get("email"), password, fullName: values.get("fullName"), accountType, accountName: values.get("accountName") || values.get("fullName") };
    try {
      const response = await fetch(`${API_URL}/api/auth/${mode === "login" ? "login" : "register"}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await readResponse(response);
      if (!response.ok) throw new Error(data.message || data.detail || "Não foi possível concluir. Confira seus dados e tente novamente.");
      await finishLogin(data);
    } catch (e) { setError(readableConnectionError(e)); setBusy(false); }
  }

  return <main className="auth-page">
    {GOOGLE_CLIENT_ID && <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onReady={() => setGoogleReady(true)} />}
    <section className="auth-story">
      <Link href="/" className="logo">celebra<span>.</span></Link>
      <div className="auth-story-copy"><div className="auth-sparkles"><Sparkles size={17} /> Celebre cada momento</div><h1 className="serif">Seu próximo grande momento começa aqui.</h1><p>Crie convites com a sua cara e organize cada detalhe da comemoração em um só lugar.</p><div className="auth-party-art"><div className="auth-orbit orbit-one"/><div className="auth-orbit orbit-two"/><div className="auth-party-icon"><PartyPopper size={42}/></div><span className="auth-confetti confetti-one">✦</span><span className="auth-confetti confetti-two">✧</span><span className="auth-confetti confetti-three">●</span><span className="auth-confetti confetti-four">✦</span></div></div>
      <span className="auth-story-foot">Convites digitais feitos para celebrar ✨</span>
    </section>
    <section className="auth-main"><div className="auth-panel">
      <Link href="/" className="auth-back"><ArrowLeft size={16}/> Voltar ao site</Link>
      <div className="auth-heading"><span className="auth-heading-icon"><Sparkles size={19}/></span><h2 className="serif">{mode === "login" ? "Que bom ter você de volta!" : "Vamos criar sua conta?"}</h2><p>{mode === "login" ? "Entre e continue planejando momentos especiais." : "É rapidinho. Depois, é só começar a celebrar."}</p></div>
      <div className="auth-tabs"><button type="button" className={mode === "login" ? "active" : ""} onClick={() => { setMode("login"); setError(""); }}>Entrar</button><button type="button" className={mode === "register" ? "active" : ""} onClick={() => { setMode("register"); setError(""); }}>Criar conta</button></div>
      {GOOGLE_CLIENT_ID ? <div className="google-wrap"><div id="google-signin-button"/><span>ou use seu e-mail</span></div> : <div className="auth-info">O acesso com Google será ativado quando o cliente OAuth for configurado.</div>}
      <form ref={form} onSubmit={submitForm} className="auth-form">
        {mode === "register" && <>
          <div className="field"><label htmlFor="fullName">Seu nome</label><input id="fullName" name="fullName" autoComplete="name" placeholder="Como podemos te chamar?" required maxLength={160}/></div>
          <div className="field"><label>Como você vai usar o Celebra?</label><div className="account-choices"><button type="button" className={accountType === "INDIVIDUAL" ? "selected" : ""} onClick={() => setAccountType("INDIVIDUAL")}><span>🎉</span><strong>Para mim</strong><small>Vou criar meus convites</small></button><button type="button" className={accountType === "BUFFET" ? "selected" : ""} onClick={() => setAccountType("BUFFET")}><span>🏛️</span><strong>Sou buffet</strong><small>Vou criar convites para clientes</small></button></div></div>
          {accountType === "BUFFET" && <div className="field"><label htmlFor="accountName">Nome do buffet</label><input id="accountName" name="accountName" placeholder="Ex.: Buffet Jardim" required maxLength={180}/></div>}
        </>}
        <div className="field"><label htmlFor="email">E-mail</label><input id="email" name="email" type="email" autoComplete="email" placeholder="voce@exemplo.com" required maxLength={320}/></div>
        <div className="field"><label htmlFor="password">Senha</label><input id="password" name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder={mode === "login" ? "Sua senha" : "Pelo menos 12 caracteres"} required minLength={mode === "login" ? 1 : 12} maxLength={100}/>{mode === "register" && <small className="auth-hint">Use pelo menos 12 caracteres.</small>}</div>
        {error && <div className="auth-error" role="alert">{error}</div>}{notice && <div className="auth-info" role="status">{notice}</div>}
        <button className="btn btn-primary auth-submit" type="submit" disabled={busy}>{busy ? "Só um instante…" : mode === "login" ? "Entrar na minha conta" : "Criar minha conta"}<span>→</span></button>
      </form>
      <p className="auth-terms">Ao continuar, você concorda com nossos <Link href="/">termos de uso</Link> e <Link href="/">política de privacidade</Link>.</p>
    </div></section>
  </main>;
}

declare global {
  interface Window { google?: { accounts: { id: { initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void; renderButton: (element: HTMLElement, options: Record<string, string | number>) => void } } } }
}
