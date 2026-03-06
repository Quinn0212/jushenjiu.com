/**
 * 数据概览仪表盘
 * NOTE: 统计卡片 + 最近订单列表
 */
import { useState, useEffect } from 'react';
import { ShoppingCart, Package, Users, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { supabase } from '../supabase.ts';

export default function Dashboard() {
    const [stats, setStats] = useState({ orders: 0, revenue: 0, users: 0, products: 0, todayOrders: 0, pendingShip: 0 });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [ordersRes, productsRes, usersRes, recentRes] = await Promise.all([
                supabase.from('orders').select('id, total, status, created_at'),
                supabase.from('products').select('id', { count: 'exact', head: true }),
                supabase.auth.admin.listUsers(),
                supabase.from('orders').select('*, order_items(*, product:products(name, image))').order('created_at', { ascending: false }).limit(8),
            ]);

            const orders = ordersRes.data || [];
            const today = new Date().toISOString().split('T')[0];
            const todayOrders = orders.filter(o => o.created_at?.startsWith(today));
            const pendingShip = orders.filter(o => o.status === 'pending_shipment');
            const revenue = orders.reduce((sum: number, o: any) => sum + Number(o.total || 0), 0);

            setStats({
                orders: orders.length,
                revenue,
                users: usersRes.data?.users?.length || 0,
                products: productsRes.count || 0,
                todayOrders: todayOrders.length,
                pendingShip: pendingShip.length,
            });
            setRecentOrders(recentRes.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const STATUS_MAP: Record<string, { label: string; color: string }> = {
        pending_payment: { label: '待付款', color: 'bg-yellow-100 text-yellow-700' },
        pending_shipment: { label: '待发货', color: 'bg-blue-100 text-blue-700' },
        pending_receipt: { label: '待收货', color: 'bg-purple-100 text-purple-700' },
        completed: { label: '已完成', color: 'bg-green-100 text-green-700' },
        cancelled: { label: '已取消', color: 'bg-stone-100 text-stone-500' },
    };

    const statCards = [
        { label: '总订单数', value: stats.orders, icon: ShoppingCart, color: 'from-blue-500 to-blue-600' },
        { label: '总营收', value: `RM${stats.revenue.toFixed(0)}`, icon: DollarSign, color: 'from-emerald-500 to-emerald-600' },
        { label: '用户总数', value: stats.users, icon: Users, color: 'from-violet-500 to-violet-600' },
        { label: '商品总数', value: stats.products, icon: Package, color: 'from-amber-500 to-amber-600' },
        { label: '今日订单', value: stats.todayOrders, icon: TrendingUp, color: 'from-rose-500 to-rose-600' },
        { label: '待发货', value: stats.pendingShip, icon: Clock, color: 'from-orange-500 to-orange-600' },
    ];

    if (loading) return <div className="flex items-center justify-center h-64 text-stone-400">加载中...</div>;

    return (
        <div className="space-y-6">
            {/* 统计卡片 */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {statCards.map(card => (
                    <div key={card.label} className="bg-white rounded-xl p-4 border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
                            <card.icon size={20} className="text-white" />
                        </div>
                        <p className="text-2xl font-bold text-stone-900">{card.value}</p>
                        <p className="text-xs text-stone-400 mt-1">{card.label}</p>
                    </div>
                ))}
            </div>

            {/* 最近订单 */}
            <div className="bg-white rounded-xl border border-stone-100 shadow-sm">
                <div className="px-5 py-4 border-b border-stone-100">
                    <h3 className="font-bold text-stone-800">最近订单</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-stone-50 text-stone-500 text-xs">
                                <th className="text-left px-5 py-3 font-medium">订单号</th>
                                <th className="text-left px-5 py-3 font-medium">商品</th>
                                <th className="text-left px-5 py-3 font-medium">金额</th>
                                <th className="text-left px-5 py-3 font-medium">状态</th>
                                <th className="text-left px-5 py-3 font-medium">时间</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-50">
                            {recentOrders.map(order => {
                                const s = STATUS_MAP[order.status] || { label: order.status, color: 'bg-stone-100 text-stone-500' };
                                return (
                                    <tr key={order.id} className="hover:bg-stone-50/50">
                                        <td className="px-5 py-3 font-mono text-xs text-stone-600">{order.order_no}</td>
                                        <td className="px-5 py-3 text-stone-700">
                                            {order.order_items?.slice(0, 2).map((i: any) => i.product?.name).filter(Boolean).join(', ') || '-'}
                                        </td>
                                        <td className="px-5 py-3 font-bold text-primary">RM{Number(order.total).toFixed(2)}</td>
                                        <td className="px-5 py-3"><span className={`px-2 py-1 rounded-full text-[11px] font-medium ${s.color}`}>{s.label}</span></td>
                                        <td className="px-5 py-3 text-stone-400 text-xs">{new Date(order.created_at).toLocaleString('zh-CN')}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {recentOrders.length === 0 && <p className="text-center text-stone-400 py-8 text-sm">暂无订单</p>}
                </div>
            </div>
        </div>
    );
}
