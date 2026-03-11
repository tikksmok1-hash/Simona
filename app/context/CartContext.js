'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('standard');

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

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
  const addToCart = (product, variant, size, quantity = 1) => {
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
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          colorName: variant.colorName,
          colorCode: variant.colorCode,
          image: variant.images?.[0]?.url || null,
          size,
          quantity,
        },
      ];
    });
    openCart();
  };

  const removeFromCart = (key) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  };

  const updateQuantity = (key, quantity) => {
    if (quantity <= 0) return removeFromCart(key);
    setCart((prev) =>
      prev.map((item) => (item.key === key ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // ── FAVORITES ACTIONS ─────────────────────────────────────────
  const addToFavorites = (product, variant) => {
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
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          colorName: variant.colorName,
          colorCode: variant.colorCode,
          image: variant.images?.[0]?.url || null,
        },
      ];
    });
  };

  const removeFromFavorites = (key) => {
    setFavorites((prev) => prev.filter((item) => item.key !== key));
  };

  const isFavorite = (productId, variantId) => {
    return favorites.some((item) => item.key === `${productId}-${variantId}`);
  };

  const toggleFavorite = (product, variant) => {
    const key = `${product.id}-${variant.id}`;
    if (favorites.find((item) => item.key === key)) {
      removeFromFavorites(key);
    } else {
      addToFavorites(product, variant);
    }
  };

  return (
    <CartContext.Provider
      value={{
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
