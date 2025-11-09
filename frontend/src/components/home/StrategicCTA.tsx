import { FC, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FuturisticButton } from '../FuturisticButton';
import { useAuth } from '../../contexts/AuthContext';

interface StrategicCTAProps {
  location: 'hero' | 'post-demo' | 'post-features' | 'footer';
  variant?: 'primary' | 'secondary';
}

const ctaContent: Record<string, { primary: string; secondary?: string }> = {
  hero: {
    primary: 'Try Demo',
    secondary: 'or Sign Up Free'
  },
  'post-demo': {
    primary: 'Sign Up to Track Your Links'
  },
  'post-features': {
    primary: 'Create Your First Short Link'
  },
  footer: {
    primary: 'Get Started Now'
  }
};

export const StrategicCTA: FC<StrategicCTAProps> = ({ location, variant = 'primary' }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [abTestVariant, setAbTestVariant] = useState<'A' | 'B'>('A');

  useEffect(() => {
    // A/B test variant assignment (stored in localStorage for consistency)
    const storedVariant = localStorage.getItem('cta_variant') as 'A' | 'B' | null;
    if (storedVariant) {
      setAbTestVariant(storedVariant);
    } else {
      const newVariant = Math.random() < 0.5 ? 'A' : 'B';
      setAbTestVariant(newVariant);
      localStorage.setItem('cta_variant', newVariant);
    }
  }, []);

  const handleClick = (action: string) => {
    // Track CTA click
    if (window.gtag) {
      window.gtag('event', 'cta_click', {
        event_category: 'CTA',
        event_label: location,
        event_action: action,
        variant: abTestVariant
      });
    }

    // Navigate based on authentication status
    if (user) {
      navigate('/dashboard');
    } else {
      if (location === 'hero' && action === 'demo') {
        // Scroll to demo section
        const demoSection = document.querySelector('#demo-section');
        if (demoSection) {
          demoSection.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate('/register');
      }
    }
  };

  const content = ctaContent[location];

  if (location === 'hero') {
    return (
      <motion.div
        className="flex flex-col sm:flex-row justify-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <FuturisticButton
          variant="neon"
          size="lg"
          onClick={() => handleClick('demo')}
          className="min-h-[44px]"
        >
          {content.primary}
        </FuturisticButton>
        <Link to="/login">
          <FuturisticButton
            variant="outline"
            size="lg"
            onClick={() => handleClick('login')}
            className="min-h-[44px]"
          >
            Login
          </FuturisticButton>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="text-center my-16"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <FuturisticButton
        variant={variant === 'primary' ? 'neon' : 'outline'}
        size="lg"
        onClick={() => handleClick('register')}
        className="min-h-[44px]"
      >
        {content.primary}
      </FuturisticButton>
      {content.secondary && (
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          {content.secondary}
        </p>
      )}
    </motion.div>
  );
};
