import React, { useEffect, useRef } from 'react';

export default function ButterflyBg({ theme = 'light' }) {
  const weatherInstanceRef = useRef(null);
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
    if (weatherInstanceRef.current && weatherInstanceRef.current.wrapper) {
      weatherInstanceRef.current.wrapper.setAttribute('data-theme', theme || 'light');
    }
  }, [theme]);

  useEffect(() => {
    // Respect reduced motion accessibility
    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    let isMounted = true;
    let idleHandle = null;
    let timerHandle = null;

    const startEffect = () => {
      if (!isMounted) return;
      if (typeof window !== 'undefined' && window.YZhanWeather) {
        try {
          if (!weatherInstanceRef.current) {
            const instance = new window.YZhanWeather();
            if (instance.wrapper) {
              instance.wrapper.id = 'butterfly-bg';
              instance.wrapper.setAttribute('data-theme', themeRef.current || 'light');
              instance.wrapper.setAttribute('aria-hidden', 'true');
              instance.wrapper.style.position = 'fixed';
              instance.wrapper.style.top = '0';
              instance.wrapper.style.left = '0';
              instance.wrapper.style.width = '100vw';
              instance.wrapper.style.height = '100vh';
              instance.wrapper.style.pointerEvents = 'none';
              instance.wrapper.style.zIndex = '1';
              instance.wrapper.style.overflow = 'hidden';
            }
            // maxDuration controls flight speed, num controls number of butterflies
            instance.run('butterfly', { maxDuration: 12, num: 14 });
            weatherInstanceRef.current = instance;
          }
        } catch (e) {
          console.warn('Butterfly effect note:', e);
        }
      }
    };

    const loadAndRun = () => {
      if (window.YZhanWeather) {
        startEffect();
      } else {
        const script = document.createElement('script');
        script.src = '/yzhanweather.min.js';
        script.async = true;
        script.onload = () => {
          if (isMounted) startEffect();
        };
        document.body.appendChild(script);
      }
    };

    // Defer initialization to idle time so page loads fast
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idleHandle = window.requestIdleCallback(loadAndRun, { timeout: 1200 });
    } else {
      timerHandle = setTimeout(loadAndRun, 800);
    }

    return () => {
      isMounted = false;
      if (idleHandle && typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleHandle);
      }
      if (timerHandle) {
        clearTimeout(timerHandle);
      }
      if (weatherInstanceRef.current) {
        try {
          if (typeof weatherInstanceRef.current.destory === 'function') {
            weatherInstanceRef.current.destory();
          } else if (typeof weatherInstanceRef.current.destroy === 'function') {
            weatherInstanceRef.current.destroy();
          }
        } catch {}
        weatherInstanceRef.current = null;
      }
      const existing = document.getElementById('butterfly-bg');
      if (existing) {
        existing.remove();
      }
    };
  }, []);

  return null;
}
