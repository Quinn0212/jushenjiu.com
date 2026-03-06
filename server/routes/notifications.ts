/**
 * 通知路由
 * 需要用户认证
 */
import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

/**
 * 获取用户的全部通知
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', req.userId)
        .order('created_at', { ascending: false });

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }

    res.json(data);
});

/**
 * 标记通知为已读
 */
router.put('/:id/read', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
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

export default router;
