/**
 * Supabase 客户端初始化
 * NOTE: 使用 service_role key 绕过 RLS，用于后端服务直接操作数据库
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('缺少 SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY 环境变量');
}

/**
 * 后端专用 Supabase 客户端（service_role 权限）
 * 用于绕过 RLS 策略直接执行数据库操作
 */
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

export default supabase;
