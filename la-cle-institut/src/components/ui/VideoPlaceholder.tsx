interface VideoPlaceholderProps {
  label?: string;
  className?: string;
  aspectRatio?: string;
}

export function VideoPlaceholder({
  label = "Vidéo atmosphère",
  className = "",
  aspectRatio = "16/9",
}: VideoPlaceholderProps) {
  return (
    <div
      className={`card-elevated flex items-center justify-center border border-filet-discret bg-graphite/60 ${className}`}
      style={{ aspectRatio }}
    >
      <p className="text-xs uppercase tracking-widest text-pierre/40">
        {label}
      </p>
    </div>
  );
}
