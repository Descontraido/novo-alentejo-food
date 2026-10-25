import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Menu,
  X,
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowUp,
  Wine,
  UtensilsCrossed,
  Flame,
  Star,
  ShoppingBag,
  Truck,
  MessageCircle,
  Soup,
  Beef,
  CakeSlice,
  GlassWater,
  Check,
} from 'lucide-react';

// ─── WhatsApp Config ───────────────────────────────────────────────────────────
const WHATSAPP_NUMBER = '351266700000';
const WHATSAPP_GENERAL_MSG = encodeURIComponent(
  'Olá! Gostaria de saber mais sobre o restaurante Sabores do Alentejo.'
);
const WHATSAPP_RESERVA_MSG = encodeURIComponent(
  'Olá! Gostaria de fazer uma reserva no Sabores do Alentejo.'
);
const WHATSAPP_ENCOMENDA_MSG = encodeURIComponent(
  'Olá! Gostaria de fazer uma encomenda para levar ou entrega.'
);

const openWhatsApp = (message?: string) => {
  const msg = message || WHATSAPP_GENERAL_MSG;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
};

// ─── Image URLs ────────────────────────────────────────────────────────────────
const IMAGES = {
  hero: 'https://images.pexels.com/photos/29068723/pexels-photo-29068723.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  foodSpread: 'https://images.pexels.com/photos/5732812/pexels-photo-5732812.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  soup: 'https://images.pexels.com/photos/19503781/pexels-photo-19503781.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  pork: 'https://images.pexels.com/photos/8862714/pexels-photo-8862714.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
  stew: 'https://images.pexels.com/photos/17803250/pexels-photo-17803250.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
  dessert: 'https://images.pexels.com/photos/34334096/pexels-photo-34334096.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
  vineyard: 'https://images.pexels.com/photos/32906683/pexels-photo-32906683.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  tavern: 'https://images.pexels.com/photos/1872888/pexels-photo-1872888.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
};

// ─── Menu Data ─────────────────────────────────────────────────────────────────
type MenuCategory = 'entradas' | 'pratos' | 'sobremesas' | 'bebidas';

interface MenuItem {
  name: string;
  description: string;
  price: string;
  tag?: string;
  image: string;
}

const MENU_CATEGORIES: { key: MenuCategory; label: string; shortLabel: string; icon: typeof Soup }[] = [
  { key: 'entradas', label: 'Entradas', shortLabel: 'Entradas', icon: Soup },
  { key: 'pratos', label: 'Pratos Principais', shortLabel: 'Pratos', icon: Beef },
  { key: 'sobremesas', label: 'Sobremesas', shortLabel: 'Sobremesas', icon: CakeSlice },
  { key: 'bebidas', label: 'Bebidas', shortLabel: 'Bebidas', icon: GlassWater },
];

