import { FC } from 'react';
import { Shield, Lock, Activity, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

interface TrustIndicatorsProps {
  placement?: 'hero' | 'footer';
}

export const TrustIndicators: FC<TrustIndicatorsProps> = ({ placement = 'hero' }) => {
  if (placement === 'hero') {
    return (
      <motion.div
        className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-gray-600 dark:text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-green-500" />
          <span>JWT Authentication</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-blue-500" />
          <span>Secure Links</span>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-purple-500" />
          <span>99.9% Uptime</span>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
              Security & Privacy
            </h3>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    JWT Authentication
                  </p>
                  <p>Industry-standard token-based authentication for secure access</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    Encrypted Connections
                  </p>
                  <p>All data transmitted over secure HTTPS connections</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Activity className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    99.9% Uptime
                  </p>
                  <p>Reliable service you can count on for your links</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
              Privacy & Data Handling
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              We respect your privacy and are committed to protecting your data. Your URL data and
              analytics are securely stored and never shared with third parties.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <a
                href="/terms"
                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
              >
                <FileText className="h-4 w-4" />
                Terms of Service
              </a>
              <a
                href="/privacy"
                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
              >
                <FileText className="h-4 w-4" />
                Privacy Policy
              </a>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 dark:text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} ShortURL. All rights reserved. Built with security
            and privacy in mind.
          </p>
        </div>
      </div>
    </div>
  );
};
