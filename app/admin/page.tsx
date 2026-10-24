"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight, Building2, CalendarDays, CircleDollarSign, CreditCard, LayoutDashboard,
  LifeBuoy, LogOut, Search, ShieldCheck, Ticket, Users,
} from "lucide-react";

const API_URL = (process.env.NEXT_PUBLIC_CELEBRA_API_URL || "http://localhost:8080").replace(/\/$/, "");
type Overview = { registeredUsers: number; buffetAccounts: number; individualAccounts: number; totalInvitations: number; publishedInvitations: number; draftInvitations: number };
type Account = { accountId: string; accountType: "BUFFET" | "INDIVIDUAL"; accountName: string; ownerName: string; ownerEmail: string; memberCount: number; invitationCount: number; publishedInvitationCount: number; createdAt: string };
type MenuKey = "overview" | "accounts" | "invitations" | "credits" | "payments" | "support";
type LoadState = "loading" | "ready" | "login" | "forbidden" | "error";

const menu: { id: MenuKey; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Visão geral", icon: LayoutDashboard },
  { id: "accounts", label: "Contas", icon: Building2 },
  { id: "invitations", label: "Convites", icon: Ticket },
  { id: "credits", label: "Planos e créditos", icon: CircleDollarSign },
  { id: "payments", label: "Pagamentos", icon: CreditCard },
  { id: "support", label: "Suporte", icon: LifeBuoy },
];

