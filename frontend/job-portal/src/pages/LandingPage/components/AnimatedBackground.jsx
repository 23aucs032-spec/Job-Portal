import React, { useRef, useEffect } from "react";

const AnimatedBackground = ({
  hue = 200,
  saturation = 80,
  lightness = 65,
  backgroundStart = "#1a1a2e",
  backgroundEnd = "#090a0f",
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const isActiveRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // 🧠 Auto-disable on low-end devices
    const isLowEndDevice =
      navigator.hardwareConcurrency &&
      navigator.hardwareConcurrency <= 4;

    if (isLowEndDevice) return;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const particles = [];
    const PARTICLE_COUNT = Math.min(100, Math.floor(width / 12));

    // eslint-disable-next-line react-hooks/unsupported-syntax
    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.vx = Math.random() * 0.4 - 0.2;
        this.vy = Math.random() * 0.4 - 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.6)`;
        ctx.fill();
      }
    }

    const init = () => {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      if (!isActiveRef.current) return;

      ctx.fillStyle = "rgba(10,10,20,0.25)";
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    // 🛑 Pause when tab inactive
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isActiveRef.current = false;
        cancelAnimationFrame(animationRef.current);
      } else {
        isActiveRef.current = true;
        animate();
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);

    init();
    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [hue, saturation, lightness]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        background: `radial-gradient(circle at bottom, ${backgroundStart} 0%, ${backgroundEnd} 100%)`,
      }}
    />
  );
};

export default AnimatedBackground;
