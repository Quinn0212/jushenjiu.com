/**
 * 订单管理页
 * NOTE: 支持筛选、发货、取消订单、查看订单详情
 */
import { useState, useEffect } from 'react';
import { Truck, X, Eye, RefreshCw, Search } from 'lucide-react';
import { supabase } from '../supabase.ts';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
    pending_payment: { label: '待付款', color: 'bg-yellow-100 text-yellow-700' },
    pending_shipment: { label: '待发货', color: 'bg-blue-100 text-blue-700' },
    pending_receipt: { label: '待收货', color: 'bg-purple-100 text-purple-700' },
    completed: { label: '已完成', color: 'bg-green-100 text-green-700' },
    cancelled: { label: '已取消', color: 'bg-stone-100 text-stone-500' },
};

const FILTERS = [
    { id: 'all', label: '全部' },
    { id: 'pending_payment', label: '待付款' },
    { id: 'pending_shipment', label: '待发货' },
    { id: 'pending_receipt', label: '待收货' },
    { id: 'completed', label: '已完成' },
    { id: 'cancelled', label: '已取消' },
];

export default function Orders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [detail, setDetail] = useState<any>(null);

    useEffect(() => { loadOrders(); }, []);

    const loadOrders = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('orders')
            .select('*, order_items(*, product:products(id, name, image, english_name))')
            .order('created_at', { ascending: false });
        setOrders(data || []);
        setLoading(false);
    };

    const updateStatus = async (id: string, status: string) => {
        await supabase.from('orders').update({ status }).eq('id', id);
        loadOrders();
        if (detail?.id === id) setDetail(null);
    };

    const filtered = orders.filter(o => {
        if (filter !== 'all' && o.status !== filter) return false;
        if (search && !o.order_no?.includes(search)) return false;
        return true;
    });

    return (
        <div className="space-y-4">
            {/* 筛选栏 */}
            <div className="bg-white rounded-xl border border-stone-100 p-4 flex flex-wrap items-center gap-3">
                <div className="flex gap-1 flex-wrap">
                    {FILTERS.map(f => (
                        <button key={f.id} onClick={() => setFilter(f.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f.id ? 'bg-primary text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
                            {f.label}
                        </button>
                    ))}
                </div>
                <div className="flex-1" />
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索订单号"
                        className="pl-8 pr-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-primary w-44" />
                </div>
                <button onClick={loadOrders} className="p-2 text-stone-400 hover:text-primary"><RefreshCw size={16} /></button>
            </div>

            {/* 订单表格 */}
            <div className="bg-white rounded-xl border border-stone-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-stone-50 text-stone-500 text-xs">
                                <th className="text-left px-5 py-3 font-medium">订单号</th>
                                <th className="text-left px-5 py-3 font-medium">商品</th>
                                <th className="text-left px-5 py-3 font-medium">金额</th>
                                <th className="text-left px-5 py-3 font-medium">付款方式</th>
                                <th className="text-left px-5 py-3 font-medium">收货地址</th>
                                <th className="text-left px-5 py-3 font-medium">状态</th>
                                <th className="text-left px-5 py-3 font-medium">时间</th>
                                <th className="text-left px-5 py-3 font-medium">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-50">
                            {loading ? (
                                <tr><td colSpan={8} className="text-center py-12 text-stone-400">加载中...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={8} className="text-center py-12 text-stone-400">暂无订单</td></tr>
                            ) : filtered.map(order => {
                                const s = STATUS_MAP[order.status] || { label: order.status, color: 'bg-stone-100 text-stone-500' };
                                const addr = order.address;
                                return (
                                    <tr key={order.id} className="hover:bg-stone-50/50">
                                        <td className="px-5 py-3 font-mono text-xs text-stone-600">{order.order_no}</td>
                                        <td className="px-5 py-3 text-stone-700 max-w-[200px] truncate">
                                            {order.order_items?.map((i: any) => `${i.product?.name}×${i.quantity}`).join(', ') || '-'}
                                        </td>
                                        <td className="px-5 py-3 font-bold text-primary">RM{Number(order.total).toFixed(2)}</td>
                                        <td className="px-5 py-3 text-stone-500 text-xs">{order.payment_method === 'cod' ? '货到付款' : '银行卡'}</td>
                                        <td className="px-5 py-3 text-stone-500 text-xs max-w-[160px] truncate">{addr?.name} {addr?.detail?.slice(0, 20)}</td>
                                        <td className="px-5 py-3"><span className={`px-2 py-1 rounded-full text-[11px] font-medium ${s.color}`}>{s.label}</span></td>
                                        <td className="px-5 py-3 text-stone-400 text-xs whitespace-nowrap">{new Date(order.created_at).toLocaleString('zh-CN')}</td>
                                        <td className="px-5 py-3">
                                            <div className="flex gap-1">
                                                <button onClick={() => setDetail(order)} className="p-1.5 text-stone-400 hover:text-primary rounded-lg hover:bg-primary/10" title="详情"><Eye size={14} /></button>
                                                {order.status === 'pending_shipment' && (
                                                    <button onClick={() => updateStatus(order.id, 'pending_receipt')} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg" title="发货"><Truck size={14} /></button>
                                                )}
                                                {(order.status === 'pending_payment' || order.status === 'pending_shipment') && (
                                                    <button onClick={() => updateStatus(order.id, 'cancelled')} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg" title="取消"><X size={14} /></button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 订单详情弹窗 */}
            {detail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setDetail(null)}>
                    <div className="bg-white rounded-2xl w-full max-w-lg mx-4 p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">订单详情</h3>
                            <button onClick={() => setDetail(null)} className="text-stone-400 hover:text-stone-600"><X size={20} /></button>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between"><span className="text-stone-500">订单号</span><span className="font-mono">{detail.order_no}</span></div>
                            <div className="flex justify-between"><span className="text-stone-500">金额</span><span className="font-bold text-primary">RM{Number(detail.total).toFixed(2)}</span></div>
                            <div className="flex justify-between"><span className="text-stone-500">状态</span><span className={`px-2 py-0.5 rounded-full text-xs ${STATUS_MAP[detail.status]?.color}`}>{STATUS_MAP[detail.status]?.label}</span></div>
                            <div className="flex justify-between"><span className="text-stone-500">付款方式</span><span>{detail.payment_method === 'cod' ? '货到付款' : '银行卡'}</span></div>
                            <div className="flex justify-between"><span className="text-stone-500">收货人</span><span>{detail.address?.name} {detail.address?.phone}</span></div>
                            <div><span className="text-stone-500">地址：</span><span className="text-stone-700">{detail.address?.detail}</span></div>
                            <div className="border-t pt-3 mt-3">
                                <p className="text-xs text-stone-500 mb-2">商品明细</p>
                                {detail.order_items?.map((item: any) => (
                                    <div key={item.id} className="flex items-center gap-3 py-2">
                                        <img src={item.product?.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-stone-100" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{item.product?.name}</p>
                                            <p className="text-xs text-stone-400">×{item.quantity} · RM{Number(item.price).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-2 mt-5">
                            {detail.status === 'pending_shipment' && (
                                <button onClick={() => updateStatus(detail.id, 'pending_receipt')} className="flex-1 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-bold hover:bg-blue-600">确认发货</button>
                            )}
                            {(detail.status === 'pending_payment' || detail.status === 'pending_shipment') && (
                                <button onClick={() => updateStatus(detail.id, 'cancelled')} className="flex-1 py-2.5 bg-red-50 text-red-500 rounded-xl text-sm font-bold hover:bg-red-100">取消订单</button>
                            )}
                            <button onClick={() => setDetail(null)} className="flex-1 py-2.5 bg-stone-100 text-stone-600 rounded-xl text-sm font-bold hover:bg-stone-200">关闭</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
