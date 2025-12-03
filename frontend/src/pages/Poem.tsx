import { FC } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PoemDisplay } from '../components/PoemDisplay';
import { BackgroundEffect } from '../components/BackgroundEffect';
import { FuturisticButton } from '../components/FuturisticButton';
import { useTheme } from '../contexts/ThemeContext';
import { ArrowLeft, Sparkles } from 'lucide-react';

const defaultPoem = `In the realm of endless links so long,
VerseCraft sings its shortening song.
Each URL transformed with care,
A tiny path through digital air.

Clicks are counted, journeys tracked,
Every visit, every fact.
From referrer to destination's door,
Analytics reveal so much more.

Share your links across the land,
Watch the data close at hand.
In this dashboard, stories grow—
Where your shortened URLs go.`;

const Poem: FC = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <>
      <BackgroundEffect />

      <div
        className={`relative min-h-screen flex flex-col justify-center items-center p-4 overflow-hidden ${
          isDarkMode ? 'bg-gray-900 text-white' : ''
        }`}
        data-testid="poem-page"
      >
        <motion.div
          className="max-w-2xl mx-auto w-full z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="flex items-center justify-center gap-2 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-6 h-6 text-purple-500" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
              VerseCraft Poetry
            </h1>
            <Sparkles className="w-6 h-6 text-pink-500" />
          </motion.div>

          <PoemDisplay
            poem={defaultPoem}
            title="The URL Shortener's Verse"
            data-testid="poem-display-component"
          />

          <motion.div
            className="mt-8 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link to="/">
              <FuturisticButton variant="outline" size="md">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </FuturisticButton>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default Poem;
