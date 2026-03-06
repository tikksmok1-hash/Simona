'use client';

import { useEffect, useState } from 'react';
import { useAdmin } from '../AdminAuthContext';
import Link from 'next/link';

function BlogListContent() {
  const { apiFetch } = useAdmin();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/admin/blog')
      .then((r) => r.json())
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const deletePost = async (id) => {
    if (!confirm('Sigur vrei să ștergi acest articol?')) return;
    try {
      await apiFetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch {}
  };

  const toggleFeatured = async (id, current) => {
    try {
      await apiFetch(`/api/admin/blog/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isFeatured: !current }),
      });
      setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, isFeatured: !current } : p)));
    } catch {}
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-light text-black">Noutăți / Blog</h1>
          <p className="text-sm text-gray-500 mt-1">{posts.length} articole</p>
        </div>
        <Link
          href="/admin/noutati/nou"
          className="bg-black text-white px-6 py-2.5 text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors"
        >
          + Articol Nou
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Se încarcă...</div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-400 text-sm">
          Nu există articole. Creează primul articol!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {post.image && (
                <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                  <img src={post.image} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 bg-gray-100 rounded text-gray-600">
                    {post.category}
                  </span>
                  {post.isFeatured && (
                    <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 bg-yellow-100 rounded text-yellow-700">
                      ★ Featured
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-medium text-black mb-1 leading-snug">{post.title}</h3>
                <p className="text-xs text-gray-400 mb-3">
                  {new Date(post.date).toLocaleDateString('ro-RO')} · {post.readTime} · {post.author}
                </p>
                <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>

                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <Link
                    href={`/admin/noutati/${post.id}`}
                    className="text-xs text-gray-500 hover:text-black px-2 py-1 border border-gray-200 rounded hover:border-black transition-colors"
                  >
                    Editează
                  </Link>
                  <button
                    onClick={() => toggleFeatured(post.id, post.isFeatured)}
                    className="text-xs text-gray-500 hover:text-black px-2 py-1 border border-gray-200 rounded hover:border-black transition-colors cursor-pointer"
                  >
                    {post.isFeatured ? 'Scoate Featured' : 'Featured'}
                  </button>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="text-xs text-red-500 hover:text-red-700 px-2 py-1 border border-red-200 rounded hover:border-red-400 transition-colors cursor-pointer ml-auto"
                  >
                    Șterge
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BlogPage() {
  return <BlogListContent />;
}
