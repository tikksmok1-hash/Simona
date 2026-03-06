'use client';

import { useEffect, useState } from 'react';
import { useAdmin } from './AdminAuthContext';
import Link from 'next/link';

function DashboardContent() {
  const { apiFetch } = useAdmin();
  const [stats, setStats] = useState({ products: 0, categories: 0, orders: 0, blog: 0 });

  useEffect(() => {
    apiFetch('/api/admin/stats')
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  const cards = [
    { 
      label: 'Produse', 
      value: stats.products, 
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ), 
      href: '/admin/produse', 
      color: 'bg-purple-50 border-purple-200' 
    },
    { 
      label: 'Categorii', 
      value: stats.categories, 
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ), 
      href: '/admin/categorii', 
      color: 'bg-blue-50 border-blue-200' 
    },
    { 
      label: 'Comenzi', 
      value: stats.orders, 
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4" />
        </svg>
      ), 
      href: '/admin/comenzi', 
      color: 'bg-green-50 border-green-200' 
    },
    { 
      label: 'Articole Blog', 
      value: stats.blog, 
      icon: (
        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ), 
      href: '/admin/noutati', 
      color: 'bg-orange-50 border-orange-200' 
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-light text-black">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Bine ai venit în panoul de administrare SIMONA.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className={`${c.color} border rounded-lg p-6 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between mb-3">
              <span>{c.icon}</span>
              <span className="text-3xl font-light text-black">{c.value}</span>
            </div>
            <p className="text-sm text-gray-600">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-sm font-medium text-black mb-4">Acțiuni Rapide</h2>
          <div className="space-y-2">
            <Link href="/admin/produse/nou" className="block px-4 py-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors text-sm text-gray-700">
              + Adaugă Produs Nou
            </Link>
            <Link href="/admin/categorii" className="block px-4 py-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors text-sm text-gray-700">
              + Adaugă Categorie
            </Link>
            <Link href="/admin/noutati/nou" className="block px-4 py-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors text-sm text-gray-700">
              + Adaugă Articol Blog
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-sm font-medium text-black mb-4">Informații Admin</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Platforma</span>
              <span className="text-black">SIMONA Fashion</span>
            </div>
            <div className="flex justify-between">
              <span>Bază de date</span>
              <span className="text-black">MongoDB Atlas</span>
            </div>
            <div className="flex justify-between">
              <span>Framework</span>
              <span className="text-black">Next.js 16</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return <DashboardContent />;
}
