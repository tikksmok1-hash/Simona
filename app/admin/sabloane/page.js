'use client';

import { useEffect, useState } from 'react';
import { useAdmin } from '../AdminAuthContext';
import TranslatableField from '../components/TranslatableField';

const EMPTY_TEMPLATE = {
  name: '',
  shortDescription: '', shortDescriptionRu: '', shortDescriptionEn: '',
  description: '', descriptionRu: '', descriptionEn: '',
  materialsInfo: '', materialsInfoRu: '', materialsInfoEn: '',
  shippingInfo: '', shippingInfoRu: '', shippingInfoEn: '',
};

export default function TemplatesPage() {
  const { apiFetch } = useAdmin();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null); // null = list view, 'new' = creating, id = editing
  const [form, setForm] = useState({ ...EMPTY_TEMPLATE });
  const [saving, setSaving] = useState(false);

  const fetchTemplates = () => {
    apiFetch('/api/admin/templates')
      .then((r) => r.json())
      .then((data) => setTemplates(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTemplates(); }, []);

  const updateField = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const startNew = () => {
    setForm({ ...EMPTY_TEMPLATE });
    setEditingId('new');
  };

  const startEdit = (tpl) => {
    setForm({
      name: tpl.name || '',
      shortDescription: tpl.shortDescription || '',
      shortDescriptionRu: tpl.shortDescriptionRu || '',
      shortDescriptionEn: tpl.shortDescriptionEn || '',
      description: tpl.description || '',
      descriptionRu: tpl.descriptionRu || '',
      descriptionEn: tpl.descriptionEn || '',
      materialsInfo: tpl.materialsInfo || '',
      materialsInfoRu: tpl.materialsInfoRu || '',
      materialsInfoEn: tpl.materialsInfoEn || '',
      shippingInfo: tpl.shippingInfo || '',
      shippingInfoRu: tpl.shippingInfoRu || '',
      shippingInfoEn: tpl.shippingInfoEn || '',
    });
    setEditingId(tpl.id);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      alert('Introduce un nume pentru șablon.');
      return;
    }
    setSaving(true);
    try {
      const isNew = editingId === 'new';
      const url = isNew ? '/api/admin/templates' : `/api/admin/templates/${editingId}`;
      const method = isNew ? 'POST' : 'PATCH';
      const res = await apiFetch(url, { method, body: JSON.stringify(form) });
      if (res.ok) {
        setEditingId(null);
        fetchTemplates();
      } else {
        const data = await res.json();
        alert(data.error || 'Eroare la salvare');
      }
    } catch {
      alert('Eroare la salvare');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Sigur dorești să ștergi acest șablon?')) return;
    try {
      const res = await apiFetch(`/api/admin/templates/${id}`, { method: 'DELETE' });
      if (res.ok) fetchTemplates();
    } catch {}
  };

  // Field summary for list view
  const fieldSummary = (tpl) => {
    const fields = [];
    if (tpl.shortDescription) fields.push('Desc. scurtă');
    if (tpl.description) fields.push('Desc. completă');
    if (tpl.materialsInfo) fields.push('Materiale');
    if (tpl.shippingInfo) fields.push('Livrare');
    return fields.length ? fields.join(' · ') : '(gol)';
  };

  // ── EDITOR VIEW ──
  if (editingId) {
    return (
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-light text-black">
              {editingId === 'new' ? 'Șablon Nou' : 'Editare Șablon'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Completează câmpurile pe care le folosești frecvent.
            </p>
          </div>
          <button onClick={() => setEditingId(null)} className="text-sm text-gray-500 hover:text-black cursor-pointer">
            ← Înapoi la Șabloane
          </button>
        </div>

        <div className="space-y-6">
          {/* Template name */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Nume Șablon *</label>
            <input
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
              placeholder='ex. "Rochii standard", "Livrare universală"...'
            />
          </div>

          {/* Template content fields */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h2 className="text-sm font-medium text-black mb-2">Conținut Șablon</h2>
            <p className="text-xs text-gray-400 mb-4">Completează doar câmpurile relevante. Restul vor fi lăsate goale la aplicare.</p>
            
            <TranslatableField
              label="Descriere scurtă" fieldKey="shortDescription"
              value={form.shortDescription} valueRu={form.shortDescriptionRu} valueEn={form.shortDescriptionEn}
              onChange={updateField} apiFetch={apiFetch}
            />
            <TranslatableField
              label="Descriere completă" fieldKey="description" multiline rows={4}
              value={form.description} valueRu={form.descriptionRu} valueEn={form.descriptionEn}
              onChange={updateField} apiFetch={apiFetch}
            />
            <TranslatableField
              label="Detalii & Materiale" fieldKey="materialsInfo" multiline rows={3}
              value={form.materialsInfo} valueRu={form.materialsInfoRu} valueEn={form.materialsInfoEn}
              onChange={updateField} apiFetch={apiFetch}
            />
            <TranslatableField
              label="Livrare & Returnare" fieldKey="shippingInfo" multiline rows={3}
              value={form.shippingInfo} valueRu={form.shippingInfoRu} valueEn={form.shippingInfoEn}
              onChange={updateField} apiFetch={apiFetch}
            />
          </div>

          {/* Save */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-black text-white text-sm px-8 py-2.5 hover:bg-black/90 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {saving ? 'Se salvează...' : editingId === 'new' ? 'Creează Șablon' : 'Salvează Modificări'}
            </button>
            <button
              onClick={() => setEditingId(null)}
              className="border border-gray-300 text-sm px-6 py-2.5 hover:border-black transition-colors cursor-pointer"
            >
              Anulează
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── LIST VIEW ──
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-light text-black">Șabloane Produse</h1>
          <p className="text-sm text-gray-500 mt-1">
            Creează șabloane pentru descrieri, materiale și livrare — le aplici cu un click când creezi produse.
          </p>
        </div>
        <button
          onClick={startNew}
          className="bg-black text-white text-xs tracking-wider px-5 py-2.5 hover:bg-black/90 transition-colors cursor-pointer whitespace-nowrap"
        >
          + Șablon Nou
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      ) : templates.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <p className="text-sm text-gray-500 mb-4">Niciun șablon creat încă.</p>
          <button
            onClick={startNew}
            className="text-xs text-black border border-black px-5 py-2 hover:bg-black hover:text-white transition-colors cursor-pointer"
          >
            Creează Primul Șablon
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {templates.map((tpl) => (
            <div key={tpl.id} className="bg-white rounded-lg border border-gray-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-black truncate">{tpl.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{fieldSummary(tpl)}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => startEdit(tpl)}
                  className="text-xs text-black border border-gray-300 px-4 py-1.5 hover:border-black transition-colors cursor-pointer"
                >
                  Editează
                </button>
                <button
                  onClick={() => handleDelete(tpl.id)}
                  className="text-xs text-red-500 border border-red-200 px-4 py-1.5 hover:border-red-500 transition-colors cursor-pointer"
                >
                  Șterge
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
