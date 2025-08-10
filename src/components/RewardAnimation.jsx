import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

const RewardAnimation = ({ isActive, onComplete }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isActive && canvasRef.current) {
      // Trigger confetti animation
      triggerConfetti();
      
      // Call onComplete after animation duration
      const timer = setTimeout(() => {
        onComplete();
      }, 5000); // 5 seconds duration
      
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  const triggerConfetti = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const myConfetti = confetti.create(canvas, {
      resize: true,
      useWorker: true
    });
    
    // Basic confetti
    myConfetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    // Additional confetti for more celebration
    setTimeout(() => {
      myConfetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      
      myConfetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 300);
  };

  if (!isActive) {
    return null;
  }

  return (
    <div className="reward-overlay">
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
      <div className="reward-message">
        <h2>🎉 Great Job! 🎉</h2>
        <p>You completed a task!</p>
      </div>
    </div>
  );
};

export default RewardAnimation;