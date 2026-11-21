import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { investigationsData } from '../../data/investigations';
import { matchInvestigation } from '../../utils/search';
import { Search, Filter, ArrowRight, ArrowLeft, CheckCircle2, X } from 'lucide-react';

export const Explore = () => {
  const { lang, t, searchQuery, setSearchQuery } = useApp();
  const [selectedCat, setSelectedCat] = useState('all');
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  const filtered = investigationsData.filter((inv) => {
    const matchesCat = selectedCat === 'all' || inv.category === selectedCat;
    const matchesQ = matchInvestigation(inv, searchQuery);
    return matchesCat && matchesQ;
  });

  return (
    <div className="space-y-8 py-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-midnight dark:text-ivory tracking-tight">
            {lang === 'ar' ? 'استكشاف تحقيقات ناسا' : 'Explore NASA Investigations'}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-ivory/60 mt-1">
            {lang === 'ar'
              ? 'تصفح وفلتر جميع التجارب العلمية الـ 13 الخاصة باحتراق اللهب في الجاذبية الصغرى'
              : 'Search, filter, and inspect all 13 research studies in microgravity combustion science'}
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 rtl:left-auto rtl:right-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.nav.searchPlaceholder}
            className="w-full bg-white dark:bg-deepblue text-xs rounded-full py-2.5 pl-9 pr-9 rtl:pl-9 rtl:pr-9 border border-neutral-300 dark:border-neutral-700 focus:outline-none focus:border-inferno text-midnight dark:text-ivory"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 rtl:right-auto rtl:left-3 top-2.5 text-neutral-400 hover:text-inferno p-0.5 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Categories Filter Pills */}
      <div className="flex flex-wrap gap-2 text-xs font-semibold">
        <button
          onClick={() => setSelectedCat('all')}
          className={`px-4 py-2 rounded-full transition ${
            selectedCat === 'all'
              ? 'bg-gradient-inferno text-midnight font-bold'
              : 'bg-white dark:bg-deepblue border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-ivory'
          }`}
        >
          {lang === 'ar' ? 'الكل (13)' : 'All Investigations (13)'}
        </button>
        <button
          onClick={() => setSelectedCat('solids')}
          className={`px-4 py-2 rounded-full transition ${
            selectedCat === 'solids'
              ? 'bg-gradient-inferno text-midnight font-bold'
              : 'bg-white dark:bg-deepblue border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-ivory'
          }`}
        >
          {lang === 'ar' ? 'احتراق المواد الصلبة (SAFFIRE / BASS)' : 'Solid Combustion (SAFFIRE / BASS)'}
        </button>
        <button
          onClick={() => setSelectedCat('droplets')}
          className={`px-4 py-2 rounded-full transition ${
            selectedCat === 'droplets'
              ? 'bg-gradient-inferno text-midnight font-bold'
              : 'bg-white dark:bg-deepblue border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-ivory'
          }`}
        >
          {lang === 'ar' ? 'قطرات الوقود واللهب البارد (FLEX / CFI)' : 'Droplets & Cool Flames (FLEX / CFI)'}
        </button>
        <button
          onClick={() => setSelectedCat('smoke')}
          className={`px-4 py-2 rounded-full transition ${
            selectedCat === 'smoke'
              ? 'bg-gradient-inferno text-midnight font-bold'
              : 'bg-white dark:bg-deepblue border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-ivory'
          }`}
        >
          {lang === 'ar' ? 'جسيمات الدخان (SAME)' : 'Smoke & Aerosols (SAME)'}
        </button>
        <button
          onClick={() => setSelectedCat('gases')}
          className={`px-4 py-2 rounded-full transition ${
            selectedCat === 'gases'
              ? 'bg-gradient-inferno text-midnight font-bold'
              : 'bg-white dark:bg-deepblue border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-ivory'
          }`}
        >
          {lang === 'ar' ? 'شعلات الغاز (SPICE / CFI-G)' : 'Gas Co-flow Flames (SPICE / CFI-G)'}
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((inv) => (
          <div
            key={inv.psi_id}
            className="p-6 rounded-[20px] bg-white dark:bg-deepblue/80 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4 hover:border-inferno/40 transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-inferno/10 text-inferno border border-inferno/20">
                  {inv.psi_id}
                </span>
                <span className="text-xs text-neutral-500 dark:text-golden font-semibold">
                  {inv.platform}
                </span>
              </div>
              <h3 className="text-lg font-bold text-midnight dark:text-ivory">{inv.name}</h3>
              <p className="text-xs text-neutral-600 dark:text-ivory/70 leading-relaxed">
                {lang === 'ar' ? inv.descriptionAr : inv.description}
              </p>
            </div>

            <div className="space-y-2 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs">
              <div className="flex justify-between text-neutral-500 dark:text-ivory/60">
                <span>{t.common.materials}:</span>
                <strong className="text-midnight dark:text-ivory font-semibold truncate max-w-[150px]">
                  {inv.materials}
                </strong>
              </div>
              <div className="flex justify-between text-neutral-500 dark:text-ivory/60">
                <span>{t.common.runs}:</span>
                <strong className="text-amber font-mono font-bold">{inv.totalRuns}</strong>
              </div>
              <div className="pt-2 flex justify-end">
                <Link
                  to={`/investigation/${inv.psi_id}`}
                  className="text-xs font-bold text-inferno hover:underline flex items-center gap-1"
                >
                  <span>{t.common.viewDetails}</span>
                  <ArrowIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