export default function AdminPage() {
  const [state, setState] = useState<LoadState>("loading");
  const [token, setToken] = useState("");
  const [overview, setOverview] = useState<Overview | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [active, setActive] = useState<MenuKey>("overview");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem("celebra.auth.token");
    if (!savedToken) { setState("login"); return; }
    setToken(savedToken);
    void loadAdminData(savedToken);
  }, []);

  async function loadAdminData(accessToken: string) {
    setState("loading");
    try {
      const headers = { Authorization: `Bearer ${accessToken}` };
      const [overviewResponse, accountsResponse] = await Promise.all([
        fetch(`${API_URL}/api/admin/overview`, { headers, cache: "no-store" }),
        fetch(`${API_URL}/api/admin/accounts`, { headers, cache: "no-store" }),
      ]);
      if (overviewResponse.status === 401 || accountsResponse.status === 401) { setState("login"); return; }
      if (overviewResponse.status === 403 || accountsResponse.status === 403) { setState("forbidden"); return; }
      if (!overviewResponse.ok || !accountsResponse.ok) throw new Error("Não foi possível carregar os dados administrativos.");
      setOverview(await overviewResponse.json());
      setAccounts(await accountsResponse.json());
      setState("ready");
    } catch { setState("error"); }
  }

  const filteredAccounts = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt-BR");
    if (!term) return accounts;
    return accounts.filter(account => `${account.accountName} ${account.ownerName || ""} ${account.ownerEmail || ""}`.toLocaleLowerCase("pt-BR").includes(term));
  }, [accounts, search]);

  function logout() {
    localStorage.removeItem("celebra.auth.token");
    localStorage.removeItem("celebra.auth.user");
    localStorage.removeItem("celebra.auth.accounts");
    window.location.assign("/entrar?next=%2Fadmin");
  }

  if (state === "loading") return <main className="admin-state"><div className="admin-state-card"><span className="admin-brand">celebra<span>.</span></span><p>Carregando painel da plataforma…</p></div></main>;
  if (state === "login") return <main className="admin-state"><section className="card admin-state-card"><span className="admin-state-icon"><ShieldCheck size={24}/></span><h1 className="serif">Acesso administrativo</h1><p>Entre com sua conta Celebra autorizada para administrar a plataforma.</p><Link href="/entrar?next=%2Fadmin" className="btn btn-primary">Entrar na conta <ArrowRight size={17}/></Link><Link href="/" className="admin-back-link">Voltar ao site</Link></section></main>;
  if (state === "forbidden") return <main className="admin-state"><section className="card admin-state-card"><span className="admin-state-icon"><ShieldCheck size={24}/></span><h1 className="serif">Esta conta não é administradora</h1><p>O usuário conectado não está autorizado para ver dados de toda a plataforma.</p><div className="admin-access-help"><strong>Como liberar o acesso</strong><span>Adicione o e-mail da sua conta a <code>CELEBRA_PLATFORM_ADMIN_EMAILS</code> no ambiente do backend e reinicie a API. Mais de um e-mail pode ser separado por vírgulas.</span></div><button type="button" className="btn btn-light" onClick={logout}>Sair e trocar de conta</button></section></main>;
  if (state === "error") return <main className="admin-state"><section className="card admin-state-card"><span className="admin-state-icon"><ShieldCheck size={24}/></span><h1 className="serif">Não foi possível carregar o painel</h1><p>Confira se a API está ativa e tente novamente.</p><button className="btn btn-primary" onClick={() => void loadAdminData(token)}>Tentar novamente</button><Link href="/painel" className="admin-back-link">Voltar ao painel de convites</Link></section></main>;

  return <main className="admin-shell">
    <aside className="admin-sidebar">
      <Link href="/" className="admin-brand">celebra<span>.</span></Link>
      <div className="admin-sidebar-label">ADMINISTRAÇÃO</div>
      <nav aria-label="Administração da plataforma">{menu.map(item => { const Icon = item.icon; return <button type="button" key={item.id} className={`admin-nav-item ${active === item.id ? "active" : ""}`} onClick={() => setActive(item.id)}><Icon size={18}/><span>{item.label}</span>{item.id === "credits" || item.id === "payments" ? <span className="admin-nav-soon">breve</span> : null}</button>; })}</nav>
      <div className="admin-sidebar-bottom"><div className="admin-role"><span><ShieldCheck size={18}/></span><div><strong>Admin da plataforma</strong><small>Acesso global autorizado</small></div></div><button className="admin-logout" onClick={logout}><LogOut size={17}/> Sair</button></div>
    </aside>
    <section className="admin-content">
      <header className="admin-topbar"><div><span className="admin-mobile-brand">celebra<span>.</span></span><span className="admin-topbar-kicker">Painel interno</span><strong>Administração da plataforma</strong></div><button className="admin-top-logout" onClick={logout}><LogOut size={17}/> Sair</button></header>
      <div className="admin-page-content">
        {active === "overview" && <>
          <div className="admin-page-heading"><div><div className="eyebrow">CENTRAL DO CELEBRA</div><h1 className="serif">Visão geral</h1><p>Acompanhe as contas e os convites em toda a plataforma.</p></div><span className="admin-live"><i/> Dados atualizados</span></div>
          <div className="admin-metrics">
            <Metric icon={Users} label="Usuários cadastrados" value={overview?.registeredUsers ?? 0} tone="rose"/>
            <Metric icon={Building2} label="Buffets" value={overview?.buffetAccounts ?? 0} tone="lavender"/>
            <Metric icon={CalendarDays} label="Contas individuais" value={overview?.individualAccounts ?? 0} tone="gold"/>
            <Metric icon={Ticket} label="Convites publicados" value={overview?.publishedInvitations ?? 0} tone="green"/>
          </div>
          <div className="admin-overview-grid"><section className="card admin-panel-card"><div className="admin-panel-heading"><div><h2>Contas recentes</h2><p>Buffets e usuários da plataforma</p></div><button onClick={() => setActive("accounts")} className="admin-text-button">Ver todas <ArrowRight size={16}/></button></div>{accounts.length ? <div className="admin-recent-list">{accounts.slice(0,5).map(account => <AccountItem key={account.accountId} account={account}/>)}</div> : <EmptyState text="Nenhuma conta cadastrada ainda."/>}</section>
            <section className="card admin-panel-card admin-invite-summary"><div className="admin-panel-heading"><div><h2>Convites</h2><p>Atividade atual</p></div><span className="admin-summary-icon"><Ticket size={18}/></span></div><div className="admin-summary-number">{overview?.totalInvitations ?? 0}</div><span className="admin-summary-label">convites criados</span><div className="admin-progress-row"><span>Publicados</span><strong>{overview?.publishedInvitations ?? 0}</strong></div><div className="admin-progress"><span style={{width:`${overview?.totalInvitations ? (overview.publishedInvitations / overview.totalInvitations) * 100 : 0}%`}}/></div><div className="admin-progress-row"><span>Rascunhos</span><strong>{overview?.draftInvitations ?? 0}</strong></div><button onClick={() => setActive("invitations")} className="admin-text-button">Acompanhar convites <ArrowRight size={16}/></button></section>
          </div>
          <section className="admin-next-step"><span><CircleDollarSign size={20}/></span><div><strong>Créditos e pagamentos</strong><p>O controle financeiro aparece aqui quando os pacotes e a integração de pagamentos forem ativados.</p></div><span className="admin-coming-label">Próxima etapa</span></section>
        </>}
        {active === "accounts" && <><div className="admin-page-heading"><div><div className="eyebrow">CLIENTES DA PLATAFORMA</div><h1 className="serif">Contas</h1><p>Consulte os buffets e os usuários individuais cadastrados.</p></div><span className="admin-count-badge">{accounts.length} contas</span></div><label className="admin-search"><Search size={18}/><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar por conta, responsável ou e-mail"/><kbd>⌕</kbd></label>{filteredAccounts.length ? <div className="admin-account-list">{filteredAccounts.map(account => <AccountItem key={account.accountId} account={account} detailed/> )}</div> : <section className="card admin-empty-card"><EmptyState text="Nenhuma conta corresponde à busca."/></section>}</>}
        {active === "invitations" && <><div className="admin-page-heading"><div><div className="eyebrow">CONTEÚDO</div><h1 className="serif">Convites</h1><p>Volume de convites por conta. O painel ainda não permite editar conteúdo dos clientes.</p></div></div><div className="admin-invite-cards"><Metric icon={Ticket} label="Total criados" value={overview?.totalInvitations ?? 0} tone="rose"/><Metric icon={CalendarDays} label="Publicados" value={overview?.publishedInvitations ?? 0} tone="green"/><Metric icon={CalendarDays} label="Rascunhos" value={overview?.draftInvitations ?? 0} tone="gold"/></div><section className="card admin-panel-card"><div className="admin-panel-heading"><div><h2>Convites por conta</h2><p>Resumo de uso</p></div></div>{accounts.length ? <div className="admin-recent-list">{accounts.filter(account => account.invitationCount > 0).map(account => <AccountItem key={account.accountId} account={account} detailed/> )}</div> : <EmptyState text="Ainda não há convites cadastrados."/>}</section></>}
        {(active === "credits" || active === "payments" || active === "support") && <ComingSoon section={active}/>}
        <footer className="admin-footer">Celebra · Administração interna <span>Os dados pessoais são visíveis apenas para contas autorizadas.</span></footer>
      </div>
    </section>
  </main>;
}

