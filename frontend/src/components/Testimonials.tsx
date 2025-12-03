import { FC } from 'react'
import { motion } from 'framer-motion'
import { GlassMorphismCard } from './GlassMorphismCard'
import { Quote } from 'lucide-react'

interface Testimonial {
  id: number
  quote: string
  name: string
  role: string
  company: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "ShortURL has transformed how we share links with our customers. The analytics dashboard gives us incredible insights into engagement patterns.",
    name: "Sarah Chen",
    role: "Marketing Director",
    company: "TechFlow Inc."
  },
  {
    id: 2,
    quote: "The simplicity and speed of this service is unmatched. We've shortened over 10,000 links and the redirect speed is lightning fast.",
    name: "Marcus Rodriguez",
    role: "Growth Lead",
    company: "StartupHub"
  },
  {
    id: 3,
    quote: "Finally, a URL shortener that takes security seriously. The detailed click tracking helps us understand our audience better.",
    name: "Emily Watson",
    role: "Product Manager",
    company: "DataVerse Solutions"
  }
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

interface TestimonialCardProps {
  testimonial: Testimonial
  glowColor: string
}

const TestimonialCard: FC<TestimonialCardProps> = ({ testimonial, glowColor }) => {
  return (
    <motion.div
      variants={item}
      data-testid="testimonial-animated-wrapper"
    >
      <div data-testid="testimonial-card">
        <GlassMorphismCard className="h-full p-6" glowColor={glowColor}>
          <div className="flex flex-col h-full">
            <Quote className="h-8 w-8 text-neon-purple opacity-60 mb-4" />
            <p
              className="text-base md:text-lg mb-6 flex-grow italic"
              data-testid="testimonial-quote"
            >
              "{testimonial.quote}"
            </p>
            <div className="border-t border-gray-200/20 pt-4">
              <p
                className="font-semibold text-lg"
                data-testid="testimonial-name"
              >
                {testimonial.name}
              </p>
              <p
                className="text-sm opacity-75"
                data-testid="testimonial-role"
              >
                {testimonial.role} at {testimonial.company}
              </p>
            </div>
          </div>
        </GlassMorphismCard>
      </div>
    </motion.div>
  )
}

const glowColors = [
  'rgba(139, 92, 246, 0.2)',  // Purple
  'rgba(0, 255, 255, 0.2)',   // Cyan/Neon Blue
  'rgba(255, 16, 240, 0.2)'   // Pink
]

export const Testimonials: FC = () => {
  return (
    <section
      className="w-full py-16 md:py-24"
      data-testid="testimonials-section"
    >
      <motion.div
        className="max-w-6xl mx-auto px-4"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent"
          variants={item}
        >
          What Our Users Say
        </motion.h2>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          data-testid="testimonials-grid"
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              glowColor={glowColors[index % glowColors.length]}
            />
          ))}
        </div>
      </motion.div>
    </section>
  )
}

export default Testimonials
