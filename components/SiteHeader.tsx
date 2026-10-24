import Link from "next/link";
export default function SiteHeader() {
 return <header className="site-header"><div className="container" style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:20}}>
  <Link href="/" className="logo">celebra<span>.</span></Link>
  <nav style={{display:"flex",alignItems:"center",gap:26,fontWeight:600}}>
   <Link href="/modelos">Modelos</Link><a href="/#como-funciona">Como funciona</a><Link href="/entrar" className="btn btn-light" style={{padding:"9px 17px"}}>Entrar</Link>
  </nav>
 </div></header>;
}
