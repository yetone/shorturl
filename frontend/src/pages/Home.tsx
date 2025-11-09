import { FC } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FuturisticButton } from '../components/FuturisticButton';
import { BackgroundEffect } from '../components/BackgroundEffect';
import { Link2, BarChart3, LayoutDashboard, Globe, Shield, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { InteractiveDemo } from '../components/home/InteractiveDemo';
import { SocialProofStats } from '../components/home/SocialProofStats';
import { EnhancedFeatureCard } from '../components/home/EnhancedFeatureCard';
import { UseCaseShowcase } from '../components/home/UseCaseShowcase';
import { TrustIndicators } from '../components/home/TrustIndicators';
import { StrategicCTA } from '../components/home/StrategicCTA';

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

      <div className={`relative min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-white' : ''}`}>
        {/* Hero Section */}
        <header role="banner" className="relative flex flex-col justify-center items-center p-4 py-24 md:py-32 overflow-hidden">
          <motion.div
            className="max-w-4xl mx-auto text-center z-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-4xl sm:text-5xl md:text-7xl font-bold mb-8 leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
                Simplify Your Links
              </span>
            </motion.h1>

            <motion.p
              className={`text-lg sm:text-xl md:text-2xl mb-12 max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Create short, memorable links that redirect to your long URLs.
              Track clicks and analyze performance with our dashboard.
            </motion.p>

            <StrategicCTA location="hero" />

            <TrustIndicators placement="hero" />
          </motion.div>
        </header>

        {/* Interactive Demo Section */}
        <div id="demo-section">
          <InteractiveDemo />
        </div>

        {/* Social Proof Section */}
        <SocialProofStats />

        {/* CTA After Social Proof */}
        <StrategicCTA location="post-demo" />

        {/* Use Case Showcase */}
        <UseCaseShowcase />

        {/* Enhanced Features Section */}
        <motion.section
          className="max-w-6xl mx-auto my-24 w-full z-10 px-4"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2
            className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
            variants={item}
          >
            Powerful Features
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <EnhancedFeatureCard
              icon={<Link2 className="h-8 w-8 text-neon-green" />}
              title="URL Shortening"
              description="Transform long, unwieldy links into short, memorable URLs that are easy to share."
              useCase="Perfect for social media posts and email campaigns"
              details="Our algorithm generates collision-free short codes and supports custom aliases. Shortened URLs never expire and redirect instantly with 99.9% uptime."
              variants={item}
              glowColor="rgba(57, 255, 20, 0.2)"
            />

            <EnhancedFeatureCard
              icon={<BarChart3 className="h-8 w-8 text-neon-blue" />}
              title="Click Analytics"
              description="Track and analyze click data including referrers, user agents, and clicks over time."
              useCase="Ideal for measuring campaign performance and ROI"
              details="Get detailed insights into click sources, geographic locations, device types, and browser usage. Export data to CSV for further analysis and reporting."
              variants={item}
              glowColor="rgba(0, 255, 255, 0.2)"
            />

            <EnhancedFeatureCard
              icon={<LayoutDashboard className="h-8 w-8 text-neon-pink" />}
              title="User Dashboard"
              description="Manage all your shortened URLs from a single, intuitive dashboard interface."
              useCase="Streamline your workflow with centralized management"
              details="View all your links at a glance, search and filter by creation date, edit or delete URLs, and access detailed analytics for each link with one click."
              variants={item}
              glowColor="rgba(255, 16, 240, 0.2)"
            />

            <EnhancedFeatureCard
              icon={<Globe className="h-8 w-8 text-neon-blue" />}
              title="Global Access"
              description="Access your shortened links from anywhere in the world, on any device."
              useCase="Work from anywhere with cloud-based access"
              details="Your links and analytics are securely stored in the cloud and accessible from any device. Responsive design ensures a great experience on desktop, tablet, and mobile."
              variants={item}
              glowColor="rgba(0, 255, 255, 0.2)"
            />

            <EnhancedFeatureCard
              icon={<Shield className="h-8 w-8 text-neon-green" />}
              title="Secure Links"
              description="Rest easy knowing your links are secure and protected from malicious activity."
              useCase="Enterprise-grade security for your peace of mind"
              details="JWT authentication, HTTPS encryption, and secure database storage. We never share your data with third parties and comply with privacy regulations."
              variants={item}
              glowColor="rgba(57, 255, 20, 0.2)"
            />

            <EnhancedFeatureCard
              icon={<Zap className="h-8 w-8 text-neon-yellow" />}
              title="Lightning Fast"
              description="Enjoy lightning-fast redirects and a responsive user interface."
              useCase="Speed matters - deliver the best user experience"
              details="Optimized infrastructure ensures sub-100ms redirect times. Our frontend is built with modern React for instant interactions and smooth animations."
              variants={item}
              glowColor="rgba(250, 255, 0, 0.2)"
            />
          </div>
        </motion.section>

        {/* CTA After Features */}
        <StrategicCTA location="post-features" />

        {/* Footer with Trust Indicators */}
        <motion.footer
          role="contentinfo"
          className={`mt-24 pb-8 ${isDarkMode ? 'opacity-90' : 'opacity-95'} z-10`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <StrategicCTA location="footer" variant="secondary" />
          <TrustIndicators placement="footer" />
        </motion.footer>
      </div>
    </>
  );
};

export default Home;
