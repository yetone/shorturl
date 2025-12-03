import { FC, useState, KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassMorphismCard } from './GlassMorphismCard'
import { ChevronDown, HelpCircle } from 'lucide-react'

interface FAQItem {
  id: number
  question: string
  answer: string
}

const faqItems: FAQItem[] = [
  {
    id: 1,
    question: "Is ShortURL free to use?",
    answer: "Yes! ShortURL offers a generous free tier that includes unlimited link shortening and basic analytics. For advanced features like custom domains and detailed analytics, we offer affordable premium plans."
  },
  {
    id: 2,
    question: "Do shortened links expire?",
    answer: "No, your shortened links are permanent and will never expire. Once you create a short link, it will continue to redirect to your destination URL indefinitely, as long as your account remains active."
  },
  {
    id: 3,
    question: "What analytics and tracking features are available?",
    answer: "Our analytics dashboard provides comprehensive insights including total clicks, click trends over time, geographic location of visitors, referrer sources, device types, and browser information. You can track performance and understand your audience better."
  },
  {
    id: 4,
    question: "How secure are my shortened links?",
    answer: "Security is our top priority. All links are served over HTTPS, and we implement industry-standard security measures to protect your data. Your links and analytics data are encrypted and stored securely."
  },
  {
    id: 5,
    question: "Can I customize my short links?",
    answer: "Yes! You can create custom short links with your preferred keywords instead of random characters. This makes your links more memorable and branded. Custom links are available on all plans."
  },
  {
    id: 6,
    question: "How fast are the redirects?",
    answer: "Our infrastructure is optimized for speed. Redirects typically happen in milliseconds, ensuring your visitors have a seamless experience. We use global CDN distribution to minimize latency worldwide."
  },
  {
    id: 7,
    question: "Can I edit or delete my links?",
    answer: "Absolutely! You have full control over your links. You can edit the destination URL, update the custom alias, or delete links entirely from your dashboard at any time."
  }
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
}

const answerVariant = {
  hidden: {
    opacity: 0,
    height: 0,
    marginTop: 0
  },
  visible: {
    opacity: 1,
    height: 'auto',
    marginTop: 16,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    height: 0,
    marginTop: 0,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
}

interface FAQItemComponentProps {
  item: FAQItem
  isExpanded: boolean
  onToggle: () => void
  glowColor: string
}

const FAQItemComponent: FC<FAQItemComponentProps> = ({ item, isExpanded, onToggle, glowColor }) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onToggle()
    }
  }

  return (
    <motion.div
      variants={itemVariant}
      data-testid="faq-item"
    >
      <GlassMorphismCard className="p-0 overflow-hidden" glowColor={glowColor} hoverEffect={false}>
        <div
          role="button"
          tabIndex={0}
          aria-expanded={isExpanded}
          onClick={onToggle}
          onKeyDown={handleKeyDown}
          className="w-full p-5 md:p-6 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
          data-testid="faq-button"
        >
          <span
            className="text-base md:text-lg font-medium text-left pr-4"
            data-testid="faq-question"
          >
            {item.question}
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0"
            data-testid="faq-icon"
          >
            <ChevronDown className="h-5 w-5 text-neon-purple" />
          </motion.div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              variants={answerVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="overflow-hidden"
              data-testid="faq-answer-wrapper"
            >
              <div
                className="px-5 md:px-6 pb-5 md:pb-6 pt-0 border-t border-gray-200/10"
                data-testid="faq-answer"
              >
                <p className="text-sm md:text-base opacity-80 leading-relaxed pt-4">
                  {item.answer}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassMorphismCard>
    </motion.div>
  )
}

const glowColors = [
  'rgba(139, 92, 246, 0.15)',  // Purple
  'rgba(0, 255, 255, 0.15)',   // Cyan/Neon Blue
  'rgba(255, 16, 240, 0.15)',  // Pink
  'rgba(57, 255, 20, 0.15)',   // Neon Green
  'rgba(250, 255, 0, 0.15)',   // Neon Yellow
]

export const FAQ: FC = () => {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

  const toggleItem = (id: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  return (
    <section
      className="w-full py-16 md:py-24"
      data-testid="faq-section"
    >
      <motion.div
        className="max-w-4xl mx-auto px-4"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        data-testid="faq-container"
      >
        <motion.div
          className="text-center mb-12"
          variants={itemVariant}
        >
          <div className="inline-flex items-center justify-center mb-4">
            <HelpCircle className="h-8 w-8 text-neon-purple mr-3" />
            <motion.h2
              className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent"
            >
              Frequently Asked Questions
            </motion.h2>
          </div>
          <p className="text-base md:text-lg opacity-70 max-w-2xl mx-auto">
            Got questions? We've got answers. Find everything you need to know about ShortURL.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <FAQItemComponent
              key={item.id}
              item={item}
              isExpanded={expandedItems.has(item.id)}
              onToggle={() => toggleItem(item.id)}
              glowColor={glowColors[index % glowColors.length]}
            />
          ))}
        </div>
      </motion.div>
    </section>
  )
}

export default FAQ
