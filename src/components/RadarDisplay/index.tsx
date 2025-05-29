"use client";
import React, { useEffect, useRef } from 'react';
import { useRobotStore } from '@/stores/robotStore';

interface DetectedObject {
  distance: number;  
  angle: number;    
  type?: string;     
}

const RadarDisplay = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectedObjects = useRobotStore.use.detectedObjects();
  const radarRange = 5; 

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configuration du canvas
    const size = Math.min(canvas.parentElement?.clientWidth || 800, canvas.parentElement?.clientHeight || 800);
    canvas.width = size;
    canvas.height = size;
    const center = size / 2;
    const radius = (size / 2) - 40;


    const drawRadar = () => {
      // Effacer le canvas
      ctx.clearRect(0, 0, size, size);

      // Sauvegarder le contexte
      ctx.save();
      
      // Appliquer la rotation de -90 degrés
      ctx.translate(center, center);
      ctx.rotate(-Math.PI / 2);
      ctx.translate(-center, -center);

      // Créer un masque pour ne montrer que la partie visible (180°)
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, -Math.PI/2, Math.PI/2);
      ctx.closePath();
      ctx.clip();

      // Fond dégradé
      const gradient = ctx.createRadialGradient(center, center, 0, center, center, radius);
      gradient.addColorStop(0, 'rgba(0, 20, 0, 0.8)');
      gradient.addColorStop(1, 'rgba(0, 40, 0, 0.4)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);

      // Dessiner le demi-cercle extérieur avec effet de lueur
      ctx.shadowColor = '#00ff00';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(center, center, radius, -Math.PI/2, Math.PI/2);
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Dessiner les demi-cercles concentriques avec effet de transparence
      for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        ctx.arc(center, center, (radius * i) / 4, -Math.PI/2, Math.PI/2);
        ctx.strokeStyle = `rgba(0, 255, 0, ${0.3 - (i * 0.05)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Dessiner les lignes de repère (tous les 30 degrés)
      for (let i = 0; i <= 180; i += 30) {
        const angle = ((90 - i) * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.lineTo(
          center + radius * Math.cos(angle),
          center + radius * Math.sin(angle)
        );
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Ajouter les graduations
        if (i !== 90) {
          const textRadius = radius + 15;
          const textX = center + textRadius * Math.cos(angle);
          const textY = center + textRadius * Math.sin(angle);
          ctx.fillStyle = '#00ff00';
          ctx.font = '12px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          // Rotation inverse du texte pour le garder lisible
          ctx.save();
          ctx.translate(textX, textY);
          ctx.rotate(Math.PI / 2);
          ctx.fillText(`${i}°`, 0, 0);
          ctx.restore();
        }
      }

      // Dessiner la ligne de balayage avec effet de lueur
      const sweepAngle = (Date.now() / 50) % 180;
      const sweepRadians = ((90 - sweepAngle) * Math.PI) / 180;
      
      // Effet de balayage avec dégradé plus visible
      const sweepGradient = ctx.createLinearGradient(
        center, center,
        center + radius * Math.cos(sweepRadians),
        center + radius * Math.sin(sweepRadians)
      );
      sweepGradient.addColorStop(0, 'rgba(0, 255, 0, 1)');
      sweepGradient.addColorStop(0.5, 'rgba(0, 255, 0, 0.8)');
      sweepGradient.addColorStop(1, 'rgba(0, 255, 0, 0.2)');

      // Dessiner la ligne de balayage principale
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.lineTo(
        center + radius * Math.cos(sweepRadians),
        center + radius * Math.sin(sweepRadians)
      );
      ctx.strokeStyle = sweepGradient;
      ctx.lineWidth = 4;
      ctx.stroke();

      // Ajouter un effet de lueur supplémentaire
      ctx.shadowColor = '#00ff00';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.lineTo(
        center + radius * Math.cos(sweepRadians),
        center + radius * Math.sin(sweepRadians)
      );
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
      ctx.lineWidth = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Dessiner un petit cercle au bout de la ligne de balayage
      ctx.beginPath();
      ctx.arc(
        center + radius * Math.cos(sweepRadians),
        center + radius * Math.sin(sweepRadians),
        3,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = '#00ff00';
      ctx.fill();

      // Dessiner les objets détectés
      detectedObjects.forEach((obj: DetectedObject) => {
        if (obj.angle >= 0 && obj.angle <= 180) {
          const distance = Math.min(obj.distance, radarRange) / radarRange;
          const angle = ((90 - obj.angle) * Math.PI) / 180;
          const x = center + radius * distance * Math.cos(angle);
          const y = center + radius * distance * Math.sin(angle);

          // Effet de lueur pour les points
          ctx.shadowColor = '#ff0000';
          ctx.shadowBlur = 15;

          // Dessiner le point
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, 2 * Math.PI);
          ctx.fillStyle = '#ff0000';
          ctx.fill();

          // Ajouter un effet de lueur plus large
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, 2 * Math.PI);
          ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
          ctx.fill();

          // Réinitialiser l'effet de lueur
          ctx.shadowBlur = 0;
        }
      });

      // Restaurer le contexte pour enlever la rotation et le masque
      ctx.restore();

      // Demander la prochaine frame
      requestAnimationFrame(drawRadar);
    };

    // Démarrer l'animation
    drawRadar();
  }, [detectedObjects]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-black rounded-lg p-4">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      />
    </div>
  );
};

export default RadarDisplay; 