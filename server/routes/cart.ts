/**
 * 购物车路由
 * 需要用户认证
 */
import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// NOTE: 所有购物车接口都要求登录
router.use(requireAuth);

/**
 * 获取当前用户的购物车
 * 关联产品信息一并返回
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
    const { data, error } = await supabase
        .from('cart_items')
        .select(`
      id,
      quantity,
      checked,
      unit_price,
      spec_label,
      product:products (*)
    `)
        .eq('user_id', req.userId)
        .order('created_at', { ascending: false });

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }

    // NOTE: 优先使用 unit_price（规格价格），否则用产品原价
    const items = (data || []).map((item: any) => ({
        id: item.id,
        productId: item.product.id,
        name: item.product.name,
        englishName: item.product.english_name,
        price: item.unit_price ? Number(item.unit_price) : item.product.price,
        specLabel: item.spec_label || '',
        image: item.product.image,
        category: item.product.category,
        quantity: item.quantity,
        checked: item.checked,
    }));

    res.json(items);
});

/**
 * 添加商品到购物车
 * 如果已存在则数量 +1
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const { productId, quantity = 1, unitPrice, specLabel } = req.body;

    if (!productId) {
        res.status(400).json({ error: '缺少 productId' });
        return;
    }

    // NOTE: 按 product_id + unit_price 匹配，同产品不同规格视为不同购物车项
    let query = supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', req.userId)
        .eq('product_id', productId);

    if (unitPrice !== undefined) {
        query = query.eq('unit_price', unitPrice);
    } else {
        query = query.is('unit_price', null);
    }

    const { data: existing } = await query.single();

    if (existing) {
        const { data, error } = await supabase
            .from('cart_items')
            .update({ quantity: existing.quantity + quantity })
            .eq('id', existing.id)
            .select()
            .single();

        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.json(data);
    } else {
        const insertData: Record<string, any> = {
            user_id: req.userId,
            product_id: productId,
            quantity,
            checked: true,
        };
        if (unitPrice !== undefined) insertData.unit_price = unitPrice;
        if (specLabel) insertData.spec_label = specLabel;

        const { data, error } = await supabase
            .from('cart_items')
            .insert(insertData)
            .select()
            .single();

        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(201).json(data);
    }
});

/**
 * 更新购物车项（数量、选中状态）
 */
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { quantity, checked } = req.body;

    const updateData: Record<string, any> = {};
    if (quantity !== undefined) updateData.quantity = quantity;
    if (checked !== undefined) updateData.checked = checked;

    const { data, error } = await supabase
        .from('cart_items')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', req.userId)
        .select()
        .single();

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }

    res.json(data);
});

/**
 * 从购物车移除商品
 */
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', id)
        .eq('user_id', req.userId);

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }

    res.json({ message: '已从购物车移除' });
});

/**
 * 批量更新购物车选中状态（全选/全不选）
 */
router.put('/batch/check', async (req: Request, res: Response): Promise<void> => {
    const { checked } = req.body;

    const { error } = await supabase
        .from('cart_items')
        .update({ checked })
        .eq('user_id', req.userId);

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }

    res.json({ message: '批量更新成功' });
});

export default router;
