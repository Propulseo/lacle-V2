"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/utils";

const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5, 2] as const;

interface VideoPlayerProps {
  src?: string;
  poster?: string;
  onTimeUpdate?: (currentTime: number) => void;
  onEnded?: () => void;
  className?: string;
  /**
   * Active le selecteur de vitesse de lecture (0.75x a 2x).
   * Methode La Cle : l'acceleration n'est proposee qu'apres completion de la capsule.
   * Par defaut desactive pour ne pas modifier le comportement des appels existants.
   */
  allowPlaybackRate?: boolean;
}

export function VideoPlayer({
  src,
  poster,
  onTimeUpdate,
  onEnded,
  className,
  allowPlaybackRate = false,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);

  const changePlaybackRate = useCallback((rate: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    setPlaybackRate(rate);
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  const seek = useCallback((seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.currentTime + seconds, video.duration));
  }, []);

  const handleSeekBar = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Number(e.target.value);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      onTimeUpdate?.(video.currentTime);
    };
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleEnded);
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleEnded);
    };
  }, [onTimeUpdate, onEnded]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!src) {
    return (
      <div className={cn("relative aspect-video rounded-xl bg-encre flex items-center justify-center", className)}>
        <div className="text-center">
          <Play className="mx-auto h-12 w-12 text-pierre" />
          <p className="mt-2 text-sm text-cendre">Vidéo non disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("group relative aspect-video rounded-xl overflow-hidden bg-nuit-profond", className)}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="h-full w-full object-cover"
        onClick={togglePlay}
      />

      {/* Controls overlay */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 bg-gradient-to-t from-nuit-profond/90 to-transparent p-4 transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Seek bar */}
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={handleSeekBar}
          aria-label="Progression de la vidéo"
          aria-valuetext={`${formatDuration(Math.floor(currentTime))} sur ${formatDuration(Math.floor(duration))}`}
          className="mb-3 h-1 w-full cursor-pointer appearance-none rounded-full bg-filet [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-or"
          style={{ background: `linear-gradient(to right, var(--color-or) ${progress}%, var(--color-filet) ${progress}%)` }}
        />

        <div className="flex items-center gap-3">
          <button type="button" onClick={() => seek(-10)} aria-label="Reculer de 10 secondes" className="text-ivoire/70 hover:text-ivoire transition-colors">
            <SkipBack className="h-4 w-4" />
          </button>
          <button type="button" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Lecture"} className="text-ivoire hover:text-or transition-colors">
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>
          <button type="button" onClick={() => seek(10)} aria-label="Avancer de 10 secondes" className="text-ivoire/70 hover:text-ivoire transition-colors">
            <SkipForward className="h-4 w-4" />
          </button>
          <span className="text-xs text-cendre tabular-nums">
            {formatDuration(Math.floor(currentTime))} / {formatDuration(Math.floor(duration))}
          </span>
          <div className="flex-1" />
          {allowPlaybackRate && (
            <select
              value={playbackRate}
              onChange={(e) => changePlaybackRate(Number(e.target.value))}
              aria-label="Vitesse de lecture"
              className="rounded-md border border-filet bg-surface px-2 py-1 text-xs text-ivoire tabular-nums transition-colors hover:border-or focus:border-or focus:outline-none"
            >
              {PLAYBACK_RATES.map((rate) => (
                <option key={rate} value={rate}>
                  {rate}×
                </option>
              ))}
            </select>
          )}
          <button type="button" onClick={toggleMute} aria-label={isMuted ? "Activer le son" : "Couper le son"} className="text-ivoire/70 hover:text-ivoire transition-colors">
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => videoRef.current?.requestFullscreen()}
            aria-label="Plein écran"
            className="text-ivoire/70 hover:text-ivoire transition-colors"
          >
            <Maximize className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
