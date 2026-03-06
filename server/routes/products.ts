/**
 * 产品路由
 * 公开接口，无需认证
 */
import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';

const router = Router();

/**
 * 获取所有产品
 * @param category 可选分类过滤
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
    const { category } = req.query;

    let query = supabase.from('products').select('*').order('created_at', { ascending: true });

    if (category && typeof category === 'string') {
        query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }

    res.json(data);
});

/**
 * 获取单个产品详情
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        res.status(404).json({ error: '产品不存在' });
        return;
    }

    res.json(data);
});

export default router;
