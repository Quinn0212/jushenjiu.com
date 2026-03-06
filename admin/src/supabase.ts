/**
 * Supabase 客户端
 * NOTE: 使用 service_role key 以获取管理员权限（仅后台使用）
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bjvguvhploirqesszocm.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqdmd1dmhwbG9pcnFlc3N6b2NtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjUxNzM0OCwiZXhwIjoyMDg4MDkzMzQ4fQ.iIkPGmk1A50RXqfZZzySrKGVP_aSQQlWiQpo8zpzLjo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
