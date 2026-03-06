'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Check if we have a token synchronously to avoid flash
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin-token');
      if (saved) {
        return { pending: true }; // Temporary user object while validating
      }
    }
    return null;
  });
  const [token, setToken] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin-token');
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const initialCheckDone = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (initialCheckDone.current) return;
    initialCheckDone.current = true;
    
    const saved = localStorage.getItem('admin-token');
    if (saved) {
      fetch('/api/admin/me', {
        headers: { Authorization: `Bearer ${saved}` },
      })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((data) => {
          setUser(data.user);
          setToken(saved);
        })
        .catch(() => {
          localStorage.removeItem('admin-token');
          setUser(null);
          setToken(null);
          router.push('/admin/login');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [router]);

  const login = async (email, password) => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Eroare la autentificare');
    localStorage.setItem('admin-token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('admin-token');
    setToken(null);
    setUser(null);
    router.push('/admin/login');
  };

  const apiFetch = async (url, options = {}) => {
    const t = token || localStorage.getItem('admin-token');
    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        Authorization: `Bearer ${t}`,
      },
    });
    if (res.status === 401) {
      logout();
      throw new Error('Sesiune expirată');
    }
    return res;
  };

  return (
    <AdminAuthContext.Provider value={{ user, token, loading, login, logout, apiFetch }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdmin must be used inside AdminAuthProvider');
  return ctx;
}
