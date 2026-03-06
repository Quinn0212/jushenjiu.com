/**
 * 订单路由
 * 需要用户认证
 */
import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

/**
 * 获取当前用户的订单列表
 * @param status 可选状态过滤
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
    const { status } = req.query;

    let query = supabase
        .from('orders')
        .select(`
      *,
      order_items (
        id,
        quantity,
        price,
        product:products (id, name, image, english_name)
      )
    `)
        .eq('user_id', req.userId)
        .order('created_at', { ascending: false });

    if (status && typeof status === 'string' && status !== 'all') {
        query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }

    res.json(data);
});

/**
 * 创建新订单
 * 同时将已选中的购物车商品清除
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const { items, paymentMethod, address, deliveryTime, remark, total } = req.body;

    console.log('[Orders] 创建订单请求:', JSON.stringify({ paymentMethod, total, itemCount: items?.length }, null, 2));

    if (!items || items.length === 0) {
        res.status(400).json({ error: '订单不能为空' });
        return;
    }

    // 生成订单号：时间戳 + 随机数
    const orderNo = `${Date.now()}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

    // 创建订单
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            user_id: req.userId,
            order_no: orderNo,
            total,
            status: paymentMethod === 'cod' ? 'pending_shipment' : 'pending_payment',
            payment_method: paymentMethod,
            address,
            delivery_time: deliveryTime,
            remark,
        })
        .select()
        .single();

    if (orderError) {
        console.error('[Orders] 创建订单失败:', orderError);
        res.status(500).json({ error: orderError.message });
        return;
    }

    // NOTE: 兼容不同字段名 (productId / product_id / id)
    const orderItems = items.map((item: any) => ({
        order_id: order.id,
        product_id: item.productId || item.product_id || item.id,
        quantity: item.quantity || 1,
        price: item.price,
    }));

    console.log('[Orders] 订单明细:', JSON.stringify(orderItems, null, 2));

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

    if (itemsError) {
        console.error('[Orders] 创建订单明细失败:', itemsError);
        // 回滚：删除已创建的空订单
        await supabase.from('orders').delete().eq('id', order.id);
        res.status(500).json({ error: `订单明细创建失败: ${itemsError.message}` });
        return;
    }

    // 清除已购买的购物车商品
    const productIds = orderItems.map((item: any) => item.product_id);
    await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', req.userId)
        .in('product_id', productIds);

    // 创建购买成功通知
    await supabase
        .from('notifications')
        .insert({
            user_id: req.userId,
            title: '购买成功',
            content: `您已成功购买产品，订单号 ${orderNo}，总金额为 RM${total.toFixed(2)}。`,
            type: 'order_success',
        });

    console.log('[Orders] 订单创建成功:', order.id);
    res.status(201).json(order);
});

export default router;
