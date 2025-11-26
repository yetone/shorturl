import { FC } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { Github, Twitter, Mail, ExternalLink } from 'lucide-react';

const Footer: FC = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.footer
      className={`w-full py-8 px-4 ${isDarkMode ? 'bg-gray-900/50 text-gray-300' : 'bg-gray-50/80 text-gray-600'}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-6xl mx-auto">
        {/* Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <motion.div variants={itemVariants} className="flex items-center gap-2">
            <div className={`text-xl font-bold bg-gradient-to-r ${isDarkMode ? 'from-blue-400 to-purple-500' : 'from-blue-600 to-purple-600'} bg-clip-text text-transparent`}>
              ShortURL
            </div>
          </motion.div>

          <motion.nav
            variants={containerVariants}
            className="flex flex-wrap justify-center gap-4 text-sm"
          >
            <motion.div variants={itemVariants}>
              <Link
                to="/"
                className={`hover:text-blue-500 transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
              >
                Home
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link
                to="/dashboard"
                className={`hover:text-blue-500 transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
              >
                Dashboard
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <a
                href="https://github.com/shorturl"
                target="_blank"
                rel="noopener noreferrer"
                className={`hover:text-blue-500 transition-colors flex items-center gap-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
              >
                GitHub <ExternalLink className="h-3 w-3" />
              </a>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link
                to="/">
                <span className={`hover:text-blue-500 transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Contact
                </span>
              </Link>
            </motion.div>
          </motion.nav>

          <motion.div
            variants={containerVariants}
            className="flex gap-3"
          >
            <motion.a
              href="https://twitter.com/shorturl"
              target="_blank"
              rel="noopener noreferrer"
              variants={itemVariants}
              className={`p-2 rounded-full transition-all ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-600'}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Twitter className="h-5 w-5" />
            </motion.a>
            <motion.a
              href="https://github.com/shorturl"
              target="_blank"
              rel="noopener noreferrer"
              variants={itemVariants}
              className={`p-2 rounded-full transition-all ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-600'}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github className="h-5 w-5" />
            </motion.a>
            <motion.a
              href="mailto:support@shorturl.com"
              variants={itemVariants}
              className={`p-2 rounded-full transition-all ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-600'}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mail className="h-5 w-5" />
            </motion.a>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          className="border-t pt-4 text-center text-xs"
          variants={itemVariants}
        >
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
            &copy; {currentYear} ShortURL. All rights reserved.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
