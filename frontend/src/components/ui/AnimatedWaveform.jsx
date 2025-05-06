import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * AnimatedWaveform component that creates a dynamic audio waveform visualization
 * 
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.color='#3b82f6'] - Primary color of the waveform
 * @param {string} [props.secondaryColor='#8b5cf6'] - Secondary color for gradient effect
 * @param {number} [props.barCount=30] - Number of bars in the waveform
 * @param {boolean} [props.animate=true] - Whether the waveform should animate
 * @param {number} [props.height=100] - Height of the waveform in pixels
 */
const AnimatedWaveform = ({
  className = '',
  color = '#3b82f6',
  secondaryColor = '#8b5cf6',
  barCount = 30,
  animate = true,
  height = 100,
  ...rest
}) => {
  const waveformRef = useRef(null);

  // Create an array of bar heights with staggered animation delays
  const bars = Array.from({ length: barCount }, (_, i) => ({
    id: i,
    delay: i * 0.05,
    initialHeight: Math.random() * 0.7 + 0.3, // Random height between 0.3 and 1.0
  }));

  return (
    <div 
      ref={waveformRef}
      className={`flex items-end justify-center gap-[2px] ${className}`}
      style={{ height: `${height}px` }}
      {...rest}
    >
      {bars.map((bar) => (
        <motion.div
          key={bar.id}
          className="w-1 rounded-t-full"
          initial={{ height: '5px' }}
          animate={animate ? { 
            height: ['5px', `${bar.initialHeight * height * 0.8}px`, '5px'] 
          } : { height: `${bar.initialHeight * height * 0.8}px` }}
          transition={{
            duration: 1.2,
            ease: "easeInOut",
            delay: bar.delay,
            repeat: Infinity,
            repeatType: "loop"
          }}
          style={{
            background: `linear-gradient(to top, ${color}, ${secondaryColor})`,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedWaveform;
