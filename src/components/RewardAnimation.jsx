import React, { useEffect, useRef, memo } from 'react';
import confetti from 'canvas-confetti';
import { CONFIG } from '../config.js';

const RewardAnimation = ({ isActive, onComplete, newTrophy }) => {
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

  useEffect(() => {
    if (isActive) {
      // Add screen shake effect for trophy unlocks
      if (newTrophy) {
        document.body.classList.add('shake');
        const shakeTimer = setTimeout(() => {
          document.body.classList.remove('shake');
        }, 1000);
        return () => clearTimeout(shakeTimer);
      }
    }
  }, [isActive, newTrophy]);

  const triggerConfetti = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const myConfetti = confetti.create(canvas, {
      resize: true,
      useWorker: true
    });
    
    // Check if a new trophy was earned
    if (newTrophy) {
      // Special confetti for trophy unlock
      myConfetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 }
      });
      
      // Additional trophy confetti
      setTimeout(() => {
        myConfetti({
          particleCount: 100,
          angle: 60,
          spread: 70,
          origin: { x: 0, y: 0.5 }
        });
        
        myConfetti({
          particleCount: 100,
          angle: 120,
          spread: 70,
          origin: { x: 1, y: 0.5 }
        });
      }, 300);
    } else {
      // Basic confetti for regular task completion
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
    }
  };

  if (!isActive) {
    return null;
  }

  return (
    <div className="reward-overlay">
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
      <div className="reward-message">
        {newTrophy ? (
          <>
            <h2 className="trophy-title">🏆 New Trophy Unlocked! 🏆</h2>
            <p className="trophy-description">Congratulations on earning the "{newTrophy.name}" trophy!</p>
            <div className="trophy-icon">
              {newTrophy.icon.endsWith('.png') ? (
                <img src={newTrophy.icon} alt={newTrophy.name} className="trophy-image" style={{ maxWidth: '64px', height: 'auto' }} />
              ) : (
                newTrophy.icon
              )}
            </div>
          </>
        ) : (
          <>
            <h2>🎉 Great Job! 🎉</h2>
            <p>{CONFIG.CONGRATULATIONS[Math.floor(Math.random() * CONFIG.CONGRATULATIONS.length)]}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default memo(RewardAnimation);