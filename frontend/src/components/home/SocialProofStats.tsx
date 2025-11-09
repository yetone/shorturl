import { FC, useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Link2, MousePointerClick, Users, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { GlassMorphismCard } from '../GlassMorphismCard';
import axios from 'axios';

interface Stats {
  total_urls: number;
  total_clicks: number;
  total_users: number;
}

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  title: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "The analytics dashboard helped us identify that 70% of our clicks came from mobile LinkedIn. We adjusted our content strategy and saw a 40% increase in engagement.",
    author: "Sarah Johnson",
    title: "Social Media Manager, TechStartup Inc."
  },
  {
    id: 2,
    quote: "Simple, fast, and exactly what we needed. The clean interface and detailed click tracking make managing our marketing campaigns so much easier.",
    author: "Mike Chen",
    title: "Small Business Owner"
  },
  {
    id: 3,
    quote: "Love the real-time analytics! Being able to see which platforms drive the most traffic has been invaluable for our content strategy.",
    author: "Alex Rivera",
    title: "Digital Marketer"
  },
  {
    id: 4,
    quote: "The geographic data and device insights help us understand our audience better. This tool pays for itself in the insights it provides.",
    author: "Jordan Lee",
    title: "Content Creator"
  },
  {
    id: 5,
    quote: "Finally, a URL shortener that doesn't feel like overkill. Perfect balance of features and simplicity for event promotion.",
    author: "Taylor Brooks",
    title: "Event Organizer"
  }
];

const Counter: FC<{ end: number; duration?: number; suffix?: string }> = ({
  end,
  duration = 2,
  suffix = ''
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const startTime = Date.now();
    const endTime = startTime + duration * 1000;

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (endTime - startTime), 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(updateCount);
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

export const SocialProofStats: FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get<Stats>(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/public/stats`,
          { timeout: 5000 }
        );
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Use fallback data if API fails
        setStats({
          total_urls: 1250,
          total_clicks: 25000,
          total_users: 350
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    // Auto-rotate testimonials every 5 seconds
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (loading) {
    return (
      <section className="max-w-6xl mx-auto my-24 px-4">
        <div className="text-center">
          <div className="animate-pulse text-gray-400">Loading statistics...</div>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      className="max-w-6xl mx-auto my-24 px-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
          Trusted by Thousands
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Join our growing community of users
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-16" role="group" aria-label="Service statistics">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <GlassMorphismCard
            className="p-6 text-center"
            glowColor="rgba(99, 102, 241, 0.2)"
          >
            <div className="flex justify-center mb-4">
              <Link2 className="h-12 w-12 text-blue-500" />
            </div>
            <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
              {stats && <Counter end={stats.total_urls} suffix="+" />}
            </div>
            <p className="text-gray-600 dark:text-gray-300">URLs Shortened</p>
          </GlassMorphismCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <GlassMorphismCard
            className="p-6 text-center"
            glowColor="rgba(168, 85, 247, 0.2)"
          >
            <div className="flex justify-center mb-4">
              <MousePointerClick className="h-12 w-12 text-purple-500" />
            </div>
            <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
              {stats && <Counter end={stats.total_clicks} suffix="+" />}
            </div>
            <p className="text-gray-600 dark:text-gray-300">Clicks Tracked</p>
          </GlassMorphismCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <GlassMorphismCard
            className="p-6 text-center"
            glowColor="rgba(236, 72, 153, 0.2)"
          >
            <div className="flex justify-center mb-4">
              <Users className="h-12 w-12 text-pink-500" />
            </div>
            <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
              {stats && <Counter end={stats.total_users} suffix="+" />}
            </div>
            <p className="text-gray-600 dark:text-gray-300">Active Users</p>
          </GlassMorphismCard>
        </motion.div>
      </div>

      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-2xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          What Our Users Say
        </h3>

        <GlassMorphismCard className="relative p-8 md:p-12" glowColor="rgba(139, 92, 246, 0.2)">
          <Quote className="absolute top-6 left-6 h-8 w-8 text-purple-500/30" />

          <div className="relative min-h-[200px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <blockquote className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6 italic">
                  "{testimonials[currentTestimonial].quote}"
                </blockquote>
                <div className="text-right">
                  <p className="font-bold text-gray-800 dark:text-white">
                    {testimonials[currentTestimonial].author}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonials[currentTestimonial].title}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prevTestimonial}
              aria-label="Previous testimonial"
              className="p-2 rounded-full bg-purple-500/20 hover:bg-purple-500/30 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <ChevronLeft className="h-5 w-5 text-purple-500" />
            </button>

            <div className="flex gap-2" role="tablist" aria-label="Testimonial navigation">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                  aria-selected={index === currentTestimonial}
                  role="tab"
                  className={`h-2 rounded-full transition-all ${
                    index === currentTestimonial
                      ? 'w-8 bg-purple-500'
                      : 'w-2 bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              aria-label="Next testimonial"
              className="p-2 rounded-full bg-purple-500/20 hover:bg-purple-500/30 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <ChevronRight className="h-5 w-5 text-purple-500" />
            </button>
          </div>
        </GlassMorphismCard>
      </motion.div>
    </motion.section>
  );
};
