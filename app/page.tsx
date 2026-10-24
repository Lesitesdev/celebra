import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import HeroModelCarousel from "@/components/HeroModelCarousel";

export default function HomePage() {
 return <>
  <SiteHeader />
  <main>
   <section className="hero"><div className="container hero-grid">
    <div><div className="eyebrow">Momentos únicos merecem ser celebrados</div><h1 className="serif">Seu evento merece um convite <em style={{color:"#647d68"}}>especial.</em></h1>
     <p>Crie convites digitais personalizados, compartilhe com seus convidados e acompanhe as confirmações em um só lugar.</p>
     <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:28}}><Link href="/entrar" className="btn btn-primary">Criar convite grátis →</Link><Link href="/modelos" className="btn btn-light">Ver modelos</Link></div>
     <div style={{display:"flex",gap:18,marginTop:28,fontSize:12,color:"#758178"}}><span>✓ Fácil de personalizar</span><span>✓ Compartilhe por link</span></div>
    </div>
    <HeroModelCarousel />
   </div></section>
   <section className="section" id="como-funciona"><div className="container"><div className="eyebrow">Simples como deve ser</div><h2 className="serif">Do primeiro clique à<br/>confirmação de presença.</h2><p className="muted" style={{maxWidth:570,lineHeight:1.7}}>Tudo o que você precisa para convidar, organizar e celebrar — em uma experiência só.</p>
    <div className="steps-grid" style={{marginTop:34}}>{[{n:"01",t:"Escolha seu modelo",d:"Encontre um estilo que combine com o seu evento."},{n:"02",t:"Personalize do seu jeito",d:"Adicione nomes, data, local, cores e sua mensagem."},{n:"03",t:"Compartilhe e acompanhe",d:"Envie o link e acompanhe as confirmações no painel."}].map(x=><article className="card step-card" key={x.n}><div className="step-num">{x.n}</div><h3 style={{fontSize:18,margin:"0 0 10px"}}>{x.t}</h3><p className="muted" style={{lineHeight:1.7,fontSize:14,margin:0}}>{x.d}</p></article>)}</div>
   </div></section>

   <section className="section"><div className="container" style={{textAlign:"center",maxWidth:680}}><div className="eyebrow">Sua próxima celebração começa aqui</div><h2 className="serif">Um convite bonito. Uma organização mais leve.</h2><p className="muted" style={{lineHeight:1.8}}>Explore a demonstração do Celebra e descubra como seu evento pode ganhar vida.</p><Link href="/entrar" className="btn btn-primary" style={{marginTop:15}}>Conhecer a plataforma →</Link></div></section>
  </main>
  <footer className="footer"><div className="container" style={{display:"flex",justifyContent:"space-between",gap:20,flexWrap:"wrap"}}><span className="logo">celebra<span>.</span></span><span>Uma demonstração de convites digitais · 2026</span><Link href="/entrar">Acessar demonstração</Link></div></footer>
 </>;
}