function Metric({ icon: Icon, label, value, tone }: { icon: typeof Users; label: string; value: number; tone: string }) {
  return <article className="card admin-metric"><span className={`admin-metric-icon ${tone}`}><Icon size={20}/></span><span className="admin-metric-label">{label}</span><strong>{value.toLocaleString("pt-BR")}</strong></article>;
}

function AccountItem({ account, detailed = false }: { account: Account; detailed?: boolean }) {
  const isBuffet = account.accountType === "BUFFET";
  return <article className={`admin-account-item ${detailed ? "detailed" : ""}`}><div className="admin-account-main"><span className={`admin-account-icon ${isBuffet ? "buffet" : "individual"}`}>{isBuffet ? <Building2 size={19}/> : <Users size={19}/>}</span><div className="admin-account-name"><strong>{account.accountName}</strong><span>{account.ownerName || "Responsável não informado"}{account.ownerEmail ? ` · ${account.ownerEmail}` : ""}</span></div><span className={`admin-type-badge ${isBuffet ? "buffet" : "individual"}`}>{isBuffet ? "Buffet" : "Individual"}</span></div><div className="admin-account-stats"><div><strong>{account.memberCount}</strong><span>{account.memberCount === 1 ? "membro" : "membros"}</span></div><div><strong>{account.invitationCount}</strong><span>{account.invitationCount === 1 ? "convite" : "convites"}</span></div><div><strong>{account.publishedInvitationCount}</strong><span>publicados</span></div></div></article>;
}

function EmptyState({ text }: { text: string }) { return <div className="admin-empty"><span><Building2 size={22}/></span><p>{text}</p></div>; }

function ComingSoon({ section }: { section: MenuKey }) {
  const title = section === "credits" ? "Planos e créditos" : section === "payments" ? "Pagamentos" : "Suporte";
  const description = section === "credits" ? "Os pacotes de convites dos buffets e os créditos individuais serão administrados aqui." : section === "payments" ? "Pedidos, pagamentos e reembolsos aparecerão depois da integração com um provedor de pagamento." : "Ferramentas para atender contas e acompanhar solicitações serão adicionadas nesta área.";
  return <section className="card admin-coming-page"><span className="admin-coming-icon"><CircleDollarSign size={25}/></span><div className="eyebrow">ÁREA ADMINISTRATIVA</div><h1 className="serif">{title}</h1><p>{description}</p><span className="admin-coming-label">Ainda não disponível</span></section>;
}
