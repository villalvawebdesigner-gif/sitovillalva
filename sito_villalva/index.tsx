import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Menu, X, Globe, Cpu, Palette, Share2, Rocket, 
  MessageSquare, Mail, Phone, Instagram, Linkedin, 
  ChevronRight, ChevronLeft, ExternalLink, Filter, Info, User, 
  Send, Sparkles, BrainCircuit, Activity,
  Youtube, Facebook, Music, ChevronDown, ArrowRight, Loader2,
  Video, CheckCircle2, Target, Eye, Check, Calendar, Clock, ArrowLeft
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// --- Types & Constants ---
type Language = 'IT' | 'EN';
type Page = 'home' | 'blog' | 'contact' | 'services' | 'about' | 'blog-post';

interface ServiceItem {
  id: string;
  label: string;
}

interface BlogPost {
  id: number;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  readTime: string;
  content: string[];
  img: string;
}

interface Content {
  nav: { home: string; services: string; blog: string; about: string; contact: string; };
  serviceItems: ServiceItem[];
  hero: { 
    slides: { title: string; subtitle: string; }[];
  };
  webDesign: { title: string; desc: string; longDesc: string; human: string; AI: string; features: string[]; cta: string; cta_btn: string; };
  social: { title: string; desc: string; longDesc: string; features: string[]; cta: string; cta_btn: string; };
  aiSolutions: { title: string; desc: string; longDesc: string; features: string[]; cta: string; cta_btn: string; };
  about: { title: string; bio: string; skills: string[]; };
  contact: { 
    title: string; 
    subtitle: string; 
    name: string; 
    email: string; 
    message: string; 
    send: string; 
    cta_desc: string; 
    cta_button: string;
    services_label: string;
    services: { id: string; label: string; msg: string; }[];
  };
  gallery: { title: string; filterAll: string; filterWeb: string; filterSocial: string; filterAI: string; };
  cta_button: string;
  ctas: { services: string; blog: string; about: string; backToBlog: string; };
  servicesPage: { heroTitle: string; heroSubtitle: string; finalCTA: string; };
  blogPage: { heroTitle: string; heroSubtitle: string; finalCTA: string; };
  aboutPage: { 
    heroTitle: string; 
    heroSubtitle: string; 
    introTitle: string;
    introDesc: string;
    missionTitle: string;
    missionDesc: string;
    visionTitle: string;
    visionDesc: string;
    strengthsTitle: string;
    strengths: string[];
    finalCTA: string;
  };
}

const TRANSLATIONS: Record<Language, Content> = {
  IT: {
    nav: { home: 'Home', services: 'Servizi', blog: 'Blog', about: 'Chi Siamo', contact: 'Contatti' },
    serviceItems: [
      { id: 'web-design', label: 'Web Design' },
      { id: 'social-strategy', label: 'Social Strategy' },
      { id: 'ai-solutions', label: 'AI Solutions' }
    ],
    hero: { 
      slides: [
        { title: 'Web Design Antigravity & Performance', subtitle: 'Sinergia perfetta tra design strategico e performance estrema.' },
        { title: 'Integrazione Intelligenza Artificiale', subtitle: 'Ottimizzazione dei flussi di lavoro aziendali tramite soluzioni LLM avanzate.' },
        { title: 'Social Media Management & Digital Strategy', subtitle: 'Contenuti SEO-driven potenziati dall\'AI per massimizzare l\'engagement.' }
      ]
    },
    webDesign: {
      title: 'Web Design Professionale',
      desc: 'Sinergia perfetta tra design strategico e performance estrema.',
      longDesc: 'Il nostro servizio di web design professionale è focalizzato sulla creazione di siti web personalizzati che non sono solo esteticamente accattivanti, mas costruiti per convertire. Attraverso uno studio meticoloso di UX/UI design, trasformiamo la tua visione in una presenza digitale solida ed efficace. Che tu abbia bisogno di un e-commerce scalabile, di landing page ad alta conversione o di un portale aziendale complesso, garantiamo un\'ottimizzazione mobile impeccabile e performance antigravity. Utilizziamo le tecnologie più avanzate per assicurare che ogni progetto sia veloce, sicuro e pronto a scalare con il tuo business.',
      human: 'Visione creativa, strategia UI/UX su Figma/Adobe e sensibilità estetica accademica.',
      AI: 'Infrastruttura Antigravity per fluidità strutturale e server CPM per velocità e scalabilità massime.',
      features: ['Design Responsive', 'Ottimizzazione SEO', 'Infrastruttura Scalabile', 'UX Centrata sull\'Umano'],
      cta: 'Eleva il tuo business con un Web Design unico.',
      cta_btn: 'Prenota il tuo Web Design'
    },
    social: {
      title: 'Social & Content Strategy',
      desc: 'Contenuti SEO-driven potenziati dall\'AI per massimizzare l\'engagement.',
      longDesc: 'Sviluppiamo strategie digitali complete basate sulla gestione social media professionale e sulla content creation d\'impatto. In un mercato saturo, l\'advertising social e un engagement costante sono fondamentali per costruire una brand awareness duratura. Analizziamo i dati del tuo target per creare contenuti che parlino direttamente alla tua audience, potenziando la tua autorità nel settore. Dalla pianificazione editoriale alla produzione video, integriamo l\'intelligenza artificiale per prevedere i trend e massimizzare la visibilità dei tuoi canali.',
      features: ['Analisi Dati AI', 'Video Editing (After Effects/CapCut)', 'Strategie di Crescita', 'Content Planning'],
      cta: 'Domina il mercato con una Social Strategy mirata.',
      cta_btn: 'Avvia la tua Social Strategy'
    },
    aiSolutions: {
      title: 'Soluzioni AI per Business',
      desc: 'Implementazione di intelligenze artificiali nei flussi di lavoro aziendali.',
      longDesc: 'Le nostre soluzioni AI per business rappresentano il future dell\'efficienza aziendale. Implementiamo l\'intelligenza artificiale per marketing per automatizzare i processi e liberare il potenziale umano. Dall\'analisi dati AI avanzata all\'integrazione di chatbot intelligenti capaci di gestire il customer service in autonomia, aiutiamo le aziende a scalare riducendo i costi operativi. Puntiamo sulla personalizzazione dell\'esperienza utente, utilizzando algoritmi predittivi per offrire ad ogni cliente esattamente ciò di cui ha bisogno, esattamente quando ne ha bisogno.',
      features: ['Automazione Workflow', 'Integrazione LLM', 'Consulenza Strategica', 'Formazione AI'],
      cta: 'Trasforma il tuo workflow con le nostre AI Solutions.',
      cta_btn: 'Implementa le tue AI Solutions'
    },
    about: {
      title: 'Chi Siamo',
      bio: 'Siamo la mente dietro Digital Studio Villalva. Con una certificazione come Social Media Manager e un solido background in Web Graphic Design, uniamo la precisione tecnica alla visione artistica. Crediamo che l\'AI sia lo strumento definitivo per elevare il potenziale umano, not per sostituirlo.',
      skills: ['Social Media Expert', 'Web Graphic Designer', 'AI Architect']
    },
    contact: {
      title: 'Contatta il Tuo Digital Studio Villalva: Web Design, AI e Social Strategy',
      subtitle: 'Pronto a scalare il tuo business? Uniamo creatività umana e potenza computazionale per offrirti soluzioni di Web Design, gestione Social Media e integrazione AI su misura. Raccontaci la tua visione e costruiamo insieme il tuo futuro digitale.',
      cta_desc: 'Ogni grande visione parte da un dialogo. Analizziamo i tuoi obiettivi per creare una strategia su misura che unisca estetica accademica e potenza computazionale.',
      cta_button: 'Richiedi una consulenza gratuita',
      name: 'Il tuo Nome',
      email: 'La tua Email',
      message: 'Il tuo Messaggio',
      services_label: 'Di quali servizi hai bisogno?',
      services: [
        { id: 'web', label: 'Web Design', msg: 'Vorrei richiedere una consulenza per un progetto di Web Design Professionale.' },
        { id: 'social', label: 'Social Strategy', msg: 'Sono interessato a una strategia social per aumentare il mio engagement.' },
        { id: 'ai', label: 'AI Solutions', msg: 'Voglio ottimizzare i miei flussi di lavoro con soluzioni AI avanzate.' },
        { id: 'seo', label: 'SEO Optimization', msg: 'I wish to improve my positioning with SEO.' },
        { id: 'brand', label: 'Brand Identity', msg: 'Ho bisogno di una nuova Brand Identity forte e coerente.' },
        { id: 'ecommerce', label: 'E-commerce', msg: 'Voglio sviluppare un E-commerce scalabile e performante.' }
      ],
      send: 'Invia Messaggio'
    },
    gallery: {
      title: 'Insights Digitali',
      filterAll: 'Tutti',
      filterWeb: 'Web Design',
      filterSocial: 'Social Media',
      filterAI: 'AI Solutions'
    },
    cta_button: 'Consulenza',
    ctas: {
      services: 'Scopri tutti i servizi',
      blog: 'Leggi tutto il blog',
      about: 'La nostra filosofia',
      backToBlog: 'Torna al Blog'
    },
    servicesPage: {
      heroTitle: 'Servizi Digitali d\'Avanguardia',
      heroSubtitle: 'Web Design Professionale, Strategie Digitali e Soluzioni AI per il tuo Business.',
      finalCTA: 'Inizia il Tuo Progetto Oggi'
    },
    blogPage: {
      heroTitle: 'Blog Villalva: Futuro Digitale & SEO',
      heroSubtitle: 'Resta aggiornato sulle ultime tendenze di web design, strategie social e intelligenza artificiale applicata.',
      finalCTA: 'Rimani aggiornato con i nostri esperti'
    },
    aboutPage: { 
      heroTitle: 'Villalva Digital Studio', 
      heroSubtitle: 'L\'unione perfetta tra creatività umana e intelligenza artificiale per il tuo successo digitale.',
      introTitle: 'Sinergia Digitale',
      introDesc: 'Villalva Digital Studio è un\'agenzia d\'avanguardia specializzata in web design professionale e strategie social media. Nata dalla passione per l\'estetica digitale e la competenza tecnica in Adobe Suite e Figma, la nostra realtà si distingue per la capacità di unire il "Human Touch" alla "AI Power". Utilizziamo l\'intelligenza artificiale non per sostituire la creatività, ma per potenziarla, garantendo uno sviluppo web personalizzato e una brand identity unica che emoziona e converte.',
      missionTitle: 'La Nostra Missione',
      missionDesc: 'Trasformare idee in esperienze digitali coinvolgenti e di successo, fornendo soluzioni innovative e su misura che integrano perfettamente l\'intuito umano e l\'efficiency dell\'AI per un branding online d\'impatto.',
      visionTitle: 'La Nostra Visione',
      visionDesc: 'Essere il partner strategico che guida le aziende verso il successo nel mondo digitale, sfruttando l\'intelligenza artificiale per prevedere le tendenze e consolidare l\'eccellenza nel design e nella gestione social.',
      strengthsTitle: 'I Nostri Punti di Forza',
      strengths: ['Equilibrio AI-Umano: La potenza dell\'algoritmo guidata dalla sensibilità umana.', 'Competenza Tecnica: Padronanza assoluta di Illustrator, Photoshop e Figma.', 'Strategia e Branding: Creazione di identità visive uniche e marketing digitale efficace.', 'Risultati e Innovazione: Absolute mastery of technical solutions che generano crescita reale.'],
      finalCTA: 'Portiamo il tuo brand al livello successivo'
    }
  },
  EN: {
    nav: { home: 'Home', services: 'Services', blog: 'Blog', about: 'About', contact: 'Contact' },
    serviceItems: [
      { id: 'web-design', label: 'Web Design' },
      { id: 'social-strategy', label: 'Social Strategy' },
      { id: 'ai-solutions', label: 'AI Solutions' }
    ],
    hero: { 
      slides: [
        { title: 'Web Design Antigravity & Performance', subtitle: 'Perfect synergy between strategic design and extreme performance.' },
        { title: 'Artificial Intelligence Integration', subtitle: 'Optimizing business workflows through advanced LLM solutions.' },
        { title: 'Social Media Management & Digital Strategy', subtitle: 'AI-boosted SEO-driven content to maximize engagement.' }
      ]
    },
    webDesign: {
      title: 'Professional Web Design',
      desc: 'Perfect synergy between strategic design and extreme performance.',
      longDesc: 'Our professional web design service focuses on creating customized websites that are not only aesthetically pleasing but built to convert. Through meticulous UX/UI design, we transform your vision into a solid and effective digital presence. Whether you need scalable e-commerce, high-conversion landing pages, or a complex corporate portal, we guarantee impeccable mobile optimization and antigravity performance. We use the most advanced technologies to ensure every project is fast, secure, and ready to scale with your business.',
      human: 'Creative vision, UI/UX strategy on Figma/Adobe, and academic aesthetic sensitivity.',
      AI: 'Antigravity infrastructure for structural fluidity and CPM servers for maximum speed and scalability.',
      features: ['Responsive Design', 'SEO Optimization', 'Scalable Infrastructure', 'Human-Centric UX'],
      cta: 'Elevate your business with a unique Web Design.',
      cta_btn: 'Book your Web Design'
    },
    social: {
      title: 'Social & Content Strategy',
      desc: 'AI-boosted SEO-driven content to maximize engagement.',
      longDesc: 'We develop complete digital strategies based on professional social media management and high-impact content creation. In a saturated market, social advertising and consistent engagement are key to building lasting brand awareness. We analyze your target data to create content that speaks directly to your audience, boosting your industry authority. From editorial planning to video production, we integrate artificial intelligence to predict trends and maximize the visibility of your channels.',
      features: ['AI Data Analysis', 'Video Editing (After Effects/CapCut)', 'Growth Strategies', 'Content Planning'],
      cta: 'Dominate the market with a targeted Social Strategy.',
      cta_btn: 'Start your Social Strategy'
    },
    aiSolutions: {
      title: 'AI Solutions for Business',
      desc: 'Implementation of artificial intelligence into business workflows.',
      longDesc: 'Our AI solutions for business represent the future of corporate efficiency. We implement AI for marketing to automate processes and release human potential. From advanced AI data analysis to the integration of intelligent chatbots capable of handling customer service autonomously, we help companies scale while reducing operating costs. We focus on personalizing the user experience, using predictive algorithms to offer every customer exactly what they need, exactly when they need it.',
      features: ['Workflow Automation', 'LLM Integration', 'Strategic Consulting', 'AI Training'],
      cta: 'Transform your workflow with our AI Solutions.',
      cta_btn: 'Implement your AI Solutions'
    },
    about: {
      title: 'About Us',
      bio: 'We are the mind behind Digital Studio Villalva. With a certification as a Social Media Manager and a solid background in Web Graphic Design, we combine technical precision with artistic vision. We believe AI is the ultimate tool to elevate human potential, not to replace it.',
      skills: ['Social Media Expert', 'Web Graphic Designer', 'AI Architect']
    },
    contact: {
      title: 'Contact Your Digital Studio Villalva: Web Design, AI, and Social Strategy',
      subtitle: 'Ready to scale your business? We merge human creativity and computational power to provide tailor-made Web Design, Social Media management, and AI integration. Tell us your vision and let\'s build your digital future together.',
      cta_desc: 'Every great vision starts with a dialogue. We analyze your goals to create a tailored strategy that combines academic aesthetics and computational power.',
      cta_button: 'Request a free consultation',
      name: 'Your Name',
      email: 'Your Email',
      message: 'Your Message',
      services_label: 'What services do you need?',
      services: [
        { id: 'web', label: 'Web Design', msg: 'I would like to request a consultation for a Professional Web Design project.' },
        { id: 'social', label: 'Social Strategy', msg: 'I am interested in a social strategy to increase my engagement.' },
        { id: 'ai', label: 'AI Solutions', msg: 'I want to optimize my workflows with advanced AI solutions.' },
        { id: 'seo', label: 'SEO Optimization', msg: 'I wish to improve my rankings with SEO.' },
        { id: 'brand', label: 'Brand Identity', msg: 'I need a strong and consistent new Brand Identity.' },
        { id: 'ecommerce', label: 'E-commerce', msg: 'I want to develop a scalable and high-performance E-commerce.' }
      ],
      send: 'Send Message'
    },
    gallery: {
      title: 'Digital Insights',
      filterAll: 'All',
      filterWeb: 'Web Design',
      filterSocial: 'Social Media',
      filterAI: 'AI Solutions'
    },
    cta_button: 'Consultation',
    ctas: {
      services: 'Explore all services',
      blog: 'Read full blog',
      about: 'Our philosophy',
      backToBlog: 'Back to Blog'
    },
    servicesPage: {
      heroTitle: 'Avant-garde Digital Services',
      heroSubtitle: 'Professional Web Design, Digital Strategies and AI Solutions for your Business.',
      finalCTA: 'Start Your Project Today'
    },
    blogPage: {
      heroTitle: 'Villalva Blog: Future & SEO Insights',
      heroSubtitle: 'Stay updated on the latest trends in web design, social strategy and applied AI.',
      finalCTA: 'Stay ahead with our experts'
    },
    aboutPage: { 
      heroTitle: 'Villalva Digital Studio', 
      heroSubtitle: 'The perfect blend of human creativity and artificial intelligence for your digital success.',
      introTitle: 'Digital Synergy',
      introDesc: 'Villalva Digital Studio is a leading agency specialized in professional web design and social media strategies. Born from a passion for digital aesthetics and technical mastery in Adobe Suite and Figma, we stand out for our ability to merge the "Human Touch" with "AI Power". We use AI not to replace creativity, but to enhance it, ensuring custom web development and a unique brand identity that excites and converts.',
      missionTitle: 'Our Mission',
      missionDesc: 'To transform ideas into engaging and successful digital experiences, providing innovative and tailor-made solutions that perfectly integrate human intuition and AI efficiency for high-impact online branding.',
      visionTitle: 'Our Vision',
      visionDesc: 'To be the strategic partner that guides businesses to success in the digital world, leveraging AI to predict trends and consolidate excellence in design and social management.',
      strengthsTitle: 'Our Key Strengths',
      strengths: ['AI-Human Balance: The power of the algorithm guided by human sensitivity.', 'Technical Expertise: Absolute mastery of Illustrator, Photoshop, and Figma.', 'Strategy & Branding: Creation of unique visual identities and effective digital marketing.', 'Results & Innovation: Absolute mastery of technical solutions that generate real growth.', 'Scalability & Performance: Servers optimized for speed and reliability.'],
      finalCTA: 'Let\'s take your brand to the next level'
    }
  }
};

