/**
 * 用户管理页
 * NOTE: 查看所有用户、查看详情、删除用户
 */
import { useState, useEffect } from 'react';
import { Trash2, Eye, X, RefreshCw, Search, UserX } from 'lucide-react';
import { supabase } from '../supabase.ts';

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [profiles, setProfiles] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [detail, setDetail] = useState<any>(null);

    useEffect(() => { loadUsers(); }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const { data: authData } = await supabase.auth.admin.listUsers();
            const userList = authData?.users || [];
            setUsers(userList);

            // 加载 profiles 关联数据
            const { data: profileData } = await supabase.from('profiles').select('*');
            const profileMap: Record<string, any> = {};
            (profileData || []).forEach((p: any) => { profileMap[p.id] = p; });
            setProfiles(profileMap);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm('确定要删除该用户？此操作不可恢复。')) return;
        await supabase.auth.admin.deleteUser(userId);
        loadUsers();
    };

    const filtered = users.filter(u => {
        const q = search.toLowerCase();
        const profile = profiles[u.id];
        return u.email?.toLowerCase().includes(q) || profile?.nickname?.toLowerCase().includes(q);
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-xs">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索用户邮箱或昵称..."
                        className="w-full pl-8 pr-3 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-primary" />
                </div>
                <button onClick={loadUsers} className="p-2 text-stone-400 hover:text-primary"><RefreshCw size={16} /></button>
                <span className="text-xs text-stone-400">共 {filtered.length} 个用户</span>
            </div>

            <div className="bg-white rounded-xl border border-stone-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-stone-50 text-stone-500 text-xs">
                                <th className="text-left px-5 py-3 font-medium">头像</th>
                                <th className="text-left px-5 py-3 font-medium">昵称</th>
                                <th className="text-left px-5 py-3 font-medium">邮箱</th>
                                <th className="text-left px-5 py-3 font-medium">会员等级</th>
                                <th className="text-left px-5 py-3 font-medium">注册时间</th>
                                <th className="text-left px-5 py-3 font-medium">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-50">
                            {loading ? (
                                <tr><td colSpan={6} className="text-center py-12 text-stone-400">加载中...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-12 text-stone-400">暂无用户</td></tr>
                            ) : filtered.map(u => {
                                const profile = profiles[u.id];
                                return (
                                    <tr key={u.id} className="hover:bg-stone-50/50">
                                        <td className="px-5 py-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold overflow-hidden">
                                                {profile?.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" /> : (profile?.nickname || u.email || '?').charAt(0).toUpperCase()}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 font-medium text-stone-800">{profile?.nickname || '新用户'}</td>
                                        <td className="px-5 py-3 text-stone-500 text-xs">{u.email}</td>
                                        <td className="px-5 py-3"><span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full text-[11px] font-medium">{profile?.member_level || '普通会员'}</span></td>
                                        <td className="px-5 py-3 text-stone-400 text-xs">{new Date(u.created_at).toLocaleDateString('zh-CN')}</td>
                                        <td className="px-5 py-3">
                                            <div className="flex gap-1">
                                                <button onClick={() => setDetail({ ...u, profile })} className="p-1.5 text-stone-400 hover:text-primary rounded-lg hover:bg-primary/10"><Eye size={14} /></button>
                                                <button onClick={() => handleDelete(u.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 用户详情弹窗 */}
            {detail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setDetail(null)}>
                    <div className="bg-white rounded-2xl w-full max-w-md mx-4 p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">用户详情</h3>
                            <button onClick={() => setDetail(null)} className="text-stone-400 hover:text-stone-600"><X size={20} /></button>
                        </div>
                        <div className="text-center mb-5">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold mx-auto overflow-hidden">
                                {detail.profile?.avatar_url ? <img src={detail.profile.avatar_url} className="w-full h-full object-cover" /> : (detail.profile?.nickname || '?').charAt(0)}
                            </div>
                            <p className="font-bold text-lg mt-2">{detail.profile?.nickname || '新用户'}</p>
                            <p className="text-sm text-stone-400">{detail.email}</p>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between py-2 border-b border-stone-50"><span className="text-stone-500">会员等级</span><span>{detail.profile?.member_level || '普通会员'}</span></div>
                            <div className="flex justify-between py-2 border-b border-stone-50"><span className="text-stone-500">手机号</span><span>{detail.profile?.phone || '未设置'}</span></div>
                            <div className="flex justify-between py-2 border-b border-stone-50"><span className="text-stone-500">性别</span><span>{detail.profile?.gender || '未设置'}</span></div>
                            <div className="flex justify-between py-2 border-b border-stone-50"><span className="text-stone-500">生日</span><span>{detail.profile?.birthday || '未设置'}</span></div>
                            <div className="flex justify-between py-2"><span className="text-stone-500">注册时间</span><span>{new Date(detail.created_at).toLocaleString('zh-CN')}</span></div>
                        </div>
                        <button onClick={() => setDetail(null)} className="w-full mt-5 py-2.5 bg-stone-100 text-stone-600 rounded-xl text-sm font-bold hover:bg-stone-200">关闭</button>
                    </div>
                </div>
            )}
        </div>
    );
}
