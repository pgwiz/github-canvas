import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  refresh?: boolean;
  color?: string;
  vx?: number;
  vy?: number;
}

type Circle = {
  x: number;
  y: number;
  translateX: number;
  translateY: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  dx: number;
  dy: number;
  magnetism: number;
};

export function Particles({
  className,
  quantity = 100,
  staticity = 50,
  ease = 50,
  size = 0.4,
  refresh = false,
  color = "#ffffff",
  vx = 0,
  vy = 0,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<Circle[]>([]);
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
  const rafID = useRef<number>(0);

  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      circles.current.length = 0;
      canvasSize.current.w = canvasContainerRef.current.offsetWidth;
      canvasSize.current.h = canvasContainerRef.current.offsetHeight;
      canvasRef.current.width = canvasSize.current.w * dpr;
      canvasRef.current.height = canvasSize.current.h * dpr;
      canvasRef.current.style.width = `${canvasSize.current.w}px`;
      canvasRef.current.style.height = `${canvasSize.current.h}px`;
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  };

  const circleParams = (): Circle => {
    const x = Math.floor(Math.random() * canvasSize.current.w);
    const y = Math.floor(Math.random() * canvasSize.current.h);
    const translateX = 0;
    const translateY = 0;
    const pSize = Math.floor(Math.random() * 2) + size;
    const alpha = 0;
    const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
    const dx = (Math.random() - 0.5) * 0.1;
    const dy = (Math.random() - 0.5) * 0.1;
    const magnetism = 0.1 + Math.random() * 4;
    return {
      x,
      y,
      translateX,
      translateY,
      size: pSize,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism,
    };
  };

  const drawParticles = () => {
    circles.current.length = 0;
    const quantityInt = quantity;
    for (let i = 0; i < quantityInt; i++) {
      circles.current.push(circleParams());
    }
  };

  const initCanvas = () => {
    resizeCanvas();
    drawParticles();
  };

  const remapValue = (
    value: number,
    start1: number,
    end1: number,
    start2: number,
    end2: number
  ): number => {
    const remapped =
      ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
    return remapped > 0 ? remapped : 0;
  };

  const animate = () => {
    if (context.current && canvasRef.current) {
      context.current.clearRect(
        0,
        0,
        canvasSize.current.w,
        canvasSize.current.h
      );
      circles.current.forEach((circle: Circle) => {
        // Handle the alpha fade in
        const edge = [
          circle.x + circle.translateX - circle.size, // distance from left edge
          canvasSize.current.w - circle.x - circle.translateX - circle.size, // distance from right edge
          circle.y + circle.translateY - circle.size, // distance from top edge
          canvasSize.current.h - circle.y - circle.translateY - circle.size, // distance from bottom edge
        ];
        const closestEdge = edge.reduce((a, b) => Math.min(a, b));
        const remapClosestEdge = parseFloat(
          remapValue(closestEdge, 0, 20, 0, 1).toFixed(2)
        );
        if (remapClosestEdge > 1) {
          circle.alpha += 0.02;
          if (circle.alpha > circle.targetAlpha) {
            circle.alpha = circle.targetAlpha;
          }
        } else {
          circle.alpha = circle.targetAlpha * remapClosestEdge;
        }

        // Movement
        circle.x += circle.dx + vx;
        circle.y += circle.dy + vy;

        // Mouse interaction
        // Calculate distance from mouse
        const dx = mouse.current.x - (circle.x + circle.translateX);
        const dy = mouse.current.y - (circle.y + circle.translateY);
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Calculate force
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;

        // Max distance, past that the force will be 0
        const maxDistance = mouse.current.x === 0 && mouse.current.y === 0 ? 0 : 2000;
        const force = (maxDistance - distance) / maxDistance;

        // If we are close enough, move the particle
        if (force > 0) {
            const moveX = forceDirectionX * force * circle.magnetism * (100 - staticity);
            const moveY = forceDirectionY * force * circle.magnetism * (100 - staticity);

            circle.translateX += (moveX - circle.translateX) / (ease / 10);
            circle.translateY += (moveY - circle.translateY) / (ease / 10);
        } else {
            circle.translateX += (0 - circle.translateX) / (ease / 10);
            circle.translateY += (0 - circle.translateY) / (ease / 10);
        }

        // Wrap around screen
        if (circle.x < -circle.size) circle.x += canvasSize.current.w + circle.size;
        else if (circle.x > canvasSize.current.w + circle.size) circle.x -= canvasSize.current.w + circle.size;

        if (circle.y < -circle.size) circle.y += canvasSize.current.h + circle.size;
        else if (circle.y > canvasSize.current.h + circle.size) circle.y -= canvasSize.current.h + circle.size;

        context.current!.beginPath();
        context.current!.arc(
          circle.x + circle.translateX,
          circle.y + circle.translateY,
          circle.size,
          0,
          2 * Math.PI
        );
        context.current!.fillStyle = color;
        context.current!.globalAlpha = circle.alpha;
        context.current!.fill();
      });
      rafID.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }
    initCanvas();
    animate();
    window.addEventListener("resize", initCanvas);

    return () => {
      window.removeEventListener("resize", initCanvas);
      cancelAnimationFrame(rafID.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const { w, h } = canvasSize.current;
        const x = e.clientX - rect.left - w / 2;
        const y = e.clientY - rect.top - h / 2;
        const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
        if (inside) {
          mouse.current.x = x;
          mouse.current.y = y;
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    initCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  return (
    <div className={cn("pointer-events-none", className)} ref={canvasContainerRef} aria-hidden="true">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