const BLOG_POSTS: BlogPost[] = [
  { 
    id: 1, 
    title: 'Web Design Professionale & UX: L\'Evoluzione del 2025', 
    category: 'Web Design', 
    date: '12 Maggio 2025',
    readTime: '15 min',
    excerpt: 'L\'unione tra estetica accademica e performance Antigravity. Scopri come l\'AI trasform la UX e la psicologia del design aumenta le conversioni.', 
    content: [
      'Nel 2025, il web design professionale ha superato il concetto di semplice layout statico. L\'integrazione di algoritmi generativi permette oggi di creare interfacce adattive in tempo reale, capaci di modificarsi in base al comportamento dell\'utente. Questo approccio, che noi di Digital Studio Villalva definiamo "Antigravity Design", garantisce una fluidità mai vista prima e una scalabilità server-side estrema.',
      'Perché puntare sull\'AI nel tuo sito web? La risposta risiede nella personalizzazione iper-mirata. Grazie alle AI Solutions, possiamo implementare sistemi di raccomandazione e layout dinamici che rispondono ai bisogni latenti dei visitatori, riducendo drasticamente il bounce rate e ottimizzando il percorso di acquisto per ogni singolo utente.',
      'Il design è molto più di "qualcosa di bello". È psicologia applicata. Studiamo i pattern di scansione oculare (F-pattern e Z-pattern) per posizionare gli elementi chiave dove l\'utente si aspetta di trovarli. La gerarchia visiva guida il visitatore verso l\'azione desiderata (CTA), massimizzando l\'efficacia comunicativa.',
      'Un uso sapiente degli spazi bianchi, dei pesi tipografici e del contrasto cromatico può aumentare il conversion rate di un sito e-commerce in modo significativo. In Digital Studio Villalva integriamo l\'estetica accademica con test di usabilità rigorosi per garantire che ogni pixel abbia una funzione strategica e rispetti l\'identità del brand.',
      'L\'ottimizzazione SEO beneficia enormemente da queste tecnologie: i motori di ricerca premiano la velocità e la rilevanza dei contenuti, parametri che l\'intelligenza artificiale gestisce con precisionre millimetrica. Un sito web moderno deve essere veloce, sicuro, intelligente e profondamente centrato sull\'umano.'
    ], 
    img: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=1200' 
  },
  { 
    id: 2, 
    title: 'Social Media Management & Digital Strategy High-Tech', 
    category: 'Social Media', 
    date: '08 Maggio 2025',
    readTime: '12 min',
    excerpt: 'Strategie SEO-driven e Content Creation AI-powered per dominare il mercato. Dalla authority su LinkedIn ai contenuti virali su TikTok.', 
    content: [
      'I brand high-tech affrontano una sfida unica: rendere comprensibile l\'innovazione complessa. Una social strategy efficace non si limita alla pubblicazione di post, ma costruisce una narrazione coerente che unisce visione umana e potenza tecnologica per creare una community fedele e informata.',
      'LinkedIn è diventato il palcoscenico principale per il networking B2B tecnologico. Attraverso la content creation mirata, aiutiamo i leader del settore a diventare Thought Leader, sfruttando l\'analisi dei dati AI per identificare i trend emergenti e le parole chiave più rilevanti prima della concorrenza.',
      'I video brevi (Reels, TikTok) potenziati dall\'AI nel montaggio e nello storytelling visivo permettono di abbattere le barriere cognitive tra prodotto e consumatore. La chiave è l\'engagement costante basato sulla valore informativo reale e sulla capacità di emozionare attraverso il medium digitale.',
      'La SEO nel 2025 si basa sull\'intento di ricerca semantica. I motori di ricerca ora comprendono il contesto e il valore di un articolo, non solo la ripetizione di keyword. Ecco perché una social & content strategy deve essere integrata alla SEO tecnica per scalare le classifiche organiche.',
      'Utilizziamo l\'AI per analizzare vasti dataset e identificare quali sono le domande reali che il tuo target si pone. Scrivere contenuti che rispondono a queste domande è l\'unico modo per costruire una brand authority duratura. La qualità batte sempre la quantità in una strategia di content planning vincente.'
    ], 
    img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1200' 
  },
  { 
    id: 3, 
    title: 'AI Solutions per Business & Deep Learning Workflow', 
    category: 'AI Solutions', 
    date: '02 Maggio 2025',
    readTime: '18 min',
    excerpt: 'L\'implementazione dell\'AI nei flussi di lavoro aziendali. Dai modelli LLM personalizzati alla generazione di asset creativi neurali.', 
    content: [
      'Le aziende che non adottano l\'automazione intelligente rischiano l\'obsolescenza rapida. L\'implementazione di LLM (Large Language Models) personalizzati nei flussi di lavoro aziendali non serve a sostituire l\'uomo, ma a potenziarne le capacità creative e decisionali attraverso l\'elaborazione di Big Data.',
      'Dai chatbot avanzati per il customer service ai sistemi di analisi documentale automatizzata, le nostre AI Solutions are progettate per scalare. Immagina di ridurre del 60% il tempo speso in task ripetitivi: questo è il potere dell\'intelligenza artificiale applicata al business moderno.',
      'La consulenza strategica di Digital Studio Villalva guida le imprese nella scelta degli strumenti giusti, assicurando una transizione digitale sicura e orientata al ROI. L\'automazione è l\'unica strada per la vera scalabilità in un mercato globale estremamente competitivo.',
      'Siamo entrati nell\'era della co-creazione. L\'intelligenza artificiale non ruba il lavoro ai designer, mas fornisce loro una "tavolozza infinita" di possibility. Il Deep Learning applicato alla grafica permette di esplorare migliaia di iterazioni creative in pochi secondi, mantenendo il controllo artistico umano.',
      'Per una brand identity moderna, l\'uso di asset visivi unici generati tramite modelli neurali garantisce un\'originalità assoluta. Uniamo la sensibilità estetica del team umano alla potenza computazionale delle AI Solutions per offrire risultati che erano impensabili fino a pochissimi anni fa.'
    ], 
    img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200' 
  },
];

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
    }> = [];

    let animationFrameId: number;
    let width: number;
    let height: number;
    let mouse = { x: -1000, y: -1000 };

    const initParticles = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      
      // Responsive particle count
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      const particleCount = isMobile ? 30 : isTablet ? 60 : 120;
      
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      const connectionDist = window.innerWidth < 768 ? 100 : 150;
      const mouseDist = 120;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Float logic
        p.x += p.vx;
        p.y += p.vy;

        // Boundary check
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse interaction (repel)
        const dxMouse = p.x - mouse.x;
        const dyMouse = p.y - mouse.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < mouseDist) {
          const force = (mouseDist - distMouse) / mouseDist;
          p.x += (dxMouse / distMouse) * force * 2;
          p.y += (dyMouse / distMouse) * force * 2;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(34, 211, 238, 0.5)'; // Ciano
        ctx.fill();

        // Connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const opacity = 1 - dist / connectionDist;
            ctx.strokeStyle = `rgba(34, 211, 238, ${opacity * 0.2})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', initParticles);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    
    initParticles();
    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', initParticles);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0"
    />
  );
};

const SocialIcons = ({ className = "", iconSize = "w-4 h-4" }: { className?: string, iconSize?: string }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <a href="#" className="text-white/60 hover:text-cyan-400 transition-colors" aria-label="Instagram"><Instagram className={`${iconSize}`} /></a>
    <a href="#" className="text-white/60 hover:text-cyan-400 transition-colors" aria-label="YouTube"><Youtube className={`${iconSize}`} /></a>
    <a href="#" className="text-white/60 hover:text-cyan-400 transition-colors" aria-label="Facebook"><Facebook className={`${iconSize}`} /></a>
    <a href="#" className="text-white/60 hover:text-cyan-400 transition-colors" aria-label="TikTok">
      <svg className={`${iconSize} fill-current`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.33 6.33 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1Z"/>
      </svg>
    </a>
  </div>
);

const ScrollRevealImage = ({ src, alt, className = "" }: { src: string; alt: string; className?: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      className={`w-full aspect-video md:aspect-square rounded-[40px] md:rounded-[50px] overflow-hidden border border-white/10 transition-all duration-[1500ms] ease-out shadow-2xl ${
        isVisible 
        ? 'grayscale-0 opacity-100 scale-100 shadow-cyan-500/20' 
        : 'grayscale opacity-10 scale-[0.98] shadow-transparent translate-y-4'
      } ${className}`}
    >
      <img src={src} className="w-full h-full object-cover" alt={alt} />
    </div>
  );
};

const BlogCard: React.FC<{ post: BlogPost, onClick: (id: number) => void, isCarouselItem?: boolean }> = ({ post, onClick, isCarouselItem = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px 100px 0px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref}
      onClick={() => onClick(post.id)}
      className={`group relative rounded-[25px] md:rounded-[45px] lg:rounded-[60px] overflow-hidden aspect-[16/20] md:aspect-[4/5] bg-neutral-900 border border-white/5 flex flex-col transition-all duration-700 ease-out cursor-pointer hover:shadow-[0_0_50px_rgba(6,182,212,0.25)] hover:border-cyan-500/40 hover:scale-[1.01] active:scale-[0.97] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } ${isCarouselItem ? 'w-full' : ''}`}
    >
      <div className="relative flex-1 overflow-hidden bg-neutral-800">
        <img 
          src={post.img} 
          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-active:opacity-100 transition-all duration-1000" 
          alt={post.title} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-100 group-hover:opacity-50 transition-opacity duration-700" />
      </div>
      <div className="p-5 md:p-8 lg:p-10 bg-[#050505] md:text-center relative z-10">
        <h4 className="text-lg md:text-2xl lg:text-3xl font-black uppercase mb-3 md:mb-6 tracking-tight leading-tight text-white group-hover:text-cyan-400 group-active:text-cyan-400 transition-colors">
          {post.title}
        </h4>
        <div className="pt-3 md:pt-6 border-t border-white/10 flex items-center justify-between md:justify-center md:gap-8">
           <span className="text-[8px] md:text-xs lg:text-sm font-black uppercase text-cyan-400 tracking-[0.2em]">{post.category}</span>
           <div className="w-8 h-8 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-black group-active:bg-cyan-500 group-active:text-black transition-all duration-500 transform group-hover:rotate-45">
              <ArrowRight size={18} className="md:w-5 md:h-5" />
           </div>
        </div>
      </div>
    </div>
  );
};

const Navbar = ({ lang, setLang, content, currentPage, setCurrentPage, onNavClick }: { lang: Language, setLang: (l: Language) => void, content: Content, currentPage: Page, setCurrentPage: (p: Page) => void, onNavClick: (id: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [desktopServicesHover, setDesktopServicesHover] = useState(false);

  const handleLink = (id: string) => {
    setIsOpen(false);
    setMobileServicesOpen(false);
    onNavClick(id);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-white/10 transform-gpu ${isOpen ? 'bg-[#0a0a0a]' : 'bg-black/60 backdrop-blur-lg'}`}>
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-12 h-24 lg:h-28 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => handleLink('home')}>
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl flex items-center justify-center font-black text-white shadow-xl">DV</div>
          <span className="text-xl lg:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 hidden lg:block uppercase tracking-tighter">Digital Studio Villalva</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2 lg:gap-6">
          <button onClick={() => handleLink('home')} className={`text-sm lg:text-base px-4 py-2 font-black transition-all hover:text-cyan-400 uppercase tracking-widest ${currentPage === 'home' || currentPage === 'blog-post' ? 'text-cyan-400' : 'text-gray-400'}`}>{content.nav.home}</button>
          
          <div className="relative h-full flex items-center" onMouseEnter={() => setDesktopServicesHover(true)} onMouseLeave={() => setDesktopServicesHover(false)}>
            <button onClick={() => handleLink('services')} className={`text-sm lg:text-base px-4 py-2 font-black transition-all hover:text-cyan-400 flex items-center gap-1 uppercase tracking-widest ${currentPage === 'services' ? 'text-cyan-400' : 'text-gray-400'}`}>{content.nav.services} <ChevronDown size={14} className={`transition-transform duration-300 ${desktopServicesHover ? 'rotate-180' : ''}`} /></button>
            <div className={`absolute top-full left-0 w-64 lg:w-72 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl transition-all duration-300 origin-top ${desktopServicesHover ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
              {content.serviceItems.map(item => (
                <button key={item.id} onClick={() => handleLink(item.id)} className="w-full text-left px-8 py-5 text-xs lg:text-sm font-black text-gray-500 hover:text-cyan-400 hover:bg-white/5 uppercase tracking-widest border-b border-white/5 last:border-0 transition-colors">{item.label}</button>
              ))}
            </div>
          </div>

          <button onClick={() => handleLink('blog')} className={`text-sm lg:text-base px-4 py-2 font-black transition-all hover:text-cyan-400 uppercase tracking-widest ${currentPage === 'blog' ? 'text-cyan-400' : 'text-gray-400'}`}>{content.nav.blog}</button>
          <button onClick={() => handleLink('about')} className={`text-sm lg:text-base px-4 py-2 font-black transition-all hover:text-cyan-400 uppercase tracking-widest ${currentPage === 'about' ? 'text-cyan-400' : 'text-gray-400'}`}>{content.nav.about}</button>
          <button onClick={() => handleLink('contact')} className={`text-sm lg:text-base px-4 py-2 font-black transition-all hover:text-cyan-400 uppercase tracking-widest ${currentPage === 'contact' ? 'text-cyan-400' : 'text-gray-400'}`}>{content.nav.contact}</button>
        </div>

        <div className="flex items-center gap-2 sm:gap-6">
          <div className="md:hidden flex items-center mr-1">
            <SocialIcons iconSize="w-4 h-4" className="gap-2.5" />
          </div>
          
          {/* Icons for Desktop */}
          <div className="hidden md:flex items-center mr-4 lg:mr-8">
            <SocialIcons iconSize="w-4 h-4 lg:w-5 lg:h-5" className="gap-3 lg:gap-4" />
          </div>

          {/* CTA Button for Desktop/Tablet */}
          <div className="hidden md:block">
            <button 
              onClick={() => handleLink('contact')} 
              className="bg-cyan-500 hover:bg-cyan-400 text-black text-[10px] lg:text-xs font-black px-5 py-2.5 lg:px-8 lg:py-4 rounded-full transition-all transform hover:scale-105 uppercase tracking-[0.15em] lg:tracking-[0.2em] shadow-lg shadow-cyan-500/20"
            >
              {content.cta_button}
            </button>
          </div>

          <div className="hidden md:block">
            <button onClick={() => setLang(lang === 'IT' ? 'EN' : 'IT')} className="flex items-center gap-2 px-4 py-2 lg:px-6 lg:py-3 rounded-full border border-white/10 hover:border-cyan-400 transition-all text-xs lg:text-sm font-black uppercase tracking-widest">
              <Globe size={16} className="text-cyan-400" /> {lang}
            </button>
          </div>

          {/* CTA Button for Mobile only */}
          <button 
            onClick={() => handleLink('contact')} 
            className="md:hidden bg-cyan-500 hover:bg-cyan-400 text-black text-[9px] font-black px-4 py-2.5 rounded-full transition-all transform hover:scale-105 uppercase tracking-[0.1em] shadow-lg shadow-cyan-500/20"
          >
            {content.cta_button}
          </button>

          <div className="flex flex-col items-center justify-center md:hidden ml-1">
            <button 
               onClick={() => setLang(lang === 'IT' ? 'EN' : 'IT')} 
               className="text-[9px] font-black text-cyan-400 uppercase tracking-tighter mb-0.5 border border-cyan-400/30 rounded px-1.5 py-0.5 bg-cyan-400/5 leading-none"
             >
               {lang}
             </button>
            <button 
              className="text-white transition-transform active:scale-90 transform-gpu antialiased" 
              onClick={() => setIsOpen(!isOpen)} 
              aria-label="Toggle Menu"
              style={{ translate: '0 0 0', backfaceVisibility: 'hidden' }}
            >
              {isOpen ? <X size={28} strokeWidth={2.5} className="block" /> : <Menu size={28} className="block" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed top-24 right-0 z-50 md:hidden w-full max-w-[280px] h-auto bg-gradient-to-br from-[#1e293b] to-[#0f172a] transition-transform duration-300 ease-out shadow-2xl rounded-bl-[2.5rem] border-l border-b border-white/10 overflow-hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col py-2">
          <button onClick={() => handleLink('home')} className="w-full text-left px-8 py-5 text-sm font-black uppercase tracking-widest border-b border-white/5 transition-all active:bg-cyan-500/10 active:text-cyan-400">{content.nav.home}</button>
          
          <div className="flex flex-col border-b border-white/5">
            <div className="flex">
              <button 
                onClick={() => handleLink('services')} 
                className="flex-1 text-left px-8 py-5 text-sm font-black uppercase tracking-widest transition-all active:bg-cyan-500/10 active:text-cyan-400 transition-colors"
              >
                {content.nav.services}
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileServicesOpen(!mobileServicesOpen);
                }} 
                className="px-6 py-5 border-l border-white/5 active:bg-cyan-500/10"
              >
                <ChevronDown size={18} className={`transition-transform duration-300 text-cyan-500 ${mobileServicesOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
            <div className={`bg-white/[0.03] flex flex-col transition-all duration-300 ${mobileServicesOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none overflow-hidden'}`}>
              {content.serviceItems.map((item, idx) => (
                <button key={item.id} onClick={() => handleLink(item.id)} className={`text-left px-12 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest active:text-cyan-400 transition-colors ${idx < content.serviceItems.length - 1 ? 'border-b border-white/5' : ''}`}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={() => handleLink('blog')} className="w-full text-left px-8 py-5 text-sm font-black uppercase tracking-widest border-b border-white/5 transition-all active:bg-cyan-500/10 active:text-cyan-400">{content.nav.blog}</button>
          <button onClick={() => handleLink('about')} className="w-full text-left px-8 py-5 text-sm font-black uppercase tracking-widest border-b border-white/5 transition-all active:bg-cyan-500/10 active:text-cyan-400">{content.nav.about}</button>
          <button onClick={() => handleLink('contact')} className="w-full text-left px-8 py-5 text-sm font-black uppercase tracking-widest transition-all active:bg-cyan-500/10 active:text-cyan-400">{content.nav.contact}</button>
        </div>
        
        <div className="bg-black/20 p-6 flex justify-center items-center border-t border-white/5">
           <SocialIcons iconSize="w-4 h-4" className="gap-6" />
        </div>
      </div>
    </nav>
  );
};

const SectionWrapper: React.FC<{ id: string, className?: string, children: React.ReactNode }> = ({ id, className = "", children }) => (
  <section id={id} className={`w-full py-14 md:py-24 lg:py-32 flex flex-col items-center justify-center relative overflow-hidden ${className}`}>
    <ParticleBackground />
    <div className="w-full max-w-[1920px] px-6 sm:px-12 md:px-24 flex flex-col items-center relative z-10">
      {children}
    </div>
  </section>
);

const SectionCTA = ({ label, onClick, className = "" }: { label: string, onClick?: () => void, className?: string }) => (
  <button 
    onClick={onClick}
    className={`mt-8 lg:mt-16 px-10 lg:px-14 py-4 lg:py-6 border-2 border-cyan-400 rounded-full text-[11px] lg:text-sm uppercase tracking-[0.3em] text-white hover:bg-cyan-500 hover:text-black hover:border-cyan-400 transition-all duration-500 font-black shadow-[0_0_60px_rgba(6,182,212,0.5)] bg-black/80 backdrop-blur-xl active:scale-95 ring-4 ring-cyan-500/10 ${className}`}
  >
    {label}
  </button>
);

const HeroCarousel = ({ slides }: { slides: { title: string; subtitle: string; }[] }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative z-10 w-full max-w-7xl lg:max-w-none mx-auto px-6 h-full flex items-center justify-center pointer-events-none">
      {slides.map((slide, i) => (
        <div 
          key={i} 
          className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-1000 ease-in-out ${
            i === current ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-normal uppercase tracking-tighter mb-6 lg:mb-10 text-white leading-tight max-w-7xl px-4">
            {slide.title}
          </h2>
          <p className="text-[16px] md:text-2xl lg:text-3xl text-gray-300 font-light max-w-4xl lg:max-w-5xl leading-relaxed px-4">
            {slide.subtitle}
          </p>
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [lang, setLang] = useState<Language>('IT');
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [filter, setFilter] = useState('All');
  const [heroVideoUrl, setHeroVideoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genMessage, setGenMessage] = useState("");
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
  const [formMessage, setFormMessage] = useState("");
  const content = TRANSLATIONS[lang];

  useEffect(() => {
    const activeMessages = content.contact.services
      .filter(s => selectedServices.has(s.id))
      .map(s => s.msg);
    
    if (activeMessages.length > 0) {
      setFormMessage(activeMessages.join('\n'));
    } else {
      setFormMessage("");
    }
  }, [selectedServices, content.contact.services]);

  const toggleService = (id: string) => {
    const newSet = new Set(selectedServices);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedServices(newSet);
  };

  const servicesScrollRef = useRef<HTMLDivElement>(null);
  const [activeService, setActiveService] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);

  const blogScrollRef = useRef<HTMLDivElement>(null);
  const [activeBlogPost, setActiveBlogPost] = useState(0);
  const [isInteractingBlog, setIsInteractingBlog] = useState(false);

  const servicesData = [
    { id: 'web-design', icon: <Cpu className="w-16 h-16 text-cyan-400" />, title: content.webDesign.title, desc: content.webDesign.desc, longDesc: content.webDesign.longDesc, features: content.webDesign.features, cta: content.webDesign.cta, cta_btn: content.webDesign.cta_btn },
    { id: 'social-strategy', icon: <Share2 className="w-16 h-16 text-purple-400" />, title: content.social.title, desc: content.social.desc, longDesc: content.social.longDesc, features: content.social.features, cta: content.social.cta, cta_btn: content.social.cta_btn },
    { id: 'ai-solutions', icon: <BrainCircuit className="w-16 h-16 text-white" />, title: content.aiSolutions.title, desc: content.aiSolutions.desc, longDesc: content.aiSolutions.longDesc, features: content.aiSolutions.features, cta: content.aiSolutions.cta, cta_btn: content.aiSolutions.cta_btn }
  ];

  const messages = [
    "Inizializzando l'estetica tecnologica HD...",
    "Generando connessioni neurali AI...",
    "Configurando gli schermi responsive dinamici...",
    "Sincronizzando i flussi di dati in ciano e blu...",
    "Quasi pronto: la visione sta prendendo vita."
  ];

  const handleNavClick = (id: string, preSelectService?: string) => {
    if (preSelectService) {
      setSelectedServices(new Set([preSelectService]));
    }
    
    if (id === 'blog') {
      setCurrentPage('blog');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (id === 'services') {
      setCurrentPage('services');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (id === 'about') {
      setCurrentPage('about');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (id === 'contact') {
      setCurrentPage('contact');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (['web-design', 'social-strategy', 'ai-solutions'].includes(id)) {
      setCurrentPage('services');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (id === 'home') {
      if (currentPage === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setCurrentPage('home');
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    } else {
      if (currentPage !== 'home') {
        setCurrentPage('home');
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleBlogCardClick = (id: number) => {
    setSelectedPostId(id);
    setCurrentPage('blog-post');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedPost = useMemo(() => 
    BLOG_POSTS.find(p => p.id === selectedPostId) || BLOG_POSTS[0]
  , [selectedPostId]);

  const generateHeroVideo = async () => {
    setIsGenerating(true);
    let msgIdx = 0;
    const msgInterval = setInterval(() => {
      setGenMessage(messages[msgIdx % messages.length]);
      msgIdx++;
    }, 4500);

    try {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await window.aistudio.openSelectKey();
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: 'High-definition (HD) futuristic and technological video showing glowing AI neural connections with bright pulses and digital data streams flowing in space. A holographic artificial intelligence interface glows. Several floating devices: a Desktop, a Tablet, and a Smartphone, each showing a website layout that dynamically adjusts instantly (responsive design). Style: electric blue, cyan, and deep black colors, fluid cinematic motion, continuous seamless loop.',
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 8000));
        operation = await ai.operations.getVideosOperation({operation: operation});
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        setHeroVideoUrl(URL.createObjectURL(blob));
      }
    } catch (error: any) {
      console.error("Errore generazione video:", error);
      if (error?.message?.includes("Requested entity was not found")) {
        await window.aistudio.openSelectKey();
      }
    } finally {
      clearInterval(msgInterval);
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (isInteracting || isGenerating || (currentPage !== 'home' && currentPage !== 'blog-post')) return;
    const interval = setInterval(() => {
      setActiveService((prev) => prev + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, [isInteracting, isGenerating, currentPage]);

  useEffect(() => {
    if (servicesScrollRef.current && window.innerWidth < 768 && !isInteracting) {
       const container = servicesScrollRef.current;
       const items = container.children;
       const count = servicesData.length;
       
       if (activeService >= count) {
          const cloneCard = items[count] as HTMLElement;
          if (cloneCard) {
            const centerOffset = (container.clientWidth - cloneCard.clientWidth) / 2;
            container.scrollTo({ left: cloneCard.offsetLeft - centerOffset, behavior: 'smooth' });
          }
          const timer = setTimeout(() => {
             if (!isInteracting) {
                const firstCard = items[0] as HTMLElement;
                const centerOffset = (container.clientWidth - firstCard.clientWidth) / 2;
                container.scrollTo({ left: firstCard.offsetLeft - centerOffset, behavior: 'auto' });
                setActiveService(0);
             }
          }, 600);
          return () => clearTimeout(timer);
       } else {
          const card = items[activeService] as HTMLElement;
          if (card) {
             const centerOffset = (container.clientWidth - card.clientWidth) / 2;
             container.scrollTo({ left: card.offsetLeft - centerOffset, behavior: 'smooth' });
          }
       }
    }
  }, [activeService, isInteracting, servicesData.length]);

  useEffect(() => {
    if (isInteractingBlog || isGenerating || currentPage !== 'home') return;
    const interval = setInterval(() => {
      setActiveBlogPost((prev) => prev + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, [isInteractingBlog, isGenerating, currentPage]);

  useEffect(() => {
    if (blogScrollRef.current && window.innerWidth < 768 && !isInteractingBlog) {
       const container = blogScrollRef.current;
       const items = container.children;
       const count = BLOG_POSTS.length;
       
       if (activeBlogPost >= count) {
          const cloneCard = items[count] as HTMLElement;
          if (cloneCard) {
            const centerOffset = (container.clientWidth - cloneCard.clientWidth) / 2;
            container.scrollTo({ left: cloneCard.offsetLeft - centerOffset, behavior: 'smooth' });
          }
          const timer = setTimeout(() => {
             if (!isInteractingBlog) {
                const firstCard = items[0] as HTMLElement;
                const centerOffset = (container.clientWidth - firstCard.clientWidth) / 2;
                container.scrollTo({ left: firstCard.offsetLeft - centerOffset, behavior: 'auto' });
                setActiveBlogPost(0);
             }
          }, 600);
          return () => clearTimeout(timer);
       } else {
          const card = items[activeBlogPost] as HTMLElement;
          if (card) {
             const centerOffset = (container.clientWidth - card.clientWidth) / 2;
             container.scrollTo({ left: card.offsetLeft - centerOffset, behavior: 'smooth' });
          }
       }
    }
  }, [activeBlogPost, isInteractingBlog, BLOG_POSTS.length]);

  const handleServicesScroll = () => {
    if (servicesScrollRef.current && isInteracting) {
      const container = servicesScrollRef.current;
      const scrollLeft = container.scrollLeft;
      const items = container.children;
      if (items.length > 1) {
        const first = items[0] as HTMLElement;
        const second = items[1] as HTMLElement;
        const itemWidth = second.offsetLeft - first.offsetLeft;
        const nameActive = Math.round((scrollLeft - (container.clientWidth - first.clientWidth) / 2) / itemWidth);
        const clampedActive = Math.max(0, Math.min(nameActive, servicesData.length));
        if (clampedActive !== activeService) {
          setActiveService(clampedActive);
        }
      }
    }
  };

  const handleBlogScroll = () => {
    if (blogScrollRef.current && isInteractingBlog) {
      const container = blogScrollRef.current;
      if (!container) return;
      const scrollLeft = container.scrollLeft;
      const items = container.children;
      if (items.length > 1) {
        const first = items[0] as HTMLElement;
        const second = items[1] as HTMLElement;
        const itemWidth = second.offsetLeft - first.offsetLeft;
        const nameActive = Math.round((scrollLeft - (container.clientWidth - first.clientWidth) / 2) / itemWidth);
        const clampedActive = Math.max(0, Math.min(nameActive, BLOG_POSTS.length));
        if (clampedActive !== activeBlogPost) {
          setActiveBlogPost(clampedActive);
        }
      }
    }
  };

  const scrollContainer = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right', type: 'services' | 'blog') => {
    if (ref.current) {
      const container = ref.current;
      const items = container.children;
      const data = type === 'services' ? servicesData : BLOG_POSTS;
      const count = data.length;
      const currentActive = (type === 'services' ? activeService : activeBlogPost) % count;
      
      let nextIndex;
      if (direction === 'right') {
        nextIndex = (currentActive + 1) % count;
      } else {
        nextIndex = (currentActive - 1 + count) % count;
      }

      if (type === 'services') {
        setIsInteracting(true);
        setActiveService(nextIndex);
        setTimeout(() => setIsInteracting(false), 3000);
      } else {
        setIsInteractingBlog(true);
        setActiveBlogPost(nextIndex);
        setTimeout(() => setIsInteractingBlog(false), 3000);
      }

      const targetCard = items[nextIndex] as HTMLElement;
      if (targetCard) {
        const centerOffset = (container.clientWidth - targetCard.clientWidth) / 2;
        container.scrollTo({ left: targetCard.offsetLeft - centerOffset, behavior: 'smooth' });
      }
    }
  };

  const filteredBlogPosts = useMemo(() => {
    if (filter === 'All') return BLOG_POSTS;
    return BLOG_POSTS.filter(p => p.category === filter);
  }, [filter]);

  return (
    <div className="bg-[#050505] text-white selection:bg-cyan-500 selection:text-white overflow-x-hidden scroll-smooth font-sans">
      <Navbar lang={lang} setLang={setLang} content={content} currentPage={currentPage} setCurrentPage={setCurrentPage} onNavClick={handleNavClick} />

      {currentPage === 'home' ? (
        <main className="animate-in fade-in duration-1000">
          <section id="home" className="relative h-[80vh] lg:h-[90vh] w-full flex items-center justify-center overflow-hidden bg-black z-0">
            <div className="absolute inset-0 z-0 bg-black">
               {heroVideoUrl ? (
                 <video 
                   autoPlay 
                   loop 
                   muted 
                   playsInline 
                   className="w-full h-full object-cover brightness-[0.5]"
                   src={heroVideoUrl}
                 />
               ) : isGenerating ? (
                 <div className="w-full h-full flex flex-col items-center justify-center bg-black gap-6 px-6 text-center">
                    <Loader2 className="w-16 h-16 text-cyan-400 animate-spin" />
                    <p className="text-xl lg:text-3xl font-light tracking-[0.2em] uppercase text-cyan-400 animate-pulse">{genMessage}</p>
                 </div>
               ) : (
                 <div className="w-full h-full bg-black relative flex flex-col items-center justify-center">
                    <button 
                      onClick={generateHeroVideo}
                      className="group relative flex flex-col items-center gap-4 transition-all hover:scale-105"
                    >
                      <div className="w-20 h-20 lg:w-28 lg:h-28 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                        <Video size={32} />
                      </div>
                      <span className="text-[10px] lg:text-xs font-black uppercase tracking-[0.3em] text-cyan-400/60 group-hover:text-cyan-400 transition-colors">
                        Generate Background with Veo AI
                      </span>
                    </button>
                 </div>
               )}
               <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black"></div>
            </div>
            {!isGenerating && <HeroCarousel slides={content.hero.slides} />}
          </section>

          <SectionWrapper id="services" className="bg-[#0d0d0d] relative mt-0 z-10">
            <div className="relative w-full max-w-7xl lg:max-w-none flex flex-col items-center z-10">
              <div className="text-center mb-8 lg:mb-20 w-full relative z-20 px-4">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-1 md:mb-0 uppercase tracking-tighter text-white/90 leading-tight">{content.nav.services}</h2>
              </div>

              <div className="relative w-full group">
                <button 
                  onClick={() => scrollContainer(servicesScrollRef, 'left', 'services')}
                  className="md:hidden absolute -left-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-cyan-400 backdrop-blur-md active:scale-90"
                  aria-label="Previous Service"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={() => scrollContainer(servicesScrollRef, 'right', 'services')}
                  className="md:hidden absolute -right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-cyan-400 backdrop-blur-md active:scale-90"
                  aria-label="Next Service"
                >
                  <ChevronRight size={24} />
                </button>

                <div 
                  ref={servicesScrollRef}
                  onMouseEnter={() => setIsInteracting(true)}
                  onMouseLeave={() => setIsInteracting(false)}
                  onTouchStart={() => setIsInteracting(true)}
                  onTouchEnd={() => setIsInteracting(false)}
                  onScroll={handleServicesScroll}
                  className="flex md:grid md:grid-cols-3 gap-6 md:gap-12 lg:gap-20 w-full overflow-x-auto md:overflow-visible pb-4 pt-4 md:pb-6 snap-x snap-mandatory scrollbar-hide scroll-smooth relative z-30 px-[10vw] md:px-0"
                >
                  {servicesData.concat(servicesData[0]).map((s, idx) => (
                    <div 
                      key={`${s.id}-${idx}`} 
                      id={idx < servicesData.length ? s.id : undefined}
                      onClick={() => {
                        if (window.innerWidth >= 768) {
                          handleNavClick(s.id);
                        }
                      }}
                      className={`min-w-[80vw] md:min-w-0 snap-center group p-8 md:p-12 lg:p-16 rounded-[40px] md:rounded-[50px] lg:rounded-[70px] transition-all duration-700 border flex flex-col items-start md:items-center ${
                        (activeService % servicesData.length) === (idx % servicesData.length) 
                        ? 'bg-black border-cyan-400 shadow-[0_20px_40px_rgba(6,182,212,0.2)] scale-[1.03] opacity-100 z-40 md:border-white/10 md:shadow-none md:scale-100 md:opacity-100 md:z-30' 
                        : 'bg-black/40 border-white/10 opacity-60 scale-[0.95] z-30 md:bg-black md:border-white/10 md:opacity-100 md:scale-100'
                      } hover:border-cyan-500/50 hover:bg-black/90 md:cursor-pointer ${idx >= servicesData.length ? 'md:hidden' : ''} md:hover:scale-[1.1] md:hover:shadow-[0_0_80px_rgba(6,182,212,0.4)] md:hover:border-cyan-400 md:hover:z-50`}
                    >
                      <div className="mb-6 md:mb-10 lg:mb-14 transform group-hover:scale-110 transition-transform duration-500 relative z-40">
                        {React.cloneElement(s.icon as React.ReactElement<{ className?: string }>, { 
                          className: `w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 ${(s.icon as React.ReactElement<{ className?: string }>).props.className || ''}` 
                        })}
                      </div>
                      <h3 className="text-2xl md:text-3xl lg:text-4xl font-black mb-4 md:mb-6 uppercase tracking-tight leading-none text-white relative z-40 md:text-center">{s.title}</h3>
                      <p className="text-gray-400 text-lg md:text-xl lg:text-2xl mb-6 md:mb-10 leading-relaxed font-light relative z-40 h-auto md:h-24 lg:h-32 overflow-hidden md:text-center">{s.desc}</p>
                      <ul className="space-y-3 md:space-y-4 lg:space-y-6 relative z-40 mt-auto md:items-start">
                        {s.features.map(f => (
                          <li key={f} className="flex items-center gap-3 md:gap-4 lg:gap-6 text-[10px] md:text-xs lg:text-sm font-black text-gray-400 uppercase tracking-widest group-hover:text-gray-100 transition-colors md:justify-start">
                             <ChevronRight size={14} className="text-cyan-500 shrink-0" /> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex md:hidden gap-3 mt-2 items-center justify-center relative z-40">
                {servicesData.map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => {
                      setIsInteracting(true);
                      setActiveService(i);
                      if (servicesScrollRef.current) {
                        const container = servicesScrollRef.current;
                        const items = container.children;
                        const card = items[i] as HTMLElement;
                        if (card) {
                          const centerOffset = (container.clientWidth - card.clientWidth) / 2;
                          container.scrollTo({ left: card.offsetLeft - centerOffset, behavior: 'smooth' });
                        }
                      }
                      setTimeout(() => setIsInteracting(false), 3000);
                    }}
                    className={`h-2 rounded-full transition-all duration-500 ${activeService % servicesData.length === i ? 'w-8 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'w-2 bg-white/10'}`}
                    aria-label={`Vai al servizio ${i + 1}`}
                  />
                ))}
              </div>
            </div>
            
            <div className="relative z-40">
              <SectionCTA label={content.ctas.services} onClick={() => handleNavClick('services')} />
            </div>
          </SectionWrapper>

          <SectionWrapper id="blog-preview" className="bg-[#05050a] relative z-10">
            <div className="relative w-full max-w-7xl lg:max-w-none flex flex-col items-center z-10">
              <div className="text-center mb-8 lg:mb-20 w-full relative z-20 px-4">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-1 md:mb-0 uppercase tracking-tighter text-white/90">{content.nav.blog}</h2>
              </div>

              <div className="relative w-full group">
                <button 
                  onClick={() => scrollContainer(blogScrollRef, 'left', 'blog')}
                  className="md:hidden absolute -left-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-cyan-400 backdrop-blur-md active:scale-90"
                  aria-label="Previous Blog Post"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={() => scrollContainer(blogScrollRef, 'right', 'blog')}
                  className="md:hidden absolute -right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-cyan-400 backdrop-blur-md active:scale-90"
                  aria-label="Next Blog Post"
                >
                  <ChevronRight size={24} />
                </button>

                <div 
                  ref={blogScrollRef}
                  onMouseEnter={() => setIsInteractingBlog(true)}
                  onMouseLeave={() => setIsInteractingBlog(false)}
                  onTouchStart={() => setIsInteractingBlog(true)}
                  onTouchEnd={() => setIsInteractingBlog(false)}
                  onScroll={handleBlogScroll}
                  className="flex md:grid md:grid-cols-3 gap-6 md:gap-12 lg:gap-20 w-full overflow-x-auto md:overflow-visible pb-4 pt-4 md:pb-6 snap-x snap-mandatory scrollbar-hide scroll-smooth relative z-30 px-[10vw] md:px-0"
                >
                  {BLOG_POSTS.map((post, idx) => (
                    <div 
                      key={`${post.id}-${idx}`} 
                      className="min-w-[80vw] md:min-w-0 snap-center transition-all duration-700"
                    >
                      <BlogCard post={post} onClick={handleBlogCardClick} isCarouselItem />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex md:hidden gap-3 mt-2 items-center justify-center relative z-40">
                {BLOG_POSTS.map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => {
                      setIsInteractingBlog(true);
                      setActiveBlogPost(i);
                      if (blogScrollRef.current) {
                        const container = blogScrollRef.current;
                        const items = container.children;
                        const card = items[i] as HTMLElement;
                        if (card) {
                          const centerOffset = (container.clientWidth - card.clientWidth) / 2;
                          container.scrollTo({ left: card.offsetLeft - centerOffset, behavior: 'smooth' });
                        }
                      }
                      setTimeout(() => setIsInteractingBlog(false), 3000);
                    }}
                    className={`h-2 rounded-full transition-all duration-500 ${activeBlogPost % BLOG_POSTS.length === i ? 'w-8 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'w-2 bg-white/10'}`}
                    aria-label={`Vai alla categoria ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="relative z-40">
              <SectionCTA label={content.ctas.blog} onClick={() => handleNavClick('blog')} className="!px-6 !tracking-[0.2em]" />
            </div>
          </SectionWrapper>

          <SectionWrapper id="about" className="bg-[#0d0d0d] relative overflow-hidden z-10">
            <div className="max-w-[1440px] mx-auto w-full">
              <div className="text-center mb-12 lg:mb-24">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-1 md:mb-0 uppercase tracking-tighter text-white/90 leading-tight">{content.about.title}</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center lg:items-start">
                {/* Visual Side */}
                <div className="lg:col-span-5 flex justify-center lg:justify-start">
                  <div className="relative group w-full max-w-md lg:max-w-none">
                    <div className="aspect-[4/5] rounded-[40px] md:rounded-[60px] lg:rounded-[80px] overflow-hidden border border-white/10 shadow-2xl shadow-black relative z-10">
                      <img 
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1200" 
                        className="w-full h-full object-cover grayscale brightness-50 transition-all duration-1000 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105" 
                        alt="Founder" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    </div>
                    {/* Decorative element */}
                    <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-cyan-500/20 rounded-[40px] md:rounded-[60px] lg:rounded-[80px] -z-0 hidden md:block"></div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="lg:col-span-7 space-y-10 lg:space-y-16">
                  <div className="p-8 md:p-12 lg:p-16 rounded-[30px] md:rounded-[40px] lg:rounded-[50px] bg-white/[0.03] border-l-4 lg:border-l-8 border-cyan-500 relative overflow-hidden group hover:bg-white/[0.05] transition-all duration-500">
                    <div className="absolute top-0 right-0 p-8 opacity-5 text-cyan-400 group-hover:scale-110 transition-transform duration-700">
                      <MessageSquare size={120} />
                    </div>
                    <p className="text-xl md:text-2xl lg:text-3xl xl:text-4xl text-gray-200 leading-relaxed font-light italic relative z-10">
                      "{content.about.bio}"
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
                    {content.about.skills.map((skill, idx) => (
                      <div key={skill} className="flex items-center gap-6 p-6 rounded-[25px] bg-white/[0.02] border border-white/5 group hover:border-cyan-500/30 hover:bg-white/[0.04] transition-all duration-500">
                         <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all duration-500 shrink-0">
                           {idx === 0 ? <Share2 size={24} /> : idx === 1 ? <Palette size={24} /> : <BrainCircuit size={24} />}
                         </div>
                         <span className="text-xs md:text-sm lg:text-base xl:text-lg font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-white transition-colors">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-12 lg:mt-24">
              <SectionCTA label={content.ctas.about} onClick={() => handleNavClick('about')} />
            </div>
          </SectionWrapper>

          <SectionWrapper id="contact-cta" className="bg-neutral-950 z-10">
            <div className="max-w-[1440px] mx-auto w-full relative z-10">
              <div className="text-center mb-12 lg:mb-20">
                <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black uppercase tracking-tighter leading-none">{content.contact.title}</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                {/* Visual Side */}
                <div className="rounded-[40px] md:rounded-[60px] lg:rounded-[80px] overflow-hidden border border-white/10 shadow-2xl aspect-[16/9] lg:aspect-square order-2 lg:order-1">
                  <img 
                    src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200" 
                    className="w-full h-full object-cover grayscale brightness-50 hover:grayscale-0 hover:brightness-100 transition-all duration-1000" 
                    alt="Technological Partnership"
                  />
                </div>
                
                {/* Content Side */}
                <div className="text-center lg:text-left space-y-10 order-1 lg:order-2">
                  <p className="text-gray-400 text-lg md:text-xl lg:text-3xl font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    {content.contact.cta_desc}
                  </p>
                  <div className="flex justify-center lg:justify-start">
                    <SectionCTA 
                      label={content.contact.cta_button} 
                      onClick={() => handleNavClick('contact')} 
                      className="!mt-0" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </SectionWrapper>
        </main>
      ) : currentPage === 'services' ? (
        <main className="animate-in fade-in duration-1000">
          <section className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] w-full flex items-center justify-center overflow-hidden z-0">
             <div className="absolute inset-0 bg-black">
                <img 
                  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1920" 
                  className="w-full h-full object-cover brightness-[0.4] scale-105" 
                  alt="Villalva Studio Services Hero" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#050505]"></div>
             </div>
             <div className="relative z-10 text-center px-6 max-w-7xl lg:max-w-none mx-auto">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-8 leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-400 to-purple-600 animate-pulse-slow">
                  {content.servicesPage.heroTitle}
                </h1>
                <h2 className="text-xl md:text-2xl lg:text-3xl text-gray-300 font-light tracking-wide uppercase leading-relaxed max-w-5xl mx-auto">
                  {content.servicesPage.heroSubtitle}
                </h2>
             </div>
          </section>

          <SectionWrapper id="services-page" className="bg-[#050505]">
            <div className="space-y-32 lg:space-y-56 w-full max-w-7xl lg:max-w-[1600px]">
              {servicesData.map((s, idx) => (
                <div key={s.id} id={s.id} className="scroll-mt-32 w-full">
                  {/* Contenitore a Due Colonne per Desktop/Tablet */}
                  <div className={`flex flex-col md:grid md:grid-cols-2 gap-12 lg:gap-24 items-center ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                    
                    {/* Colonna Testo */}
                    <div className={`flex flex-col items-center md:items-center text-center md:text-center space-y-6 lg:space-y-10 ${idx % 2 === 1 ? 'md:order-2' : ''}`}>
                      <h3 className="order-2 md:order-1 text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none text-white">{s.title}</h3>
                      
                      <div className="order-1 md:order-2 inline-flex p-5 lg:p-8 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)] md:mx-auto">
                        {React.cloneElement(s.icon as React.ReactElement<{ className?: string }>, { className: 'w-12 h-12 lg:w-20 lg:h-20' })}
                      </div>

                      <p className="order-3 md:order-3 text-gray-400 text-lg lg:text-2xl leading-relaxed font-light max-w-2xl">
                        {s.longDesc}
                      </p>
                      
                      <div className="hidden md:flex order-4">
                        <SectionCTA label={s.cta_btn} onClick={() => {
                          const mapping: Record<string, string> = {
                            'web-design': 'web',
                            'social-strategy': 'social',
                            'ai-solutions': 'ai'
                          };
                          handleNavClick('contact', mapping[s.id]);
                        }} className="!mt-0" />
                      </div>
                    </div>

                    {/* Colonna Immagine */}
                    <div className={idx % 2 === 1 ? 'md:order-1' : ''}>
                      <ScrollRevealImage 
                        src={
                          s.id === 'web-design' ? 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=1200' :
                          s.id === 'social-strategy' ? 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1200' :
                          'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200'
                        } 
                        alt={s.title}
                        className="!aspect-square lg:!aspect-[4/3] rounded-[60px] lg:rounded-[80px]"
                      />
                    </div>
                  </div>

                  {/* Terza Sezione: Griglia Features (Distribuita su 3 o 4 colonne su Desktop) */}
                  <div className="mt-16 lg:mt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8 w-full">
                    {s.features.map(f => (
                      <div key={f} className="flex flex-col items-center md:items-start gap-4 p-6 lg:p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-all group backdrop-blur-sm">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                           <CheckCircle2 size={24} />
                        </div> 
                        <span className="text-xs lg:text-sm font-black text-gray-300 uppercase tracking-widest group-hover:text-white transition-colors text-center md:text-left">{f}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Visibile solo su mobile a fine sezione */}
                  <div className="flex md:hidden justify-center mt-12">
                    <SectionCTA label={s.cta_btn} onClick={() => handleNavClick('contact')} />
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Finale della Pagina Servizi */}
            <div className="mt-32 lg:mt-56 w-full max-w-7xl lg:max-w-none mx-auto p-12 md:p-20 lg:p-32 rounded-[60px] lg:rounded-[120px] bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-cyan-500/20 text-center shadow-[0_30px_100px_rgba(0,0,0,0.5)] relative overflow-hidden group">
               <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
               <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12 lg:gap-24 text-center lg:text-left">
                  <div className="lg:max-w-4xl space-y-6">
                    <h4 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none">
                      {content.servicesPage.finalCTA}
                    </h4>
                    <p className="text-gray-400 text-lg lg:text-2xl font-light">
                      Trasformiamo il potenziale in risultati tangibili. Collabora con Digital Studio Villalva per un futuro tecnologico ed umano.
                    </p>
                  </div>
                  <button 
                    onClick={() => handleNavClick('contact')}
                    className="px-12 py-6 lg:px-20 lg:py-10 bg-cyan-500 text-black font-black uppercase tracking-[0.4em] text-xs lg:text-sm rounded-full hover:bg-white transition-all transform hover:scale-105 shadow-2xl shadow-cyan-500/20 active:scale-95 shrink-0"
                  >
                    {content.contact.cta_button}
                  </button>
               </div>
            </div>
          </SectionWrapper>
        </main>
      ) : currentPage === 'blog' ? (
        <main className="animate-in fade-in duration-1000">
          <section className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] w-full flex items-center justify-center overflow-hidden z-0">
             <div className="absolute inset-0 bg-black">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1920" 
                  className="w-full h-full object-cover brightness-[0.4] scale-105" 
                  alt="Villalva Blog Hero" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#050505]"></div>
             </div>
             <div className="relative z-10 text-center px-6 max-w-7xl lg:max-w-none mx-auto">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-8 leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-400 to-purple-600 animate-pulse-slow">
                  {content.blogPage.heroTitle}
                </h1>
                <h2 className="text-xl md:text-2xl lg:text-3xl text-gray-300 font-light tracking-wide uppercase leading-relaxed max-w-5xl mx-auto">
                  {content.blogPage.heroSubtitle}
                </h2>
             </div>
          </section>

          <SectionWrapper id="blog-page" className="bg-[#050505]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16 w-full max-w-7xl lg:max-w-none">
              {BLOG_POSTS.map(post => (
                <BlogCard key={post.id} post={post} onClick={handleBlogCardClick} />
              ))}
            </div>

            <div className="mt-24 lg:mt-32 w-full max-w-7xl lg:max-w-none mx-auto p-10 md:p-14 lg:p-24 rounded-[60px] lg:rounded-[100px] bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-cyan-500/20 text-center lg:text-left shadow-[0_30px_100px_rgba(0,0,0,0.5)] relative overflow-hidden group">
               <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
               <div className="relative z-10 lg:flex lg:items-center lg:justify-between gap-12">
                  <div className="lg:max-w-4xl">
                    <h4 className="text-3xl md:text-6xl lg:text-8xl font-black uppercase tracking-tighter mb-6 lg:mb-4 leading-none">
                      {content.blogPage.finalCTA}
                    </h4>
                    <p className="text-gray-400 text-lg md:text-xl lg:text-3xl font-light mb-10 lg:mb-0 lg:mx-0">
                      Approfondisci i temi che stanno ridefinendo l'ecosistema digitale globale attraverso le nostre macro-guide tematiche.
                    </p>
                  </div>
                  <button 
                    onClick={() => handleNavClick('contact')}
                    className="px-12 py-6 lg:px-16 lg:py-8 bg-cyan-500 text-black font-black uppercase tracking-[0.4em] text-xs lg:text-sm rounded-full hover:bg-white transition-all transform hover:scale-105 shadow-2xl shadow-cyan-500/20 active:scale-95 shrink-0"
                  >
                    {content.contact.cta_button}
                  </button>
               </div>
            </div>
          </SectionWrapper>
        </main>
      ) : currentPage === 'blog-post' ? (
        <main className="animate-in fade-in duration-1000 pt-28">
           <SectionWrapper id="blog-detail" className="bg-[#050505]">
             <div className="w-full max-w-5xl mx-auto">
                <button 
                  onClick={() => setCurrentPage('blog')}
                  className="flex items-center gap-3 text-cyan-400 font-black uppercase tracking-widest text-xs lg:text-sm mb-12 hover:text-white transition-colors group"
                >
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border border-cyan-400/30 flex items-center justify-center group-hover:bg-cyan-500/10 group-hover:border-cyan-400 transition-all">
                    <ArrowLeft size={20} />
                  </div>
                  {content.ctas.backToBlog}
                </button>

                <div className="flex flex-col gap-6 lg:gap-10 mb-12 lg:mb-16">
                  <div className="flex items-center gap-4 text-[10px] lg:text-xs font-black uppercase tracking-[0.3em] text-cyan-500">
                    <span className="bg-cyan-500/10 px-4 py-2 rounded-full border border-cyan-500/20">{selectedPost.category}</span>
                    <div className="flex items-center gap-2"><Calendar size={14} /> {selectedPost.date}</div>
                    <div className="flex items-center gap-2"><Clock size={14} /> {selectedPost.readTime}</div>
                  </div>
                  <h1 className="text-4xl md:text-6xl lg:text-8xl font-black uppercase tracking-tight leading-none text-white md:text-center">
                    {selectedPost.title}
                  </h1>
                </div>

                <div className="w-full aspect-[16/9] lg:aspect-[21/9] rounded-[40px] md:rounded-[60px] lg:rounded-[80px] overflow-hidden border border-white/10 mb-16 lg:mb-24 shadow-2xl shadow-black">
                   <img src={selectedPost.img} className="w-full h-full object-cover" alt={selectedPost.title} />
                </div>

                <div className="space-y-10 lg:space-y-16 text-gray-300">
                  {selectedPost.content.map((para, i) => (
                    <p key={i} className={`text-lg md:text-2xl lg:text-3xl leading-relaxed font-light ${i === 0 ? 'first-letter:text-5xl lg:first-letter:text-8xl first-letter:font-black first-letter:text-cyan-500 first-letter:mr-4 first-letter:float-left' : ''}`}>
                      {para}
                    </p>
                  ))}
                </div>

                <div className="mt-24 lg:mt-32 p-12 lg:p-20 rounded-[40px] lg:rounded-[60px] bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-cyan-500/20 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-12">
                   <div className="flex-1">
                      <h3 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight mb-6 leading-none text-white">
                        {content.servicesPage.finalCTA}
                      </h3>
                      <p className="text-gray-400 text-lg md:text-xl lg:text-2xl font-light">
                        Implementa queste strategie evolute nel tuo business con Digital Studio Villalva.
                      </p>
                   </div>
                   <button 
                    onClick={() => handleNavClick('contact')}
                    className="px-12 py-6 lg:px-16 lg:py-8 bg-cyan-500 text-black font-black uppercase tracking-[0.4em] text-xs lg:text-sm rounded-full hover:bg-white transition-all transform hover:scale-105 shadow-2xl shadow-cyan-500/20 active:scale-95 shrink-0"
                  >
                    {content.contact.cta_button}
                  </button>
                </div>
             </div>
           </SectionWrapper>
        </main>
      ) : currentPage === 'about' ? (
        <main className="animate-in fade-in duration-1000">
          <section className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] w-full flex items-center justify-center overflow-hidden z-0">
             <div className="absolute inset-0 bg-black">
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1920" 
                  className="w-full h-full object-cover brightness-[0.4] scale-105" 
                  alt="Villalva Studio About Hero" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#050505]"></div>
             </div>
             <div className="relative z-10 text-center px-6 max-w-7xl lg:max-w-none mx-auto">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-8 leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-400 to-purple-600 animate-pulse-slow">
                  {content.aboutPage.heroTitle}
                </h1>
                <h2 className="text-xl md:text-2xl lg:text-3xl text-gray-300 font-light tracking-wide uppercase leading-relaxed max-w-5xl mx-auto">
                  {content.aboutPage.heroSubtitle}
                </h2>
             </div>
          </section>

          <SectionWrapper id="about-content" className="bg-[#050505]">
            <div className="space-y-24 lg:space-y-48 w-full max-w-7xl lg:max-w-none">
              <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 items-center">
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight mb-10 leading-none text-cyan-400">{content.aboutPage.introTitle}</h3>
                  <p className="text-gray-300 text-xl md:text-2xl lg:text-3xl leading-relaxed font-light mb-8">
                    {content.aboutPage.introDesc}
                  </p>
                </div>
                <div className="flex-1 w-full aspect-square rounded-[60px] lg:rounded-[100px] overflow-hidden border border-white/10 shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 transition-all duration-1000" alt="Team Work" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-12 md:gap-20 lg:gap-32">
                <div className="p-12 md:p-16 lg:p-24 rounded-[60px] lg:rounded-[80px] bg-white/[0.03] border border-white/5 hover:border-cyan-500/30 transition-all group">
                  <div className="mb-10 lg:mb-16 w-20 h-20 lg:w-32 lg:h-32 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)] group-hover:scale-110 transition-all">
                    <Target size={36} className="lg:w-16 lg:h-16" />
                  </div>
                  <h4 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight mb-8 leading-none text-white">{content.aboutPage.missionTitle}</h4>
                  <p className="text-gray-400 text-lg md:text-xl lg:text-2xl leading-relaxed font-light">
                    {content.aboutPage.missionDesc}
                  </p>
                </div>
                <div className="p-12 md:p-16 lg:p-24 rounded-[60px] lg:rounded-[80px] bg-white/[0.03] border border-white/5 hover:border-purple-500/30 transition-all group">
                  <div className="mb-10 lg:mb-16 w-20 h-20 lg:w-32 lg:h-32 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-[0_0_20px_rgba(147,51,234,0.2)] group-hover:scale-110 transition-all">
                    <Eye size={36} className="lg:w-16 lg:h-16" />
                  </div>
                  <h4 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight mb-8 leading-none text-white">{content.aboutPage.visionTitle}</h4>
                  <p className="text-gray-400 text-lg md:text-xl lg:text-2xl leading-relaxed font-light">
                    {content.aboutPage.visionDesc}
                  </p>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter mb-16 lg:mb-24 leading-none">{content.aboutPage.strengthsTitle}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20">
                  {content.aboutPage.strengths.map((strength, i) => {
                    const [title, desc] = strength.split(': ');
                    return (
                      <div key={i} className="flex gap-8 lg:gap-12 p-10 lg:p-16 rounded-[40px] lg:rounded-[60px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all text-left group">
                        <div className="shrink-0 w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                          <CheckCircle2 size={24} className="lg:w-8 lg:h-8" />
                        </div>
                        <div>
                          <h5 className="text-xl md:text-2xl lg:text-3xl font-black uppercase tracking-tight text-white mb-3 lg:mb-6">{title}</h5>
                          <p className="text-gray-500 text-base md:text-lg lg:text-xl font-light leading-relaxed group-hover:text-gray-300 transition-colors">{desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="w-full max-w-7xl lg:max-w-none mx-auto p-10 md:p-14 lg:p-24 rounded-[60px] lg:rounded-[100px] bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-cyan-500/20 text-center lg:text-left shadow-[0_30px_100px_rgba(0,0,0,0.5)] relative overflow-hidden group mt-12 lg:mt-32">
                 <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                 <div className="relative z-10 lg:flex lg:items-center lg:justify-between gap-12">
                    <h4 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter mb-8 lg:mb-0 leading-none">
                      {content.aboutPage.finalCTA}
                    </h4>
                    <button 
                      onClick={() => handleNavClick('contact')}
                      className="px-12 py-6 lg:px-16 lg:py-8 bg-cyan-500 text-black font-black uppercase tracking-[0.4em] text-xs lg:text-sm rounded-full hover:bg-white transition-all transform hover:scale-105 shadow-2xl shadow-cyan-500/20 active:scale-95 shrink-0"
                    >
                      {content.contact.cta_button}
                    </button>
                 </div>
              </div>
            </div>
          </SectionWrapper>
        </main>
      ) : (
        <main className="animate-in fade-in duration-1000">
           <SectionWrapper id="contact-page" className="pt-24 pb-24 lg:pt-48 lg:pb-48">
             <div className="max-w-[1440px] mx-auto w-full relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
                  
                  {/* Info Column */}
                  <div className="lg:col-span-5 text-center lg:text-left space-y-12">
                    <div>
                      <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black mb-8 uppercase tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-400 to-purple-600">
                        {content.contact.title}
                      </h1>
                      <p className="text-gray-400 text-xl md:text-2xl lg:text-3xl font-light leading-relaxed italic">
                        {content.contact.subtitle}
                      </p>
                    </div>

                    <div className="hidden lg:flex flex-col gap-8">
                       <div className="flex items-center gap-6 p-8 rounded-[40px] bg-white/[0.03] border border-white/10 group hover:border-cyan-500/40 transition-all duration-500">
                         <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                           <Mail size={32} />
                         </div>
                         <div>
                           <span className="block text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-1">Scrivici</span>
                           <span className="text-xl font-black">info@villalva.studio</span>
                         </div>
                       </div>
                       <div className="flex items-center gap-6 p-8 rounded-[40px] bg-white/[0.03] border border-white/10 group hover:border-cyan-500/40 transition-all duration-500">
                         <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                           <Phone size={32} />
                         </div>
                         <div>
                           <span className="block text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-1">Chiamaci</span>
                           <span className="text-xl font-black">+39 123 456 789</span>
                         </div>
                       </div>
                    </div>
                  </div>

                  {/* Form Column */}
                  <div className="lg:col-span-7">
                    <form className="space-y-8 lg:space-y-12 bg-black/40 p-8 md:p-12 lg:p-16 rounded-[40px] md:rounded-[60px] border border-white/5 backdrop-blur-xl shadow-2xl" onSubmit={e => e.preventDefault()}>
                      <div className="grid sm:grid-cols-2 gap-8 lg:gap-12">
                        <div className="space-y-2">
                          <label className="text-[10px] lg:text-xs font-black uppercase tracking-[0.3em] text-cyan-400 ml-4">{content.contact.name}</label>
                          <input className="w-full bg-white/[0.02] border border-white/10 rounded-[30px] lg:rounded-[40px] px-8 py-6 lg:py-8 text-lg lg:text-xl font-bold focus:border-cyan-500 outline-none transition-all placeholder:text-gray-700 text-white" placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] lg:text-xs font-black uppercase tracking-[0.3em] text-cyan-400 ml-4">{content.contact.email}</label>
                          <input className="w-full bg-white/[0.02] border border-white/10 rounded-[30px] lg:rounded-[40px] px-8 py-6 lg:py-8 text-lg lg:text-xl font-bold focus:border-cyan-500 outline-none transition-all placeholder:text-gray-700 text-white" placeholder="email@example.com" />
                        </div>
                      </div>

                      <div className="space-y-6 lg:space-y-10">
                        <h3 className="text-sm lg:text-lg font-black uppercase tracking-[0.4em] text-white border-l-4 border-cyan-500 pl-4">{content.contact.services_label}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                          {content.contact.services.map((service) => (
                            <button
                              key={service.id}
                              type="button"
                              onClick={() => toggleService(service.id)}
                              className={`flex items-center gap-4 p-5 lg:p-6 rounded-[25px] lg:rounded-[30px] border transition-all text-left group ${
                                selectedServices.has(service.id)
                                  ? 'bg-cyan-500 border-cyan-500 text-black shadow-[0_10px_30px_rgba(6,182,212,0.3)]'
                                  : 'bg-white/[0.02] border-white/10 text-gray-500 hover:border-cyan-500/50 hover:text-white'
                              }`}
                            >
                              <div className={`shrink-0 w-6 h-6 lg:w-7 lg:h-7 rounded-full border flex items-center justify-center transition-all ${
                                selectedServices.has(service.id) ? 'bg-black border-black' : 'border-gray-700 group-hover:border-cyan-500'
                              }`}>
                                {selectedServices.has(service.id) && <Check size={14} className="text-cyan-400 lg:w-4 lg:h-4" />}
                              </div>
                              <span className="text-[10px] lg:text-xs font-black uppercase tracking-widest">{service.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] lg:text-xs font-black uppercase tracking-[0.3em] text-cyan-400 ml-4">{content.contact.message}</label>
                        <textarea 
                          rows={6} 
                          value={formMessage}
                          onChange={(e) => setFormMessage(e.target.value)}
                          className="w-full bg-white/[0.02] border border-white/10 rounded-[40px] lg:rounded-[50px] px-8 py-8 lg:py-10 text-lg lg:text-xl font-bold focus:border-cyan-500 outline-none resize-none transition-all placeholder:text-gray-700 text-white" 
                          placeholder="Parlaci del tuo progetto..." 
                        />
                      </div>

                      <button className="w-full py-6 lg:py-8 bg-cyan-500 text-black font-black uppercase tracking-[0.4em] text-xs lg:text-sm rounded-full hover:bg-white transition-all transform hover:scale-[1.02] shadow-2xl shadow-cyan-500/20 active:scale-95 shrink-0 flex items-center justify-center gap-4">
                        <Send size={18} className="lg:w-6 lg:h-6" /> {content.contact.send}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
           </SectionWrapper>
        </main>
      )}

      <footer className="bg-black text-white pt-10 lg:pt-20 pb-10 lg:pb-20 px-6 sm:px-12 md:px-24 border-t border-white/5 relative z-20">
        <div className="max-w-[1920px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-12 mb-16 lg:mb-32">
          <div className="space-y-8 lg:space-y-12">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('home')}>
              <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl flex items-center justify-center font-black text-white">DV</div>
              <span className="text-xl lg:text-3xl font-black uppercase tracking-tighter">Villalva Studio</span>
            </div>
            <p className="text-gray-400 text-sm lg:text-lg leading-relaxed font-light">
              Design d'avanguardia e strategie social potenziate dall'AI. Eleviamo la tua presenza digitale combinando estetica accademica e potenza computazionale.
            </p>
          </div>

          <div className="space-y-8 lg:space-y-12">
            <h4 className="text-[10px] lg:text-xs font-black uppercase tracking-[0.4em] text-cyan-400">Navigazione</h4>
            <ul className="space-y-4 lg:space-y-6 text-xs lg:text-base font-black text-gray-400 uppercase tracking-widest">
              <li className="hover:text-white cursor-pointer transition-colors" onClick={() => handleNavClick('home')}>Home</li>
              <li className="hover:text-white cursor-pointer transition-colors" onClick={() => handleNavClick('services')}>Servizi</li>
              <li className="hover:text-white cursor-pointer transition-colors" onClick={() => handleNavClick('blog')}>Blog</li>
              <li className="hover:text-white cursor-pointer transition-colors" onClick={() => handleNavClick('about')}>Chi Siamo</li>
              <li className="hover:text-white cursor-pointer transition-colors" onClick={() => handleNavClick('contact')}>Contatti</li>
            </ul>
          </div>

          <div className="space-y-8 lg:space-y-12">
            <h4 className="text-[10px] lg:text-xs font-black uppercase tracking-[0.4em] text-cyan-400">Contatti</h4>
            <div className="space-y-4 lg:space-y-6">
              <a href="mailto:info@villalva.studio" className="flex items-center gap-4 text-xs lg:text-base font-black text-gray-400 hover:text-white transition-colors uppercase tracking-widest group">
                <Mail size={16} className="text-cyan-500 group-hover:scale-110 transition-transform lg:w-6 lg:h-6" /> info@villalva.studio
              </a>
              <a href="tel:+39123456789" className="flex items-center gap-4 text-xs lg:text-base font-black text-gray-400 hover:text-white transition-colors uppercase tracking-widest group">
                <Phone size={16} className="text-cyan-500 group-hover:scale-110 transition-transform lg:w-6 lg:h-6" /> +39 123 456 789
              </a>
            </div>
          </div>

          <div className="space-y-8 lg:space-y-12">
            <h4 className="text-[10px] lg:text-xs font-black uppercase tracking-[0.4em] text-cyan-400">Social Media</h4>
            <SocialIcons iconSize="w-5 h-5 lg:w-8 lg:h-8" className="gap-6 lg:gap-10" />
          </div>
        </div>

        <div className="max-w-[1920px] mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] lg:text-xs font-black uppercase tracking-[0.3em] text-gray-600">
            © {new Date().getFullYear()} Digital Studio Villalva. All rights reserved.
          </p>
          <div className="flex gap-12 text-[9px] lg:text-xs font-black uppercase tracking-[0.3em] text-gray-600">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </footer>

      <style>{`
        :root {
          --primary-color: #22d3ee;
          --accent-color: #9333ea;
          --bg-color: #050505;
          --text-color: #ffffff;
          --muted-color: #9ca3af;
          --bg-gradient: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
        }
        body { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: var(--bg-color); }
        ::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 20px; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.02); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<App />);