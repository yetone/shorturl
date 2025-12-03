import { FC, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GlassMorphismCard } from './GlassMorphismCard';
import { useTheme } from '../contexts/ThemeContext';
import { generatePoem } from '../utils/poemGenerator';

interface PoemDisplayProps {
  poem?: string;
  title?: string;
  className?: string;
}

export const PoemDisplay: FC<PoemDisplayProps> = ({
  poem,
  title = 'VerseCraft',
  className = ''
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [displayPoem, setDisplayPoem] = useState<string>(poem || '');

  useEffect(() => {
    if (!poem) {
      setDisplayPoem(generatePoem());
    } else {
      setDisplayPoem(poem);
    }
  }, [poem]);

  const lines = displayPoem.split('\n');

  return (
    <GlassMorphismCard
      className={`p-8 ${className}`}
      glowColor={isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'}
      data-testid="poem-container"
    >
      <div className="text-center" data-testid="poem-display">
        {title && (
          <motion.h2
            className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            data-testid="poem-title"
          >
            {title}
          </motion.h2>
        )}

        <motion.div
          className="poem-content font-serif text-lg md:text-xl leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          data-testid="poem-content"
        >
          {lines.map((line, index) => (
            <p
              key={index}
              className={`my-2 ${line.trim() === '' ? 'h-4' : ''}`}
              data-testid={`poem-line-${index}`}
            >
              {line || '\u00A0'}
            </p>
          ))}
        </motion.div>
      </div>
    </GlassMorphismCard>
  );
};

export default PoemDisplay;
