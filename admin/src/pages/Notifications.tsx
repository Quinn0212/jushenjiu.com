/**
 * 通知管理页
 * NOTE: 向指定用户或全部用户发送系统通知/公告
 */
import { useState, useEffect } from 'react';
import { Send, Trash2, RefreshCw, Bell, Users, User } from 'lucide-react';
import { supabase } from '../supabase.ts';

export default function Notifications() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [allUsers, setAllUsers] = useState<any[]>([]);

    // 发送表单
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [type, setType] = useState('system');
    const [target, setTarget] = useState<'all' | 'single'>('all');
    const [targetEmail, setTargetEmail] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setLoading(true);
        const [notifRes, usersRes] = await Promise.all([
            supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(50),
            supabase.auth.admin.listUsers(),
        ]);
        setNotifications(notifRes.data || []);
        setAllUsers(usersRes.data?.users || []);
        setLoading(false);
    };

    const handleSend = async () => {
        if (!title || !content) return;
        setSending(true);

        try {
            if (target === 'all') {
                // 向所有用户发送
                const inserts = allUsers.map(u => ({ user_id: u.id, title, content, type }));
                await supabase.from('notifications').insert(inserts);
            } else {
                // 向指定用户发送
                const user = allUsers.find(u => u.email === targetEmail);
                if (!user) { alert('未找到该用户'); setSending(false); return; }
                await supabase.from('notifications').insert({ user_id: user.id, title, content, type });
            }
            setTitle(''); setContent(''); setTargetEmail('');
            loadData();
        } catch (err) {
            console.error(err);
        } finally {
            setSending(false);
        }
    };

    const handleDelete = async (id: string) => {
        await supabase.from('notifications').delete().eq('id', id);
        loadData();
    };

    const TYPE_MAP: Record<string, { label: string; color: string }> = {
        system: { label: '系统通知', color: 'bg-blue-50 text-blue-600' },
        promotion: { label: '促销活动', color: 'bg-orange-50 text-orange-600' },
        order_success: { label: '订单通知', color: 'bg-green-50 text-green-600' },
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 发送面板 */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-xl border border-stone-100 shadow-sm p-5 sticky top-6">
                    <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2"><Bell size={18} className="text-primary" /> 发送通知</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-stone-600 mb-1">通知类型</label>
                            <select value={type} onChange={e => setType(e.target.value)}
                                className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-primary bg-white">
                                <option value="system">系统通知</option>
                                <option value="promotion">促销活动</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-stone-600 mb-1">发送目标</label>
                            <div className="flex gap-2">
                                <button onClick={() => setTarget('all')} className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border-2 transition-colors ${target === 'all' ? 'border-primary bg-primary/5 text-primary' : 'border-stone-200 text-stone-500'}`}>
                                    <Users size={14} /> 全部用户
                                </button>
                                <button onClick={() => setTarget('single')} className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border-2 transition-colors ${target === 'single' ? 'border-primary bg-primary/5 text-primary' : 'border-stone-200 text-stone-500'}`}>
                                    <User size={14} /> 指定用户
                                </button>
                            </div>
                        </div>

                        {target === 'single' && (
                            <div>
                                <label className="block text-xs font-bold text-stone-600 mb-1">用户邮箱</label>
                                <select value={targetEmail} onChange={e => setTargetEmail(e.target.value)}
                                    className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-primary bg-white">
                                    <option value="">选择用户</option>
                                    {allUsers.map(u => <option key={u.id} value={u.email}>{u.email}</option>)}
                                </select>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-stone-600 mb-1">标题 *</label>
                            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="通知标题"
                                className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-primary" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-stone-600 mb-1">内容 *</label>
                            <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="通知内容..." rows={4}
                                className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-primary resize-none" />
                        </div>

                        <button onClick={handleSend} disabled={sending || !title || !content || (target === 'single' && !targetEmail)}
                            className="w-full py-3 bg-gradient-to-r from-[#B8860B] to-[#D4A017] text-white font-bold rounded-xl text-sm disabled:opacity-50 flex items-center justify-center gap-2 hover:shadow-lg transition-shadow">
                            <Send size={16} /> {sending ? '发送中...' : '发送通知'}
                        </button>
                    </div>
                </div>
            </div>

            {/* 历史通知列表 */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-xl border border-stone-100 shadow-sm">
                    <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
                        <h3 className="font-bold text-stone-800">历史通知</h3>
                        <button onClick={loadData} className="p-1.5 text-stone-400 hover:text-primary"><RefreshCw size={14} /></button>
                    </div>
                    <div className="divide-y divide-stone-50">
                        {loading ? (
                            <p className="text-center text-stone-400 py-12 text-sm">加载中...</p>
                        ) : notifications.length === 0 ? (
                            <p className="text-center text-stone-400 py-12 text-sm">暂无通知记录</p>
                        ) : notifications.map(n => {
                            const t = TYPE_MAP[n.type] || { label: n.type, color: 'bg-stone-50 text-stone-500' };
                            return (
                                <div key={n.id} className="px-5 py-4 hover:bg-stone-50/50 flex items-start gap-3 group">
                                    <div className={`mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${t.color}`}>{t.label}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm text-stone-800">{n.title}</p>
                                        <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">{n.content}</p>
                                        <p className="text-[10px] text-stone-300 mt-1">{new Date(n.created_at).toLocaleString('zh-CN')}</p>
                                    </div>
                                    <button onClick={() => handleDelete(n.id)} className="p-1 text-stone-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} /></button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
