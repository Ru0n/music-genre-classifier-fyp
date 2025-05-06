import { motion } from 'framer-motion';
import {
  Music,
  Headphones,
  Radio,
  Mic2,
  Disc,
  ListMusic,
  Volume2,
  Play
} from 'lucide-react';

/**
 * FloatingIcons component that creates floating music-related icons
 *
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {number} [props.iconCount=8] - Number of icons to display
 * @param {string} [props.color='currentColor'] - Color of the icons
 * @param {number} [props.size=24] - Size of the icons
 * @param {boolean} [props.randomPlacement=true] - Whether to place icons randomly
 */
const FloatingIcons = ({
  className = '',
  iconCount = 8,
  color = 'currentColor',
  size = 24,
  randomPlacement = true,
  ...rest
}) => {
  // Array of available icons
  const icons = [
    Music,
    Headphones,
    Radio,
    Mic2,
    Disc,
    ListMusic,
    Volume2,
    Play
  ];

  // Generate random positions for the icons
  const generateRandomPosition = () => {
    if (!randomPlacement) return {};

    return {
      top: `${Math.random() * 80 + 10}%`,
      left: `${Math.random() * 80 + 10}%`,
      opacity: Math.random() * 0.5 + 0.2,
    };
  };

  // Create an array of icon elements with random animations
  const iconElements = Array.from({ length: iconCount }, (_, i) => {
    const IconComponent = icons[i % icons.length];
    const position = generateRandomPosition();
    const animationDelay = i * 0.5;
    const animationDuration = 20 + Math.random() * 10;
    const floatType = i % 2 === 0 ? 'float' : 'float-reverse';

    return {
      id: i,
      component: IconComponent,
      position,
      animationDelay,
      animationDuration,
      floatType,
      size: size * (0.7 + Math.random() * 0.6), // Random size variation
    };
  });

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} {...rest}>
      {iconElements.map((icon) => (
        <motion.div
          key={icon.id}
          className="absolute"
          initial={{ opacity: 0 }}
          animate={{ opacity: icon.position.opacity || 0.5 }}
          transition={{ duration: 1, delay: icon.animationDelay }}
          style={{
            top: icon.position.top || `${(icon.id * 10) + 10}%`,
            left: icon.position.left || `${(icon.id * 10) + 10}%`,
          }}
        >
          <motion.div
            animate={{ y: [0, -20, 0], x: [0, 15, 0], rotate: [0, 10, 0] }}
            transition={{
              duration: icon.animationDuration,
              ease: "easeInOut",
              delay: icon.animationDelay,
              repeat: Infinity,
              repeatType: "loop"
            }}
          >
            <icon.component size={icon.size} color={color} strokeWidth={1.5} />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingIcons;
