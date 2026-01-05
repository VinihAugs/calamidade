import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center relative">
      {/* Background image - Desktop */}
      <div 
        className="hidden md:block fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: 'url(/fundo.png)',
        }}
      >
        {/* Overlay para melhorar legibilidade */}
        <div className="absolute inset-0 bg-background/50" />
      </div>

      {/* Background image - Mobile */}
      <div 
        className="md:hidden fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: 'url(/homesecundarymobile.png)',
        }}
      >
        {/* Overlay para melhorar legibilidade */}
        <div className="absolute inset-0 bg-background/50" />
      </div>

      <div className="text-center relative z-10 px-4 py-8 rounded-lg backdrop-blur-sm bg-background/30">
        <h1 
          className="mb-4 text-6xl font-medieval font-bold"
          style={{
            color: '#D4AF37',
            textShadow: `
              0 0 10px rgba(212, 175, 55, 0.5),
              2px 2px 4px rgba(0, 0, 0, 0.9),
              4px 4px 8px rgba(0, 0, 0, 0.8)
            `,
          }}
        >
          404
        </h1>
        <p 
          className="mb-6 text-xl"
          style={{
            color: '#F5F5F5',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)',
          }}
        >
          Página não encontrada
        </p>
        <a 
          href="/" 
          className="text-primary underline hover:text-primary/90 font-medieval"
          style={{
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
          }}
        >
          Voltar para Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
