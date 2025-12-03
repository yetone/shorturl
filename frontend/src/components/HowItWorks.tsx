import { FC } from 'react';
import { motion } from 'framer-motion';
import { GlassMorphismCard } from './GlassMorphismCard';
import { UserPlus, Link2, Zap, BarChart3 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  glowColor: string;
}

const steps: Step[] = [
  {
    id: 1,
    title: 'Create Account',
    description: 'Sign up for free in seconds. No credit card required to get started.',
    icon: <UserPlus className="h-8 w-8" />,
    glowColor: 'rgba(57, 255, 20, 0.2)',
  },
  {
    id: 2,
    title: 'Paste URL',
    description: 'Enter your long URL into our shortener. We handle any valid web address.',
    icon: <Link2 className="h-8 w-8" />,
    glowColor: 'rgba(0, 255, 255, 0.2)',
  },
  {
    id: 3,
    title: 'Get Short Link',
    description: 'Instantly receive a short, memorable link ready to share anywhere.',
    icon: <Zap className="h-8 w-8" />,
    glowColor: 'rgba(255, 16, 240, 0.2)',
  },
  {
    id: 4,
    title: 'Track Analytics',
    description: 'Monitor clicks, analyze traffic sources, and gain insights into your audience.',
    icon: <BarChart3 className="h-8 w-8" />,
    glowColor: 'rgba(250, 255, 0, 0.2)',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export const HowItWorks: FC = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <section
      aria-label="How It Works"
      role="region"
      className="w-full py-16"
    >
      <motion.div
        className="max-w-6xl mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-100px' }}
      >
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
          variants={itemVariants}
        >
          How It Works
        </motion.h2>

        <div
          data-testid="how-it-works-steps-container"
          className="flex flex-col md:flex-row gap-6 md:gap-4 items-stretch justify-center"
        >
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col md:flex-row items-center flex-1">
              <motion.div
                data-testid={`how-it-works-step-${step.id}`}
                className="w-full"
                variants={itemVariants}
              >
                <GlassMorphismCard
                  className="h-full p-6 rounded-xl text-center"
                  glowColor={step.glowColor}
                >
                  {/* Step Number Badge */}
                  <div
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-full mb-4 font-bold text-lg ${
                      isDarkMode
                        ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white'
                        : 'bg-gradient-to-br from-blue-500 to-purple-500 text-white'
                    }`}
                  >
                    {step.id}
                  </div>

                  {/* Icon */}
                  <div
                    data-testid={`step-icon-${step.id}`}
                    aria-hidden="true"
                    className={`flex justify-center mb-4 ${
                      isDarkMode ? 'text-neon-green' : 'text-blue-600'
                    }`}
                    style={{
                      color: step.id === 1 ? '#39FF14' :
                             step.id === 2 ? '#00FFFF' :
                             step.id === 3 ? '#FF10F0' :
                             '#FAFF00'
                    }}
                  >
                    {step.icon}
                  </div>

                  {/* Title */}
                  <h3
                    className={`text-xl font-bold mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}
                  >
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p
                    data-testid={`step-description-${step.id}`}
                    className={`text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    {step.description}
                  </p>
                </GlassMorphismCard>
              </motion.div>

              {/* Connector Arrow (visible on md+ screens, hidden for last step) */}
              {index < steps.length - 1 && (
                <div
                  data-testid={`step-connector-${index + 1}`}
                  className="hidden md:flex items-center justify-center px-2 flex-shrink-0"
                  aria-hidden="true"
                >
                  <svg
                    className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              )}

              {/* Mobile Connector (vertical arrow) */}
              {index < steps.length - 1 && (
                <div
                  className="flex md:hidden items-center justify-center py-2"
                  aria-hidden="true"
                >
                  <svg
                    className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default HowItWorks;
