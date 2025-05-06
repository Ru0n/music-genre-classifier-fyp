import { motion } from 'framer-motion';
import Card from './Card';

/**
 * FeatureCard component for displaying features with icons and minimal text
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.icon - Icon component to display
 * @param {string} props.title - Short title for the feature
 * @param {string} props.description - Brief description (max 10 words)
 * @param {string} [props.className] - Additional CSS classes
 * @param {number} [props.delay=0] - Animation delay in seconds
 */
const FeatureCard = ({
  icon,
  title,
  description,
  className = '',
  delay = 0,
  ...rest
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
    >
      <Card 
        variant="glass" 
        hover 
        className={`p-6 text-center flex flex-col items-center ${className}`}
        {...rest}
      >
        <motion.div 
          className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4 shadow-inner-soft"
          whileHover={{ 
            scale: 1.05,
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)'
          }}
        >
          {icon}
        </motion.div>
        
        <h3 className="text-xl font-semibold mb-2 font-display">{title}</h3>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {description}
        </p>
      </Card>
    </motion.div>
  );
};

export default FeatureCard;
