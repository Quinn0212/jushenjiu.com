/**
 * 认证中间件
 * 从请求头中提取 JWT token 并验证用户身份
 */
import { Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase.js';

// NOTE: 扩展 Express Request 类型以包含用户信息
declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

/**
 * 必须登录的中间件
 * 验证失败返回 401
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        res.status(401).json({ error: '未提供认证令牌' });
        return;
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        res.status(401).json({ error: '认证令牌无效或已过期' });
        return;
    }

    req.userId = user.id;
    next();
}

/**
 * 可选登录的中间件
 * 如果有 token 且有效则附加用户信息，否则继续不报错
 */
export async function optionalAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (token) {
        const { data: { user } } = await supabase.auth.getUser(token);
        if (user) {
            req.userId = user.id;
        }
    }

    next();
}
