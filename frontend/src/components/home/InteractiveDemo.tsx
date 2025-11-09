import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Copy, Check, AlertCircle } from 'lucide-react';
import { GlassMorphismCard } from '../GlassMorphismCard';
import { FuturisticButton } from '../FuturisticButton';
import axios from 'axios';

interface DemoURLResponse {
  short_code: string;
  original_url: string;
  shortened_url: string;
  expires_at: string;
  created_at: string;
}

export const InteractiveDemo: FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DemoURLResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const response = await axios.post<DemoURLResponse>(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/demo/urls`,
        { url },
        { timeout: 5000 }
      );
      setResult(response.data);
      setUrl('');
    } catch (err: any) {
      if (err.response?.status === 429) {
        setError('Rate limit exceeded. Please try again in a minute.');
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err.code === 'ECONNABORTED') {
        setError('Request timeout. Please try again.');
      } else {
        setError('Failed to shorten URL. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (result) {
      try {
        await navigator.clipboard.writeText(result.shortened_url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = result.shortened_url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  return (
    <motion.section
      className="max-w-4xl mx-auto my-24 px-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Try It Now
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Shorten a URL instantly - no registration required
        </p>
      </div>

      <GlassMorphismCard className="p-6 md:p-8" glowColor="rgba(99, 102, 241, 0.2)">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="demo-url-input"
              className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200"
            >
              Enter your long URL
            </label>
            <div className="relative">
              <input
                id="demo-url-input"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.example.com/very/long/url/path"
                required
                disabled={loading}
                aria-label="URL to shorten"
                aria-describedby={error ? 'demo-error' : undefined}
                aria-invalid={!!error}
                className="w-full px-4 py-3 pl-12 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-400 disabled:opacity-50 text-base md:text-lg min-h-[44px]"
                style={{ fontSize: '16px' }}
              />
              <Link2 className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <FuturisticButton
            type="submit"
            variant="neon"
            size="lg"
            disabled={loading || !url}
            className="w-full min-h-[44px]"
          >
            {loading ? 'Shortening...' : 'Shorten It'}
          </FuturisticButton>
        </form>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              id="demo-error"
              role="alert"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 space-y-4"
            >
              <div role="status" aria-live="polite" className="sr-only">
                URL shortened successfully
              </div>

              <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <strong>Original:</strong>
                </p>
                <p className="text-sm text-gray-800 dark:text-gray-200 break-all mb-4">
                  {result.original_url}
                </p>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <strong>Shortened:</strong>
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <code className="flex-1 text-base md:text-lg font-mono text-blue-600 dark:text-blue-400 break-all">
                    {result.shortened_url}
                  </code>
                  <button
                    onClick={handleCopy}
                    aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
                    className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    {copied ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <Copy className="h-5 w-5 text-blue-500" />
                    )}
                  </button>
                </div>

                {copied && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-green-600 dark:text-green-400 mt-2"
                    role="status"
                    aria-live="polite"
                  >
                    Copied to clipboard!
                  </motion.p>
                )}
              </div>

              <div className="text-center p-4 bg-purple-500/10 border border-purple-500/50 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  This demo link expires in 24 hours.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <a
                    href="/register"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    Sign up
                  </a>{' '}
                  to track analytics and manage your links permanently!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassMorphismCard>
    </motion.section>
  );
};
