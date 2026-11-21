import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { investigationsData } from '../../data/investigations';
import { matchInvestigation } from '../../utils/search';
import { Sun, Moon, Globe, Search, Menu, X, ArrowRight, ArrowLeft } from 'lucide-react';

export const Navbar = () => {
  const { theme, toggleTheme, lang, toggleLanguage, t, searchQuery, setSearchQuery } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchContainerRef = useRef(null);

  const navLinks = [
    { path: '/', label: t.nav.home },
    { path: '/explore', label: t.nav.explore },
    { path: '/dashboard', label: t.nav.dashboard },
    { path: '/compare', label: t.nav.compare },
    { path: '/assistant', label: t.nav.assistant },
    { path: '/about', label: t.nav.about },
  ];

  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  // Matching results for quick search dropdown
  const searchResults = searchQuery.trim()
    ? investigationsData.filter(inv => matchInvestigation(inv, searchQuery)).slice(0, 5)
    : [];

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      setSearchFocused(false);
      navigate('/explore');
    }
  };

  const handleSelectResult = (psiId) => {
    setSearchFocused(false);
    navigate(`/investigation/${psiId}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-deepblue/80 backdrop-blur-md border-b border-neutral-200 dark:border-midnight px-6 py-3.5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-9 h-9 rounded-full bg-[#0B3D91] flex items-center justify-center text-white font-black text-[11px] tracking-tight shadow-sm shrink-0">
            NASA
          </div>
          <div className="h-5 w-[1px] bg-neutral-300 dark:bg-neutral-700"></div>
          <div>
            <span className="text-xl font-black italic tracking-tight text-gradient-wahaaj font-wahaaj-ar transition">
              {lang === 'ar' ? 'وهّاج' : 'WAHAJ'}
            </span>
          </div>
        </Link>

        {/* Center Desktop Links - Equal spacing & Centered */}
        <nav className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 text-sm font-semibold flex-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-2 py-1 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-inferno font-bold'
                    : 'text-neutral-600 dark:text-ivory/80 hover:text-midnight dark:hover:text-golden'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-[-8px] left-0 right-0 h-[2.5px] bg-inferno rounded-full animate-fadeIn" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Quick Search with Live Dropdown */}
          <div ref={searchContainerRef} className="relative hidden md:block w-52 xl:w-64">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 rtl:left-auto rtl:right-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setSearchFocused(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchFocused(true);
              }}
              onKeyDown={handleSearchKeyDown}
              placeholder={t.nav.searchPlaceholder}
              className="w-full bg-neutral-100 dark:bg-midnight/70 text-xs rounded-full py-2 pl-9 pr-8 rtl:pl-8 rtl:pr-9 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:border-inferno text-midnight dark:text-ivory placeholder:text-neutral-400 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 rtl:right-auto rtl:left-2.5 top-2.5 text-neutral-400 hover:text-inferno transition p-0.5 rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Live Search Results Dropdown */}
            {searchFocused && searchQuery.trim() && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-deepblue border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-xl overflow-hidden z-50 text-xs animate-fadeIn">
                <div className="p-2 border-b border-neutral-100 dark:border-neutral-800 text-[11px] font-bold text-neutral-400 uppercase tracking-wider px-3">
                  {lang === 'ar' ? 'نتائج أبحاث ناسا' : 'NASA Research Results'}
                </div>
                
                {searchResults.length > 0 ? (
                  <div className="max-h-64 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800">
                    {searchResults.map((inv) => (
                      <button
                        key={inv.psi_id}
                        onClick={() => handleSelectResult(inv.psi_id)}
                        className="w-full text-left rtl:text-right p-3 hover:bg-neutral-50 dark:hover:bg-midnight/60 transition flex items-center justify-between gap-2 group"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-midnight dark:text-ivory group-hover:text-inferno transition">
                              {inv.name}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-inferno/10 text-inferno font-mono font-bold">
                              {inv.psi_id}
                            </span>
                          </div>
                          <div className="text-[11px] text-neutral-500 dark:text-ivory/60 truncate max-w-[200px]">
                            {inv.materials}
                          </div>
                        </div>
                        <ArrowIcon className="w-3.5 h-3.5 text-neutral-400 group-hover:text-inferno shrink-0 transition" />
                      </button>
                    ))}
                    
                    <button
                      onClick={() => {
                        setSearchFocused(false);
                        navigate('/explore');
                      }}
                      className="w-full p-2.5 text-center font-bold text-inferno hover:bg-orange-50 dark:hover:bg-midnight/80 transition block text-[11px]"
                    >
                      {lang === 'ar' ? 'عرض كافة النتائج في المستكشف ←' : 'View all in Explorer →'}
                    </button>
                  </div>
                ) : (
                  <div className="p-4 text-center text-neutral-400">
                    {lang === 'ar' ? 'لا توجد أبحاث مطابقة' : 'No matching investigations found'}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-neutral-100 dark:bg-midnight/60 hover:bg-neutral-200 dark:hover:bg-midnight text-midnight dark:text-ivory border border-neutral-200 dark:border-neutral-700 transition"
            title="Switch Language (English / العربية)"
          >
            <Globe className="w-3.5 h-3.5 text-inferno" />
            <span>{lang === 'en' ? 'العربية' : 'English'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-neutral-100 dark:bg-midnight/60 hover:bg-neutral-200 dark:hover:bg-midnight text-midnight dark:text-ivory border border-neutral-200 dark:border-neutral-700 transition"
            title="Toggle Light / Dark Mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-golden" />
            ) : (
              <Moon className="w-4 h-4 text-midnight" />
            )}
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-8 h-8 rounded-full flex items-center justify-center text-midnight dark:text-ivory"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-4 pt-4 border-t border-neutral-200 dark:border-midnight space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-neutral-800 dark:text-ivory hover:bg-neutral-100 dark:hover:bg-midnight/60"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
