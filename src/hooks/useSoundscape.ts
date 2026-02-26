import { useEffect, useRef } from 'react';

export const useSoundscape = (enabled: boolean) => {
  const audioContext = useRef<AudioContext | null>(null);
  const oscillator = useRef<OscillatorNode | null>(null);
  const gainNode = useRef<GainNode | null>(null);

  useEffect(() => {
    if (!enabled) {
      if (audioContext.current) {
        audioContext.current.close();
        audioContext.current = null;
      }
      return;
    }

    // Initialize Audio Context on user interaction (handled by browser policy)
    const initAudio = () => {
      if (audioContext.current) return;
      
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Ambient Hum (Low frequency server room sound)
      oscillator.current = audioContext.current.createOscillator();
      gainNode.current = audioContext.current.createGain();
      
      oscillator.current.type = 'sine';
      oscillator.current.frequency.setValueAtTime(40, audioContext.current.currentTime); // 40Hz deep hum
      
      gainNode.current.gain.setValueAtTime(0.01, audioContext.current.currentTime); // Very subtle
      
      oscillator.current.connect(gainNode.current);
      gainNode.current.connect(audioContext.current.destination);
      
      oscillator.current.start();
    };

    const handleInteraction = () => {
      initAudio();
      document.removeEventListener('click', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, [enabled]);

  const playClick = () => {
    if (!audioContext.current || audioContext.current.state === 'suspended') return;

    const osc = audioContext.current.createOscillator();
    const g = audioContext.current.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(800, audioContext.current.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioContext.current.currentTime + 0.1);

    g.gain.setValueAtTime(0.02, audioContext.current.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioContext.current.currentTime + 0.1);

    osc.connect(g);
    g.connect(audioContext.current.destination);

    osc.start();
    osc.stop(audioContext.current.currentTime + 0.1);
  };

  const playUnlock = () => {
    if (!audioContext.current || audioContext.current.state === 'suspended') return;

    const osc = audioContext.current.createOscillator();
    const g = audioContext.current.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, audioContext.current.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, audioContext.current.currentTime + 0.3);

    g.gain.setValueAtTime(0.05, audioContext.current.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioContext.current.currentTime + 0.3);

    osc.connect(g);
    g.connect(audioContext.current.destination);

    osc.start();
    osc.stop(audioContext.current.currentTime + 0.3);
  };

  return { playClick, playUnlock };
};
