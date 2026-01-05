import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Swords, Shield, Skull } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const iconsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(iconsRef.current?.children || [], 
      { opacity: 0, scale: 0.5, y: 20 },
      { opacity: 1, scale: 1, y: 0, stagger: 0.1, duration: 0.6 }
    )
    .fromTo(titleRef.current, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8 },
      '-=0.3'
    )
    .fromTo(subtitleRef.current, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      '-=0.4'
    )
    .fromTo(buttonRef.current, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 },
      '-=0.3'
    );
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div 
        className="hidden md:block absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/og-image.png)',
        }}
      >
        <div className="absolute inset-0 bg-background/40" />
      </div>

      <div 
        className="md:hidden absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/homemobile.png)',
        }}
      >
        <div className="absolute inset-0 bg-background/40" />
      </div>

      <div 
        className="md:hidden absolute inset-0 bg-cover bg-center bg-no-repeat opacity-0"
        style={{
          backgroundImage: 'url(/homesecundarymobile.png)',
        }}
      >
        <div className="absolute inset-0 bg-background/40" />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-destructive/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <div ref={iconsRef} className="flex items-center justify-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-lg bg-secondary/90 backdrop-blur-sm border border-primary/30 flex items-center justify-center shadow-2xl">
            <Shield className="w-7 h-7 text-primary drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" />
          </div>
          <div className="w-16 h-16 rounded-lg bg-primary/30 backdrop-blur-sm border-2 border-primary/50 flex items-center justify-center glow-gold shadow-2xl">
            <Swords className="w-8 h-8 text-primary drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" />
          </div>
          <div className="w-14 h-14 rounded-lg bg-secondary/90 backdrop-blur-sm border border-destructive/30 flex items-center justify-center shadow-2xl">
            <Skull className="w-7 h-7 text-destructive drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" />
          </div>
        </div>

        <h1
          ref={titleRef}
          className="font-medieval text-5xl md:text-6xl lg:text-7xl font-bold mb-4 relative"
          style={{
            color: '#D4AF37',
            textShadow: `
              0 0 10px rgba(212, 175, 55, 0.5),
              0 0 20px rgba(212, 175, 55, 0.3),
              2px 2px 4px rgba(0, 0, 0, 0.9),
              4px 4px 8px rgba(0, 0, 0, 0.8),
              6px 6px 12px rgba(0, 0, 0, 0.7),
              -1px -1px 2px rgba(0, 0, 0, 0.9),
              1px -1px 2px rgba(0, 0, 0, 0.9),
              -1px 1px 2px rgba(0, 0, 0, 0.9),
              1px 1px 2px rgba(0, 0, 0, 0.9)
            `,
            WebkitTextStroke: '1px rgba(0, 0, 0, 0.5)',
          }}
        >
          Cavaleiros do Caos
        </h1>

        <p
          ref={subtitleRef}
          className="text-lg md:text-xl mb-12 max-w-md mx-auto px-4 py-2 rounded-lg"
          style={{
            color: '#F5F5F5',
            textShadow: `
              0 0 8px rgba(0, 0, 0, 0.8),
              2px 2px 4px rgba(0, 0, 0, 0.9),
              4px 4px 8px rgba(0, 0, 0, 0.7),
              -1px -1px 2px rgba(0, 0, 0, 0.9),
              1px -1px 2px rgba(0, 0, 0, 0.9),
              -1px 1px 2px rgba(0, 0, 0, 0.9),
              1px 1px 2px rgba(0, 0, 0, 0.9)
            `,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}
        >
          Gerencie a iniciativa do seu grupo de RPG com estilo medieval
        </p>

        <Button
          ref={buttonRef}
          onClick={() => navigate('/tracker')}
          size="lg"
          className="btn-medieval text-primary-foreground px-10 py-6 text-lg shadow-2xl border-2 border-primary/50"
          style={{
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.5), 0 0 20px rgba(212, 175, 55, 0.3)',
          }}
        >
          Iniciar Combate
        </Button>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg backdrop-blur-sm bg-black/30">
          <div className="w-12 h-px bg-primary/50" />
          <span 
            className="font-medieval text-2xl"
            style={{
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
              filter: 'drop-shadow(0 0 4px rgba(212, 175, 55, 0.5))',
            }}
          >
            ⚔️
          </span>
          <div className="w-12 h-px bg-primary/50" />
        </div>
      </div>
    </div>
  );
};

export default Home;
