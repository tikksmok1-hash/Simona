'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '../AdminAuthContext';

const ACTION_LABELS = {
  LOGIN: { label: 'Autentificare', color: 'bg-green-100 text-green-800', icon: '🔓' },
  LOGIN_FAILED: { label: 'Login eșuat', color: 'bg-red-100 text-red-800', icon: '🚫' },
  LOGIN_2FA_PENDING: { label: '2FA în așteptare', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
  LOGIN_2FA_FAILED: { label: '2FA eșuat', color: 'bg-red-100 text-red-800', icon: '🚫' },
  '2FA_ENABLE': { label: '2FA activat', color: 'bg-blue-100 text-blue-800', icon: '🔐' },
  '2FA_DISABLE': { label: '2FA dezactivat', color: 'bg-orange-100 text-orange-800', icon: '🔓' },
  PRODUCT_CREATE: { label: 'Produs creat', color: 'bg-emerald-100 text-emerald-800', icon: '➕' },
  PRODUCT_UPDATE: { label: 'Produs actualizat', color: 'bg-blue-100 text-blue-800', icon: '✏️' },
  PRODUCT_DELETE: { label: 'Produs șters', color: 'bg-red-100 text-red-800', icon: '🗑️' },
  ORDER_UPDATE: { label: 'Comandă actualizată', color: 'bg-purple-100 text-purple-800', icon: '📦' },
  CATEGORY_CREATE: { label: 'Categorie creată', color: 'bg-emerald-100 text-emerald-800', icon: '➕' },
  CATEGORY_UPDATE: { label: 'Categorie actualizată', color: 'bg-blue-100 text-blue-800', icon: '✏️' },
  CATEGORY_DELETE: { label: 'Categorie ștearsă', color: 'bg-red-100 text-red-800', icon: '🗑️' },
  BLOG_CREATE: { label: 'Articol creat', color: 'bg-emerald-100 text-emerald-800', icon: '➕' },
  BLOG_UPDATE: { label: 'Articol actualizat', color: 'bg-blue-100 text-blue-800', icon: '✏️' },
  BLOG_DELETE: { label: 'Articol șters', color: 'bg-red-100 text-red-800', icon: '🗑️' },
  SETTINGS_UPDATE: { label: 'Setări actualizate', color: 'bg-indigo-100 text-indigo-800', icon: '⚙️' },
};

const ACTION_FILTERS = [
  { value: '', label: 'Toate acțiunile' },
  { value: 'LOGIN', label: '🔓 Autentificări reușite' },
  { value: 'LOGIN_FAILED', label: '🚫 Autentificări eșuate' },
  { value: 'PRODUCT_CREATE', label: '➕ Produse create' },
  { value: 'PRODUCT_UPDATE', label: '✏️ Produse actualizate' },
  { value: 'PRODUCT_DELETE', label: '🗑️ Produse șterse' },
  { value: 'ORDER_UPDATE', label: '📦 Comenzi actualizate' },
  { value: 'CATEGORY_CREATE', label: '➕ Categorii create' },
  { value: 'CATEGORY_DELETE', label: '🗑️ Categorii șterse' },
  { value: 'BLOG_CREATE', label: '➕ Articole create' },
  { value: 'BLOG_DELETE', label: '🗑️ Articole șterse' },
  { value: 'SETTINGS_UPDATE', label: '⚙️ Setări actualizate' },
  { value: '2FA_ENABLE', label: '🔐 2FA activat' },
  { value: '2FA_DISABLE', label: '🔓 2FA dezactivat' },
];

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;

  if (diff < 60000) return 'Acum';
  if (diff < 3600000) return `Acum ${Math.floor(diff / 60000)} min`;
  if (diff < 86400000) return `Acum ${Math.floor(diff / 3600000)} ore`;

  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

function parseUserAgent(ua) {
  if (!ua) return 'Necunoscut';
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  return 'Altul';
}

function getDeviceType(ua) {
  if (!ua) return '🖥️';
  if (/Mobile|Android|iPhone|iPad/i.test(ua)) return '📱';
  return '🖥️';
}

export default function AuditLogsPage() {
  const { apiFetch } = useAdmin();
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '50' });
      if (filter) params.set('action', filter);
      const res = await apiFetch(`/api/admin/audit?${params}`);
      const data = await res.json();
      setLogs(data.logs || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch {
      setLogs([]);
    }
    setLoading(false);
  }, [apiFetch, page, filter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-black">Jurnal de Activitate</h1>
          <p className="text-sm text-gray-500 mt-1">
            {total} {total === 1 ? 'înregistrare' : 'înregistrări'} · se șterg automat după 30 de zile
          </p>
        </div>
        <button
          onClick={fetchLogs}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors disabled:opacity-50 self-start"
        >
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reîncarcă
        </button>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-black transition-colors"
        >
          {ACTION_FILTERS.map(f => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>

      {/* Logs table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-100">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500 text-sm">Nicio înregistrare găsită</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Data</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Acțiune</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Detalii</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Utilizator</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">IP</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 w-10">🌐</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map(log => {
                  const meta = ACTION_LABELS[log.action] || { label: log.action, color: 'bg-gray-100 text-gray-800', icon: '📋' };
                  return (
                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                        {formatDate(log.createdAt)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${meta.color}`}>
                          <span>{meta.icon}</span>
                          {meta.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700 max-w-xs truncate" title={log.details || ''}>
                        {log.details || '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {log.userEmail || '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-500 font-mono text-xs whitespace-nowrap">
                        {log.ip || '—'}
                      </td>
                      <td className="px-4 py-3 text-center" title={parseUserAgent(log.userAgent)}>
                        {getDeviceType(log.userAgent)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {logs.map(log => {
              const meta = ACTION_LABELS[log.action] || { label: log.action, color: 'bg-gray-100 text-gray-800', icon: '📋' };
              const isExpanded = expandedId === log.id;
              return (
                <div
                  key={log.id}
                  onClick={() => setExpandedId(isExpanded ? null : log.id)}
                  className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer active:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${meta.color}`}>
                      {meta.icon} {meta.label}
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(log.createdAt)}</span>
                  </div>
                  {log.details && (
                    <p className="text-sm text-gray-700 mb-1 truncate">{log.details}</p>
                  )}
                  <p className="text-xs text-gray-500">{log.userEmail || '—'}</p>
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
                      <p className="text-xs text-gray-500">
                        <span className="font-medium">IP:</span> {log.ip || '—'}
                      </p>
                      <p className="text-xs text-gray-500">
                        <span className="font-medium">Browser:</span> {parseUserAgent(log.userAgent)}
                      </p>
                      <p className="text-xs text-gray-500">
                        <span className="font-medium">Dispozitiv:</span> {getDeviceType(log.userAgent)} {/Mobile|Android|iPhone|iPad/i.test(log.userAgent || '') ? 'Mobil' : 'Desktop'}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-gray-500">
                Pagina {page} din {pages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ← Înapoi
                </button>
                <button
                  onClick={() => setPage(p => Math.min(pages, p + 1))}
                  disabled={page >= pages}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Înainte →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
