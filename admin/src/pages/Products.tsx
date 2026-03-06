/**
 * 商品管理页
 * NOTE: 支持查看/新增/编辑/删除商品
 */
import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save, Search } from 'lucide-react';
import { supabase } from '../supabase.ts';

const EMPTY_FORM = { name: '', english_name: '', price: '', original_price: '', image: '', category: '艾烟系列', description: '', tags: '' };

export default function Products() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    useEffect(() => { loadProducts(); }, []);

    const loadProducts = async () => {
        setLoading(true);
        const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        setProducts(data || []);
        setLoading(false);
    };

    const handleEdit = (p: any) => {
        setForm({
            name: p.name || '', english_name: p.english_name || '', price: String(p.price || ''),
            original_price: String(p.original_price || ''), image: p.image || '', category: p.category || '',
            description: p.description || '', tags: (p.tags || []).join(', '),
        });
        setEditingId(p.id);
        setShowForm(true);
    };

    const handleNew = () => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); };

    const handleSave = async () => {
        if (!form.name || !form.price || !form.image || !form.category) return;
        setSaving(true);
        const payload = {
            name: form.name, english_name: form.english_name, price: Number(form.price),
            original_price: form.original_price ? Number(form.original_price) : null,
            image: form.image, category: form.category, description: form.description,
            tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        };
        if (editingId) {
            await supabase.from('products').update(payload).eq('id', editingId);
        } else {
            await supabase.from('products').insert(payload);
        }
        setSaving(false);
        setShowForm(false);
        loadProducts();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('确定删除该商品？')) return;
        await supabase.from('products').delete().eq('id', id);
        loadProducts();
    };

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索商品名称..."
                        className="pl-8 pr-3 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-primary w-64" />
                </div>
                <button onClick={handleNew} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-light transition-colors">
                    <Plus size={16} /> 新增商品
                </button>
            </div>

            {/* 商品网格 */}
            {loading ? <p className="text-center text-stone-400 py-12">加载中...</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filtered.map(p => (
                        <div key={p.id} className="bg-white rounded-xl border border-stone-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                            <div className="aspect-square bg-stone-100 relative overflow-hidden">
                                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(p)} className="p-2 bg-white rounded-full shadow-lg hover:bg-primary hover:text-white transition-colors"><Pencil size={14} /></button>
                                        <button onClick={() => handleDelete(p.id)} className="p-2 bg-white rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <p className="font-bold text-stone-900 text-sm truncate">{p.name}</p>
                                <p className="text-xs text-stone-400 truncate">{p.english_name}</p>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <span className="text-lg font-bold text-primary">RM{Number(p.price).toFixed(0)}</span>
                                    {p.original_price && <span className="text-xs text-stone-400 line-through">RM{Number(p.original_price).toFixed(0)}</span>}
                                </div>
                                <span className="inline-block mt-2 px-2 py-0.5 bg-stone-100 text-stone-500 text-[11px] rounded-full">{p.category}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 新增/编辑弹窗 */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowForm(false)}>
                    <div className="bg-white rounded-2xl w-full max-w-lg mx-4 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-stone-100 flex justify-between items-center sticky top-0 bg-white rounded-t-2xl">
                            <h3 className="text-lg font-bold">{editingId ? '编辑商品' : '新增商品'}</h3>
                            <button onClick={() => setShowForm(false)} className="text-stone-400 hover:text-stone-600"><X size={20} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-stone-600 mb-1">商品名称 *</label>
                                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-primary" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-stone-600 mb-1">英文名称</label>
                                <input value={form.english_name} onChange={e => setForm(f => ({ ...f, english_name: e.target.value }))} className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-primary" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-stone-600 mb-1">售价 (RM) *</label>
                                    <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-600 mb-1">原价 (RM)</label>
                                    <input type="number" value={form.original_price} onChange={e => setForm(f => ({ ...f, original_price: e.target.value }))} className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-primary" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-stone-600 mb-1">图片 URL *</label>
                                <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-primary" />
                                {form.image && <img src={form.image} alt="preview" className="mt-2 w-24 h-24 rounded-xl object-cover border" />}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-stone-600 mb-1">分类 *</label>
                                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-primary bg-white">
                                    <option>艾烟系列</option><option>艾灸系列</option><option>养生周边</option><option>礼盒套装</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-stone-600 mb-1">标签（逗号分隔）</label>
                                <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="热销, 新品" className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-primary" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-stone-600 mb-1">描述</label>
                                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-primary resize-none" />
                            </div>
                        </div>
                        <div className="p-6 pt-0">
                            <button onClick={handleSave} disabled={saving || !form.name || !form.price || !form.image}
                                className="w-full py-3 bg-gradient-to-r from-[#B8860B] to-[#D4A017] text-white font-bold rounded-xl text-sm disabled:opacity-50 flex items-center justify-center gap-2 hover:shadow-lg transition-shadow">
                                <Save size={16} /> {saving ? '保存中...' : '保存商品'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
