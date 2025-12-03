import { FC } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FuturisticButton } from '../components/FuturisticButton';
import { GlassMorphismCard } from '../components/GlassMorphismCard';
import { BackgroundEffect } from '../components/BackgroundEffect';
import { InteractiveDemo } from '../components/InteractiveDemo';
import { Testimonials } from '../components/Testimonials';
import { Link2, BarChart3, LayoutDashboard, Globe, Shield, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { StatisticsSection } from '../components/StatisticsSection';

const Home: FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isAuthenticated = !!user;
  const isDarkMode = theme === 'dark';

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <>
      <BackgroundEffect />

      <div className={`relative min-h-screen flex flex-col justify-center items-center p-4 overflow-hidden ${isDarkMode ? 'bg-gray-900 text-white' : ''}`}>
        <motion.div
          className="max-w-4xl mx-auto text-center z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
              Simplify Your Links
            </span>
          </motion.h1>

          <motion.p
            className={`text-xl md:text-2xl mb-12 max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Create short, memorable links that redirect to your long URLs.
            Track clicks and analyze performance with our dashboard.
          </motion.p>

          <motion.div
            className="flex flex-col md:flex-row justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              <FuturisticButton variant="neon" size="lg">
                Get Started
              </FuturisticButton>
            </Link>
            <Link to="/login">
              <FuturisticButton variant="outline" size="lg">
                Login
              </FuturisticButton>
            </Link>
          </motion.div>
        </motion.div>

        {/* Interactive Demo Section */}
        <motion.div
          className="max-w-6xl mx-auto mt-16 w-full z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <InteractiveDemo />
        </motion.div>

        {/* Statistics Section - positioned to build credibility early in the page flow */}
        <StatisticsSection className="mt-16 z-10" />

        <motion.div
          className="max-w-6xl mx-auto mt-16 w-full z-10"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2
            className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
            variants={item}
          >
            Features
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Link2 className="h-8 w-8 text-neon-green" />}
              title="URL Shortening"
              description="Transform long, unwieldy links into short, memorable URLs that are easy to share."
              variants={item}
              glowColor="rgba(57, 255, 20, 0.2)"
            />

            <FeatureCard
              icon={<BarChart3 className="h-8 w-8 text-neon-blue" />}
              title="Click Analytics"
              description="Track and analyze click data including referrers, user agents, and clicks over time."
              variants={item}
              glowColor="rgba(0, 255, 255, 0.2)"
            />

            <FeatureCard
              icon={<LayoutDashboard className="h-8 w-8 text-neon-pink" />}
              title="User Dashboard"
              description="Manage all your shortened URLs from a single, intuitive dashboard interface."
              variants={item}
              glowColor="rgba(255, 16, 240, 0.2)"
            />

            <FeatureCard
              icon={<Globe className="h-8 w-8 text-neon-blue" />}
              title="Global Access"
              description="Access your shortened links from anywhere in the world, on any device."
              variants={item}
              glowColor="rgba(0, 255, 255, 0.2)"
            />

            <FeatureCard
              icon={<Shield className="h-8 w-8 text-neon-green" />}
              title="Secure Links"
              description="Rest easy knowing your links are secure and protected from malicious activity."
              variants={item}
              glowColor="rgba(57, 255, 20, 0.2)"
            />

            <FeatureCard
              icon={<Zap className="h-8 w-8 text-neon-yellow" />}
              title="Lightning Fast"
              description="Enjoy lightning-fast redirects and a responsive user interface."
              variants={item}
              glowColor="rgba(250, 255, 0, 0.2)"
            />
          </div>
        </motion.div>

        <div className="w-full z-10 mt-16">
          <Testimonials />
        </div>

        <motion.footer
          className={`mt-24 text-center text-sm ${isDarkMode ? 'opacity-50' : 'opacity-75'} z-10`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <p>&copy; {new Date().getFullYear()} ShortURL. All rights reserved.</p>
        </motion.footer>
      </div>
    </>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  variants: any;
  glowColor: string;
}

const FeatureCard: FC<FeatureCardProps> = ({ icon, title, description, variants, glowColor }) => {
  return (
    <motion.div variants={variants}>
      <GlassMorphismCard className="h-full p-6" glowColor={glowColor}>
        <div className="mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p>{description}</p>
      </GlassMorphismCard>
    </motion.div>
  );
};

export default Home;
