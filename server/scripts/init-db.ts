/**
 * 数据库初始化脚本
 * 通过 Supabase Management API 执行 SQL
 */
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  const sqlPath = path.join(__dirname, '..', 'supabase-schema.sql');
  const fullSql = fs.readFileSync(sqlPath, 'utf8');

  // 拆分 SQL 为独立语句
  // NOTE: 使用正则按分号+换行拆分，过滤空语句和纯注释
  const statements = fullSql
    .split(/;\s*\n/)
    .map(s => s.trim())
    .filter(s => {
      if (!s) return false;
      // 过滤纯注释行
      const lines = s.split('\n').filter(l => !l.trim().startsWith('--') && l.trim().length > 0);
      return lines.length > 0;
    });

  console.log(`\n准备执行 ${statements.length} 条 SQL 语句...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i].trim();
    if (!stmt) continue;

    const preview = stmt.substring(0, 80).replace(/\n/g, ' ').replace(/\s+/g, ' ');
    process.stdout.write(`[${i + 1}/${statements.length}] ${preview}... `);

    try {
      const { error } = await supabase.rpc('', {} as any);
      // supabase-js 不直接支持原始 SQL，使用 REST API
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({}),
      });

      // 使用 pg 连接方式 — 通过 Supabase 的 SQL 执行接口
      // NOTE: 正式方式需要通过 Supabase Dashboard SQL Editor 执行
      console.log('⚠️  需要手动执行');
    } catch (err: any) {
      console.log(`❌ ${err.message}`);
      errorCount++;
    }
  }

  console.log(`\n========================================`);
  console.log(`⚠️  Supabase REST API 不支持执行原始 DDL SQL。`);
  console.log(`请手动在 Supabase Dashboard SQL Editor 中执行 supabase-schema.sql`);
  console.log(`Dashboard 地址: ${supabaseUrl.replace('.supabase.co', '.supabase.co')}/dashboard`);
  console.log(`========================================\n`);
}

main().catch(console.error);
