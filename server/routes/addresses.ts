/**
 * 收货地址路由
 * 需要用户认证
 */
import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

/**
 * 获取用户所有收货地址
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
    const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', req.userId)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }

    res.json(data);
});

/**
 * 新增收货地址
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
    const { name, phone, state, city, postcode, detail, isDefault } = req.body;

    if (!name || !phone || !state || !city || !postcode || !detail) {
        res.status(400).json({ error: '请填写完整的地址信息' });
        return;
    }

    // NOTE: 如果设为默认地址，先把其他地址的 is_default 改为 false
    if (isDefault) {
        await supabase
            .from('addresses')
            .update({ is_default: false })
            .eq('user_id', req.userId);
    }

    const { data, error } = await supabase
        .from('addresses')
        .insert({
            user_id: req.userId,
            name,
            phone,
            state,
            city,
            postcode,
            detail,
            is_default: isDefault || false,
        })
        .select()
        .single();

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }

    res.status(201).json(data);
});

/**
 * 更新收货地址
 */
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, phone, state, city, postcode, detail, isDefault } = req.body;

    // NOTE: 如果设为默认地址，先把其他地址的 is_default 改为 false
    if (isDefault) {
        await supabase
            .from('addresses')
            .update({ is_default: false })
            .eq('user_id', req.userId);
    }

    const updateData: Record<string, any> = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (state !== undefined) updateData.state = state;
    if (city !== undefined) updateData.city = city;
    if (postcode !== undefined) updateData.postcode = postcode;
    if (detail !== undefined) updateData.detail = detail;
    if (isDefault !== undefined) updateData.is_default = isDefault;

    const { data, error } = await supabase
        .from('addresses')
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
 * 删除收货地址
 */
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id)
        .eq('user_id', req.userId);

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }

    res.json({ message: '地址已删除' });
});

export default router;
