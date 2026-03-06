/**
 * 认证路由
 * NOTE: 使用 nodemailer 通过 Gmail SMTP 发送验证码邮件
 */
import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';
import { requireAuth } from '../middleware/auth.js';
import nodemailer from 'nodemailer';

const router = Router();

/**
 * 配置 nodemailer SMTP transporter
 * NOTE: 使用 .env 中的 Gmail SMTP 配置
 */
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

/**
 * 内存中的 OTP 存储
 * NOTE: 生产环境应使用 Redis 等持久化存储
 * key: email, value: { code, expiresAt }
 */
const otpStore = new Map<string, { code: string; expiresAt: number }>();

/**
 * 生成 6 位数字验证码
 */
function generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * 发送 OTP 验证码到邮箱
 * NOTE: 通过 nodemailer + Gmail SMTP 发送真实邮件
 */
router.post('/send-otp', async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    if (!email) {
        res.status(400).json({ error: '请输入邮箱地址' });
        return;
    }

    // 邮箱格式校验
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        res.status(400).json({ error: '请输入有效的邮箱地址' });
        return;
    }

    // 防止频繁发送（同一邮箱 60 秒内只能发一次）
    const existing = otpStore.get(email);
    if (existing && existing.expiresAt - Date.now() > 240000) {
        res.status(429).json({ error: '验证码已发送，请稍后再试' });
        return;
    }

    const code = generateOtp();
    // OTP 有效期 5 分钟
    otpStore.set(email, { code, expiresAt: Date.now() + 5 * 60 * 1000 });

    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: email,
            subject: '【聚神灸】邮箱验证码',
            html: `
                <div style="max-width:480px;margin:0 auto;padding:32px;font-family:'Segoe UI',Arial,sans-serif;background:#fefcf7;border:1px solid #e8dcc8;border-radius:16px;">
                    <div style="text-align:center;margin-bottom:24px;">
                        <h1 style="color:#B8860B;font-size:24px;margin:0;">聚神灸</h1>
                        <p style="color:#a08050;font-size:13px;margin:4px 0 0;">草本艾烟专卖</p>
                    </div>
                    <div style="background:white;border-radius:12px;padding:24px;border:1px solid #f0e6d0;">
                        <p style="color:#333;font-size:15px;margin:0 0 16px;">您好，</p>
                        <p style="color:#555;font-size:14px;margin:0 0 20px;">您的邮箱验证码为：</p>
                        <div style="text-align:center;background:linear-gradient(135deg,#B8860B,#D4A017);border-radius:12px;padding:20px;margin:0 0 20px;">
                            <span style="font-size:36px;font-weight:bold;letter-spacing:8px;color:white;">${code}</span>
                        </div>
                        <p style="color:#888;font-size:12px;margin:0;text-align:center;">验证码有效期为 5 分钟，请勿将验证码告知他人</p>
                    </div>
                    <p style="color:#bbb;font-size:11px;text-align:center;margin:16px 0 0;">此邮件由系统自动发送，请勿直接回复</p>
                </div>
            `,
        });

        console.log(`📧 验证码已发送至 ${email}`);
        res.json({ message: '验证码已发送，请检查您的邮箱' });
    } catch (err: any) {
        console.error('邮件发送失败:', err);
        // HACK: 邮件发送失败时，将验证码在响应中返回（仅开发环境）
        console.log(`\n========================================`);
        console.log(`📧 验证码 for ${email}: ${code}`);
        console.log(`========================================\n`);
        res.json({
            message: '验证码已发送，请检查您的邮箱',
            code_hint: process.env.NODE_ENV === 'development' ? code : undefined,
        });
    }
});

/**
 * 验证 OTP
 */
router.post('/verify-otp', async (req: Request, res: Response): Promise<void> => {
    const { email, code } = req.body;

    if (!email || !code) {
        res.status(400).json({ error: '请输入邮箱和验证码' });
        return;
    }

    const stored = otpStore.get(email);
    if (!stored) {
        res.status(400).json({ error: '验证码不存在或已过期，请重新获取' });
        return;
    }

    if (Date.now() > stored.expiresAt) {
        otpStore.delete(email);
        res.status(400).json({ error: '验证码已过期，请重新获取' });
        return;
    }

    if (stored.code !== code) {
        res.status(400).json({ error: '验证码错误' });
        return;
    }

    // 验证成功，标记该邮箱已验证（保留记录，注册时检查）
    otpStore.set(email, { code: '__VERIFIED__', expiresAt: Date.now() + 10 * 60 * 1000 });

    res.json({ message: '验证成功', verified: true });
});

/**
 * 用户注册
 * NOTE: 必须先通过 OTP 验证，才能注册
 */
