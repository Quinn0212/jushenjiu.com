/**
 * 优惠券路由
 */
import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

/**
 * 获取所有可用优惠券（公开接口）
 */
router.get('/', async (_req: Request, res: Response): Promise<void> => {
    const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('status', 'valid')
        .gte('expiry', new Date().toISOString().split('T')[0])
        .order('created_at', { ascending: false });

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }

    res.json(data);
});

/**
 * 获取用户领取的优惠券
 */
router.get('/mine', requireAuth, async (req: Request, res: Response): Promise<void> => {
    const { data, error } = await supabase
        .from('user_coupons')
        .select(`
      id,
      used,
      coupon:coupons (*)
    `)
        .eq('user_id', req.userId)
        .order('created_at', { ascending: false });

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }

    res.json(data);
});

export default router;
