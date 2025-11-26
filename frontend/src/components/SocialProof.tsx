import { FC } from 'react';
import { motion } from 'framer-motion';
import { Users, Link2, MousePointerClick, Shield, Zap, CheckCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface StatisticProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  testId?: string;
}

const Statistic: FC<StatisticProps> = ({ icon, value, label, testId }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <motion.div
      className={`flex flex-col items-center justify-center p-6 rounded-lg ${
        isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'
      } backdrop-blur-sm`}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      data-testid={testId}
    >
      <div className="mb-3">{icon}</div>
      <div className={`text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent`}>
        {value}
      </div>
      <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        {label}
      </div>
    </motion.div>
  );
};

interface TrustBadgeProps {
  icon: React.ReactNode;
  label: string;
  testId?: string;
}

const TrustBadge: FC<TrustBadgeProps> = ({ icon, label, testId }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <motion.div
      className={`flex items-center gap-2 px-4 py-2 rounded-full ${
        isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'
      } backdrop-blur-sm`}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      data-testid={testId}
    >
      {icon}
      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {label}
      </span>
    </motion.div>
  );
};

export const SocialProof: FC = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.section
      className="max-w-6xl mx-auto mt-24 w-full z-10 px-4"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      data-testid="social-proof-section"
    >
      <motion.h2
        className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
        variants={item}
      >
        Trusted by Thousands
      </motion.h2>

      <motion.p
        className={`text-center mb-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
        variants={item}
      >
        Join our growing community of users who trust us with their links
      </motion.p>

      {/* Statistics Section */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        variants={item}
      >
        <Statistic
          icon={<Link2 className="h-10 w-10 text-neon-blue" />}
          value="10,000+"
          label="URLs Shortened"
          testId="stat-urls-shortened"
        />
        <Statistic
          icon={<MousePointerClick className="h-10 w-10 text-neon-pink" />}
          value="1M+"
          label="Clicks Tracked"
          testId="stat-clicks-tracked"
        />
        <Statistic
          icon={<Users className="h-10 w-10 text-neon-green" />}
          value="5,000+"
          label="Active Users"
          testId="stat-active-users"
        />
      </motion.div>

      {/* Trust Indicators Section */}
      <motion.div
        className="flex flex-wrap justify-center gap-4"
        variants={item}
      >
        <TrustBadge
          icon={<Shield className="h-5 w-5 text-neon-green" />}
          label="Secure & Encrypted"
          testId="trust-badge-security"
        />
        <TrustBadge
          icon={<Zap className="h-5 w-5 text-neon-yellow" />}
          label="Lightning Fast"
          testId="trust-badge-performance"
        />
        <TrustBadge
          icon={<CheckCircle className="h-5 w-5 text-neon-blue" />}
          label="99.9% Uptime"
          testId="trust-badge-reliability"
        />
      </motion.div>
    </motion.section>
  );
};
