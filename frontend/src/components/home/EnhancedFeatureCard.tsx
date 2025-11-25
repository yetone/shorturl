import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { GlassMorphismCard } from '../GlassMorphismCard';

interface EnhancedFeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  useCase: string;
  details: string;
  glowColor: string;
  variants?: any;
}

export const EnhancedFeatureCard: FC<EnhancedFeatureCardProps> = ({
  icon,
  title,
  description,
  useCase,
  details,
  glowColor,
  variants
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => setIsExpanded(!isExpanded);

  return (
    <motion.div variants={variants} className="h-full">
      <GlassMorphismCard
        className="h-full p-6 transition-all hover:scale-105"
        glowColor={glowColor}
      >
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-3">{description}</p>

        <div className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-3">
          {useCase}
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-700 dark:text-gray-400">{details}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={handleToggle}
          className="mt-4 flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-sm font-medium cursor-pointer"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Show less' : 'Learn more'}
        >
          <span>{isExpanded ? 'Show Less' : 'Learn More'}</span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </button>
      </GlassMorphismCard>
    </motion.div>
  );
};
