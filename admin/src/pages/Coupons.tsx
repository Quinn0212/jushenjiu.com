/**
 * 优惠券管理页
 * NOTE: 创建/编辑/发放优惠券，查看用户领取情况
 */
import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save, Send, RefreshCw } from 'lucide-react';
import { supabase } from '../supabase.ts';

const EMPTY_FORM = { name: '', value: '', description: '', min_amount: '0', expiry: '', status: 'valid' };

export default function Coupons() {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    // 发放弹窗
    const [showDistribute, setShowDistribute] = useState<string | null>(null);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    useEffect(() => { loadCoupons(); }, []);

    const loadCoupons = async () => {
        setLoading(true);
        const { data } = await supabase.from('coupons').select('*, user_coupons(id, user_id, used)').order('created_at', { ascending: false });
        setCoupons(data || []);
        setLoading(false);
    };

    const handleEdit = (c: any) => {
        setForm({ name: c.name, value: String(c.value), description: c.description || '', min_amount: String(c.min_amount || 0), expiry: c.expiry || '', status: c.status || 'valid' });
        setEditingId(c.id);
        setShowForm(true);
    };

    const handleSave = async () => {
        if (!form.name || !form.value) return;
        setSaving(true);
        const payload = { name: form.name, value: Number(form.value), description: form.description, min_amount: Number(form.min_amount) || 0, expiry: form.expiry || null, status: form.status };
        if (editingId) {
            await supabase.from('coupons').update(payload).eq('id', editingId);
        } else {
            await supabase.from('coupons').insert(payload);
        }
        setSaving(false);
        setShowForm(false);
        setForm(EMPTY_FORM);
        setEditingId(null);
        loadCoupons();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('确定删除该优惠券？')) return;
        await supabase.from('user_coupons').delete().eq('coupon_id', id);
        await supabase.from('coupons').delete().eq('id', id);
        loadCoupons();
    };

    const openDistribute = async (couponId: string) => {
        setShowDistribute(couponId);
        setSelectedUsers([]);
        const { data } = await supabase.auth.admin.listUsers();
        setAllUsers(data?.users || []);
    };

    const distributeToUsers = async () => {
        if (!showDistribute || selectedUsers.length === 0) return;
        const inserts = selectedUsers.map(uid => ({ user_id: uid, coupon_id: showDistribute }));
        await supabase.from('user_coupons').upsert(inserts, { onConflict: 'user_id,coupon_id' });
        setShowDistribute(null);
        loadCoupons();
    };

    const distributeToAll = async () => {
        if (!showDistribute) return;
        const inserts = allUsers.map(u => ({ user_id: u.id, coupon_id: showDistribute }));
        await supabase.from('user_coupons').upsert(inserts, { onConflict: 'user_id,coupon_id' });
        setShowDistribute(null);
        loadCoupons();
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button onClick={loadCoupons} className="p-2 text-stone-400 hover:text-primary"><RefreshCw size={16} /></button>
                    <span className="text-xs text-stone-400">共 {coupons.length} 张优惠券</span>
                </div>
                <button onClick={() => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-light transition-colors">
                    <Plus size={16} /> 创建优惠券
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? <p className="col-span-3 text-center text-stone-400 py-12">加载中...</p> : coupons.map(c => (
                    <div key={c.id} className="bg-white rounded-xl border border-stone-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h4 className="font-bold text-stone-900">{c.name}</h4>
                                <p className="text-xs text-stone-400 mt-0.5">{c.description || '无描述'}</p>
                            </div>
                            <span className="text-2xl font-bold text-primary">RM{Number(c.value).toFixed(0)}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-stone-400 mb-3">
                            <span>满 RM{Number(c.min_amount).toFixed(0)} 可用</span>
                            <span>·</span>
                            <span>{c.expiry ? `有效至 ${c.expiry}` : '长期有效'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs mb-4">
                            <span className={`px-2 py-0.5 rounded-full ${c.status === 'valid' ? 'bg-green-50 text-green-600' : 'bg-stone-100 text-stone-400'}`}>
                                {c.status === 'valid' ? '生效中' : '已失效'}
                            </span>
                            <span className="text-stone-400">已领取 {c.user_coupons?.length || 0} 张</span>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => openDistribute(c.id)} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 flex items-center justify-center gap-1"><Send size={12} /> 发放</button>
                            <button onClick={() => handleEdit(c)} className="p-2 text-stone-400 hover:text-primary hover:bg-primary/10 rounded-lg"><Pencil size={14} /></button>
                            <button onClick={() => handleDelete(c.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                        </div>
                    </div>
                ))}
            </div>

            {/* 创建/编辑弹窗 */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowForm(false)}>
                    <div className="bg-white rounded-2xl w-full max-w-md mx-4 p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-lg font-bold">{editingId ? '编辑优惠券' : '创建优惠券'}</h3>
                            <button onClick={() => setShowForm(false)} className="text-stone-400"><X size={20} /></button>
                        </div>
                        <div className="space-y-4">
                            <div><label className="block text-xs font-bold text-stone-600 mb-1">名称 *</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-primary" /></div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="block text-xs font-bold text-stone-600 mb-1">面额 (RM) *</label><input type="number" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-primary" /></div>
                                <div><label className="block text-xs font-bold text-stone-600 mb-1">最低消费 (RM)</label><input type="number" value={form.min_amount} onChange={e => setForm(f => ({ ...f, min_amount: e.target.value }))} className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-primary" /></div>
                            </div>
                            <div><label className="block text-xs font-bold text-stone-600 mb-1">有效期</label><input type="date" value={form.expiry} onChange={e => setForm(f => ({ ...f, expiry: e.target.value }))} className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-primary" /></div>
                            <div><label className="block text-xs font-bold text-stone-600 mb-1">描述</label><input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-primary" /></div>
                        </div>
                        <button onClick={handleSave} disabled={saving || !form.name || !form.value}
                            className="w-full mt-5 py-3 bg-gradient-to-r from-[#B8860B] to-[#D4A017] text-white font-bold rounded-xl text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                            <Save size={16} /> {saving ? '保存中...' : '保存'}
                        </button>
                    </div>
                </div>
            )}

            {/* 发放弹窗 */}
            {showDistribute && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowDistribute(null)}>
                    <div className="bg-white rounded-2xl w-full max-w-md mx-4 p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">发放优惠券</h3>
                            <button onClick={() => setShowDistribute(null)} className="text-stone-400"><X size={20} /></button>
                        </div>
                        <button onClick={distributeToAll} className="w-full py-2.5 bg-blue-500 text-white rounded-xl text-sm font-bold mb-4 hover:bg-blue-600">发放给所有用户</button>
                        <p className="text-xs text-stone-500 mb-2">或选择特定用户：</p>
                        <div className="max-h-60 overflow-y-auto space-y-1 border border-stone-100 rounded-xl p-2">
                            {allUsers.map(u => (
                                <label key={u.id} className="flex items-center gap-2 p-2 hover:bg-stone-50 rounded-lg cursor-pointer">
                                    <input type="checkbox" checked={selectedUsers.includes(u.id)} onChange={e => {
                                        setSelectedUsers(prev => e.target.checked ? [...prev, u.id] : prev.filter(id => id !== u.id));
                                    }} className="rounded border-stone-300" />
                                    <span className="text-sm text-stone-700">{u.email}</span>
                                </label>
                            ))}
                        </div>
                        {selectedUsers.length > 0 && (
                            <button onClick={distributeToUsers} className="w-full mt-3 py-2.5 bg-primary text-white rounded-xl text-sm font-bold">
                                发放给 {selectedUsers.length} 个用户
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
