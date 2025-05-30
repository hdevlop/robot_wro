"use client";
import React, { useRef, useEffect } from 'react';
import { useRobotStore } from '@/stores/robotStore';
import { useMqttRadar } from '@/hooks/useMqttRadar';

const RadarDisplayContent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectedObjects = useRobotStore.use.detectedObjects();
  const radarRange = 5;
  const sweepRef = useRef({ angle: 0, direction: 1 });
  const animationRef = useRef(0);

  useMqttRadar();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      const size = Math.min(container.clientWidth, container.clientHeight) - 20;
      canvas.width = size;
      canvas.height = size;
    };

    updateCanvasSize();
    
    const center = canvas.width / 2;
    const radius = (canvas.width / 2) - 80;
    const sweepSpeed = 0.5;

    const drawRadar = () => {
      if (!canvas || !ctx) return;
      
      const currentCenter = canvas.width / 2;
      const currentRadius = (canvas.width / 2) - 80;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(currentCenter, currentCenter);
      ctx.rotate(-Math.PI/2);
      ctx.translate(-currentCenter, -currentCenter);
      ctx.beginPath();
      ctx.moveTo(currentCenter, currentCenter);
      ctx.arc(currentCenter, currentCenter, currentRadius, -Math.PI/2, Math.PI/2);
      ctx.closePath();
      ctx.clip();

      // Background gradient
      const gradient = ctx.createRadialGradient(currentCenter, currentCenter, 0, currentCenter, currentCenter, currentRadius);
      gradient.addColorStop(0, 'rgba(20, 0, 0, 0.9)');
      gradient.addColorStop(1, 'rgba(40, 0, 0, 0.6)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Shadow effects
      ctx.shadowColor = 'rgba(255, 0, 0, 0.3)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Draw range circles and labels
      for (let i = 1; i <= 4; i++) {
        const circleRadius = (currentRadius * i) / 4;
        const distance = (radarRange * i) / 4;

        ctx.beginPath();
        ctx.arc(currentCenter, currentCenter, circleRadius, -Math.PI/2, Math.PI/2);
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = 'rgba(255, 0, 0, 0.9)';
        ctx.textAlign = 'left';
        ctx.fillText(`${distance.toFixed(1)}m`, currentCenter + circleRadius + 5, currentCenter);
      }

      ctx.shadowBlur = 0;

      // Draw angle lines and labels
      for (let i = 0; i <= 180; i += 15) {
        const angle = (i * Math.PI) / 180 - Math.PI/2;
        const x = currentCenter + currentRadius * Math.cos(angle);
        const y = currentCenter + currentRadius * Math.sin(angle);

        ctx.beginPath();
        ctx.moveTo(currentCenter, currentCenter);
        ctx.lineTo(x, y);
        ctx.strokeStyle = i % 30 === 0 ? 'rgba(255, 0, 0, 0.5)' : 'rgba(255, 0, 0, 0.2)';
        ctx.lineWidth = i % 30 === 0 ? 3 : 1;
        ctx.stroke();

        if (i % 30 === 0) {
          const textRadius = currentRadius + 25;
          const textX = currentCenter + textRadius * Math.cos(angle);
          const textY = currentCenter + textRadius * Math.sin(angle);
          ctx.font = 'bold 16px Arial';
          ctx.fillStyle = 'rgba(255, 0, 0, 1)';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${i}°`, textX, textY);
        }

        if (i % 30 !== 0) {
          const tickRadius = currentRadius + 5;
          const tickX = currentCenter + tickRadius * Math.cos(angle);
          const tickY = currentCenter + tickRadius * Math.sin(angle);
          ctx.beginPath();
          ctx.arc(tickX, tickY, 2, 0, 2 * Math.PI);
          ctx.fillStyle = 'rgba(255, 0, 0, 0.6)';
          ctx.fill();
        }
      }

      // Update sweep angle
      sweepRef.current.angle += sweepSpeed * sweepRef.current.direction;
      if (sweepRef.current.angle >= 180) {
        sweepRef.current.angle = 180;
        sweepRef.current.direction = -1;
      } else if (sweepRef.current.angle <= 0) {
        sweepRef.current.angle = 0;
        sweepRef.current.direction = 1;
      }
      const sweepRadians = (sweepRef.current.angle * Math.PI) / 180 - Math.PI/2;

      // Draw sweep line
      ctx.shadowColor = 'rgba(255, 0, 0, 0.5)';
      ctx.shadowBlur = 15;

      const sweepGradient = ctx.createLinearGradient(
        currentCenter, currentCenter,
        currentCenter + currentRadius * Math.cos(sweepRadians),
        currentCenter + currentRadius * Math.sin(sweepRadians)
      );
      sweepGradient.addColorStop(0, 'rgba(255, 0, 0, 0.9)');
      sweepGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');

      ctx.beginPath();
      ctx.moveTo(currentCenter, currentCenter);
      ctx.lineTo(
        currentCenter + currentRadius * Math.cos(sweepRadians),
        currentCenter + currentRadius * Math.sin(sweepRadians)
      );
      ctx.strokeStyle = sweepGradient;
      ctx.lineWidth = 4;
      ctx.stroke();

      // Draw sweep glow
      ctx.shadowColor = 'rgba(255, 0, 0, 0.3)';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.moveTo(currentCenter, currentCenter);
      ctx.lineTo(
        currentCenter + currentRadius * Math.cos(sweepRadians),
        currentCenter + currentRadius * Math.sin(sweepRadians)
      );
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.4)';
      ctx.lineWidth = 8;
      ctx.stroke();

      // Draw sweep endpoint
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(
        currentCenter + currentRadius * Math.cos(sweepRadians),
        currentCenter + currentRadius * Math.sin(sweepRadians),
        4,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = '#ff0000';
      ctx.fill();

      ctx.restore();

      // Draw angle display
      ctx.font = 'bold 20px Arial';
      ctx.fillStyle = 'rgba(255, 0, 0, 1)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`Angle: ${Math.round(sweepRef.current.angle)}°`, currentCenter, 30);

      ctx.save();
      // Reapply rotation for objects
      ctx.translate(currentCenter, currentCenter);
      ctx.rotate(-Math.PI/2);
      ctx.translate(-currentCenter, -currentCenter);

      // Draw detected objects
      detectedObjects.forEach((obj) => {
        if (obj.angle >= 0 && obj.angle <= 180) {
          const distance = Math.min(obj.distance, radarRange) / radarRange;
          const angle = (obj.angle * Math.PI) / 180 - Math.PI/2;
          const x = currentCenter + currentRadius * distance * Math.cos(angle);
          const y = currentCenter + currentRadius * distance * Math.sin(angle);

          // Calculate opacity based on object age
          const age = Date.now() - obj.timestamp;
          const opacity = Math.max(0, 1 - (age / 5000)); // Fade out over 5 seconds

          if (opacity > 0) {
            // Glow effect for points
            ctx.shadowColor = `rgba(0, 255, 0, ${opacity * 0.8})`;
            ctx.shadowBlur = 20;

            // Draw central point
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = `rgba(0, 255, 0, ${opacity})`;
            ctx.fill();

            // Add wider glow effect
            ctx.beginPath();
            ctx.arc(x, y, 10, 0, 2 * Math.PI);
            ctx.fillStyle = `rgba(0, 255, 0, ${opacity * 0.3})`;
            ctx.fill();

            // Display object information
            ctx.shadowBlur = 0;
            ctx.font = 'bold 12px Arial';
            ctx.fillStyle = `rgba(0, 255, 0, ${opacity * 0.9})`;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.fillText(`D: ${obj.distance.toFixed(1)}m`, x + 10, y);
            ctx.fillText(`A: ${obj.angle.toFixed(0)}°`, x + 10, y + 15);
          }
        }
      });

      ctx.restore();

      // Continue animation
      animationRef.current = requestAnimationFrame(drawRadar);
    };

    // Start animation
    drawRadar();

    // Handle window resize
    const handleResize = () => {
      updateCanvasSize();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [detectedObjects]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <canvas
        ref={canvasRef}
        className="max-w-full max-h-full"
        style={{ imageRendering: 'crisp-edges' }}
      />
    </div>
  );
};

export default RadarDisplayContent;