"use client";
import { useEffect, useRef } from "react";

export function GlowCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -200, y: -200 });
  const ring = useRef({ x: -200, y: -200 });
  const rafId = useRef<number>(0);

  useEffect(() => {
    // Only on non-touch devices
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const enterInteractive = () => {
      dotRef.current?.classList.add("cursor-hover");
      ringRef.current?.classList.add("cursor-hover");
    };
    const leaveInteractive = () => {
      dotRef.current?.classList.remove("cursor-hover");
      ringRef.current?.classList.remove("cursor-hover");
    };
    const onDown = () => {
      dotRef.current?.classList.add("cursor-click");
      ringRef.current?.classList.add("cursor-click");
    };
    const onUp = () => {
      dotRef.current?.classList.remove("cursor-click");
      ringRef.current?.classList.remove("cursor-click");
    };

    const animate = () => {
      // Dot follows instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.current.x - 5}px, ${pos.current.y - 5}px, 0)`;
      }
      // Ring lags slightly
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x - 18}px, ${ring.current.y - 18}px, 0)`;
      }
      rafId.current = requestAnimationFrame(animate);
    };

    const bindInteractive = () => {
      document.querySelectorAll("a, button, [role=button], select, input, textarea").forEach((el) => {
        el.addEventListener("mouseenter", enterInteractive);
        el.addEventListener("mouseleave", leaveInteractive);
      });
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    bindInteractive();

    rafId.current = requestAnimationFrame(animate);

    // Re-bind on DOM changes
    const observer = new MutationObserver(bindInteractive);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(rafId.current);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <style>{`
        body { cursor: none; }
        a, button, [role=button], input, select, textarea { cursor: none; }
        #glow-dot {
          position: fixed; top: 0; left: 0; z-index: 9999; pointer-events: none;
          width: 10px; height: 10px; border-radius: 50%;
          background: oklch(0.92 0.008 248);
          mix-blend-mode: difference;
          will-change: transform;
          transition: width 0.25s, height 0.25s, background 0.25s;
        }
        #glow-dot.cursor-hover {
          width: 14px; height: 14px;
          background: oklch(0.98 0.005 248);
        }
        #glow-dot.cursor-click {
          width: 8px; height: 8px;
          background: oklch(0.82 0.010 248);
        }

        #glow-ring {
          position: fixed; top: 0; left: 0; z-index: 9998; pointer-events: none;
          width: 36px; height: 36px; border-radius: 50%;
          border: 1px solid oklch(0.82 0.010 248 / 0.40);
          will-change: transform;
          transition: width 0.35s, height 0.35s, border-color 0.35s, opacity 0.35s;
        }
        #glow-ring.cursor-hover {
          width: 56px; height: 56px;
          border-color: oklch(0.82 0.010 248 / 0.70);
        }
        #glow-ring.cursor-click {
          width: 28px; height: 28px;
          border-color: oklch(0.92 0.008 248 / 0.9);
        }
        @media (hover: none) {
          body { cursor: auto; }
          #glow-dot, #glow-ring { display: none; }
        }
      `}</style>
      <div id="glow-dot" ref={dotRef} aria-hidden />
      <div id="glow-ring" ref={ringRef} aria-hidden />
    </>
  );
}
