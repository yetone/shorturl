import { FC, useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Link2, Copy, Check, AlertCircle, Loader2 } from 'lucide-react';
import { GlassMorphismCard } from './GlassMorphismCard';
import { FuturisticButton } from './FuturisticButton';
import { useTheme } from '../contexts/ThemeContext';
import { Link } from 'react-router-dom';

interface InteractiveDemoProps {
  className?: string;
}

interface DemoResult {
  originalUrl: string;
  shortenedUrl: string;
  shortCode: string;
}

/**
 * Validates if a string is a valid URL format
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;

  const trimmedUrl = url.trim();
  if (trimmedUrl.length === 0) return false;

  try {
    const urlObj = new URL(trimmedUrl);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Generates a demo short code (client-side only, for preview purposes)
 */
export function generateDemoShortCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const InteractiveDemo: FC<InteractiveDemoProps> = ({ className = '' }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DemoResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    // Validation: Check for empty input
    if (!url.trim()) {
      setError('Please enter a URL to shorten');
      return;
    }

    // Validation: Check for valid URL format
    if (!isValidUrl(url)) {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    // Simulate loading state
    setIsLoading(true);

    // Simulate API delay for demo effect
    await new Promise(resolve => setTimeout(resolve, 800));

    // Generate demo result (client-side preview only)
    const shortCode = generateDemoShortCode();
    const shortenedUrl = `${window.location.origin}/r/${shortCode}`;

    setResult({
      originalUrl: url,
      shortenedUrl,
      shortCode,
    });

    setIsLoading(false);
  };

  const handleCopy = async () => {
    if (result) {
      try {
        await navigator.clipboard.writeText(result.shortenedUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const handleReset = () => {
    setUrl('');
    setError(null);
    setResult(null);
  };

  return (
    <section
      className={`w-full max-w-2xl mx-auto ${className}`}
      aria-label="Interactive URL Shortening Demo"
    >
      <GlassMorphismCard
        className="p-6 md:p-8"
        glowColor="rgba(99, 102, 241, 0.3)"
      >
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Link2 className="h-6 w-6 text-indigo-500" />
            <h2 className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Try It Now
            </h2>
          </div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            See how easy it is to shorten URLs - no registration required!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="demo-url-input"
              className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Enter your long URL
            </label>
            <input
              id="demo-url-input"
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError(null);
              }}
              placeholder="https://example.com/very-long-url-path..."
              className={`w-full px-4 py-3 rounded-lg border transition-colors
                ${isDarkMode
                  ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-500 focus:border-indigo-500'
                  : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-indigo-500'
                }
                focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
              aria-describedby={error ? 'demo-error' : undefined}
              aria-invalid={error ? 'true' : 'false'}
              disabled={isLoading}
            />
          </div>

          {error && (
            <motion.div
              id="demo-error"
              role="alert"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30"
            >
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-500">{error}</p>
            </motion.div>
          )}

          <FuturisticButton
            type="submit"
            variant="neon"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                <span>Shortening...</span>
              </span>
            ) : (
              'Shorten URL'
            )}
          </FuturisticButton>
        </form>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-4"
            data-testid="demo-result"
          >
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100/50'}`}>
              <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Original URL:
              </p>
              <p className={`text-sm truncate ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {result.originalUrl}
              </p>
            </div>

            <div className={`p-4 rounded-lg border-2 border-indigo-500/30 ${isDarkMode ? 'bg-indigo-900/20' : 'bg-indigo-50'}`}>
              <p className={`text-xs mb-1 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
                Shortened URL Preview:
              </p>
              <div className="flex items-center gap-2">
                <p className={`text-lg font-mono flex-1 truncate ${isDarkMode ? 'text-indigo-200' : 'text-indigo-700'}`}>
                  {result.shortenedUrl}
                </p>
                <button
                  onClick={handleCopy}
                  className={`p-2 rounded-md transition-colors ${
                    isDarkMode
                      ? 'hover:bg-gray-700'
                      : 'hover:bg-gray-200'
                  }`}
                  aria-label={copied ? 'Copied!' : 'Copy shortened URL'}
                >
                  {copied ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <Copy className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  )}
                </button>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-amber-900/20 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'}`}>
              <p className={`text-sm ${isDarkMode ? 'text-amber-200' : 'text-amber-800'}`}>
                <strong>This is a demo preview.</strong> The link shown above is for demonstration purposes only and will not work.{' '}
                <Link
                  to="/register"
                  className={`underline font-medium ${isDarkMode ? 'text-amber-100 hover:text-white' : 'text-amber-900 hover:text-amber-700'}`}
                >
                  Register for free
                </Link>{' '}
                to create permanent shortened links with full analytics!
              </p>
            </div>

            <button
              onClick={handleReset}
              className={`text-sm underline ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}
            >
              Try another URL
            </button>
          </motion.div>
        )}
      </GlassMorphismCard>
    </section>
  );
};

export default InteractiveDemo;
