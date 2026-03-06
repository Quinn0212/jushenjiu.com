/**
 * Express 服务器入口
 * 聚神灸草本艾烟专卖 — 后端 API
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import productsRouter from './routes/products.js';
import authRouter from './routes/auth.js';
import cartRouter from './routes/cart.js';
import ordersRouter from './routes/orders.js';
import notificationsRouter from './routes/notifications.js';
import favoritesRouter from './routes/favorites.js';
import footprintsRouter from './routes/footprints.js';
import couponsRouter from './routes/coupons.js';
import addressesRouter from './routes/addresses.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 请求日志（开发环境）
app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// API 路由
app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/footprints', footprintsRouter);
app.use('/api/coupons', couponsRouter);
app.use('/api/addresses', addressesRouter);

// 健康检查端点
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

if (process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
        console.log(`\n🔥 聚神灸后端服务已启动：http://localhost:${PORT}`);
        console.log(`📦 API 基础路径：http://localhost:${PORT}/api\n`);
    });
}

export default app;