router.post('/register', async (req: Request, res: Response): Promise<void> => {
    const { email, password, nickname } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: '邮箱和密码为必填项' });
        return;
    }

    if (password.length < 6) {
        res.status(400).json({ error: '密码长度不能少于 6 位' });
        return;
    }

    // 检查 OTP 是否已验证
    const otpRecord = otpStore.get(email);
    if (!otpRecord || otpRecord.code !== '__VERIFIED__') {
        res.status(400).json({ error: '请先完成邮箱验证' });
        return;
    }

    // 清除 OTP 记录
    otpStore.delete(email);

    // 检查用户是否已存在（可能是之前 magic link 创建的临时用户）
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.email === email);

    if (existingUser) {
        // 用户已存在，更新密码
        const { error: updateError } = await supabase.auth.admin.updateUserById(existingUser.id, {
            password,
            user_metadata: { nickname: nickname || '新用户' },
            email_confirm: true,
        });

        if (updateError) {
            res.status(400).json({ error: updateError.message });
            return;
        }

        // NOTE: 自动分配新人专享券
        await supabase.from('user_coupons').upsert({
            user_id: existingUser.id,
            coupon_id: '00000000-0000-0000-0000-000000000101',
        }, { onConflict: 'user_id,coupon_id' });

        res.json({ message: '注册成功，请登录', user: { id: existingUser.id, email } });
    } else {
        // 创建新用户
        const { data, error } = await supabase.auth.admin.createUser({
            email,
            password,
            user_metadata: { nickname: nickname || '新用户' },
            email_confirm: true,
        });

        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }

        // NOTE: 自动分配新人专享券
        await supabase.from('user_coupons').upsert({
            user_id: data.user.id,
            coupon_id: '00000000-0000-0000-0000-000000000101',
        }, { onConflict: 'user_id,coupon_id' });

        res.json({ message: '注册成功，请登录', user: { id: data.user.id, email: data.user.email } });
    }
});

/**
 * 用户登录
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: '请输入邮箱和密码' });
        return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        res.status(401).json({ error: '邮箱或密码错误' });
        return;
    }

    res.json({
        user: data.user,
        session: data.session,
    });
});

/**
 * 获取当前用户信息
 * NOTE: 合并 profiles 表数据和 auth.users 的邮箱
 */
router.get('/me', requireAuth, async (req: Request, res: Response): Promise<void> => {
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', req.userId)
        .single();

    if (error) {
        res.status(404).json({ error: '用户资料不存在' });
        return;
    }

    // 从 auth.users 获取邮箱
    const { data: authUser } = await supabase.auth.admin.getUserById(req.userId!);
    const email = authUser?.user?.email || '';

    res.json({ ...profile, email });
});

/**
 * 更新用户资料
 */
router.put('/me', requireAuth, async (req: Request, res: Response): Promise<void> => {
    const { nickname, avatar_url, phone, gender, birthday, signature } = req.body;

    const { data, error } = await supabase
        .from('profiles')
        .update({ nickname, avatar_url, phone, gender, birthday, signature })
        .eq('id', req.userId)
        .select()
        .single();

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }

    res.json(data);
});

/**
 * 修改密码
 * NOTE: 需要当前密码验证身份后才能设置新密码
 */
router.post('/change-password', requireAuth, async (req: Request, res: Response): Promise<void> => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        res.status(400).json({ error: '请输入当前密码和新密码' });
        return;
    }

    if (newPassword.length < 6) {
        res.status(400).json({ error: '新密码长度不能少于 6 位' });
        return;
    }

    // 先获取用户邮箱
    const { data: userData } = await supabase.auth.admin.getUserById(req.userId!);
    if (!userData?.user?.email) {
        res.status(400).json({ error: '用户信息获取失败' });
        return;
    }

    // 验证当前密码是否正确
    const { error: loginError } = await supabase.auth.signInWithPassword({
        email: userData.user.email,
        password: currentPassword,
    });

    if (loginError) {
        res.status(400).json({ error: '当前密码错误' });
        return;
    }

    // 使用 admin API 更新密码
    const { error: updateError } = await supabase.auth.admin.updateUserById(req.userId!, {
        password: newPassword,
    });

    if (updateError) {
        res.status(500).json({ error: updateError.message });
        return;
    }

    res.json({ message: '密码修改成功' });
});

/**
 * 注销账号
 * NOTE: 删除用户的所有数据和 auth.users 记录
 * CAUTION: 此操作不可逆
 */
router.post('/delete-account', requireAuth, async (req: Request, res: Response): Promise<void> => {
    const { password } = req.body;

    if (!password) {
        res.status(400).json({ error: '请输入密码确认注销' });
        return;
    }

    // 获取用户邮箱
    const { data: userData } = await supabase.auth.admin.getUserById(req.userId!);
    if (!userData?.user?.email) {
        res.status(400).json({ error: '用户信息获取失败' });
        return;
    }

    // 验证密码
    const { error: loginError } = await supabase.auth.signInWithPassword({
        email: userData.user.email,
        password,
    });

    if (loginError) {
        res.status(400).json({ error: '密码错误，无法注销' });
        return;
    }

    // 删除用户（Supabase admin API 会级联删除关联数据）
    const { error: deleteError } = await supabase.auth.admin.deleteUser(req.userId!);

    if (deleteError) {
        res.status(500).json({ error: deleteError.message });
        return;
    }

    console.log(`[Auth] 用户已注销: ${userData.user.email}`);
    res.json({ message: '账号已注销' });
});

/**
 * 登出
 */
router.post('/logout', async (_req: Request, res: Response): Promise<void> => {
    res.json({ message: '已登出' });
});

export default router;
