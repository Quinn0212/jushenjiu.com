/**
 * 管理员登录页
 */
import { useState } from 'react';
import { supabase } from '../supabase.ts';

export default function Login({ onLogin }: { onLogin: (email: string) => void }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
            if (authError) throw authError;
            onLogin(email);
        } catch (err: any) {
            setError(err.message || '登录失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900">
            <div className="w-full max-w-md mx-4">
                <div className="text-center mb-8">
                    <img src="https://res.cloudinary.com/dmdjliyio/image/upload/v1772517580/%E8%81%9A%E7%A5%9E%E7%81%B8logo-Photoroom_hzgbyt.png" alt="Logo" className="mx-auto rounded-2xl mb-4 shadow-lg" style={{ width: '64px', height: '64px', objectFit: 'contain' }} />
                    <h1 className="text-2xl font-bold text-[#D4A017]">聚神灸</h1>
                    <p className="text-stone-400 text-sm mt-1">后台管理系统</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-stone-800/50 backdrop-blur-sm rounded-2xl p-8 border border-stone-700/50 shadow-2xl">
                    <h2 className="text-lg font-bold text-stone-200 mb-6">管理员登录</h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-stone-400 mb-1.5">邮箱地址</label>
                            <input
                                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                                placeholder="admin@example.com"
                                className="w-full px-4 py-3 bg-stone-900/50 border border-stone-600/50 rounded-xl text-stone-200 text-sm focus:outline-none focus:border-[#B8860B] transition-colors placeholder:text-stone-600"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-stone-400 mb-1.5">密码</label>
                            <input
                                type="password" value={password} onChange={e => setPassword(e.target.value)} required
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-stone-900/50 border border-stone-600/50 rounded-xl text-stone-200 text-sm focus:outline-none focus:border-[#B8860B] transition-colors placeholder:text-stone-600"
                            />
                        </div>
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className="w-full mt-6 py-3 bg-gradient-to-r from-[#B8860B] to-[#D4A017] text-white font-bold rounded-xl text-sm disabled:opacity-50 hover:shadow-lg hover:shadow-[#B8860B]/25 transition-all active:scale-[0.98]"
                    >
                        {loading ? '登录中...' : '登 录'}
                    </button>
                </form>
            </div>
        </div>
    );
}
