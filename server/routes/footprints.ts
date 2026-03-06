/**
 * 足迹路由
 * 需要用户认证
 */
import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

/**
 * 获取用户浏览足迹（含产品详情，按时间倒序）
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
    const { data, error } = await supabase
        .from('footprints')
        .select(`
      id,
      viewed_at,
      product:products (*)
    `)
        .eq('user_id', req.userId)
        .order('viewed_at', { ascending: false })
        .limit(50);

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }

    res.json(data);
});

/**
 * 记录浏览足迹
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const { productId } = req.body;

    if (!productId) {
        res.status(400).json({ error: '缺少 productId' });
        return;
    }

    const { data, error } = await supabase
        .from('footprints')
        .insert({ user_id: req.userId, product_id: productId })
        .select()
        .single();

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }

    res.status(201).json(data);
});

export default router;