const MENU_ITEMS: Record<MenuCategory, MenuItem[]> = {
  entradas: [
    { name: 'Açorda Alentejana', description: 'Sopa de pão com coentros, alho e ovo escalfado', price: '8,50€', tag: 'Clássico', image: 'https://images.pexels.com/photos/3728383/pexels-photo-3728383.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200' },
    { name: 'Sopa de Cação', description: 'Sopa tradicional de peixe com pão alentejano', price: '9,00€', tag: 'Clássico', image: 'https://images.pexels.com/photos/17312402/pexels-photo-17312402.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200' },
    { name: 'Queijo Serpa', description: 'Queijo de ovelha curado com mel do Alentejo', price: '7,50€', image: 'https://images.pexels.com/photos/31372431/pexels-photo-31372431.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200' },
    { name: 'Enchidos Regionais', description: 'Presunto, chouriço e morcela de porco preto', price: '10,00€', tag: 'Popular', image: 'https://images.pexels.com/photos/19585057/pexels-photo-19585057.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200' },
    { name: 'Tomate Alentejano', description: 'Tomate fresco com azeite, alho e orégãos', price: '6,50€', image: 'https://images.pexels.com/photos/19711352/pexels-photo-19711352.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200' },
    { name: 'Melão com Presunto', description: 'Melão fresco com presunto de porco preto ibérico', price: '9,50€', image: 'https://images.pexels.com/photos/29068725/pexels-photo-29068725.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200' },
  ],
  pratos: [
    { name: 'Porco Preto Grelhado', description: 'Lombo de porco preto ibérico com batatas assadas e grelos salteados', price: '18,50€', tag: 'Chef', image: 'https://images.pexels.com/photos/31029751/pexels-photo-31029751.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200' },
    { name: 'Ensopado de Borrego', description: 'Borrego estufado em panela de barro com pão e batata', price: '16,50€', tag: 'Clássico', image: 'https://images.pexels.com/photos/29253254/pexels-photo-29253254.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200' },
    { name: 'Migas com Carne de Porco', description: 'Migas de pão com entremeada e grelos de nabiça', price: '14,00€', image: 'https://images.pexels.com/photos/13774718/pexels-photo-13774718.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200' },
    { name: 'Bacalhau à Alentejana', description: 'Bacalhau assado com grão-de-bico, batata e coentros', price: '16,00€', image: 'https://images.pexels.com/photos/31372386/pexels-photo-31372386.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200' },
    { name: 'Frango de Cabidela', description: 'Frango estufado no próprio sangue com arroz', price: '14,50€', image: 'https://images.pexels.com/photos/2673353/pexels-photo-2673353.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200' },
    { name: 'Secretos de Porco Preto', description: 'Secretos ibéricos grelhados com sal e alho', price: '17,00€', tag: 'Popular', image: 'https://images.pexels.com/photos/8862714/pexels-photo-8862714.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200' },
    { name: 'Cozido de Grão', description: 'Cozido tradicional com grão, legumes e carnes', price: '13,50€', image: 'https://images.pexels.com/photos/37065023/pexels-photo-37065023.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200' },
    { name: 'Pluma Ibérica', description: 'Pluma de porco preto grelhada com batata-doce', price: '19,00€', tag: 'Chef', image: 'https://images.pexels.com/photos/18015000/pexels-photo-18015000.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200' },
  ],
  sobremesas: [
    { name: 'Sericaia', description: 'Pudim de ovos com canela, receita conventual', price: '6,00€', tag: 'Clássico', image: 'https://images.pexels.com/photos/34334096/pexels-photo-34334096.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200' },
    { name: 'Encharcada', description: 'Doce conventual de ovos e amêndoa', price: '5,50€', image: 'https://images.pexels.com/photos/36737341/pexels-photo-36737341.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200' },
    { name: 'Toucinho do Céu', description: 'Bolo tradicional alentejano de amêndoa e ovos', price: '5,00€', image: 'https://images.pexels.com/photos/37382225/pexels-photo-37382225.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200' },
    { name: 'Bolo Rançoso', description: 'Bolo rústico com pão, canela e amêndoa', price: '4,50€', image: 'https://images.pexels.com/photos/10885488/pexels-photo-10885488.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200' },
    { name: 'Natas do Céu', description: 'Pudim cremoso com natas e ovos', price: '5,50€', tag: 'Popular', image: 'https://images.pexels.com/photos/34315402/pexels-photo-34315402.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200' },
    { name: 'Queijinhos do Céu', description: 'Queijinhos doces de amêndoa e ovos', price: '5,00€', image: 'https://images.pexels.com/photos/23336564/pexels-photo-23336564.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
  ],
  bebidas: [
    { name: 'Vinho Tinto Alentejano', description: 'Seleção de vinhos tintos regionais (copo)', price: '4,00€', image: 'https://images.pexels.com/photos/6688471/pexels-photo-6688471.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200' },
    { name: 'Vinho Branco Alentejano', description: 'Seleção de vinhos brancos regionais (copo)', price: '3,50€', image: 'https://images.pexels.com/photos/8472900/pexels-photo-8472900.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200' },
    { name: 'Vinho da Casa (jarro)', description: 'Vinho da casa, tinto ou branco', price: '8,00€', tag: 'Popular', image: 'https://images.pexels.com/photos/5524007/pexels-photo-5524007.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200' },
    { name: 'Licor de Amêndoa Amarga', description: 'Licor tradicional alentejano', price: '4,00€', image: 'https://images.pexels.com/photos/6760879/pexels-photo-6760879.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200' },
    { name: 'Licor de Mel', description: 'Licor artesanal de mel do Alentejo', price: '3,50€', image: 'https://images.pexels.com/photos/6760875/pexels-photo-6760875.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200' },
    { name: 'Cerveja Sagres', description: 'Cerveja portuguesa (garrafa)', price: '3,00€', image: 'https://images.pexels.com/photos/7421851/pexels-photo-7421851.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200' },
    { name: 'Água de Monchique', description: 'Água mineral natural algarvia', price: '2,00€', image: 'https://images.pexels.com/photos/7564983/pexels-photo-7564983.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200' },
    { name: 'Café Expresso', description: 'Café tradicional português', price: '1,20€', image: 'https://images.pexels.com/photos/34315406/pexels-photo-34315406.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200' },
  ],
};

// ─── Dish Data ─────────────────────────────────────────────────────────────────
const DISHES = [
  {
    image: IMAGES.soup,
    title: 'Açorda Alentejana',
    description: 'Sopa de pão tradicional com coentros, alho e ovo escalfado, receita centenária do Alentejo.',
    icon: UtensilsCrossed,
  },
  {
    image: IMAGES.pork,
    title: 'Porco Preto',
    description: 'Carne de porco preto ibérico, criado em montado, grelhado na perfeição com ervas aromáticas.',
    icon: Flame,
  },
  {
    image: IMAGES.stew,
    title: 'Ensopado de Borrego',
    description: 'Borrego estufado lentamente com batata, pão e especiarias, cozinhado em panela de barro.',
    icon: Wine,
  },
  {
    image: IMAGES.dessert,
    title: 'Doçaria Conventual',
    description: 'Sobremesas tradicionais feitas com ovos, açúcar e amêndoas, seguindo receitas seculares.',
    icon: Star,
  },
];

// ─── Locations Data ────────────────────────────────────────────────────────────
const LOCATIONS = [
  {
    name: 'Elvas',
    address: 'Rua da República, 15, 7350-136 Elvas',
    phone: '+351 268 622 000',
    hours: 'Ter-Dom: 12h-23h',
    mapUrl: 'https://maps.google.com/?q=Elvas+Portugal',
  },
  {
    name: 'Santa Eulália',
    address: 'Largo da República, 7350-421 Santa Eulália',
    phone: '+351 268 674 000',
    hours: 'Ter-Dom: 12h-22h',
    mapUrl: 'https://maps.google.com/?q=Santa+Eulália+Elvas+Portugal',
  },
];

// ─── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Detect active section
      const sections = ['menu', 'especialidades', 'tradição', 'localizações', 'reservas'];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Menu', href: '#menu' },
    { label: 'Especialidades', href: '#especialidades' },
    { label: 'Tradição', href: '#tradição' },
    { label: 'Localizações', href: '#localizações' },
  ];

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-bark/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 sm:gap-3 group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gold flex items-center justify-center group-hover:bg-gold-light transition-colors">
              <UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5 text-bark" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-base sm:text-xl font-bold tracking-wide text-cream">
                Sabores
              </span>
              <span className="font-accent text-[10px] sm:text-xs tracking-[0.25em] sm:tracking-[0.3em] uppercase text-gold leading-none">
                do Alentejo
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`text-sm font-medium tracking-wide uppercase transition-colors relative ${
                  activeSection === link.href.replace('#', '')
                    ? 'text-gold'
                    : 'text-cream/80 hover:text-gold'
                }`}
              >
                {link.label}
                {activeSection === link.href.replace('#', '') && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold rounded-full" />
                )}
              </a>
            ))}
            <a
              href="#reservas"
              onClick={(e) => handleNavClick(e, '#reservas')}
              className="bg-gold hover:bg-gold-light text-bark px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all hover:shadow-lg hover:shadow-gold/30"
            >
              Reservas
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-cream p-2"
            aria-label="Abrir menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-bark/95 backdrop-blur-md px-4 py-6 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`block text-base font-medium tracking-wide uppercase py-2 transition-colors ${
                activeSection === link.href.replace('#', '')
                  ? 'text-gold'
                  : 'text-cream/80 hover:text-gold'
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#reservas"
            onClick={(e) => handleNavClick(e, '#reservas')}
            className="inline-block bg-gold hover:bg-gold-light text-bark px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all mt-2"
          >
            Reservas
          </a>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero Section ──────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section id="inicio" className="relative h-screen min-h-[600px] sm:min-h-[700px] flex items-center justify-center overflow-hidden pt-16">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={IMAGES.hero}
          alt="Mesa farta de comida alentejana"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bark/70 via-bark/50 to-bark/80" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-8 opacity-20 hidden lg:block">
        <svg width="60" height="400" viewBox="0 0 60 400" fill="none">
          <line x1="30" y1="0" x2="30" y2="400" stroke="#C5993E" strokeWidth="1" />
          <circle cx="30" cy="200" r="8" fill="#C5993E" />
          <circle cx="30" cy="200" r="15" stroke="#C5993E" strokeWidth="1" fill="none" />
        </svg>
      </div>
      <div className="absolute top-1/3 right-8 opacity-20 hidden lg:block">
        <svg width="60" height="300" viewBox="0 0 60 300" fill="none">
          <line x1="30" y1="0" x2="30" y2="300" stroke="#C5993E" strokeWidth="1" />
          <circle cx="30" cy="150" r="8" fill="#C5993E" />
          <circle cx="30" cy="150" r="15" stroke="#C5993E" strokeWidth="1" fill="none" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="mb-4 sm:mb-6 animate-fade-in-up">
          <span className="inline-block font-accent text-gold text-sm sm:text-lg md:text-xl tracking-[0.25em] sm:tracking-[0.3em] uppercase">
            Cozinha Tradicional
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-cream leading-[1.1] mb-4 sm:mb-6 animate-fade-in-up text-balance" style={{ animationDelay: '0.2s' }}>
          Sabores do
          <br />
          <span className="text-gold">Alentejo</span>
        </h1>
        <p className="font-body text-cream/80 text-sm sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 sm:mb-10 animate-fade-in-up px-2" style={{ animationDelay: '0.4s' }}>
          Descubra a autenticidade da gastronomia alentejana, onde cada prato conta
          uma história de tradição, terra e alma portuguesa.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-in-up px-4" style={{ animationDelay: '0.6s' }}>
          <a
            href="#menu"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-gold hover:bg-gold-light text-bark px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold tracking-wide transition-all hover:shadow-lg hover:shadow-gold/30 flex items-center justify-center gap-2 group text-sm sm:text-base"
          >
            Ver Menu
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <button
            onClick={() => openWhatsApp(WHATSAPP_RESERVA_MSG)}
            className="border-2 border-cream/30 hover:border-gold text-cream hover:text-gold px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold tracking-wide transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <MessageCircle className="w-4 h-4" />
            Fazer Reserva
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer"
        aria-label="Scroll para baixo"
      >
        <div className="w-6 h-10 border-2 border-cream/30 rounded-full flex items-start justify-center pt-2">
          <div className="w-1.5 h-3 bg-gold rounded-full" />
        </div>
      </button>
    </section>
  );
}

