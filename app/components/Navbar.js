'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';

// Helper: convert display phone like "062 000 160" to international format "37362000160"
function phoneToInternational(phone) {
  const digits = phone.replace(/[^\d]/g, '');
  if (digits.startsWith('373')) return digits;
  // Remove leading 0 if present
  const local = digits.startsWith('0') ? digits.slice(1) : digits;
  return '373' + local;
}

// Module-level cache — persists across navigations within the same session
let categoriesCache = { data: null, ts: 0 };

export default function Navbar({ siteSettings = {} }) {
  const phone1 = siteSettings.phone1 || '062 000 160';
  const phone2 = siteSettings.phone2 || '';
  const siteEmail = siteSettings.email || 'simona.md_info@mail.ru';
  const siteAddress = siteSettings.address || 'str. Ion Creangă 58, Chișinău';
  const phone1Intl = phoneToInternational(phone1);
  const phone2Intl = phone2 ? phoneToInternational(phone2) : '';

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openMobileCategory, setOpenMobileCategory] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);
  const [dbCategories, setDbCategories] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const phoneRef = useRef(null);
  const searchTimerRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount, favorites, openCart } = useCart();

  // Homepage detection — computed directly from pathname (no extra state/effect)
  const isHomepage = pathname === '/' || !pathname;

  // Check scroll position on mount and scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    // Check immediately on mount
    handleScroll();
    // Mark as mounted AFTER first paint so transitions kick in smoothly
    // Use double-rAF to ensure the browser has painted the initial frame first
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setMounted(true);
      });
    });
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch categories — use module-level cache to avoid refetching on every navigation
  useEffect(() => {
    // Check if admin is logged in
    if (localStorage.getItem('admin-token')) setIsAdmin(true);

    if (categoriesCache.data) {
      setDbCategories(categoriesCache.data);
      // Refetch in background if stale (> 5 min)
      if (Date.now() - categoriesCache.ts > 5 * 60 * 1000) {
        fetch('/api/categories')
          .then((res) => res.json())
          .then((data) => {
            if (Array.isArray(data)) {
              categoriesCache = { data, ts: Date.now() };
              setDbCategories(data);
            }
          })
          .catch(() => {});
      }
      return;
    }

    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          categoriesCache = { data, ts: Date.now() };
          setDbCategories(data);
        }
      })
      .catch(() => {});
  }, []);

  // Close search results and phone dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      const inDesktop = searchRef.current && searchRef.current.contains(e.target);
      const inMobile = mobileSearchRef.current && mobileSearchRef.current.contains(e.target);
      if (!inDesktop && !inMobile) {
        setShowResults(false);
      }
      if (phoneRef.current && !phoneRef.current.contains(e.target)) {
        setIsPhoneOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search products via API with debounce
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setSearchResults(data);
            setShowResults(true);
          }
        })
        .catch(() => {});
    }, 300);
    return () => { if (searchTimerRef.current) clearTimeout(searchTimerRef.current); };
  }, [searchQuery]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      setShowResults(true);
    }
  }

  function handleResultClick(slug) {
    setSearchQuery('');
    setShowResults(false);
    setIsSearchOpen(false);
    router.push(`/produs/${slug}`);
  }

  // Transparent only on homepage when not scrolled and menu is closed
  const isTransparent = isHomepage && !isScrolled && !isMenuOpen;

  // Filter out DB categories with 0 products (direct + subcategory products)
  const activeDbCategories = dbCategories.filter((cat) => {
    const directCount = cat._count?.products || 0;
    const subCount = (cat.subcategories || []).reduce((sum, sub) => sum + (sub._count?.products || 0), 0);
    return directCount + subCount > 0;
  });

  const navCategories = [
    ...activeDbCategories,
    { id: 'reducere', name: 'Reducere', slug: 'reduceri', subcategories: [], highlight: true },
    { id: 'bestsellers', name: 'BestSellers', slug: 'bestsellers', subcategories: [] },
    { id: 'noutati', name: 'Noutăți', slug: 'noutati', subcategories: [] },
    { id: 'livrare', name: 'Livrare', slug: 'livrare', subcategories: [] },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,backdrop-filter,box-shadow] duration-500 ${
      !mounted ? 'opacity-0' : ''
    } ${
      isTransparent 
        ? 'bg-transparent' 
        : 'bg-white/95 backdrop-blur-md shadow-sm'
    }`}>
      {/* Top Bar */}
      <div className={`py-2 text-xs tracking-wide font-light transition-[background-color,backdrop-filter] duration-500 ${
        isTransparent 
          ? 'bg-white/10 backdrop-blur-sm text-white'
          : 'bg-black text-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* Phone with dropdown */}
          <div className="relative" ref={phoneRef}>
            <button
              onClick={() => setIsPhoneOpen(!isPhoneOpen)}
              className="flex items-center gap-1.5 hover:opacity-75 transition-opacity cursor-pointer"
            >
              <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              <span className="tracking-widest">{phone1}</span>
              <svg className={`w-2.5 h-2.5 opacity-60 transition-transform duration-200 ${isPhoneOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown */}
            <div className={`absolute left-0 top-full mt-1 w-52 bg-white shadow-xl border border-gray-100 transition-all duration-200 z-[100] ${isPhoneOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
              <a
                href={`https://wa.me/${phone1Intl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700 hover:text-black"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="#25D366" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span className="text-xs tracking-wide">WhatsApp</span>
              </a>
              <a
                href={`viber://chat?number=%2B${phone1Intl}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700 hover:text-black border-t border-gray-50"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="#7360F2" viewBox="0 0 24 24">
                  <path d="M11.4 0C5.5.3.8 5.3.8 11.2c0 2.1.6 4.1 1.6 5.8L.8 21.5l4.7-1.5c1.6.9 3.4 1.4 5.4 1.4h.1C16.8 21.4 21.5 16.5 21.5 10.5 21.5 4.7 17 .1 11.4 0zm5.5 15.1c-.2.6-1.2 1.2-1.7 1.2-.4.1-.9.1-1.4-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.2-.2-1.3-1.7-1.3-3.3 0-1.5.8-2.3 1.1-2.6.3-.3.6-.4.8-.4h.6c.2 0 .4.1.6.4.2.4.7 1.7.8 1.8.1.1.1.3 0 .5-.1.2-.2.3-.3.4-.1.1-.2.3-.1.5.1.2.5.8 1.1 1.3.7.7 1.4 1 1.6 1.1.2.1.4.1.5-.1.1-.2.5-.6.7-.8.2-.2.4-.2.6-.1.2.1 1.3.6 1.5.7.2.1.4.2.4.3.1.2.1.7-.1 1.3z"/>
                </svg>
                <span className="text-xs tracking-wide">Viber</span>
              </a>
              <a
                href={`tel:+${phone1Intl}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700 hover:text-black border-t border-gray-50"
              >
                <svg className="w-4 h-4 flex-shrink-0 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                <span className="text-xs tracking-wide">{phone1}</span>
              </a>
              {phone2 && (
                <a
                  href={`tel:+${phone2Intl}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700 hover:text-black border-t border-gray-50"
                >
                  <svg className="w-4 h-4 flex-shrink-0 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  <span className="text-xs tracking-wide">{phone2}</span>
                </a>
              )}
            </div>
          </div>

          {/* Center message - hidden on mobile */}
          <p className="hidden md:block text-center tracking-widest uppercase text-[10px]">
            Livrare în Republica Moldova
          </p>

          {/* Address - link to Google Maps */}
          <a
            href={`https://www.google.com/maps/search/${encodeURIComponent(siteAddress + ', Moldova')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 text-[10px] tracking-wide opacity-80 hover:opacity-100 transition-opacity"
          >
            <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            {siteAddress}
          </a>
        </div>
      </div>

      {/* Main Header - Logo, Search, Icons */}
      <div className={`transition-[border-color] duration-500 ${
        isTransparent ? 'border-b border-white/20' : 'border-b border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="SIMONA Fashion"
                className="h-20 w-auto object-contain"
              />
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-12" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim().length >= 2 && setShowResults(true)}
                  onKeyDown={e => e.key === 'Escape' && setShowResults(false)}
                  placeholder="Caută produse..."
                  className={`w-full px-4 py-2.5 border focus:outline-none text-sm font-light tracking-wide transition-all duration-500 ${
                    isTransparent 
                      ? 'border-white/30 focus:border-white bg-white/10 backdrop-blur-sm text-white placeholder:text-white/70'
                      : 'border-gray-200 focus:border-black bg-white text-black placeholder:text-gray-400'
                  }`}
                />
                <button type="submit" className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                  isTransparent ? 'text-white/70 hover:text-white' : 'text-gray-400 hover:text-black'
                }`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                {showResults && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-xl z-[200]">
                    {searchResults.length > 0 ? searchResults.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleResultClick(p.slug)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                      >
                        {p.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.image} alt={p.name} className="w-10 h-12 object-cover flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-black font-light truncate">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.price} MDL</p>
                        </div>
                      </button>
                    )) : (
                      <div className="px-4 py-5 text-center">
                        <svg className="w-8 h-8 text-gray-200 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <p className="text-sm text-gray-400 font-light">Niciun produs găsit pentru</p>
                        <p className="text-sm text-black font-medium mt-0.5">&ldquo;{searchQuery}&rdquo;</p>
                      </div>
                    )}
                  </div>
                )}
              </form>
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-6">
              {/* Admin */}
              {isAdmin && (
                <Link href="/admin" className={`relative transition-colors hidden md:block ${
                  isTransparent ? 'text-white hover:text-white/80' : 'text-gray-700 hover:text-black'
                }`} title="Admin Panel">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </Link>
              )}

              {/* Search - Mobile */}
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`md:hidden transition-colors ${
                  isTransparent ? 'text-white hover:text-white/80' : 'text-gray-700 hover:text-black'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Favorites */}
              <Link href="/favorite" className={`relative transition-colors ${
                isTransparent ? 'text-white hover:text-white/80' : 'text-gray-700 hover:text-black'
              }`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {favorites.length > 0 && (
                  <span className={`absolute -top-1.5 -right-1.5 text-[10px] w-4 h-4 flex items-center justify-center ${
                    isTransparent ? 'bg-white text-black' : 'bg-black text-white'
                  }`}>{favorites.length}</span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={openCart}
                className={`relative transition-colors cursor-pointer ${
                  isTransparent ? 'text-white hover:text-white/80' : 'text-gray-700 hover:text-black'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className={`absolute -top-1.5 -right-1.5 text-[10px] w-4 h-4 flex items-center justify-center ${
                    isTransparent ? 'bg-white text-black' : 'bg-black text-white'
                  }`}>{cartCount}</span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`md:hidden flex flex-col justify-center items-center w-6 h-6 gap-[5px] ${
                  isTransparent ? 'text-white' : 'text-gray-700'
                }`}
              >
                <span className={`block w-5 h-px bg-current transition-all duration-300 origin-center ${
                  isMenuOpen ? 'translate-y-[6px] rotate-45' : ''
                }`} />
                <span className={`block w-5 h-px bg-current transition-all duration-200 ${
                  isMenuOpen ? 'opacity-0 scale-x-0' : ''
                }`} />
                <span className={`block w-5 h-px bg-current transition-all duration-300 origin-center ${
                  isMenuOpen ? '-translate-y-[6px] -rotate-45' : ''
                }`} />
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isSearchOpen && (
            <div className="md:hidden py-4" ref={mobileSearchRef}>
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Escape' && setShowResults(false)}
                  placeholder="Caută produse..."
                  autoFocus
                  className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black text-sm font-light tracking-wide"
                />
                <button type="submit" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                {showResults && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-xl z-[200]">
                    {searchResults.length > 0 ? searchResults.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleResultClick(p.slug)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                      >
                        {p.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.image} alt={p.name} className="w-10 h-12 object-cover flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-black font-light truncate">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.price} MDL</p>
                        </div>
                      </button>
                    )) : (
                      <div className="px-4 py-5 text-center">
                        <svg className="w-8 h-8 text-gray-200 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <p className="text-sm text-gray-400 font-light">Niciun produs găsit pentru</p>
                        <p className="text-sm text-black font-medium mt-0.5">&ldquo;{searchQuery}&rdquo;</p>
                      </div>
                    )}
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Categories Navigation Bar - Desktop */}
      <div className={`hidden md:block transition-[border-color] duration-500 ${
        isTransparent ? 'border-b border-white/10' : 'border-b border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-1 lg:gap-3 xl:gap-6 h-11">
            {navCategories.map((category) => {
              const subs = (category.subcategories || []).filter(s => !s._count || s._count.products > 0);

              return (
                <div key={category.id} className="relative group flex-shrink-0 h-full flex items-center">
                  <Link 
                    href={
                      category.slug === 'reduceri' ? '/reduceri' :
                      category.slug === 'bestsellers' ? '/bestsellers' :
                      category.slug === 'noutati' ? '/noutati' :
                      category.slug === 'livrare' ? '/livrare' :
                      `/categorie/${category.slug}`
                    }
                    className={`text-[11px] lg:text-xs xl:text-sm tracking-wider uppercase py-3 block whitespace-nowrap ${
                      category.highlight 
                        ? isTransparent ? 'text-white font-medium' : 'text-black font-medium'
                        : isTransparent ? 'text-white/80 hover:text-white font-light' : 'text-gray-600 hover:text-black font-light'
                    }`}
                  >
                    {category.name}
                  </Link>
                  
                  {/* Subcategories Dropdown */}
                  {subs.length > 0 && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="bg-white border border-gray-100 shadow-xl rounded-md">
                        <div className="py-2">
                          {subs.map((sub) => (
                            <Link 
                              key={sub.id}
                              href={`/categorie/${category.slug}/${sub.slug}`}
                              className="block px-5 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-black text-sm font-light tracking-wide transition-colors"
                            >
                              {sub.name}
                            </Link>
                          ))}
                          <div className="border-t border-gray-100 mt-2 pt-2">
                            <Link 
                              href={`/categorie/${category.slug}`}
                              className="block px-5 py-2.5 text-black text-sm font-medium tracking-wide hover:bg-gray-50 transition-colors"
                            >
                              Vezi toate →
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-white border-t border-gray-100 overflow-hidden scrollbar-hide transition-all duration-300 ease-in-out ${
        isMenuOpen ? 'max-h-[70vh] opacity-100 overflow-y-auto' : 'max-h-0 opacity-0'
      }`}>
          <div className="px-6 py-4">
            <Link href="/" className="block text-gray-700 hover:text-black text-sm font-light tracking-wider uppercase py-3 border-b border-gray-50">
              Acasă
            </Link>
            
            {navCategories.map((category) => {
              const subs = (category.subcategories || []).filter(s => !s._count || s._count.products > 0);

              return (
                <div key={category.id} className="border-b border-gray-50">
                  {subs.length > 0 ? (
                    <>
                      <button
                        onClick={() => setOpenMobileCategory(openMobileCategory === category.id ? null : category.id)}
                        className={`w-full flex items-center justify-between text-sm tracking-wider py-3 ${
                          category.highlight 
                            ? 'text-black font-medium uppercase' 
                            : 'text-gray-700 hover:text-black font-light'
                        }`}
                      >
                        {category.name}
                        <svg 
                          className={`w-4 h-4 transition-transform ${openMobileCategory === category.id ? 'rotate-180' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {openMobileCategory === category.id && (
                        <div className="pb-3 pl-4">
                          {subs.map((sub) => (
                            <Link 
                              key={sub.id}
                              href={`/categorie/${category.slug}/${sub.slug}`}
                              className="block text-gray-500 hover:text-black text-sm font-light py-2"
                            >
                              {sub.name}
                            </Link>
                          ))}
                          <Link 
                            href={`/categorie/${category.slug}`}
                            className="block text-black text-sm font-medium py-2 mt-1"
                          >
                            Vezi toate →
                          </Link>
                        </div>
                      )}
                    </>
                  ) : (
                    <Link 
                      href={
                        category.slug === 'reduceri' ? '/reduceri' :
                        category.slug === 'bestsellers' ? '/bestsellers' :
                        category.slug === 'noutati' ? '/noutati' :
                        category.slug === 'livrare' ? '/livrare' :
                        `/categorie/${category.slug}`
                      }
                      className={`block text-sm tracking-wider py-3 ${
                        category.highlight 
                          ? 'text-black font-medium uppercase' 
                          : 'text-gray-700 hover:text-black font-light uppercase'
                      }`}
                    >
                      {category.name}
                    </Link>
                  )}
                </div>
              );
            })}
            
            {/* Contact Info */}
            <div className="pt-4 pb-2 flex flex-col gap-3">
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 text-gray-500 hover:text-black text-sm font-light transition-colors"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Admin Panel
                </Link>
              )}
              <a
                href={`mailto:${siteEmail}`}
                className="flex items-center gap-3 text-gray-500 hover:text-black text-sm font-light transition-colors"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                {siteEmail}
              </a>
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(siteAddress + ', Moldova')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-500 hover:text-black text-sm font-light transition-colors"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                {siteAddress}
              </a>
            </div>
          </div>
        </div>
    </nav>
  );
}
