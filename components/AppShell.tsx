"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AccountActions from "@/components/AccountActions";
export default function AppShell({children}:{children:React.ReactNode}) {
 const path=usePathname();
 const links=[["/painel","Visão geral"],["/painel/eventos","Meus eventos"],["/painel/eventos/novo","Criar evento"],["/modelos","Modelos de convites"]];
 return <div className="app-shell"><header className="app-header"><Link href="/painel" className="logo" style={{fontSize:27}}>celebra<span>.</span></Link><div className="app-header-actions"><AccountActions/><Link href="/" className="btn btn-light app-header-site-link">Ver site</Link></div></header>
  <div className="app-body"><aside className="sidebar">{links.map(([href,label])=><Link key={href} href={href} className={`side-link ${path===href?"active":""}`}>{label}</Link>)}<div style={{margin:"24px 12px 0",fontSize:11,color:"#9aa39a",lineHeight:1.5}}>CELEBRA · MVP FRONTEND<br/>Seus dados ficam neste navegador.</div></aside><main className="app-main">{children}</main></div>
 </div>;
}
