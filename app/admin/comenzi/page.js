'use client';

import { useEffect, useState } from 'react';
import { useAdmin } from '../AdminAuthContext';

const STATUS_LABELS = {
  PENDING: 'În așteptare',
  CONFIRMED: 'Confirmat',
  PROCESSING: 'Procesare',
  SHIPPED: 'Expediat',
  DELIVERED: 'Livrat',
  CANCELLED: 'Anulat',
  REFUNDED: 'Rambursat',
};

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-gray-100 text-gray-800',
};

function OrdersContent() {
  const { apiFetch } = useAdmin();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await apiFetch('/api/admin/orders');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await apiFetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    } catch {}
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-light text-black">Comenzi</h1>
        <p className="text-sm text-gray-500 mt-1">{orders.length} comenzi în total</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Se încarcă...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="flex justify-center mb-2">
            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p className="text-gray-500">Nu există comenzi încă.</p>
          <p className="text-gray-400 text-xs mt-2">Comenzile vor apărea aici când clienții plasează comenzi.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Header */}
              <div
                className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm font-mono text-gray-500">#{order.orderNumber}</span>
                  <span className={`text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] || 'bg-gray-100'}`}>
                    {STATUS_LABELS[order.status] || order.status}
                  </span>
                  {order.returning?.isReturning && (
                    <span className="text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Client Cunoscut
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-sm font-medium">{order.total?.toFixed(2)} MDL</span>
                  <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('ro-RO')}</span>
                  <svg className={`w-4 h-4 text-gray-400 transition-transform ${expandedId === order.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Expanded detail */}
              {expandedId === order.id && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    {/* Items */}
                    <div className="md:col-span-2">
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Produse</h3>
                      <div className="space-y-2">
                        {order.items?.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 text-sm">
                            {item.imageUrl && (
                              <img src={item.imageUrl} alt="" className="w-10 h-10 object-cover rounded" />
                            )}
                            <div className="flex-1">
                              <span className="text-gray-800">{item.productName}</span>
                              <span className="text-gray-400 text-xs ml-2">{item.colorName} / {item.sizeName}</span>
                            </div>
                            <span className="text-gray-500">{item.quantity}×</span>
                            <span className="font-medium">{item.total?.toFixed(2)} MDL</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Status + Info */}
                    <div>
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Actualizare Status</h3>
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black cursor-pointer"
                      >
                        {Object.entries(STATUS_LABELS).map(([val, label]) => (
                          <option key={val} value={val}>{label}</option>
                        ))}
                      </select>

                      {order.shippingAddress && (
                        <div className="mt-4">
                          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Adresă Livrare</h3>
                          <p className="text-sm text-gray-600">
                            {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                            {order.shippingAddress.address1}<br />
                            {order.shippingAddress.city}, {order.shippingAddress.county}<br />
                            {order.shippingAddress.phone}
                          </p>
                        </div>
                      )}

                      {/* Returning customer info */}
                      {order.returning?.isReturning && (
                        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <h3 className="text-xs font-medium text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            Client Cunoscut
                          </h3>
                          <div className="space-y-1 text-xs text-amber-900">
                            {order.returning.phoneOrders > 0 && (
                              <p>📱 Telefonul apare în <b>{order.returning.phoneOrders}</b> {order.returning.phoneOrders === 1 ? 'altă comandă' : 'alte comenzi'}</p>
                            )}
                            {order.returning.nameOrders > 0 && (
                              <p>👤 Numele apare în <b>{order.returning.nameOrders}</b> {order.returning.nameOrders === 1 ? 'altă comandă' : 'alte comenzi'}</p>
                            )}
                            {order.returning.addressOrders > 0 && (
                              <p>📍 Adresa apare în <b>{order.returning.addressOrders}</b> {order.returning.addressOrders === 1 ? 'altă comandă' : 'alte comenzi'}</p>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="mt-4 pt-4 border-t border-gray-100 space-y-1 text-sm">
                        <div className="flex justify-between text-gray-500">
                          <span>Subtotal</span>
                          <span>{order.subtotal?.toFixed(2)} MDL</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                          <span>Livrare</span>
                          <span>{order.shippingCost?.toFixed(2)} MDL</span>
                        </div>
                        <div className="flex justify-between font-medium text-black">
                          <span>Total</span>
                          <span>{order.total?.toFixed(2)} MDL</span>
                        </div>
                      </div>

                      {order.customerNote && (
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Observații client</h3>
                          <p className="text-sm text-gray-600 italic">{order.customerNote}</p>
                        </div>
                      )}

                      {order.user?.email && !order.user.email.startsWith('guest_') && (
                        <div className="mt-3">
                          <p className="text-xs text-gray-400">Email: <span className="text-gray-600">{order.user.email}</span></p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return <OrdersContent />;
}
