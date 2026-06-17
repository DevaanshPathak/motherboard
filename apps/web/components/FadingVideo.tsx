"use client";

import React, { useRef, useEffect, useState } from 'react';

interface FadingVideoProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function FadingVideo({ src, className, style }: FadingVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId: number;
    const startTime = performance.now();
    const duration = 1000; // 1 second fade-in on load

    const fadeIn = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setOpacity(progress);
      if (progress < 1) {
        rafId = requestAnimationFrame(fadeIn);
      }
    };

    const handlePlay = () => {
      rafId = requestAnimationFrame(fadeIn);
    };

    video.addEventListener('playing', handlePlay);

    // If it started playing before the event listener was attached
    if (video.readyState >= 3 && !video.paused) {
      handlePlay();
    }

    return () => {
      video.removeEventListener('playing', handlePlay);
      cancelAnimationFrame(rafId);
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      className={className}
      style={{ 
        ...style, 
        opacity: opacity 
      }}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
    />
  );
}
