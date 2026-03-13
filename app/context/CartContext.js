'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('standard');

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('simona-cart');
      const savedFavorites = localStorage.getItem('simona-favorites');
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    } catch (e) {}
    setMounted(true);
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('simona-cart', JSON.stringify(cart));
    }
  }, [cart, mounted]);

  // Save favorites to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('simona-favorites', JSON.stringify(favorites));
    }
  }, [favorites, mounted]);

  // ── CART ACTIONS ─────────────────────────────────────────────
  const addToCart = useCallback((product, variant, size, quantity = 1) => {
    const key = `${product.id}-${variant.id}-${size}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          slug: product.slug,
          name: product.name,
          nameRu: product.nameRu || '',
          nameEn: product.nameEn || '',
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          colorName: variant.colorName,
          colorNameRu: variant.colorNameRu || '',
          colorNameEn: variant.colorNameEn || '',
          colorCode: variant.colorCode,
          image: variant.images?.[0]?.url || null,
          size,
          quantity,
        },
      ];
    });
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((key) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  }, []);

  const updateQuantity = useCallback((key, quantity) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.key !== key));
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.key === key ? { ...item, quantity } : item))
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  // ── FAVORITES ACTIONS ─────────────────────────────────────────
  const addToFavorites = useCallback((product, variant) => {
    const key = `${product.id}-${variant.id}`;
    setFavorites((prev) => {
      if (prev.find((item) => item.key === key)) return prev;
      return [
        ...prev,
        {
          key,
          productId: product.id,
          variantId: variant.id,
          slug: product.slug,
          name: product.name,
          nameRu: product.nameRu || '',
          nameEn: product.nameEn || '',
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          colorName: variant.colorName,
          colorNameRu: variant.colorNameRu || '',
          colorNameEn: variant.colorNameEn || '',
          colorCode: variant.colorCode,
          image: variant.images?.[0]?.url || null,
        },
      ];
    });
  }, []);

  const removeFromFavorites = useCallback((key) => {
    setFavorites((prev) => prev.filter((item) => item.key !== key));
  }, []);

  const isFavorite = useCallback((productId, variantId) => {
    return favorites.some((item) => item.key === `${productId}-${variantId}`);
  }, [favorites]);

  const toggleFavorite = useCallback((product, variant) => {
    const key = `${product.id}-${variant.id}`;
    setFavorites((prev) => {
      if (prev.find((item) => item.key === key)) {
        return prev.filter((item) => item.key !== key);
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          variantId: variant.id,
          slug: product.slug,
          name: product.name,
          nameRu: product.nameRu || '',
          nameEn: product.nameEn || '',
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          colorName: variant.colorName,
          colorNameRu: variant.colorNameRu || '',
          colorNameEn: variant.colorNameEn || '',
          colorCode: variant.colorCode,
          image: variant.images?.[0]?.url || null,
        },
      ];
    });
  }, []);

  const contextValue = useMemo(() => ({
    cart,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isCartOpen,
    openCart,
    closeCart,
    deliveryMethod,
    setDeliveryMethod,
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
  }), [cart, cartCount, cartTotal, addToCart, removeFromCart, updateQuantity, clearCart, isCartOpen, openCart, closeCart, deliveryMethod, setDeliveryMethod, favorites, addToFavorites, removeFromFavorites, isFavorite, toggleFavorite]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
