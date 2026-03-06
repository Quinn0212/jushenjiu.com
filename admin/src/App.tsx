/**
 * 后台管理系统主布局
 * NOTE: 包含侧边栏导航和路由页面切换
 */
import { useState, useEffect } from 'react';
import {
    LayoutDashboard, ShoppingCart, Package, Users, Ticket,
    Bell, LogOut, ChevronDown, Menu, X
} from 'lucide-react';
import { supabase } from './supabase.ts';
import Dashboard from './pages/Dashboard.tsx';
import Orders from './pages/Orders.tsx';
import Products from './pages/Products.tsx';
import UsersPage from './pages/Users.tsx';
import Coupons from './pages/Coupons.tsx';
import Notifications from './pages/Notifications.tsx';
import Login from './pages/Login.tsx';

type Page = 'dashboard' | 'orders' | 'products' | 'users' | 'coupons' | 'notifications';

const NAV_ITEMS: { id: Page; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'dashboard', label: '数据概览', icon: LayoutDashboard },
    { id: 'orders', label: '订单管理', icon: ShoppingCart },
    { id: 'products', label: '商品管理', icon: Package },
    { id: 'users', label: '用户管理', icon: Users },
    { id: 'coupons', label: '优惠券管理', icon: Ticket },
    { id: 'notifications', label: '通知管理', icon: Bell },
];

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [adminEmail, setAdminEmail] = useState('');
    const [currentPage, setCurrentPage] = useState<Page>('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem('admin_logged_in');
        const email = localStorage.getItem('admin_email');
        if (saved === 'true' && email) {
            setIsLoggedIn(true);
            setAdminEmail(email);
        }
    }, []);

    const handleLogin = (email: string) => {
        setIsLoggedIn(true);
        setAdminEmail(email);
        localStorage.setItem('admin_logged_in', 'true');
        localStorage.setItem('admin_email', email);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setAdminEmail('');
        localStorage.removeItem('admin_logged_in');
        localStorage.removeItem('admin_email');
    };

    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} />;
    }

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard': return <Dashboard />;
            case 'orders': return <Orders />;
            case 'products': return <Products />;
            case 'users': return <UsersPage />;
            case 'coupons': return <Coupons />;
            case 'notifications': return <Notifications />;
        }
    };

    return (
        <div className="flex h-screen overflow-hidden">
            {/* 侧边栏 */}
            <aside className={`${sidebarOpen ? 'w-60' : 'w-0 -ml-60'} transition-all duration-300 bg-sidebar text-white flex flex-col shrink-0`}>
                <div className="p-5 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <img src="https://res.cloudinary.com/dmdjliyio/image/upload/v1772517580/%E8%81%9A%E7%A5%9E%E7%81%B8logo-Photoroom_hzgbyt.png" alt="Logo" style={{ width: '36px', height: '36px', objectFit: 'contain' }} className="rounded-lg" />
                        <div>
                            <h1 className="text-base font-bold text-primary">聚神灸</h1>
                            <p className="text-[10px] text-stone-400">后台管理系统</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 py-3 overflow-y-auto">
                    {NAV_ITEMS.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setCurrentPage(item.id)}
                            className={`w-full flex items-center gap-3 px-5 py-3 text-sm transition-colors ${currentPage === item.id
                                ? 'bg-primary/20 text-primary border-r-3 border-primary font-bold'
                                : 'text-stone-400 hover:bg-sidebar-hover hover:text-stone-200'
                                }`}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center text-primary text-xs font-bold">
                            {adminEmail.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-stone-300 truncate">{adminEmail}</p>
                            <p className="text-[10px] text-stone-500">管理员</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-stone-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                        <LogOut size={14} /> 退出登录
                    </button>
                </div>
            </aside>

            {/* 主内容区 */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="shrink-0 h-14 bg-white border-b border-stone-200 flex items-center px-5 gap-4">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-stone-500 hover:text-primary transition-colors">
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    <h2 className="text-base font-bold text-stone-800">
                        {NAV_ITEMS.find(i => i.id === currentPage)?.label}
                    </h2>
                </header>
                <div className="flex-1 overflow-y-auto p-6 bg-stone-50">
                    {renderPage()}
                </div>
            </main>
        </div>
    );
}
