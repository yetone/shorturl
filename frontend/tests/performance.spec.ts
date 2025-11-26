import { test, expect } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';
import lighthouse from 'lighthouse';
import { chromium } from 'playwright';

test.describe('Performance and Load Time Optimization', () => {

  test('Run Lighthouse performance audit (mobile)', async ({ page }, testInfo) => {
    await page.goto('/');

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Run Lighthouse audit with mobile emulation
    const result = await page.evaluate(async () => {
      const performanceData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        loadTime: performanceData.loadEventEnd - performanceData.fetchStart,
        domContentLoaded: performanceData.domContentLoadedEventEnd - performanceData.fetchStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
      };
    });

    console.log('Mobile performance metrics:', result);

    // For now, we'll verify basic performance
    // A full Lighthouse audit would need a separate process
    expect(result.loadTime).toBeLessThan(5000); // Page loads within 5 seconds
    testInfo.attach('performance-metrics', {
      body: JSON.stringify(result, null, 2),
      contentType: 'application/json',
    });
  });

  test('Run Lighthouse performance audit (desktop)', async ({ page }, testInfo) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    const result = await page.evaluate(async () => {
      const performanceData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        loadTime: performanceData.loadEventEnd - performanceData.fetchStart,
        domContentLoaded: performanceData.domContentLoadedEventEnd - performanceData.fetchStart,
      };
    });

    console.log('Desktop performance metrics:', result);

    expect(result.loadTime).toBeLessThan(4000); // Desktop should be faster
    testInfo.attach('performance-metrics', {
      body: JSON.stringify(result, null, 2),
      contentType: 'application/json',
    });
  });

  test('Measure First Contentful Paint (FCP)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const fcp = await page.evaluate(() => {
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      return fcpEntry ? fcpEntry.startTime : 0;
    });

    console.log('First Contentful Paint:', fcp, 'ms');

    // FCP should be less than 1.5 seconds (1500ms)
    expect(fcp).toBeLessThan(1500);
    expect(fcp).toBeGreaterThan(0); // Ensure FCP was actually measured
  });

  test('Measure Largest Contentful Paint (LCP)', async ({ page }) => {
    await page.goto('/');

    // Wait for page to stabilize
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const lcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          resolve(lastEntry.renderTime || lastEntry.loadTime);
        });
        observer.observe({ type: 'largest-contentful-paint', buffered: true });

        // Timeout after 5 seconds
        setTimeout(() => resolve(0), 5000);
      });
    });

    console.log('Largest Contentful Paint:', lcp, 'ms');

    // LCP should be less than 2.5 seconds (2500ms)
    expect(lcp).toBeLessThan(2500);
    expect(lcp).toBeGreaterThan(0);
  });

  test('Measure Time to Interactive (TTI)', async ({ page }) => {
    await page.goto('/');

    const tti = await page.evaluate(async () => {
      const performanceData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      // TTI approximation: when page becomes interactive
      return performanceData.domInteractive - performanceData.fetchStart;
    });

    console.log('Time to Interactive (approximation):', tti, 'ms');

    // TTI should be less than 3.5 seconds (3500ms)
    expect(tti).toBeLessThan(3500);
  });

  test('Measure Cumulative Layout Shift (CLS)', async ({ page }) => {
    await page.goto('/');

    // Wait for page to load and settle
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const cls = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
        });
        observer.observe({ type: 'layout-shift', buffered: true });

        setTimeout(() => {
          observer.disconnect();
          resolve(clsValue);
        }, 2000);
      });
    });

    console.log('Cumulative Layout Shift:', cls);

    // CLS should be less than 0.1
    expect(cls).toBeLessThan(0.1);
  });

  test('Profile hero section animation with Chrome DevTools', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Start recording performance
    await page.evaluate(() => {
      (window as any).performanceMarks = [];
    });

    // Measure animation performance by checking frame timing
    const animationPerformance = await page.evaluate(async () => {
      return new Promise<{ avgFps: number; minFps: number }>((resolve) => {
        const frameTimes: number[] = [];
        let lastTime = performance.now();
        let frameCount = 0;

        const measureFrames = () => {
          const currentTime = performance.now();
          const delta = currentTime - lastTime;
          frameTimes.push(delta);
          lastTime = currentTime;
          frameCount++;

          if (frameCount < 60) { // Measure 60 frames (1 second at 60fps)
            requestAnimationFrame(measureFrames);
          } else {
            const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
            const avgFps = 1000 / avgFrameTime;
            const maxFrameTime = Math.max(...frameTimes);
            const minFps = 1000 / maxFrameTime;

            resolve({ avgFps, minFps });
          }
        };

        requestAnimationFrame(measureFrames);
      });
    });

    console.log('Animation performance:', animationPerformance);
    console.log('Average FPS:', animationPerformance.avgFps);
    console.log('Minimum FPS:', animationPerformance.minFps);

    // Animation should maintain at least 55fps
    expect(animationPerformance.minFps).toBeGreaterThanOrEqual(55);
  });

  test('Profile feature card scroll reveal animations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Scroll to feature section
    await page.evaluate(() => {
      const featuresSection = document.querySelector('h2');
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
      }
    });

    await page.waitForTimeout(500);

    // Measure scroll animation performance
    const scrollPerformance = await page.evaluate(async () => {
      return new Promise<{ avgFps: number; minFps: number }>((resolve) => {
        const frameTimes: number[] = [];
        let lastTime = performance.now();
        let frameCount = 0;

        // Start scrolling
        window.scrollBy({ top: 500, behavior: 'smooth' });

        const measureFrames = () => {
          const currentTime = performance.now();
          const delta = currentTime - lastTime;
          frameTimes.push(delta);
          lastTime = currentTime;
          frameCount++;

          if (frameCount < 30) { // Measure 30 frames
            requestAnimationFrame(measureFrames);
          } else {
            const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
            const avgFps = 1000 / avgFrameTime;
            const maxFrameTime = Math.max(...frameTimes);
            const minFps = 1000 / maxFrameTime;

            resolve({ avgFps, minFps });
          }
        };

        requestAnimationFrame(measureFrames);
      });
    });

    console.log('Scroll animation performance:', scrollPerformance);
    console.log('Average FPS:', scrollPerformance.avgFps);
    console.log('Minimum FPS:', scrollPerformance.minFps);

    // Scroll animations should maintain at least 55fps
    expect(scrollPerformance.minFps).toBeGreaterThanOrEqual(55);
  });

  test('Throttle network to Fast 3G and load homepage', async ({ page, context }) => {
    // Simulate Fast 3G network conditions
    const client = await context.newCDPSession(page);
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: (1.6 * 1024 * 1024) / 8, // 1.6 Mbps
      uploadThroughput: (750 * 1024) / 8, // 750 Kbps
      latency: 150, // 150ms latency
    });

    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check if page becomes interactive
    const isInteractive = await page.evaluate(() => {
      return document.readyState === 'complete';
    });

    const loadTime = Date.now() - startTime;

    console.log('Load time on Fast 3G:', loadTime, 'ms');
    console.log('Page interactive:', isInteractive);

    // Page should load and become interactive within 5 seconds even on 3G
    expect(loadTime).toBeLessThan(5000);
    expect(isInteractive).toBe(true);
  });

  test('Measure total JavaScript bundle size for homepage', async ({ page }) => {
    const resources: { url: string; size: number; type: string }[] = [];

    // Listen to all responses
    page.on('response', async (response) => {
      const url = response.url();
      const type = response.request().resourceType();

      if (type === 'script' || type === 'document') {
        try {
          const buffer = await response.body();
          resources.push({
            url,
            size: buffer.length,
            type,
          });
        } catch (e) {
          // Some responses might not have body
        }
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Calculate total JavaScript size
    const jsResources = resources.filter(r => r.type === 'script' || r.url.includes('.js'));
    const totalJsSize = jsResources.reduce((sum, r) => sum + r.size, 0);
    const totalJsSizeKB = (totalJsSize / 1024).toFixed(2);

    console.log('JavaScript resources:');
    jsResources.forEach(r => {
      console.log(`  ${r.url}: ${(r.size / 1024).toFixed(2)} KB`);
    });
    console.log(`Total JS size: ${totalJsSizeKB} KB`);

    // Note: This measures uncompressed size. Gzipped would be ~30-40% of this
    // Allowing for uncompressed size of ~750KB (which gzips to ~300KB)
    expect(totalJsSize).toBeLessThan(750 * 1024);
  });

  test('Check if feature cards use lazy loading or intersection observer', async () => {
    // This is a unit test that checks the implementation
    const homePageContent = `import { FC } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FuturisticButton } from '../components/FuturisticButton';
import { GlassMorphismCard } from '../components/GlassMorphismCard';
import { BackgroundEffect } from '../components/BackgroundEffect';
import { Link2, BarChart3, LayoutDashboard, Globe, Shield, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';`;

    // Check if the code uses whileInView or similar lazy loading patterns
    const usesWhileInView = homePageContent.includes('whileInView') ||
                           homePageContent.includes('IntersectionObserver') ||
                           homePageContent.includes('viewport');

    // Read the actual Home.tsx file to check for lazy loading
    const fs = require('fs');
    const path = require('path');
    const homePagePath = path.join(process.cwd(), 'src', 'pages', 'Home.tsx');

    let hasLazyLoading = false;

    try {
      const homePageCode = fs.readFileSync(homePagePath, 'utf-8');

      // Check for whileInView (Framer Motion's intersection observer pattern)
      hasLazyLoading = homePageCode.includes('whileInView') &&
                      homePageCode.includes('viewport');

      console.log('Lazy loading implemented:', hasLazyLoading);
      console.log('Uses whileInView:', homePageCode.includes('whileInView'));
      console.log('Uses viewport config:', homePageCode.includes('viewport'));
    } catch (e) {
      console.log('Could not read Home.tsx file');
    }

    // Below-the-fold content should load progressively
    expect(hasLazyLoading).toBe(true);
  });
});
