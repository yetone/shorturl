import { FC, useEffect, useState, useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { Link2, MousePointerClick, Users, TrendingUp } from 'lucide-react';
import { GlassMorphismCard } from './GlassMorphismCard';

// Default statistics data (can be replaced with API data)
const DEFAULT_STATS = [
  {
    id: 'urls-shortened',
    label: 'URLs Shortened',
    value: 1250000,
    icon: Link2,
    glowColor: 'rgba(57, 255, 20, 0.2)',
    iconColor: 'text-neon-green',
  },
  {
    id: 'clicks-tracked',
    label: 'Clicks Tracked',
    value: 45000000,
    icon: MousePointerClick,
    glowColor: 'rgba(0, 255, 255, 0.2)',
    iconColor: 'text-neon-blue',
  },
  {
    id: 'active-users',
    label: 'Active Users',
    value: 50000,
    icon: Users,
    glowColor: 'rgba(255, 16, 240, 0.2)',
    iconColor: 'text-neon-pink',
  },
  {
    id: 'uptime',
    label: 'Uptime',
    value: 99.9,
    suffix: '%',
    icon: TrendingUp,
    glowColor: 'rgba(250, 255, 0, 0.2)',
    iconColor: 'text-neon-yellow',
  },
];

interface StatItem {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  icon: FC<{ className?: string }>;
  glowColor: string;
  iconColor: string;
}

interface StatisticsSectionProps {
  stats?: StatItem[];
  className?: string;
}

/**
 * Formats a number with appropriate suffixes (K, M, B)
 */
const formatNumber = (num: number): string => {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toFixed(num % 1 === 0 ? 0 : 1);
};

interface AnimatedCounterProps {
  targetValue: number;
  suffix?: string;
  isInView: boolean;
  duration?: number;
}

/**
 * AnimatedCounter component that animates from 0 to target value
 * using framer-motion's animate utility
 */
const AnimatedCounter: FC<AnimatedCounterProps> = ({
  targetValue,
  suffix = '',
  isInView,
  duration = 2,
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;

      const controls = animate(0, targetValue, {
        duration,
        ease: 'easeOut',
        onUpdate: (value) => {
          setDisplayValue(value);
        },
      });

      return () => controls.stop();
    }
  }, [isInView, targetValue, duration]);

  return (
    <span
      className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
      aria-label={`${formatNumber(targetValue)}${suffix}`}
      role="text"
    >
      {formatNumber(displayValue)}{suffix}
    </span>
  );
};

interface StatCardProps {
  stat: StatItem;
  isInView: boolean;
  index: number;
}

/**
 * Individual stat card with animated counter
 */
const StatCard: FC<StatCardProps> = ({ stat, isInView, index }) => {
  const Icon = stat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: 'easeOut'
      }}
      data-testid={`stat-card-${stat.id}`}
    >
      <GlassMorphismCard
        className="h-full p-6 text-center"
        glowColor={stat.glowColor}
        hoverEffect={true}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className={`p-3 rounded-full bg-opacity-20 ${stat.iconColor.replace('text-', 'bg-')}`}
            aria-hidden="true"
          >
            <Icon className={`h-8 w-8 ${stat.iconColor}`} aria-hidden="true" />
          </div>

          <AnimatedCounter
            targetValue={stat.value}
            suffix={stat.suffix}
            isInView={isInView}
            duration={2}
          />

          <span className="text-sm md:text-base text-gray-600 dark:text-gray-300 font-medium">
            {stat.label}
          </span>
        </div>
      </GlassMorphismCard>
    </motion.div>
  );
};

/**
 * StatisticsSection component displays platform statistics
 * with animated counters that trigger on scroll into view
 */
export const StatisticsSection: FC<StatisticsSectionProps> = ({
  stats = DEFAULT_STATS,
  className = '',
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.3,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      className={`w-full py-16 ${className}`}
      data-testid="statistics-section"
      aria-label="Platform Statistics"
      role="region"
    >
      <motion.div
        className="max-w-6xl mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <motion.h2
          className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          Trusted by Thousands
        </motion.h2>

        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          role="list"
          aria-label="Statistics metrics"
        >
          {stats.map((stat, index) => (
            <div key={stat.id} role="listitem">
              <StatCard stat={stat} isInView={isInView} index={index} />
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default StatisticsSection;
export { DEFAULT_STATS };
export type { StatItem, StatisticsSectionProps };
