/**
 * 前端 API 客户端
 * 统一封装所有后端 API 调用
 */

const API_BASE = '/api';

/**
 * 获取存储在 localStorage 中的认证 token
 */
function getToken(): string | null {
    return localStorage.getItem('auth_token');
}

/**
 * 保存认证 token
 */
export function setToken(token: string): void {
    localStorage.setItem('auth_token', token);
}

/**
 * 清除认证 token
 */
export function clearToken(): void {
    localStorage.removeItem('auth_token');
}

/**
 * 检查是否已登录
 */
export function isAuthenticated(): boolean {
    return !!getToken();
}

/**
 * 通用 fetch 封装
 * 自动附加 Authorization 头和 JSON Content-Type
 */
async function request<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `请求失败: ${response.status}`);
    }

    return response.json();
}

// ==================== 产品 API ====================

export const productApi = {
    /**
     * 获取所有产品，支持分类过滤
     */
    getAll: (category?: string) => {
        const query = category ? `?category=${encodeURIComponent(category)}` : '';
        return request<any[]>(`/products${query}`);
    },

    /**
     * 获取单个产品详情
     */
    getById: (id: string) => {
        return request<any>(`/products/${id}`);
    },
};

// ==================== 认证 API ====================

export const authApi = {
    /**
     * 用户登录
     */
    login: async (email: string, password: string) => {
        const data = await request<any>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        if (data.session?.access_token) {
            setToken(data.session.access_token);
        }
        return data;
    },

    /**
     * 发送邮箱 OTP 验证码
     */
    sendOtp: async (email: string) => {
        return request<any>('/auth/send-otp', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    },

    /**
     * 验证邮箱 OTP 验证码
     */
    verifyOtp: async (email: string, code: string) => {
        return request<any>('/auth/verify-otp', {
            method: 'POST',
            body: JSON.stringify({ email, code }),
        });
    },

    /**
     * 用户注册（注册后不自动登录）
     */
    register: async (email: string, password: string, nickname?: string) => {
        return request<any>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, nickname }),
        });
    },

    /**
     * 获取当前用户信息
     */
    getProfile: () => {
        return request<any>('/auth/me');
    },

    /**
     * 更新用户资料
     */
    updateProfile: (profileData: Record<string, any>) => {
        return request<any>('/auth/me', {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
    },

    /**
     * 修改密码
     */
    changePassword: (currentPassword: string, newPassword: string) => {
        return request<any>('/auth/change-password', {
            method: 'POST',
            body: JSON.stringify({ currentPassword, newPassword }),
        });
    },

    /**
     * 注销账号
     */
    deleteAccount: (password: string) => {
        return request<any>('/auth/delete-account', {
            method: 'POST',
            body: JSON.stringify({ password }),
        });
    },

    /**
     * 登出
     */
    logout: () => {
        clearToken();
        return Promise.resolve();
    },
};

// ==================== 购物车 API ====================

export const cartApi = {
    /**
     * 获取购物车列表
     */
    getAll: () => {
        return request<any[]>('/cart');
    },

    /**
     * 添加商品到购物车
     */
    add: (productId: string, quantity = 1, unitPrice?: number, specLabel?: string) => {
        return request<any>('/cart', {
            method: 'POST',
            body: JSON.stringify({ productId, quantity, unitPrice, specLabel }),
        });
    },

    /**
     * 更新购物车项
     */
    update: (id: string, data: { quantity?: number; checked?: boolean }) => {
        return request<any>(`/cart/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    /**
     * 删除购物车项
     */
    remove: (id: string) => {
        return request<any>(`/cart/${id}`, {
            method: 'DELETE',
        });
    },
};

// ==================== 订单 API ====================

export const orderApi = {
    /**
     * 获取订单列表
     */
    getAll: (status?: string) => {
        const query = status && status !== 'all' ? `?status=${encodeURIComponent(status)}` : '';
        return request<any[]>(`/orders${query}`);
    },

    /**
     * 创建订单
     */
    create: (orderData: {
        items: any[];
        paymentMethod: string;
        address: any;
        deliveryTime: string;
        remark: string;
        total: number;
    }) => {
        return request<any>('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
    },
};

// ==================== 通知 API ====================

export const notificationApi = {
    /**
     * 获取消息列表
     */
    getAll: () => {
        return request<any[]>('/notifications');
    },

    /**
     * 标记已读
     */
    markRead: (id: string) => {
        return request<any>(`/notifications/${id}/read`, {
            method: 'PUT',
        });
    },
};

// ==================== 收藏 API ====================

export const favoriteApi = {
    /**
     * 获取收藏列表
     */
    getAll: () => {
        return request<any[]>('/favorites');
    },

    /**
     * 添加收藏
     */
    add: (productId: string) => {
        return request<any>('/favorites', {
            method: 'POST',
            body: JSON.stringify({ productId }),
        });
    },

    /**
     * 取消收藏
     */
    remove: (productId: string) => {
        return request<any>(`/favorites/${productId}`, {
            method: 'DELETE',
        });
    },
};

// ==================== 足迹 API ====================

export const footprintApi = {
    /**
     * 获取足迹列表
     */
    getAll: () => {
        return request<any[]>('/footprints');
    },

    /**
     * 记录足迹
     */
    add: (productId: string) => {
        return request<any>('/footprints', {
            method: 'POST',
            body: JSON.stringify({ productId }),
        });
    },
};

// ==================== 优惠券 API ====================

export const couponApi = {
    /**
     * 获取所有可用优惠券
     */
    getAll: () => {
        return request<any[]>('/coupons');
    },

    /**
     * 获取用户已领取的优惠券
     */
    getMine: () => {
        return request<any[]>('/coupons/mine');
    },
};

export const addressApi = {
    /**
     * 获取所有收货地址
     */
    getAll: () => {
        return request<any[]>('/addresses');
    },

    /**
     * 新增收货地址
     */
    add: (data: { name: string; phone: string; state: string; city: string; postcode: string; detail: string; isDefault?: boolean }) => {
        return request<any>('/addresses', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * 更新收货地址
     */
    update: (id: string, data: Record<string, any>) => {
        return request<any>(`/addresses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    /**
     * 删除收货地址
     */
    remove: (id: string) => {
        return request<any>(`/addresses/${id}`, {
            method: 'DELETE',
        });
    },
};
