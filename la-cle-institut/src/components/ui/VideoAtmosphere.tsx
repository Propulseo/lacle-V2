"use client";

import { useEffect, useRef, useState } from "react";

interface VideoAtmosphereProps {
  src: string;
  poster: string;
  className?: string;
  aspectRatio?: string;
}

export function VideoAtmosphere({
  src,
  poster,
  className = "",
  aspectRatio = "16/9",
}: VideoAtmosphereProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible && videoRef.current) {
      videoRef.current.load();
    }
  }, [isVisible]);

  return (
    <div
      ref={containerRef}
      className={`card-elevated relative overflow-hidden bg-graphite/60 ${className}`}
      style={{ aspectRatio }}
    >
      {/* Poster fallback */}
      <img
        src={poster}
        alt=""
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
          isLoaded ? "opacity-0" : "opacity-100"
        }`}
      />
      {/* Lazy video */}
      {isVisible && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          autoPlay
          onLoadedData={() => setIsLoaded(true)}
          className={`h-full w-full object-cover transition-opacity duration-1000 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
