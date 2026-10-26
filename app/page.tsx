import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import HeroModelCarousel from "@/components/HeroModelCarousel";
import { Gift, MapPin, Share2, Smartphone, Users } from "lucide-react";

export default function HomePage() {
 return <>
  <SiteHeader />
  <main>
   <section className="hero"><div className="container hero-grid"><HeroModelCarousel /></div></section>
   <section className="section" id="como-funciona"><div className="container"><div className="eyebrow">Simples como deve ser</div><h2 className="serif">Do primeiro clique à celebração perfeita.</h2><p className="muted" style={{maxWidth:570,lineHeight:1.7}}>Crie seu convite, compartilhe com seus convidados e acompanhe tudo em um só lugar.</p>
    <div className="steps-grid" style={{marginTop:34}}>{[
     {n:"01",t:"Crie seu convite personalizado",d:"Escolha um modelo, adicione fotos, nomes, data, horário e local. Edite os detalhes para deixar tudo com a sua cara.",Icon:Smartphone},
     {n:"02",t:"Salve e compartilhe",d:"Publique seu convite e envie o link pelo WhatsApp para amigos e familiares. Simples, rápido e sem precisar imprimir.",Icon:Share2},
     {n:"03",t:"Acompanhe as confirmações",d:"Veja quem confirmou presença, quem não poderá comparecer e quantas pessoas estarão no evento, tudo em um só painel.",Icon:Users},
     {n:"04",t:"Receba presentes e contribuições",d:"Monte sua lista de presentes, compartilhe com os convidados e acompanhe as contribuições. Consulte as condições e os prazos de recebimento do meio de pagamento escolhido.",Icon:Gift},
    ].map(({n,t,d,Icon})=><article className="card step-card" key={n}><div className="step-card-heading"><div className="step-num">{n}</div><span className="step-icon"><Icon size={20} aria-hidden="true"/></span></div><h3 style={{fontSize:18,margin:"0 0 10px"}}>{t}</h3><p className="muted" style={{lineHeight:1.7,fontSize:14,margin:0}}>{d}</p></article>)}</div>
   </div></section>

   <section className="section benefits-section"><div className="container"><div className="eyebrow">Celebra do seu jeito</div><h2 className="serif">Muito mais que um convite digital.</h2>
    <div className="benefits-grid" style={{marginTop:28}}>{[
     {t:"Tudo online",d:"Seus convidados acessam pelo celular, sem instalar aplicativos.",Icon:Smartphone},
     {t:"Presenças organizadas",d:"Acompanhe as respostas sem depender de mensagens dispersas.",Icon:Users},
     {t:"Localização fácil",d:"Compartilhe o endereço e facilite a chegada dos convidados.",Icon:MapPin},
     {t:"Lista de presentes",d:"Permita que os convidados escolham presentes ou façam contribuições, conforme os recursos disponíveis.",Icon:Gift},
    ].map(({t,d,Icon})=><article className="card benefit-card" key={t}><span className="benefit-icon"><Icon size={21} aria-hidden="true"/></span><h3>{t}</h3><p className="muted">{d}</p></article>)}</div>
   </div></section>

   <section className="section"><div className="container" style={{textAlign:"center",maxWidth:680}}><div className="eyebrow">Sua próxima celebração começa aqui</div><h2 className="serif">Um convite bonito. Uma organização mais leve.</h2><p className="muted" style={{lineHeight:1.8}}>Explore a demonstração do Celebra e descubra como seu evento pode ganhar vida.</p><Link href="/entrar" className="btn btn-primary" style={{marginTop:15}}>Conhecer a plataforma →</Link></div></section>
  </main>
  <footer className="footer"><div className="container" style={{display:"flex",justifyContent:"space-between",gap:20,flexWrap:"wrap"}}><span className="logo">celebra<span>.</span></span><span>Uma demonstração de convites digitais · 2026</span><Link href="/entrar">Acessar demonstração</Link></div></footer>
 </>;
}
