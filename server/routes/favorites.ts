/**
 * 收藏路由
 * 需要用户认证
 */
import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

/**
 * 获取用户收藏列表（含产品详情）
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
    const { data, error } = await supabase
        .from('favorites')
        .select(`
      id,
      created_at,
      product:products (*)
    `)
        .eq('user_id', req.userId)
        .order('created_at', { ascending: false });

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }

    res.json(data);
});

/**
 * 添加收藏
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const { productId } = req.body;

    if (!productId) {
        res.status(400).json({ error: '缺少 productId' });
        return;
    }

    const { data, error } = await supabase
        .from('favorites')
        .insert({ user_id: req.userId, product_id: productId })
        .select()
        .single();

    if (error) {
        // HACK: 处理重复收藏的唯一约束冲突
        if (error.code === '23505') {
            res.status(200).json({ message: '已收藏' });
            return;
        }
        res.status(500).json({ error: error.message });
        return;
    }

    res.status(201).json(data);
});

/**
 * 取消收藏
 */
router.delete('/:productId', async (req: Request, res: Response): Promise<void> => {
    const { productId } = req.params;

    const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', req.userId)
        .eq('product_id', productId);

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }

    res.json({ message: '已取消收藏' });
});

export default router;
