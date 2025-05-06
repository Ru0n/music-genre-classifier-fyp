import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * GenreVisualization component that creates an interactive circular visualization of music genres
 * 
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {Array} [props.genres] - Array of genre objects with name and color properties
 */
const GenreVisualization = ({
  className = '',
  genres = [
    { name: 'Blues', color: '#1e40af' },
    { name: 'Classical', color: '#0ea5e9' },
    { name: 'Country', color: '#92400e' },
    { name: 'Disco', color: '#db2777' },
    { name: 'Hip-Hop', color: '#f97316' },
    { name: 'Jazz', color: '#8b5cf6' },
    { name: 'Metal', color: '#334155' },
    { name: 'Pop', color: '#ec4899' },
    { name: 'Reggae', color: '#65a30d' },
    { name: 'Rock', color: '#e11d48' },
  ],
  ...rest
}) => {
  const [hoveredGenre, setHoveredGenre] = useState(null);

  // Calculate positions in a circle
  const calculatePosition = (index, total, radius = 120) => {
    const angle = (index / total) * 2 * Math.PI;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    return { x, y };
  };

  return (
    <div 
      className={`relative flex items-center justify-center h-[300px] w-full ${className}`}
      {...rest}
    >
      <div className="relative w-[300px] h-[300px]">
        {genres.map((genre, index) => {
          const position = calculatePosition(index, genres.length);
          const isHovered = hoveredGenre === genre.name;
          
          return (
            <motion.div
              key={genre.name}
              className="absolute"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: isHovered ? 1.2 : 1,
                x: position.x, 
                y: position.y,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: index * 0.1
                }
              }}
              style={{ 
                left: '50%', 
                top: '50%',
                marginLeft: -15,
                marginTop: -15
              }}
            >
              <motion.div
                className="relative cursor-pointer"
                animate={{ 
                  y: [0, -5, 0, 5, 0],
                  x: [0, 3, 0, -3, 0]
                }}
                transition={{
                  duration: 5 + index,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "loop"
                }}
                onHoverStart={() => setHoveredGenre(genre.name)}
                onHoverEnd={() => setHoveredGenre(null)}
              >
                <motion.div 
                  className="w-[30px] h-[30px] rounded-full"
                  style={{ backgroundColor: genre.color }}
                  animate={{ 
                    boxShadow: isHovered 
                      ? `0 0 15px ${genre.color}` 
                      : `0 0 5px ${genre.color}`
                  }}
                />
                
                {isHovered && (
                  <motion.div
                    className="absolute whitespace-nowrap text-sm font-medium bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-soft"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ 
                      top: '100%', 
                      left: '50%', 
                      transform: 'translateX(-50%)',
                      marginTop: '8px',
                      color: genre.color
                    }}
                  >
                    {genre.name}
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default GenreVisualization;
