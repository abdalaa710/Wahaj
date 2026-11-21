import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ArrowRight, ArrowLeft, Play, Search, Database, ShieldCheck, Bot, Sparkles, Flame, Orbit } from 'lucide-react';

export const Home = () => {
  const { lang, t } = useApp();
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-16 py-4">

      {/* HERO SECTION */}
      <section className="grid grid-cols-12 gap-8 items-center">
        
        {/* Left Hero Content */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          <div className="space-y-2 relative">
            <h1 className="text-6xl md:text-7xl xl:text-8xl font-black tracking-tight leading-tight">
              <span className="text-gradient-wahaaj font-wahaaj-ar italic block">
                {lang === 'ar' ? 'وهّاج' : 'WAHAAJ'}
              </span>
            </h1>
            <p className="text-xl md:text-2xl font-bold text-midnight dark:text-ivory tracking-tight">
              {t.hero.tagline}
            </p>
          </div>

          <p className="text-base text-neutral-600 dark:text-ivory/80 max-w-xl leading-relaxed">
            {t.hero.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/explore"
              className="bg-gradient-inferno text-midnight font-extrabold text-sm px-6 py-3.5 rounded-full shadow-lg shadow-inferno/20 hover:opacity-95 active:scale-95 transition flex items-center gap-3"
            >
              <span>{t.hero.exploreBtn}</span>
              <div className="w-6 h-6 rounded-full bg-midnight text-white flex items-center justify-center">
                <ArrowIcon className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link
              to="/dashboard"
              className="bg-white dark:bg-deepblue border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-ivory font-bold text-sm px-6 py-3.5 rounded-full hover:bg-neutral-50 dark:hover:bg-midnight transition shadow-sm"
            >
              {t.hero.dashboardBtn}
            </Link>
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <div>
              <div className="text-2xl font-black text-inferno font-mono">13</div>
              <div className="text-[11px] text-neutral-500 dark:text-ivory/60 font-semibold">{t.metrics.investigations}</div>
            </div>
            <div>
              <div className="text-2xl font-black text-amber font-mono">3,000+</div>
              <div className="text-[11px] text-neutral-500 dark:text-ivory/60 font-semibold">{t.metrics.runs}</div>
            </div>
            <div>
              <div className="text-2xl font-black text-golden font-mono">15+</div>
              <div className="text-[11px] text-neutral-500 dark:text-ivory/60 font-semibold">{t.metrics.materials}</div>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-500 font-mono">100%</div>
              <div className="text-[11px] text-neutral-500 dark:text-ivory/60 font-semibold">{t.metrics.fidelity}</div>
            </div>
          </div>
        </div>

        {/* Right Hero Cinematic Visual - Full Image with Exact Dimensions */}
        <div className="col-span-12 lg:col-span-7 flex items-center">
          <div className="relative w-full aspect-[1024/471] rounded-[24px] overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-2xl bg-midnight group">
            <img 
              src={`${import.meta.env.BASE_URL}hero-astronaut.jpg`} 
              alt="NASA Microgravity Astronaut & Flame Chamber" 
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" 
            />
          </div>
        </div>
      </section>

      {/* PLATFORM FEATURES */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-midnight dark:text-ivory tracking-tight">{t.features.title}</h2>
          <p className="text-xs text-neutral-500 dark:text-ivory/60 mt-1">{t.features.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/explore"
            className="p-6 rounded-[20px] bg-white dark:bg-deepblue/80 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:translate-y-[-3px] transition group flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-midnight flex items-center justify-center text-inferno text-xl shrink-0">
                🔥
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-midnight dark:text-ivory group-hover:text-inferno transition">
                  {t.features.exploreTitle}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-ivory/60 leading-snug">
                  {t.features.exploreDesc}
                </p>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-orange-50 dark:bg-midnight group-hover:bg-inferno text-inferno group-hover:text-white flex items-center justify-center shrink-0 transition ml-2">
              <ArrowIcon className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            to="/dashboard"
            className="p-6 rounded-[20px] bg-white dark:bg-deepblue/80 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:translate-y-[-3px] transition group flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-midnight flex items-center justify-center text-accentBlue shrink-0">
                <Database className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-midnight dark:text-ivory group-hover:text-accentBlue transition">
                  {t.features.dashboardTitle}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-ivory/60 leading-snug">
                  {t.features.dashboardDesc}
                </p>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-midnight group-hover:bg-accentBlue text-accentBlue group-hover:text-white flex items-center justify-center shrink-0 transition ml-2">
              <ArrowIcon className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            to="/compare"
            className="p-6 rounded-[20px] bg-white dark:bg-deepblue/80 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:translate-y-[-3px] transition group flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-midnight flex items-center justify-center text-accentBlue shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-midnight dark:text-ivory group-hover:text-accentBlue transition">
                  {t.features.compareTitle}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-ivory/60 leading-snug">
                  {t.features.compareDesc}
                </p>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-orange-50 dark:bg-midnight group-hover:bg-inferno text-inferno group-hover:text-white flex items-center justify-center shrink-0 transition ml-2">
              <ArrowIcon className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            to="/assistant"
            className="p-6 rounded-[20px] bg-white dark:bg-deepblue/80 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:translate-y-[-3px] transition group flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-midnight flex items-center justify-center text-inferno shrink-0">
                <Bot className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-midnight dark:text-ivory group-hover:text-inferno transition">
                  {t.features.assistantTitle}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-ivory/60 leading-snug">
                  {t.features.assistantDesc}
                </p>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-midnight group-hover:bg-accentBlue text-accentBlue group-hover:text-white flex items-center justify-center shrink-0 transition ml-2">
              <ArrowIcon className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};

