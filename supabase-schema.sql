-- ============================================
-- 聚神灸 — 草本艾烟专卖 数据库表结构
-- 适用于 Supabase (PostgreSQL)
-- ============================================

-- 1. 产品表
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  english_name TEXT,
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 用户扩展信息表（关联 Supabase Auth）
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT DEFAULT '新用户',
  avatar_url TEXT,
  phone TEXT,
  gender TEXT,
  birthday DATE,
  signature TEXT,
  member_level TEXT DEFAULT '普通会员',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. 购物车表
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
  checked BOOLEAN DEFAULT true,
  unit_price NUMERIC(10,2),
  spec_label TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, product_id, unit_price)
);

-- 4. 订单表
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_no TEXT NOT NULL UNIQUE,
  total NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_payment',
  payment_method TEXT,
  address JSONB,
  delivery_time TEXT,
  remark TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. 订单明细表
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price NUMERIC(10, 2) NOT NULL
);

-- 6. 收藏表
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- 7. 足迹表
CREATE TABLE IF NOT EXISTS footprints (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT now()
);

-- 8. 通知表
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'system',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. 优惠券定义表
CREATE TABLE IF NOT EXISTS coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  value NUMERIC(10, 2) NOT NULL,
  description TEXT,
  min_amount NUMERIC(10, 2) DEFAULT 0,
  expiry DATE,
  status TEXT DEFAULT 'valid',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. 用户优惠券表
CREATE TABLE IF NOT EXISTS user_coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, coupon_id)
);

-- 11. 收货地址表
CREATE TABLE IF NOT EXISTS addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  postcode TEXT NOT NULL,
  detail TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 插入初始产品数据
-- ============================================
INSERT INTO products (id, name, english_name, price, original_price, image, category, tags, description) VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    '禅意·陈年艾草烟',
    'Aged Moxa Cigarettes',
    268,
    388,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDoJwGEXa3g6oHzV5vNO-tGETLJmzJPwTP0R-53vN-J9iwUIO534Qz9AyJPpNR3RDVryaoUNXuPzREV0qpt39e35_wPAH_mgUb0CJ6f4j3pY2TnyWMvJoEOyBp1eu8x8x8g_S0uYhdwYWAasdecEK7Puy1dEmofQX0RA-cdRBqXJ7MUIWKhv0UNWKQsWYHugGXgzQdbgH4jpl2NmVb7uLLA3-MCdDJgOqZozbw9sfM1Q9a02BLgEAUKQYa5sFEtJd1OSuwaGzwimJyK',
    '标准烟支',
    ARRAY['以艾代烟', '清肺润喉', '0尼古丁', '纯草本'],
    '选用陈年蕲艾，配以薄荷、甘草等天然草本，科学配比，口感细腻不呛喉。'
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    '清心·薄荷艾烟',
    'Mint & Moxa Blend',
    89,
    NULL,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB6LLdfi8AEogeABnctoIG_qifkxofK9OjjL-1jKXXqMkJQ22T-eo5KT1A69ClFoa8KqguquxysHnw3LttF56XBOfIanU3ThtQK938rd_uFYcQAhOKEnwSCMmN8EBS8MfjGkM7a_GNGRoqJ93maJ1Fd1GlyMhyPG-BDCdcYz_A3N-NTV-GW1_Fsk9Nl19V7Oud3kXy1lqSNwbg3y0lrmYNv6InV4AiCcAF_K8ZFPiOKjRC1-9GQYE7pzN3bfs5w3xPruFSULitBytk9',
    '标准烟支',
    ARRAY['清凉提神', '草本芬芳'],
    '草本香气醇厚，入口清凉，能有效缓解疲劳，平复情绪，安神助眠。'
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    '尊享礼盒·细支草本烟',
    NULL,
    328,
    NULL,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDEgtBRyHEW6SJkXp4dTktbA2oo353QwW0kPwOKt87aWny9uYI97iIRav255Uwhwp2UfGbFRTqTOlOZlLoW-bTY9PzNPStJogsnHA13abQGbOv30YCnt6bdnqI27kE-3mA9h4K1uLTtWjotRHYKOhH9ujP4IxWRZ6s3yVtrCFDJgR-rydskaJB812vCMXtYNU5FJvH4b3E-LsRxsrhzzoI9EGhdRJ9DvYrEnzZKxXsDCnOXlKTv73jrl7-3A8qe454qxECky_8wM6QO',
    '尊享礼盒',
    ARRAY['礼赠佳品', '高端定制'],
    '精选上等艾草，细支工艺，烟气柔和。'
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    '尊享礼盒·细支茉莉',
    NULL,
    328,
    NULL,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBktemygrBl0rcGnUtSc67me4skIJdmZUF2TCB1wvUrzAOQ_uRdYQm7dvmXkmxTvRC6otdHcooD2scH_9Mr9pTHEIpCFXXiXdeLqzjhYO8lsjAWUmvEGLyqoqcoOGDMH1qO0qXNnKyK07fB1afiHyJYNDkiqKdoVgqihblZaxd-8lPyaAtD3eAs_602NWIX5wKaKKaRNjKTB0TwaOpXpjXCnwdrCuS3667e6DRWXHJHdGo2iVeCD4QSSNUoaQCFdLKaHSIEhm8PeYoc',
    '尊享礼盒',
    ARRAY['花香四溢', '清新淡雅'],
    '茉莉花香与艾草香完美融合，清新怡人。'
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 插入初始优惠券数据
-- ============================================
INSERT INTO coupons (id, name, value, description, min_amount, expiry, status) VALUES
  ('00000000-0000-0000-0000-000000000101', '新人专享券', 20, '满100可用', 100, '2026-12-31', 'valid'),
  ('00000000-0000-0000-0000-000000000102', '店庆优惠券', 50, '满300可用', 300, '2026-05-20', 'valid'),
  ('00000000-0000-0000-0000-000000000103', '艾草烟专用', 10, '无门槛', 0, '2026-04-15', 'valid'),
  ('00000000-0000-0000-0000-000000000104', '免邮券', 0, '全场通用', 0, '2026-06-30', 'valid')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- RLS 策略
-- ============================================

-- 产品表：所有人可读取
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_select_all" ON products FOR SELECT USING (true);

-- 用户资料：用户只能操作自己的数据
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 购物车：用户只能操作自己的数据
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cart_select_own" ON cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "cart_insert_own" ON cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "cart_update_own" ON cart_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "cart_delete_own" ON cart_items FOR DELETE USING (auth.uid() = user_id);

-- 订单：用户只能查看自己的
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders_select_own" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "orders_insert_own" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "order_items_select_own" ON order_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

-- 收藏
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "favorites_select_own" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "favorites_insert_own" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "favorites_delete_own" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- 足迹
ALTER TABLE footprints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "footprints_select_own" ON footprints FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "footprints_insert_own" ON footprints FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 通知
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_select_own" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_update_own" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- 优惠券：所有人可读
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "coupons_select_all" ON coupons FOR SELECT USING (true);

-- 用户优惠券
ALTER TABLE user_coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_coupons_select_own" ON user_coupons FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_coupons_insert_own" ON user_coupons FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 注册触发器：自动创建 profiles
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, nickname)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'nickname', '新用户'));
  -- NOTE: 自动分配新人专享券
  INSERT INTO public.user_coupons (user_id, coupon_id)
  VALUES (new.id, '00000000-0000-0000-0000-000000000101')
  ON CONFLICT (user_id, coupon_id) DO NOTHING;
  RETURN new;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
