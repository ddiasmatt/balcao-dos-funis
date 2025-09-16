import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center ltv-gradient-subtle">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="mb-8">
          <div className="text-8xl font-bold ltv-text-orange mb-4">404</div>
          <h1 className="ltv-title mb-4">Página não encontrada</h1>
          <p className="ltv-body ltv-text-gray mb-8">
            Oops! A página que você está procurando não existe ou foi movida.
          </p>
        </div>
        
        <Button 
          asChild
          className="ltv-gradient text-white hover:opacity-90"
        >
          <a href="/" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Voltar ao início
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
