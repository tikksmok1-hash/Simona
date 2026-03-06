'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { categories } from '@/lib/data/categories';
import { products } from '@/lib/data/products';
import { useCart } from '@/app/context/CartContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openMobileCategory, setOpenMobileCategory] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount, favorites, openCart } = useCart();

  // Close search results on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target) &&
          mobileSearchRef.current && !mobileSearchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter products on query change
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    const results = products
      .filter(p => p.isActive && p.name.toLowerCase().includes(q))
      .slice(0, 6);
    setSearchResults(results);
    setShowResults(true);
  }, [searchQuery]);

  function handleSearchSubmit(e) {
    e.preventDefault();
  }

  function handleResultClick(slug) {
    setSearchQuery('');
    setShowResults(false);
    setIsSearchOpen(false);
    router.push(`/produs/${slug}`);
  }

  // Transparent only on homepage
  const isHomepage = pathname === '/';
  const isTransparent = isHomepage && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navCategories = [
    ...categories,
    { id: 'reducere', name: 'Reducere', slug: 'reduceri', subcategories: [], highlight: true },
    { id: 'bestsellers', name: 'BestSellers', slug: 'bestsellers', subcategories: [] },
    { id: 'noutati', name: 'Noutăți', slug: 'noutati', subcategories: [] },
    { id: 'livrare', name: 'Livrare', slug: 'livrare', subcategories: [] },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isTransparent 
        ? 'bg-transparent' 
        : 'bg-white/95 backdrop-blur-md shadow-sm'
    }`}>
      {/* Top Bar */}
      <div className={`py-2 text-xs tracking-wide font-light transition-all duration-500 ${
        isTransparent 
          ? 'bg-white/10 backdrop-blur-sm text-white'
          : 'bg-black text-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* Phone with dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 hover:opacity-75 transition-opacity cursor-pointer">
              <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              <span className="tracking-widest">062 000 160</span>
              <svg className="w-2.5 h-2.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown */}
            <div className="absolute left-0 top-full mt-1 w-44 bg-white shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100]">
              <a
                href="https://wa.me/37362000160"
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
                href="viber://chat?number=%2B37362000160"
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700 hover:text-black border-t border-gray-50"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="#7360F2" viewBox="0 0 24 24">
                  <path d="M11.4 0C5.5.3.8 5.3.8 11.2c0 2.1.6 4.1 1.6 5.8L.8 21.5l4.7-1.5c1.6.9 3.4 1.4 5.4 1.4h.1C16.8 21.4 21.5 16.5 21.5 10.5 21.5 4.7 17 .1 11.4 0zm5.5 15.1c-.2.6-1.2 1.2-1.7 1.2-.4.1-.9.1-1.4-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.2-.2-1.3-1.7-1.3-3.3 0-1.5.8-2.3 1.1-2.6.3-.3.6-.4.8-.4h.6c.2 0 .4.1.6.4.2.4.7 1.7.8 1.8.1.1.1.3 0 .5-.1.2-.2.3-.3.4-.1.1-.2.3-.1.5.1.2.5.8 1.1 1.3.7.7 1.4 1 1.6 1.1.2.1.4.1.5-.1.1-.2.5-.6.7-.8.2-.2.4-.2.6-.1.2.1 1.3.6 1.5.7.2.1.4.2.4.3.1.2.1.7-.1 1.3z"/>
                </svg>
                <span className="text-xs tracking-wide">Viber</span>
              </a>
              <a
                href="tel:062000160"
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700 hover:text-black border-t border-gray-50"
              >
                <svg className="w-4 h-4 flex-shrink-0 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                <span className="text-xs tracking-wide">Telefon</span>
              </a>
            </div>
          </div>

          {/* Center message - hidden on mobile */}
          <p className="hidden md:block text-center tracking-widest uppercase text-[10px]">
            Livrare în Republica Moldova
          </p>

          {/* Address - link to Google Maps */}
          <a
            href="https://www.google.com/maps/search/str.+Ion+Creangă+58,+Chișinău,+Moldova"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 text-[10px] tracking-wide opacity-80 hover:opacity-100 transition-opacity"
          >
            <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            str. Ion Creangă 58, Chișinău
          </a>
        </div>
      </div>

      {/* Main Header - Logo, Search, Icons */}
      <div className={`transition-all duration-500 ${
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
                  onFocus={() => searchResults.length > 0 && setShowResults(true)}
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
                {/* Dropdown rezultate */}
                {showResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-xl z-[200]">
                    {searchResults.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleResultClick(p.slug)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                      >
                        {p.variants?.[0]?.images?.[0]?.url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.variants[0].images[0].url} alt={p.name} className="w-10 h-12 object-cover flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-black font-light truncate">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.price} MDL</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </form>
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-6">
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
                className={`md:hidden transition-colors ${
                  isTransparent ? 'text-white hover:text-white/80' : 'text-gray-700 hover:text-black'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
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
                {showResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-xl z-[200]">
                    {searchResults.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleResultClick(p.slug)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                      >
                        {p.variants?.[0]?.images?.[0]?.url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.variants[0].images[0].url} alt={p.name} className="w-10 h-12 object-cover flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-black font-light truncate">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.price} MDL</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Categories Navigation Bar - Desktop */}
      <div className={`hidden md:block transition-all duration-500 ${
        isTransparent ? 'border-b border-white/10' : 'border-b border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-8 h-12">
            {navCategories.map((category) => (
              <div key={category.id} className="relative group">
                <Link 
                  href={
                    category.slug === 'reduceri' ? '/reduceri' :
                    category.slug === 'bestsellers' ? '/bestsellers' :
                    category.slug === 'noutati' ? '/noutati' :
                    category.slug === 'livrare' ? '/livrare' :
                    `/categorie/${category.slug}`
                  }
                  className={`text-sm tracking-wider uppercase transition-colors py-3 block ${
                    category.highlight 
                      ? isTransparent ? 'text-white font-medium' : 'text-black font-medium'
                      : isTransparent ? 'text-white/80 hover:text-white font-light' : 'text-gray-600 hover:text-black font-light'
                  }`}
                >
                  {category.name}
                </Link>
                
                {/* Subcategories Dropdown */}
                {category.subcategories && category.subcategories.length > 0 && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-0 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="bg-white border border-gray-100 shadow-xl mt-0">
                      <div className="py-2">
                        {category.subcategories.map((sub) => (
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
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 max-h-[70vh] overflow-y-auto">
          <div className="px-6 py-4">
            <Link href="/" className="block text-gray-700 hover:text-black text-sm font-light tracking-wider uppercase py-3 border-b border-gray-50">
              Acasă
            </Link>
            
            {navCategories.map((category) => (
              <div key={category.id} className="border-b border-gray-50">
                {category.subcategories && category.subcategories.length > 0 ? (
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
                        {category.subcategories.map((sub) => (
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
            ))}
            
            <Link href="/contact" className="block text-gray-700 hover:text-black text-sm font-light tracking-wider uppercase py-3">
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