// ─── Menu Section (Improved) ───────────────────────────────────────────────────
function MenuSection() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('entradas');

  return (
    <section id="menu" className="py-14 sm:py-20 lg:py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <span className="font-accent text-gold-dark text-base sm:text-lg tracking-[0.2em] uppercase">
            O Nosso Menu
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-bark leading-tight mt-3 sm:mt-4">
            Cozinhado com
            <br />
            <span className="text-wine">alma alentejana</span>
          </h2>
          <p className="text-bark-light/70 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto mt-4 sm:mt-6 px-2">
            Cada prato é preparado diariamente com ingredientes frescos e locais,
            respeitando as receitas tradicionais.
          </p>
        </div>

        {/* Category Tabs - Grid 2x2 em mobile, flex em desktop */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
          {MENU_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all whitespace-nowrap ${
                activeCategory === cat.key
                  ? 'bg-wine text-cream shadow-lg shadow-wine/30 scale-[1.02]'
                  : 'bg-white text-bark hover:bg-wine/10 shadow-md'
              }`}
            >
              <cat.icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">
                <span className="sm:hidden">{cat.shortLabel}</span>
                <span className="hidden sm:inline">{cat.label}</span>
              </span>
            </button>
          ))}
        </div>

        {/* Menu Items Grid - 1 col mobile, 2 col tablet+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 max-w-6xl mx-auto">
          {MENU_ITEMS[activeCategory].map((item) => (
            <div
              key={item.name}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all hover:-translate-y-0.5 duration-300 overflow-hidden group"
            >
              {/* Mobile: Imagem no topo (stacked) | Desktop: horizontal */}
              <div className="flex flex-col sm:flex-row h-full">
                {/* Image */}
                <div className="relative w-full sm:w-36 h-40 sm:h-auto flex-shrink-0 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-transparent to-white/5" />
                </div>
                {/* Content */}
                <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-base sm:text-lg font-bold text-bark group-hover:text-wine transition-colors leading-tight">
                        {item.name}
                      </h3>
                      {item.tag && (
                        <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0 ${
                          item.tag === 'Clássico' ? 'bg-gold/20 text-gold-dark' :
                          item.tag === 'Popular' ? 'bg-olive/20 text-olive' :
                          item.tag === 'Chef' ? 'bg-wine/20 text-wine' :
                          'bg-bark/10 text-bark-light'
                        }`}>
                          {item.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-bark-light/60 text-xs sm:text-sm mt-1.5 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-display text-lg sm:text-xl font-bold text-wine">
                      {item.price}
                    </span>
                    <button
                      onClick={() => {
                        const msg = encodeURIComponent(
                          `Olá! Gostaria de encomendar: ${item.name} (${item.price})`
                        );
                        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
                      }}
                      className="text-wine/50 hover:text-wine transition-colors p-2 -m-2 active:scale-95"
                      aria-label={`Encomendar ${item.name}`}
                    >
                      <ShoppingBag className="w-5 h-5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10 sm:mt-12 px-4">
          <button
            onClick={() => openWhatsApp(WHATSAPP_ENCOMENDA_MSG)}
            className="bg-wine hover:bg-wine-dark text-cream px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-semibold tracking-wide transition-all hover:shadow-lg hover:shadow-wine/30 inline-flex items-center gap-2 group text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            <ShoppingBag className="w-4 h-4" />
            Encomendar via WhatsApp
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-bark/10 max-w-2xl mx-auto text-center">
          <div>
            <span className="font-display text-2xl sm:text-3xl font-bold text-wine">25+</span>
            <p className="text-bark-light/60 text-xs sm:text-sm mt-1">Pratos Tradicionais</p>
          </div>
          <div>
            <span className="font-display text-2xl sm:text-3xl font-bold text-wine">100%</span>
            <p className="text-bark-light/60 text-xs sm:text-sm mt-1">Ingredientes Locais</p>
          </div>
          <div>
            <span className="font-display text-2xl sm:text-3xl font-bold text-wine">2</span>
            <p className="text-bark-light/60 text-xs sm:text-sm mt-1">Localizações</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Order Section ─────────────────────────────────────────────────────────────
function OrderSection() {
  return (
    <section className="py-14 sm:py-20 lg:py-28 bg-wine relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.03) 35px, rgba(255,255,255,0.03) 70px)`,
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={IMAGES.tavern}
                alt="Interior do restaurante"
                className="w-full h-[280px] sm:h-[360px] lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bark/40 to-transparent" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6 sm:space-y-8 order-1 lg:order-2">
            <div className="space-y-3 sm:space-y-4">
              <span className="font-accent text-gold text-base sm:text-lg tracking-[0.2em] uppercase">
                Para Levar
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-cream leading-tight">
                Encomende os
                <br />
                <span className="text-gold">sabores do Alentejo</span>
              </h2>
            </div>
            <p className="text-cream/80 text-sm sm:text-base md:text-lg leading-relaxed max-w-lg">
              Leve a autenticidade alentejana para sua casa. Encomende para entrega
              ou levantamento no restaurante.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => openWhatsApp(WHATSAPP_ENCOMENDA_MSG)}
                className="bg-gold hover:bg-gold-light text-bark px-6 py-3.5 sm:px-8 sm:py-4 rounded-full font-semibold tracking-wide transition-all hover:shadow-lg hover:shadow-gold/30 flex items-center justify-center gap-2 group text-sm sm:text-base"
              >
                <Truck className="w-4 h-4" />
                Entrega ao Domicílio
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => openWhatsApp(WHATSAPP_ENCOMENDA_MSG)}
                className="border-2 border-cream/30 hover:border-gold text-cream hover:text-gold px-6 py-3.5 sm:px-8 sm:py-4 rounded-full font-semibold tracking-wide transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <ShoppingBag className="w-4 h-4" />
                Levantamento
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Highlights Section ────────────────────────────────────────────────────────
function HighlightsSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollToSlide = (index: number) => {
    const newIndex = ((index % DISHES.length) + DISHES.length) % DISHES.length;
    setActiveSlide(newIndex);
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.children[0]?.clientWidth || 0;
      sliderRef.current.scrollTo({
        left: newIndex * (cardWidth + 24),
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="especialidades" className="py-20 lg:py-32 bg-cream-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="font-accent text-gold-dark text-lg tracking-[0.2em] uppercase">
            Especialidades
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-bark mt-4">
            Algo para <span className="text-wine">todos</span>
          </h2>
          <p className="text-bark-light/60 text-lg mt-4 max-w-2xl mx-auto">
            Dos sucos do Alentejo aos pratos de resistência, descubra as nossas especialidades
            que honram séculos de tradição gastronómica.
          </p>
        </div>

        {/* Mobile: Grid layout (shows all cards) */}
        <div className="grid grid-cols-2 gap-4 md:hidden">
          {DISHES.map((dish) => (
            <div key={dish.title}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg group">
                <div className="relative overflow-hidden h-[140px]">
                  <img
                    src={dish.image}
                    alt={dish.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bark/20 to-transparent" />
                  <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-cream/90 flex items-center justify-center">
                    <dish.icon className="w-4 h-4 text-wine" />
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-display text-sm font-bold text-bark mb-1">
                    {dish.title}
                  </h3>
                  <p className="text-bark-light/60 text-xs leading-relaxed line-clamp-2">
                    {dish.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Slider layout */}
        <div className="relative hidden md:block">
          {/* Navigation Arrows */}
          <button
            onClick={() => scrollToSlide(activeSlide - 1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gold hover:text-bark transition-all"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scrollToSlide(activeSlide + 1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gold hover:text-bark transition-all"
            aria-label="Próximo"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Cards Container */}
          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 px-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {DISHES.map((dish) => (
              <div
                key={dish.title}
                className="flex-shrink-0 w-[340px] snap-center"
              >
                <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
                  <div className="relative overflow-hidden h-[320px]">
                    <img
                      src={dish.image}
                      alt={dish.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bark/20 to-transparent" />
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-cream/90 flex items-center justify-center">
                      <dish.icon className="w-5 h-5 text-wine" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold text-bark mb-2">
                      {dish.title}
                    </h3>
                    <p className="text-bark-light/60 text-sm leading-relaxed">
                      {dish.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {DISHES.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  activeSlide === index
                    ? 'bg-wine w-8'
                    : 'bg-bark/20 hover:bg-bark/40'
                }`}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Tradition / Marquee Section ───────────────────────────────────────────────
function TraditionSection() {
  const marqueeItems = [
    'Azeite do Alentejo',
    'Pão de Masse Velha',
    'Vinho Alentejano',
    'Queijo Serpa',
    'Porco Preto',
    'Mel do Alentejo',
    'Açorda Tradicional',
    'Enchidos Regionais',
  ];

  return (
    <section id="tradição" className="py-14 sm:py-20 lg:py-28 bg-bark relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Content */}
          <div className="space-y-5 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <span className="font-accent text-gold text-base sm:text-lg tracking-[0.2em] uppercase">
                Tradição
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-cream leading-tight">
                Raízes que se
                <br />
                <span className="text-gold">saboreiam</span>
              </h2>
            </div>
            <p className="text-cream/70 text-sm sm:text-base md:text-lg leading-relaxed max-w-lg">
              A gastronomia alentejana é património vivo. Das planícies douradas ao
              montado de sobro e azinhe, cada ingrediente carrega a essência de uma
              terra que sabe preservar o que de melhor tem.
            </p>
            <button
              onClick={() => openWhatsApp(WHATSAPP_GENERAL_MSG)}
              className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors font-semibold group text-sm sm:text-base"
            >
              Saiba Mais
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={IMAGES.vineyard}
                alt="Vinhedos do Alentejo"
                className="w-full h-[280px] sm:h-[360px] lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-bark/40 to-transparent" />
            </div>
            {/* Decorative card */}
            <div className="absolute -bottom-4 sm:-bottom-6 -right-3 sm:-right-6 bg-gold rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-xl hidden sm:block">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-bark/10 flex items-center justify-center">
                  <Wine className="w-5 h-5 sm:w-6 sm:h-6 text-bark" />
                </div>
                <div>
                  <span className="font-semibold text-bark text-xs sm:text-sm">Vinho Alentejano</span>
                  <p className="text-bark/60 text-[10px] sm:text-xs">Denominação de Origem</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="mt-20 border-t border-b border-cream/10 py-6 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className="mx-8 font-accent text-2xl sm:text-3xl text-cream/20 uppercase tracking-widest flex items-center gap-8"
            >
              {item}
              <span className="w-2 h-2 rounded-full bg-gold/40" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Locations Section ─────────────────────────────────────────────────────────
function LocationsSection() {
  return (
    <section id="localizações" className="py-14 sm:py-20 lg:py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <span className="font-accent text-gold-dark text-base sm:text-lg tracking-[0.2em] uppercase">
            Localizações
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-bark mt-3 sm:mt-4">
            Encontre o seu <span className="text-wine">Sabores</span>
          </h2>
          <p className="text-bark-light/60 text-sm sm:text-base md:text-lg mt-3 sm:mt-4 max-w-2xl mx-auto px-2">
            Visite-nos em qualquer um dos nossos restaurantes pelo coração do Alentejo.
          </p>
        </div>

        {/* Location Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {LOCATIONS.map((loc) => (
            <div
              key={loc.name}
              className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-shadow group hover:-translate-y-1 duration-300"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-wine/10 flex items-center justify-center mb-4 sm:mb-5 group-hover:bg-wine/20 transition-colors">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-wine" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-bark mb-3 sm:mb-4">
                {loc.name}
              </h3>
              <div className="space-y-2.5 sm:space-y-3 text-bark-light/60 text-sm">
                <p>{loc.address}</p>
                <a
                  href={`tel:${loc.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-2 hover:text-wine transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {loc.phone}
                </a>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {loc.hours}
                </p>
              </div>
              <a
                href={loc.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-wine hover:text-wine-dark mt-4 sm:mt-5 text-sm font-semibold transition-colors group/link"
              >
                Ver no Google Maps
                <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
              </a>
            </div>
          ))}
        </div>

        {/* Mapa - Elvas e Santa Eulália */}
        <div className="mt-12 sm:mt-16">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-bark">
              Onde nos <span className="text-wine">encontrar</span>
            </h3>
            <p className="text-bark-light/60 text-sm sm:text-base mt-2">
              Explore a localização dos nossos restaurantes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Mapa Elvas */}
            <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg">
              <div className="p-4 sm:p-5 border-b border-bark/10 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-wine" />
                <h4 className="font-display text-lg sm:text-xl font-bold text-bark">
                  Elvas
                </h4>
              </div>
              <div className="relative w-full h-[280px] sm:h-[340px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12345.67!2d-7.1635!3d38.8809!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd163a3f6f9b5b5b%3A0x1234567890abcdef!2sElvas%2C%20Portugal!5e0!3m2!1spt-PT!2spt!4v1700000000000!5m2!1spt-PT!2spt"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mapa de Elvas"
                />
              </div>
              <div className="p-4 sm:p-5">
                <a
                  href="https://maps.google.com/?q=Elvas+Portugal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-wine hover:bg-wine-dark text-cream px-4 py-2 rounded-full text-sm font-semibold transition-all"
                >
                  <MapPin className="w-4 h-4" />
                  Abrir no Google Maps
                </a>
              </div>
            </div>

            {/* Mapa Santa Eulália */}
            <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg">
              <div className="p-4 sm:p-5 border-b border-bark/10 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-wine" />
                <h4 className="font-display text-lg sm:text-xl font-bold text-bark">
                  Santa Eulália
                </h4>
              </div>
              <div className="relative w-full h-[280px] sm:h-[340px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12345.67!2d-7.2181!3d38.8962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd163a4f7f9c6c6c%3A0x2345678901bcdef0!2sSanta%20Eul%C3%A1lia%2C%20Elvas%2C%20Portugal!5e0!3m2!1spt-PT!2spt!4v1700000000001!5m2!1spt-PT!2spt"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mapa de Santa Eulália"
                />
              </div>
              <div className="p-4 sm:p-5">
                <a
                  href="https://maps.google.com/?q=Santa+Eulália+Elvas+Portugal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-wine hover:bg-wine-dark text-cream px-4 py-2 rounded-full text-sm font-semibold transition-all"
                >
                  <MapPin className="w-4 h-4" />
                  Abrir no Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Reservation Section ───────────────────────────────────────────────────────
function ReservationSection() {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    data: '',
    pessoas: '',
    restaurante: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `Olá! Gostaria de fazer uma reserva:\n\n` +
      `• Nome: ${formData.nome}\n` +
      `• Telefone: ${formData.telefone}\n` +
      `• Data: ${formData.data}\n` +
      `• Pessoas: ${formData.pessoas}\n` +
      `• Restaurante: ${formData.restaurante}\n\n` +
      `Obrigado!`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="reservas" className="py-14 sm:py-20 lg:py-28 bg-wine relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gold/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="font-accent text-gold text-base sm:text-lg tracking-[0.2em] uppercase">
          Reservas
        </span>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-cream mt-3 sm:mt-4 leading-tight">
          Reserve a sua <span className="text-gold">mesa</span>
        </h2>
        <p className="text-cream/70 text-sm sm:text-base md:text-lg mt-4 sm:mt-6 max-w-2xl mx-auto px-2">
          Garanta o seu lugar para uma experiência gastronómica inesquecível.
        </p>

        <div className="mt-8 sm:mt-10 bg-cream/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 max-w-2xl mx-auto border border-cream/10">
          {submitted ? (
            <div className="py-8 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="font-display text-2xl font-bold text-cream">Reserva Enviada!</h3>
              <p className="text-cream/60">A sua reserva foi enviada via WhatsApp. Entraremos em contacto em breve.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <input
                  type="text"
                  name="nome"
                  placeholder="Nome"
                  required
                  value={formData.nome}
                  onChange={handleChange}
                  className="bg-cream/10 border border-cream/20 rounded-xl px-4 py-3 sm:px-5 sm:py-3.5 text-cream placeholder-cream/40 focus:outline-none focus:border-gold transition-colors text-sm sm:text-base"
                />
                <input
                  type="tel"
                  name="telefone"
                  placeholder="Telefone"
                  required
                  value={formData.telefone}
                  onChange={handleChange}
                  className="bg-cream/10 border border-cream/20 rounded-xl px-4 py-3 sm:px-5 sm:py-3.5 text-cream placeholder-cream/40 focus:outline-none focus:border-gold transition-colors text-sm sm:text-base"
                />
                <input
                  type="date"
                  name="data"
                  required
                  value={formData.data}
                  onChange={handleChange}
                  className="bg-cream/10 border border-cream/20 rounded-xl px-4 py-3 sm:px-5 sm:py-3.5 text-cream placeholder-cream/40 focus:outline-none focus:border-gold transition-colors text-sm sm:text-base"
                />
                <select
                  name="pessoas"
                  required
                  value={formData.pessoas}
                  onChange={handleChange}
                  className="bg-cream/10 border border-cream/20 rounded-xl px-4 py-3 sm:px-5 sm:py-3.5 text-cream/60 focus:outline-none focus:border-gold transition-colors appearance-none text-sm sm:text-base"
                >
                  <option value="" className="text-bark">Pessoas</option>
                  <option value="1" className="text-bark">1 Pessoa</option>
                  <option value="2" className="text-bark">2 Pessoas</option>
                  <option value="3" className="text-bark">3 Pessoas</option>
                  <option value="4" className="text-bark">4 Pessoas</option>
                  <option value="5" className="text-bark">5 Pessoas</option>
                  <option value="6" className="text-bark">6+ Pessoas</option>
                </select>
              </div>
              <select
                name="restaurante"
                required
                value={formData.restaurante}
                onChange={handleChange}
                className="w-full bg-cream/10 border border-cream/20 rounded-xl px-4 py-3 sm:px-5 sm:py-3.5 text-cream/60 focus:outline-none focus:border-gold transition-colors mb-4 sm:mb-6 appearance-none text-sm sm:text-base"
              >
                <option value="" className="text-bark">Escolha o restaurante</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc.name} value={loc.name} className="text-bark">
                    {loc.name} — {loc.address}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full bg-gold hover:bg-gold-light text-bark py-3.5 sm:py-4 rounded-xl font-semibold tracking-wide transition-all hover:shadow-lg hover:shadow-gold/30 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <MessageCircle className="w-4 h-4" />
                Reservar via WhatsApp
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Scroll to Top Button ─────────────────────────────────────────────────────
function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-24 right-4 sm:right-6 z-40 w-11 h-11 sm:w-12 sm:h-12 bg-wine hover:bg-wine-dark text-cream rounded-full shadow-xl flex items-center justify-center transition-all hover:shadow-2xl hover:scale-110 animate-fade-in-up"
      aria-label="Voltar ao topo"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}

// ─── WhatsApp Floating Button ─────────────────────────────────────────────────
function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  useEffect(() => {
    // Show tooltip briefly on first load
    const timer = setTimeout(() => setTooltipVisible(true), 3000);
    const hideTimer = setTimeout(() => setTooltipVisible(false), 7000);
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="fixed bottom-24 left-4 sm:left-6 z-40 flex items-center gap-2 sm:gap-3 flex-row-reverse">
      {/* Tooltip - escondido em mobile */}
      <div
        className={`hidden sm:block bg-white text-bark text-sm font-medium px-4 py-2 rounded-xl shadow-lg transition-all duration-300 whitespace-nowrap ${
          hovered || tooltipVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'
        }`}
      >
        Precisa de ajuda? Fale connosco!
      </div>

      {/* Button */}
      <button
        onClick={() => openWhatsApp(WHATSAPP_GENERAL_MSG)}
        onMouseEnter={() => { setHovered(true); setTooltipVisible(false); }}
        onMouseLeave={() => setHovered(false)}
        className="w-12 h-12 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#1ebe57] text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:shadow-2xl hover:scale-110"
        aria-label="Contactar via WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </button>
    </div>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const handleFooterNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const footerLinks = [
    { label: 'Menu', href: '#menu' },
    { label: 'Especialidades', href: '#especialidades' },
    { label: 'Tradição', href: '#tradição' },
    { label: 'Localizações', href: '#localizações' },
    { label: 'Reservas', href: '#reservas' },
  ];

  return (
    <footer className="bg-bark pt-14 sm:pt-20 pb-20 sm:pb-8 safe-bottom">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 pb-8 sm:pb-12 border-b border-cream/10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gold flex items-center justify-center">
                <UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5 text-bark" />
              </div>
              <div>
                <span className="font-display text-lg sm:text-xl font-bold text-cream">Sabores</span>
                <span className="font-accent text-gold text-[10px] sm:text-xs tracking-[0.2em] uppercase block leading-none">
                  do Alentejo
                </span>
              </div>
            </div>
            <p className="text-cream/40 text-xs sm:text-sm leading-relaxed max-w-xs">
              Cozinha tradicional alentejana, onde cada prato é uma viagem
              ao coração de Portugal.
            </p>
            <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-cream/10 hover:bg-gold/20 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 text-cream/60" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-cream/10 hover:bg-gold/20 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 text-cream/60" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <button
                onClick={() => openWhatsApp(WHATSAPP_GENERAL_MSG)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-cream/10 hover:bg-gold/20 flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <svg className="w-4 h-4 text-cream/60" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </button>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-cream font-semibold mb-4 sm:mb-5 text-sm sm:text-base">Navegação</h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleFooterNavClick(e, link.href)}
                    className="text-cream/40 hover:text-gold transition-colors text-xs sm:text-sm cursor-pointer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-cream font-semibold mb-4 sm:mb-5 text-sm sm:text-base">Contacto</h4>
            <ul className="space-y-2 sm:space-y-3 text-cream/40 text-xs sm:text-sm">
              <li>
                <a href="tel:+351266700000" className="flex items-center gap-2 hover:text-gold transition-colors">
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="break-all">+351 266 700 000</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@saboresdoalentejo.pt" className="flex items-center gap-2 hover:text-gold transition-colors">
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="break-all">info@saboresdoalentejo.pt</span>
                </a>
              </li>
              <li>
                <a
                  href="https://maps.google.com/?q=Elvas+Alentejo+Portugal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-gold transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span>Elvas, Alentejo, Portugal</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-display text-cream font-semibold mb-4 sm:mb-5 text-sm sm:text-base">Horário</h4>
            <ul className="space-y-2 sm:space-y-3 text-cream/40 text-xs sm:text-sm">
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                Terça a Sexta: 12h-23h
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                Sábado: 12h-00h
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                Domingo: 12h-22h
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                Segunda: Encerrado
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-center sm:text-left">
          <p className="text-cream/30 text-[10px] sm:text-xs">
            © 2025 Sabores do Alentejo. Todos os direitos reservados.
          </p>
          <div className="flex gap-4 sm:gap-6 text-cream/30 text-[10px] sm:text-xs">
            <a href="#" className="hover:text-gold transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-gold transition-colors">Termos e Condições</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="font-body">
      <Navbar />
      <HeroSection />
      <MenuSection />
      <OrderSection />
      <HighlightsSection />
      <TraditionSection />
      <LocationsSection />
      <ReservationSection />
      <Footer />
      <ScrollToTopButton />
      <WhatsAppButton />
    </div>
  );
}
