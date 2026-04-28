import { SearchX } from "lucide-react";
import { Button } from "./Button";

interface NotFoundProps {
  title?: string;
  message?: string;
  backHref?: string;
  backLabel?: string;
}

export function NotFound({
  title = "Page introuvable",
  message = "La ressource demandee n'existe pas ou a ete supprimee.",
  backHref,
  backLabel = "Retour",
}: NotFoundProps) {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-attention/10">
        <SearchX className="h-8 w-8 text-attention" />
      </div>
      <div>
        <h2 className="font-serif text-xl text-ivoire">{title}</h2>
        <p className="mt-2 max-w-md text-sm text-cendre">{message}</p>
      </div>
      {backHref && (
        <Button href={backHref} variant="default" size="sm">
          {backLabel}
        </Button>
      )}
    </div>
  );
}
