"use client";
import { useState } from "react";
import Link from "next/link";
export default function LoginPage() {
 const [email,setEmail]=useState("demo@celebra.com"); const [password,setPassword]=useState("celebra123"); const [error,setError]=useState("");
 function enter(e:React.FormEvent){e.preventDefault();if(!email.includes("@")||password.length<4){setError("Informe um e-mail válido e uma senha com pelo menos 4 caracteres.");return;}window.location.href="/painel";}
 return <main style={{minHeight:"100vh",display:"grid",gridTemplateColumns:"1fr 1fr"}}>
  <section style={{background:"#e7eee2",display:"flex",flexDirection:"column",justifyContent:"space-between",padding:38}}><Link href="/" className="logo">celebra<span>.</span></Link><div style={{maxWidth:460,margin:"auto"}}><div className="eyebrow">Um jeito mais leve de organizar</div><h1 className="serif" style={{fontSize:48,lineHeight:1.1}}>Toda grande história começa com um convite.</h1><p className="muted" style={{lineHeight:1.8}}>Crie algo especial e deixe o Celebra ajudar você a cuidar dos detalhes.</p></div><p className="muted" style={{fontSize:12}}>Demonstração de produto · Acesso não seguro</p></section>
  <section style={{display:"grid",placeItems:"center",padding:24}}><form onSubmit={enter} className="card" style={{padding:32,width:"min(420px,100%)",boxShadow:"none",border:0}}><Link href="/" style={{fontSize:13,color:"#647d68"}}>← Voltar ao site</Link><h2 className="serif" style={{fontSize:34,margin:"22px 0 8px"}}>Bem-vindo!</h2><p className="muted" style={{marginBottom:28}}>Entre para explorar a demonstração do Celebra.</p>
   <div className="field"><label>E-mail</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></div><div className="field"><label>Senha</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={4}/></div>
   {error&&<p style={{color:"#b42318",fontSize:13}}>{error}</p>}<button className="btn btn-primary" style={{width:"100%",marginTop:8}} type="submit">Acessar demonstração →</button><div className="notice" style={{marginTop:18}}>Acesso demonstrativo: os campos vêm preenchidos. Não há autenticação real nem conta de usuário.</div>
  </form></section>
 </main>;
}
