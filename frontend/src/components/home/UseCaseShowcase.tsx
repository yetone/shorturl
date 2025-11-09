import { FC } from 'react';
import { motion } from 'framer-motion';
import { Share2, BarChart3, Video, Store, Calendar } from 'lucide-react';
import { GlassMorphismCard } from '../GlassMorphismCard';

interface UseCase {
  id: number;
  icon: React.ReactNode;
  title: string;
  persona: string;
  description: string;
  glowColor: string;
}

const useCases: UseCase[] = [
  {
    id: 1,
    icon: <Share2 className="h-8 w-8 text-blue-500" />,
    title: "For Social Media Managers",
    persona: "social-media-manager",
    description:
      "Track which platforms drive the most engagement. Monitor clicks from Instagram, Twitter, and LinkedIn with detailed referrer analytics to optimize your social strategy.",
    glowColor: "rgba(59, 130, 246, 0.2)"
  },
  {
    id: 2,
    icon: <BarChart3 className="h-8 w-8 text-purple-500" />,
    title: "For Digital Marketers",
    persona: "digital-marketer",
    description:
      "Understand your audience with geographic data and device insights. Optimize campaigns based on real user behavior patterns and conversion metrics.",
    glowColor: "rgba(168, 85, 247, 0.2)"
  },
  {
    id: 3,
    icon: <Video className="h-8 w-8 text-pink-500" />,
    title: "For Content Creators",
    persona: "content-creator",
    description:
      "Share clean, professional links to your content. See which posts resonate most with real-time click tracking and build your audience strategically.",
    glowColor: "rgba(236, 72, 153, 0.2)"
  },
  {
    id: 4,
    icon: <Store className="h-8 w-8 text-green-500" />,
    title: "For Small Business Owners",
    persona: "small-business-owner",
    description:
      "Simple link management for promotions and campaigns. No complexity, just straightforward analytics that matter for your business growth.",
    glowColor: "rgba(34, 197, 94, 0.2)"
  },
  {
    id: 5,
    icon: <Calendar className="h-8 w-8 text-orange-500" />,
    title: "For Event Organizers",
    persona: "event-organizer",
    description:
      "Create memorable links for event registration. Track ticket page visits and conversion rates easily to maximize attendance.",
    glowColor: "rgba(249, 115, 22, 0.2)"
  }
];

export const UseCaseShowcase: FC = () => {
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
      className="max-w-6xl mx-auto my-24 px-4"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={container}
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Perfect for Every Use Case
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          Whether you're managing social media, running marketing campaigns, or organizing events,
          we've got you covered.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {useCases.map((useCase) => (
          <motion.div key={useCase.id} variants={item}>
            <GlassMorphismCard
              className="h-full p-6 hover:scale-105 transition-transform cursor-pointer"
              glowColor={useCase.glowColor}
              onClick={() => {
                // Track engagement
                if (window.gtag) {
                  window.gtag('event', 'use_case_click', {
                    event_category: 'Engagement',
                    event_label: useCase.persona
                  });
                }
              }}
            >
              <div className="mb-4">{useCase.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">
                {useCase.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {useCase.description}
              </p>
            </GlassMorphismCard>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 overflow-x-auto md:overflow-visible">
        <div className="flex md:grid md:grid-cols-5 gap-4 pb-4 md:pb-0 min-w-max md:min-w-0">
          {useCases.map((useCase, index) => (
            <motion.div
              key={`mobile-${useCase.id}`}
              variants={item}
              className="flex-shrink-0 w-64 md:w-auto md:hidden"
            >
              <GlassMorphismCard
                className="h-full p-4"
                glowColor={useCase.glowColor}
              >
                <div className="mb-3">{useCase.icon}</div>
                <h4 className="text-base font-bold mb-2 text-gray-800 dark:text-white">
                  {useCase.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                  {useCase.description}
                </p>
              </GlassMorphismCard>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};
