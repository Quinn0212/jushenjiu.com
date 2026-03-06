/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  Grid,
  ShoppingCart,
  User,
  Search,
  Bell,
  ChevronRight,
  Plus,
  Minus,
  ArrowLeft,
  Heart,
  Share2,
  Headset,
  ShoppingBag,
  CheckCircle2,
  Truck,
  ShieldCheck,
  Wallet,
  Package,
  Star,
  MapPin,
  Settings,
  MessageSquare,
  CreditCard,
  Ticket,
  Banknote,
  Eye,
  EyeOff,
  Smartphone,
  Lock,
  RefreshCw,
  Mail,
  X,
  Camera
} from 'lucide-react';
import { Product, Screen, Notification, normalizeProduct } from './types.ts';
import { productApi, cartApi, orderApi, authApi, notificationApi, favoriteApi, footprintApi, couponApi, addressApi, isAuthenticated, clearToken } from './api.ts';

// --- Components ---

const Navbar = ({ activeScreen, setScreen }: { activeScreen: Screen, setScreen: (s: Screen) => void }) => {
  const navItems: { id: Screen, icon: any, label: string }[] = [
    { id: 'home', icon: Home, label: '首页' },
    { id: 'category', icon: Grid, label: '分类' },
    { id: 'cart', icon: ShoppingCart, label: '购物车' },
    { id: 'profile', icon: User, label: '我的' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background-light/90 backdrop-blur-md border-t border-primary/10 px-4 pb-6 pt-2 flex justify-around items-center z-50">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setScreen(item.id)}
          className={`flex flex-col items-center gap-1 transition-colors ${activeScreen === item.id ? 'text-primary' : 'text-slate-400 hover:text-primary'
            }`}
        >
          <item.icon size={24} fill={activeScreen === item.id ? 'currentColor' : 'none'} />
          <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

// --- Screens ---

const HomeScreen = ({ onProductClick, onSearch, onNotifications, onCategoryClick, onCultureClick, onAddToCart, unreadCount, products }: {
  onProductClick: (p: Product) => void,
  onSearch: () => void,
  onNotifications: () => void,
  onCategoryClick: (cat: string) => void,
  onCultureClick: () => void,
  onAddToCart: (p: Product) => void,
  unreadCount: number,
  products: Product[],
  key?: string
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-24"
    >
      <header className="sticky top-0 z-50 flex items-center bg-background-light/95 backdrop-blur-sm px-4 py-3 border-b border-primary/10 justify-between">
        <div className="flex size-10 shrink-0 items-center overflow-hidden rounded-full border border-primary/20">
          <img
            alt="Logo"
            className="w-full h-full object-cover"
            src="https://res.cloudinary.com/dmdjliyio/image/upload/v1772517580/%E8%81%9A%E7%A5%9E%E7%81%B8logo-Photoroom_hzgbyt.png"
            referrerPolicy="no-referrer"
          />
        </div>
        <h1 className="text-primary text-xl font-bold leading-tight tracking-tight flex-1 ml-3">聚神灸</h1>
        <div className="flex gap-3 items-center">
          <button onClick={onSearch} className="text-primary/80 hover:text-primary transition-colors"><Search size={20} /></button>
          <button
            onClick={onNotifications}
            className="text-primary/80 hover:text-primary transition-colors relative"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full border border-white"></span>
            )}
          </button>
        </div>
      </header>

      <section className="px-4 py-4">
        <div
          onClick={() => { if (products.length > 0) onProductClick(products[0]); }}
          className="relative overflow-hidden rounded-xl h-48 bg-primary/10 border border-primary/20 group cursor-pointer"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(184, 134, 11, 0.4), transparent), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAN6YF4FkcVRq3oeQRMBoV-iUZRRTBlPqEygWPQWO9-0J6xcrE7FJvLNvmdvCbwehpVUV9i8KP2E1F2hSyy9kQESaJ1qtV3JE_6qE85tLm7f4OANhd9gTeGKXsaenQZDG-Jl79Y3ZUsand1OIG_AI4xMkV-2V9tXdHQmhaZ6ayDfghF6ds9vhPqu2UMkO5H3HapsNRs0VjACwZ1klPjb2B2a52tH5UjkbhtPmLKU7qDjLaEPpvEbOaavg7jc2dcjb6aZHcDe5tbx_BB")`
            }}
          ></div>
          <div className="relative h-full flex flex-col justify-center p-6">
            <h2 className="text-white text-2xl font-bold leading-tight drop-shadow-md tracking-wide">草本精华 吸入自然<br />可吸食药艾烟</h2>
            <p className="text-white/90 text-sm mt-2 font-normal tracking-wide">古法炮制 · 亦烟亦药</p>
            <div className="mt-4">
              <span className="bg-primary text-white px-4 py-1.5 rounded-full text-xs font-medium shadow-lg tracking-wide">立即尝鲜</span>
            </div>
          </div>
        </div>
      </section>

      <section className="flex w-full overflow-x-auto px-4 py-6 gap-6 no-scrollbar">
        {[
          { label: '标准烟支', id: '标准烟支', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3OwaMPu7tSJKoz6E2CbLIgrL_HASFzvRzXXFfHBMAlv9CCdwNPcpzzlN8-WXluuKnFmNzzUDUG6HYA8QAHxTqoOuhsLAl4MH3zbo9RFNz7q4KrzIW8VFpZ8WKDYcWBQr6fy9A3rOclkfQRgRZ-Vz7HbNhkawDfKGQogjewTEsEY0q3WMxb-b7dt2t7ehMG71Fs8pDvP1z-JokilZU4iYqFeb-eB9SUZZAVQrchlWXWZC9TK6xY879aXRPjBDs2kijWI2EnOc480dm' },
          { label: '礼盒套装', id: '尊享礼盒', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvEq3xXsCjcP8tMAMppTJ_cf4LDFIzjubI3yILHUh-W_PribWNeQIUPvYAsXhp55q11WVQg_63nzeb1apOx_XS-k3DolOTpaW6IdczK5tLmCfSfhzKTsO5kIZ4URIpSOYbNQ5JOq4k5L7MbjAFbf1PZnq60MPCU9ftiEZGYRTzjToT_0sUbJdebWC30X-ynbzpSqmNvZvjkNnSr6MdjSWB0YczfHZd0zrrG-0tqp5usAJppWcS1Qg2xl9tPUz8VUQCocP3muW1BvDZ' },
        ].map((cat, i) => (
          <button key={i} onClick={() => onCategoryClick(cat.id)} className="flex flex-col items-center gap-2 min-w-[70px] active:scale-95 transition-transform">
            <div className="size-14 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 overflow-hidden">
              <img className="w-full h-full object-cover" src={cat.img} alt={cat.label} referrerPolicy="no-referrer" />
            </div>
            <p className="text-slate-800 text-xs font-medium tracking-wide">{cat.label}</p>
          </button>
        ))}
      </section>

      <section className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-slate-900 text-lg font-bold border-l-4 border-primary pl-3 tracking-wide">艾烟文化</h2>
          <button onClick={onCultureClick} className="bg-primary text-white px-3 py-1 rounded-full text-xs flex items-center font-medium shadow-sm active:scale-95 transition-transform">
            了解更多 <ChevronRight size={14} className="ml-0.5" />
          </button>
        </div>
        <div onClick={onCultureClick} className="bg-white/50 border border-primary/10 p-4 rounded-xl cursor-pointer active:bg-primary/5 transition-colors">
          <p className="text-slate-600 text-sm leading-relaxed tracking-wide">
            “吞吐之间，尽享草本芬芳。聚神药艾烟，非传统烟草，乃自然之馈赠，清肺润喉，提神醒脑。”
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="aspect-video rounded-lg overflow-hidden border border-primary/5">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQx_h4cvX28l0lVqHYK0GRTXPjAhruN3VH7KfSFryhufdJdILE6og_0zQy31gLUypzcmUEu7ROPAmscgOnlkFsLE8_1ZcsMSFq8fJYmrdseg3Xsbzhk_lGEu9O0DpkxzRH0cfx20RFe_EeEB10zAYmWC4uyPA7p-Qd6jY4W9baF_05eNvf1DwGgRKwA1_8aKmKJMFve5oioSxKNeuq4Zc1mnWeIE7UcxALXBTFNSd-z65xu59I8kWw1BWs1IftgoHhMSf-xLBhUeGZ" alt="Culture 1" referrerPolicy="no-referrer" />
            </div>
            <div className="aspect-video rounded-lg overflow-hidden border border-primary/5">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBq0IY7tCs0n3xJ1Ic95natg9CjhjADuUGoLSeop-3H9zrERozHcM-ye_qmSQR_CD-xJtj6NuhUFi9vXNsk15Nfzu8VHQYaFimPTI_P5XkulcWMYMChWnf1KbOB4dZr5HWX8WgQ-1RPQalAWrVTIePDKd8eQWSdKWkx0TEvNoZvrVgXTJelXQRcrOKLWR2ujZNLAniKzAt8RY9xV17yr1CkE1u2moO1vu19PRYM5OkPFkUp1aTxPeFIEClOyGPHhfEe6cRdlM6w776l" alt="Culture 2" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-4">
        <h2 className="text-slate-900 text-lg font-bold mb-4 border-l-4 border-primary pl-3 tracking-wide">热销烟品</h2>
        <div className="grid grid-cols-2 gap-4">
          {products.length === 0 && <p className="text-slate-400 text-sm col-span-2 text-center py-8">正在加载产品...</p>}
          {products.slice(0, 2).map((product) => (
            <div
              key={product.id}
              onClick={() => onProductClick(product)}
              className="bg-white border border-primary/10 rounded-xl overflow-hidden shadow-sm active:scale-95 transition-transform"
            >
              <div className="aspect-square bg-slate-100 overflow-hidden">
                <img className="w-full h-full object-cover" src={product.image} alt={product.name} referrerPolicy="no-referrer" />
              </div>
              <div className="p-3">
                <h3 className="text-slate-800 text-sm font-bold truncate tracking-wide">{product.name}</h3>
                <p className="text-slate-400 text-[10px] mt-1 uppercase tracking-wider font-medium">{product.englishName || 'Premium Moxa'}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-primary font-bold text-lg">RM{product.price}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                    className="bg-primary text-white size-8 rounded-full flex items-center justify-center shadow-sm active:scale-110 transition-transform"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};

const CategoryScreen = ({ onProductClick, onSearch, initialCategory, onAddToCart, onNotifications, unreadCount, products }: {
  onProductClick: (p: Product) => void,
  onSearch: () => void,
  initialCategory?: string,
  onAddToCart: (p: Product) => void,
  onNotifications: () => void,
  unreadCount: number,
  products: Product[],
  key?: string
}) => {
  const [activeCategory, setActiveCategory] = useState(initialCategory || '标准烟支');
  const categories = ['标准烟支', '尊享礼盒'];

  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen flex flex-col overflow-hidden"
    >
      <header className="shrink-0 flex items-center bg-background-light/95 backdrop-blur-sm px-4 py-3 border-b border-primary/10 justify-between z-20">
        <div className="flex size-10 shrink-0 items-center overflow-hidden rounded-full border border-primary/20">
          <img alt="Logo" className="w-full h-full object-cover" src="https://res.cloudinary.com/dmdjliyio/image/upload/v1772517580/%E8%81%9A%E7%A5%9E%E7%81%B8logo-Photoroom_hzgbyt.png" referrerPolicy="no-referrer" />
        </div>
        <div className="flex-1 mx-3 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50" />
          <input
            onClick={onSearch}
            readOnly
            className="w-full bg-white/50 border border-primary/10 rounded-full py-1.5 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none cursor-pointer"
            placeholder="搜索艾烟产品"
            type="text"
          />
        </div>
        <button
          onClick={onNotifications}
          className="text-primary/80 hover:text-primary transition-colors shrink-0 relative"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full border border-white"></span>
          )}
        </button>
      </header>

      <main className="flex-1 flex overflow-hidden pb-[80px]">
        <aside className="w-24 bg-white/40 border-r border-primary/10 h-full overflow-y-auto no-scrollbar shrink-0 flex flex-col gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`relative py-5 px-2 text-sm font-medium transition-colors ${activeCategory === cat ? 'text-primary bg-white' : 'text-slate-600 hover:text-primary hover:bg-white/50'
                }`}
            >
              <span className="relative z-10">{cat}</span>
              {activeCategory === cat && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"></div>
              )}
            </button>
          ))}
        </aside>

        <div className="flex-1 h-full overflow-y-auto p-4 no-scrollbar">
          <div className="w-full h-28 rounded-lg overflow-hidden mb-6 relative shadow-sm border border-primary/10">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAN6YF4FkcVRq3oeQRMBoV-iUZRRTBlPqEygWPQWO9-0J6xcrE7FJvLNvmdvCbwehpVUV9i8KP2E1F2hSyy9kQESaJ1qtV3JE_6qE85tLm7f4OANhd9gTeGKXsaenQZDG-Jl79Y3ZUsand1OIG_AI4xMkV-2V9tXdHQmhaZ6ayDfghF6ds9vhPqu2UMkO5H3HapsNRs0VjACwZ1klPjb2B2a52tH5UjkbhtPmLKU7qDjLaEPpvEbOaavg7jc2dcjb6aZHcDe5tbx_BB")` }}></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center px-4">
              <div className="text-white">
                <h2 className="font-bold text-lg tracking-wide mb-1">本草艾烟 · 替烟佳选</h2>
                <p className="text-xs opacity-90 font-light">不含尼古丁 · 纯正艾草香</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="flex items-center text-sm font-bold text-slate-800 mb-4">
              <span className="w-1 h-3 bg-primary rounded-full mr-2"></span>
              {activeCategory}
            </h3>
            <div className="grid grid-cols-2 gap-y-6 gap-x-3">
              {products.filter(p => p.category === activeCategory).map((product) => (
                <div
                  key={product.id}
                  onClick={() => onProductClick(product)}
                  className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
                >
                  <div className="size-24 bg-white rounded-lg flex items-center justify-center border border-primary/20 shadow-sm overflow-hidden p-1 relative group">
                    <img className="w-full h-full object-cover rounded" src={product.image} alt={product.name} referrerPolicy="no-referrer" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product);
                      }}
                      className="absolute bottom-1 right-1 bg-primary text-white size-6 rounded-full flex items-center justify-center shadow-sm active:scale-110 transition-transform opacity-0 group-hover:opacity-100"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="text-slate-600 text-[11px] font-medium text-center leading-tight">{product.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
};

const CartScreen = ({ cartItems, onUpdateQty, onToggleCheck, onPurchase, onRemove, onProductClick, onAddToCart, products }: {
  cartItems: any[],
  onUpdateQty: (id: string, delta: number) => void,
  onToggleCheck: (id: string) => void,
  onPurchase: (total: number) => void,
  onRemove: (id: string) => void,
  onProductClick: (p: Product) => void,
  onAddToCart: (p: Product) => void,
  products: Product[],
  key?: string
}) => {
  const total = cartItems.reduce((sum, item) => item.checked ? sum + item.price * item.quantity : sum, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-32"
    >
      <header className="sticky top-0 z-50 flex items-center bg-background-light/95 backdrop-blur-sm px-4 py-4 border-b border-primary/10 justify-between">
        <h1 className="text-xl font-bold text-slate-900 tracking-wide">购物车</h1>
      </header>

      <main className="px-4 pt-4">
        {cartItems.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-primary/10 p-12 text-center shadow-sm">
            <ShoppingCart size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 text-sm">购物车是空的</p>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-primary/10 p-4 mb-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-dashed border-slate-200">
              <input
                type="checkbox"
                checked={cartItems.length > 0 && cartItems.every(i => i.checked)}
                onChange={() => {
                  const allChecked = cartItems.every(i => i.checked);
                  cartItems.forEach(i => {
                    if (i.checked === allChecked) onToggleCheck(i.id);
                  });
                }}
                className="size-5 rounded-full border-2 border-slate-300 text-primary focus:ring-0 cursor-pointer"
              />
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-slate-800 tracking-wide">全选</span>
                <ChevronRight size={14} className="text-slate-400" />
              </div>
            </div>

            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => onToggleCheck(item.id)}
                      className="size-5 rounded-full border-2 border-slate-300 text-primary focus:ring-0 cursor-pointer"
                    />
                  </div>
                  <div className="size-24 shrink-0 rounded-lg overflow-hidden bg-slate-100 border border-primary/5">
                    <img className="w-full h-full object-cover" src={item.image} alt={item.name} referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex flex-col justify-between flex-1 py-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-slate-900 font-bold text-sm line-clamp-2 tracking-wide leading-relaxed pr-2">{item.name}</h3>
                        {item.specLabel && <span className="text-[11px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded mt-1 inline-block border border-slate-100">{item.specLabel}</span>}
                      </div>
                      <button onClick={() => onRemove(item.id)} className="text-slate-300 hover:text-red-500 transition-colors shrink-0">
                        <Minus size={14} />
                      </button>
                    </div>
                    <div className="flex items-end justify-between">
                      <span className="text-primary font-bold text-lg tracking-tight">RM{item.price}</span>
                      <div className="flex items-center border border-slate-200 rounded-md bg-white">
                        <button
                          onClick={() => onUpdateQty(item.id, -1)}
                          className="px-2 py-0.5 text-slate-400 hover:text-primary transition-colors disabled:opacity-50"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-2 text-sm font-medium text-slate-800 min-w-[20px] text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQty(item.id, 1)}
                          className="px-2 py-0.5 text-slate-400 hover:text-primary transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 mb-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px bg-primary/20 w-12"></div>
            <span className="font-medium text-sm flex items-center gap-1 tracking-widest text-slate-900">
              <Heart size={16} fill="currentColor" />
              猜你喜欢
            </span>
            <div className="h-px bg-primary/20 w-12"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {products.slice(2, 6).map((product) => (
              <div
                key={product.id}
                onClick={() => onProductClick(product)}
                className="bg-white border border-primary/10 rounded-xl overflow-hidden shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
              >
                <div className="aspect-square bg-slate-100 overflow-hidden">
                  <img className="w-full h-full object-cover" src={product.image} alt={product.name} referrerPolicy="no-referrer" />
                </div>
                <div className="p-3">
                  <h3 className="text-slate-800 text-xs font-bold truncate tracking-wide">{product.name}</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-primary font-bold text-sm tracking-tight">RM{product.price}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product);
                      }}
                      className="bg-primary/10 text-primary size-6 rounded-full flex items-center justify-center active:scale-125 transition-transform"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <div className="fixed bottom-[80px] left-0 right-0 bg-white border-t border-primary/10 px-4 py-3 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={cartItems.length > 0 && cartItems.every(i => i.checked)}
              onChange={() => {
                const allChecked = cartItems.every(i => i.checked);
                cartItems.forEach(i => {
                  if (i.checked === allChecked) onToggleCheck(i.id);
                });
              }}
              className="size-5 rounded-full border-2 border-slate-300 text-primary focus:ring-0 cursor-pointer"
            />
            <label className="text-sm text-slate-600 font-medium tracking-wide">全选</label>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 tracking-wide">不含运费</div>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-medium text-slate-800 tracking-wide">合计:</span>
                <span className="text-lg font-bold text-primary tracking-tight">RM{total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => cartItems.some(i => i.checked) && onPurchase(total)}
              className="bg-primary text-white px-8 py-2.5 rounded-full font-bold shadow-lg shadow-primary/30 active:scale-95 transition-transform tracking-wider disabled:opacity-50"
              disabled={!cartItems.some(i => i.checked)}
            >
              结算 ({cartItems.filter(i => i.checked).length})
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ProfileScreen = ({
  onNotifications,
  unreadCount,
  onCoupons,
  onFootprints,
  onFavorites,
  onSettings,
  onCustomerService,
  onAddress,
  onOrders,
  isLoggedIn,
  onLogin,
  orders,
  userProfile,
  couponCount,
  footprintCount
}: {
  onNotifications: () => void,
  unreadCount: number,
  onCoupons: () => void,
  onFootprints: () => void,
  onFavorites: () => void,
  onSettings: () => void,
  onCustomerService: () => void,
  onAddress: () => void,
  onOrders: (tab?: string) => void,
  isLoggedIn: boolean,
  onLogin: () => void,
  orders: any[],
  userProfile: any,
  couponCount: number,
  footprintCount: number,
  key?: string
}) => {
  // NOTE: 根据订单数据动态计算各状态数量
  const orderCounts = {
    pending_payment: orders.filter(o => o.status === 'pending_payment').length,
    pending_shipment: orders.filter(o => o.status === 'pending_shipment').length,
    pending_receipt: orders.filter(o => o.status === 'pending_receipt').length,
    after_sale: orders.filter(o => o.status === 'after_sale' || o.status === 'refund').length,
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-24"
    >
      <header className="relative pt-12 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCf_v1_GAzOPBJLJCjXErMm6JoI9cgNWIFhyFMOuByLEKbWVqXF34eky6kOC50bb089KUBlc-Ib1XOvnKjZFpjY9ZQRUZeSsoq-0-FXdRb6WVcavKx4lJbKA4yipXeZREhGyCSuvU9F4XTXO4-Uoz2HcmxRK9IKT0QtadHFg8yxGboQO59El7u4bLPOfBEcaHM1N1a780UeAOeWPWBO7gIalgiQIDKFz3BOgz4wBwiV3MmOSjO9PgjNSByfdcw4jZUdDZ9GPbL4_6iP')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background-light/50 to-background-light pointer-events-none"></div>
        <div className="relative z-10 flex items-center gap-5">
          <div className="size-20 rounded-full border-2 border-primary/30 p-1 bg-white/50 backdrop-blur-sm shadow-md">
            <img alt="Avatar" className="w-full h-full rounded-full object-cover" src={userProfile?.avatar_url || 'https://res.cloudinary.com/dmdjliyio/image/upload/v1772517580/%E8%81%9A%E7%A5%9E%E7%81%B8logo-Photoroom_hzgbyt.png'} referrerPolicy="no-referrer" />
          </div>
          <div className="flex flex-col">
            {isLoggedIn ? (
              <>
                <h1 className="text-2xl font-bold text-slate-900 tracking-wide">{userProfile?.nickname || '新用户'}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full border border-primary/20">{userProfile?.member_level || '普通会员'}</span>
                  {userProfile?.signature && <span className="text-slate-400 text-[10px] max-w-[120px] truncate">{userProfile.signature}</span>}
                </div>
              </>
            ) : (
              <button onClick={onLogin} className="text-2xl font-bold text-slate-900 tracking-wide hover:text-primary transition-colors">登录 / 注册</button>
            )}
          </div>
          <div className="ml-auto">
            <button
              onClick={onNotifications}
              className="text-slate-400 hover:text-primary transition-colors relative"
            >
              <Bell size={24} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 w-3 h-3 rounded-full border-2 border-white"></span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="px-4 -mt-6 relative z-10 space-y-4">
        <div className="bg-white/80 backdrop-blur-sm border border-primary/10 rounded-xl p-4 shadow-sm grid grid-cols-2 divide-x divide-primary/10">
          <button onClick={onCoupons} className="flex flex-col items-center gap-1">
            <span className="text-lg font-bold text-slate-900">{couponCount}</span>
            <span className="text-xs text-slate-500">优惠券</span>
          </button>
          <button onClick={onFootprints} className="flex flex-col items-center gap-1">
            <span className="text-lg font-bold text-slate-900">{footprintCount}</span>
            <span className="text-xs text-slate-500">足迹</span>
          </button>
        </div>

        <section className="bg-white/80 backdrop-blur-sm border border-primary/10 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-dashed border-primary/10 pb-3">
            <h2 className="text-slate-900 font-bold text-base border-l-4 border-primary pl-2 tracking-wide">我的订单</h2>
            <button onClick={() => onOrders('all')} className="text-xs text-slate-400 flex items-center hover:text-primary">
              查看全部 <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: '待付款', icon: Wallet, count: orderCounts.pending_payment, tab: 'pending_payment' },
              { label: '待发货', icon: Package, count: orderCounts.pending_shipment, tab: 'pending_shipment' },
              { label: '待收货', icon: Truck, count: orderCounts.pending_receipt, tab: 'pending_receipt' },
              { label: '退换/售后', icon: ShieldCheck, count: orderCounts.after_sale, tab: 'after_sale' },
            ].map((item, i) => (
              <button key={i} onClick={() => onOrders(item.tab)} className="flex flex-col items-center gap-2 group cursor-pointer">
                <div className="relative">
                  <item.icon size={24} className="text-slate-600 group-hover:text-primary transition-colors" />
                  {item.count > 0 && (
                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] min-w-[16px] h-4 flex items-center justify-center rounded-full font-medium px-1">{item.count}</span>
                  )}
                </div>
                <span className="text-xs text-slate-600 group-hover:text-primary">{item.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="bg-white/80 backdrop-blur-sm border border-primary/10 rounded-xl shadow-sm overflow-hidden">
          {[
            { label: '我的收藏', icon: Heart, onClick: onFavorites },
            { label: '收货地址', icon: MapPin, onClick: onAddress },
            { label: '官方客服', icon: Headset, onClick: onCustomerService },
            { label: '设置', icon: Settings, onClick: onSettings },
          ].map((item, i) => (
            <button key={i} onClick={item.onClick} className={`w-full flex items-center p-4 hover:bg-primary/5 transition-colors ${i < 3 ? 'border-b border-primary/5' : ''}`}>
              <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                <item.icon size={18} />
              </div>
              <span className="text-slate-800 text-sm font-medium flex-1 text-left">{item.label}</span>
              <ChevronRight size={18} className="text-slate-300" />
            </button>
          ))}
        </section>

        <section className="relative overflow-hidden rounded-xl h-24 bg-primary/10 border border-primary/20 group mt-2">
          <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: "linear-gradient(to right, rgba(184, 134, 11, 0.2), transparent), url('https://lh3.googleusercontent.com/aida-public/AB6AXuAUNPVE2f3j97ouZB2hj7wLGWvcmO5W5EAIZd38398AM3YfybyRn4Th_8Bgw0yYPfFcvNA5Gqr3JyqQKs2AxtHDjvQen5HXMceLRLDbpCV8PCqo0de4uEE6taiLgKpGCYyM4li4z4XHCRve2J3U3t2ZiQCZC9Z2vzRvS5bEwOGIpiaT6_WsR0Mur6UFV1OD-U1hIvVizaX0v4uPPoCnPvm7ZT2I31xOLqovonoCfggSiTWzH2LG3rt1IergTkd79V-T5yTBhbPB93A2')" }}></div>
          <div className="relative h-full flex flex-col justify-center px-6">
            <h3 className="text-slate-900 text-lg font-bold tracking-wide">邀请好友 享好礼</h3>
            <p className="text-slate-700 text-xs mt-1">每邀请一位好友立得 RM20 优惠券一张</p>
          </div>
        </section>

        <div className="pt-8 pb-4 flex flex-col items-center">
          <img
            src="https://res.cloudinary.com/dmdjliyio/image/upload/v1772517580/%E8%81%9A%E7%A5%9E%E7%81%B8logo-Photoroom_hzgbyt.png"
            className="w-12 h-12 object-contain mb-2"
            alt="Logo"
            referrerPolicy="no-referrer"
          />
          <p className="text-[10px] tracking-widest uppercase font-medium text-slate-900">JU SHEN JIU</p>
          <p className="text-[10px] mt-1 tracking-wide text-slate-900">草本艾烟 · 吞吐自然之息</p>
        </div>
      </main>
    </motion.div>
  );
};

const ProductDetailScreen = ({ product, onBack, onAddToCart, onBuyNow, onGoToCart, onCustomerService, cartCount, isFavorited, onToggleFavorite }: { product: Product, onBack: () => void, onAddToCart: (p: Product) => void, onBuyNow: (p: Product) => void, onGoToCart: () => void, onCustomerService: () => void, cartCount: number, isFavorited: boolean, onToggleFavorite: (p: Product) => void, key?: string }) => {
  // NOTE: 每个商品的规格数据
  const specsMap: Record<string, { label: string, price: number }[]> = {
    '禅意·陈年艾草烟': [
      { label: '20支/盒 (硬盒精装)', price: 268 },
      { label: '10支/盒 (硬盒精装)', price: 168 },
      { label: '5支/盒 (体验装)', price: 98 },
    ],
    '清心·薄荷艾烟': [
      { label: '20支/盒 (硬盒精装)', price: 158 },
      { label: '10支/盒 (硬盒精装)', price: 89 },
      { label: '5支/盒 (体验装)', price: 49 },
    ],
    '尊享礼盒·细支草本烟': [
      { label: '40支/盒 (豪华礼盒)', price: 568 },
      { label: '20支/盒 (精品礼盒)', price: 328 },
      { label: '10支/盒 (迷你礼盒)', price: 188 },
    ],
    '尊享礼盒·细支茉莉': [
      { label: '40支/盒 (豪华礼盒)', price: 568 },
      { label: '20支/盒 (精品礼盒)', price: 328 },
      { label: '10支/盒 (迷你礼盒)', price: 188 },
    ],
  };
  const specs = specsMap[product.name] || [
    { label: '20支/盒 (标准装)', price: product.price },
    { label: '10支/盒 (精简装)', price: Math.round(product.price * 0.6) },
  ];
  const [selectedSpecIndex, setSelectedSpecIndex] = useState(0);
  const [showSpecModal, setShowSpecModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const selectedSpec = specs[selectedSpecIndex];
  const displayPrice = selectedSpec.price;
  const handleAddToCart = () => onAddToCart({ ...product, price: displayPrice, specLabel: selectedSpec.label, selectedQty: quantity } as any);
  const handleBuyNow = () => onBuyNow({ ...product, price: displayPrice, specLabel: selectedSpec.label, selectedQty: quantity } as any);
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-0 z-[60] bg-background-light overflow-y-auto pb-28 rice-paper"
    >
      <header className="sticky top-0 z-50 flex items-center bg-background-light/95 backdrop-blur-sm px-4 py-3 border-b border-primary/10 justify-between">
        <button onClick={onBack} className="flex items-center text-slate-800 hover:text-primary transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-slate-800 text-lg font-bold">商品详情</h1>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => onToggleFavorite(product)}
            className={`transition-colors ${isFavorited ? 'text-red-500' : 'text-slate-800 hover:text-red-500'}`}
          >
            <Heart size={20} fill={isFavorited ? 'currentColor' : 'none'} />
          </button>
        </div>
      </header>

      <main>
        <section className="relative w-full aspect-[4/3] bg-primary/5">
          <img className="w-full h-full object-cover" src={product.image} alt={product.name} referrerPolicy="no-referrer" />
          <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs">
            1/5
          </div>
        </section>

        <section className="px-4 py-5 bg-white/50 border-b border-primary/10 mb-2">
          <h1 className="text-xl font-bold text-slate-900 leading-snug tracking-tight">{product.name}</h1>
          <p className="text-slate-500 text-xs mt-1 font-light tracking-wide">{product.tags.join(' · ')}</p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-xs text-primary font-bold">RM</span>
            <span className="text-3xl font-bold text-primary">{displayPrice}</span>
            {product.originalPrice && displayPrice < product.originalPrice && (
              <span className="text-xs text-slate-400 line-through ml-2">RM{product.originalPrice}</span>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 border-t border-primary/5 pt-3">
            <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-primary" /> 正品保证</span>
            <span className="flex items-center gap-1"><Truck size={14} className="text-primary" /> 极速发货</span>
            <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-primary" /> 不含烟草</span>
          </div>
        </section>

        <section
          onClick={() => setShowSpecModal(true)}
          className="px-4 py-4 bg-white/50 border-y border-primary/10 mb-2 flex items-center justify-between active:bg-primary/5 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-slate-900 w-8 shrink-0">选择</span>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm text-slate-800 font-medium">规格：{selectedSpec.label}</span>
              <span className="text-xs text-slate-500">RM{displayPrice} · 已选：{quantity}件</span>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-400" />
        </section>

        <section className="px-4 py-5 bg-white/50 border-y border-primary/10 mb-2">
          <div className="flex items-center mb-3">
            <div className="w-1 h-3.5 bg-primary rounded-full mr-2"></div>
            <h2 className="text-base font-bold text-slate-900">核心功效</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col p-3 rounded-lg border border-primary/10 bg-background-light">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheck size={16} />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">清肺润喉</h3>
              </div>
              <p className="text-[11px] text-slate-600 leading-normal">艾草精油雾化入肺，帮助清理呼吸道浊气，缓解嗓子不适。</p>
            </div>
            <div className="flex flex-col p-3 rounded-lg border border-primary/10 bg-background-light">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Star size={16} />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">提神醒脑</h3>
              </div>
              <p className="text-[11px] text-slate-600 leading-normal">草本香气醇厚，入口清凉，能有效缓解疲劳，平复情绪。</p>
            </div>
          </div>
        </section>

        <section className="px-4 py-6 bg-white/50 border-t border-primary/10">
          <div className="flex items-center justify-center mb-6">
            <span className="h-px w-6 bg-primary/20"></span>
            <h2 className="mx-3 text-sm font-bold text-primary tracking-widest">品鉴指南</h2>
            <span className="h-px w-6 bg-primary/20"></span>
          </div>
          <div className="space-y-6">
            <div className="flex gap-4 items-center">
              <div className="w-1/2 rounded-lg overflow-hidden border border-primary/10 shadow-sm aspect-[4/3] shrink-0">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAN6YF4FkcVRq3oeQRMBoV-iUZRRTBlPqEygWPQWO9-0J6xcrE7FJvLNvmdvCbwehpVUV9i8KP2E1F2hSyy9kQESaJ1qtV3JE_6qE85tLm7f4OANhd9gTeGKXsaenQZDG-Jl79Y3ZUsand1OIG_AI4xMkV-2V9tXdHQmhaZ6ayDfghF6ds9vhPqu2UMkO5H3HapsNRs0VjACwZ1klPjb2B2a52tH5UjkbhtPmLKU7qDjLaEPpvEbOaavg7jc2dcjb6aZHcDe5tbx_BB" alt="Guide 1" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-primary font-bold text-lg">01</span>
                  <h4 className="text-sm font-bold text-slate-800">点燃品吸</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">像传统香烟一样点燃前端，轻吸一口，感受草本香气。</p>
              </div>
            </div>
            <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 relative mx-2">
              <h3 className="text-xs font-bold text-primary mb-1">温馨提示</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                本品非烟草制品，不含尼古丁与焦油。初次尝试者建议小口慢吸。
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* 规格选择弹窗 */}
      <AnimatePresence>
        {showSpecModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSpecModal(false)} className="fixed inset-0 bg-black/40 z-[80]" />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[80] max-w-md mx-auto">
              <div className="flex gap-4 p-5 border-b border-primary/10">
                <img src={product.image} className="w-20 h-20 rounded-xl object-cover border border-primary/10" alt={product.name} referrerPolicy="no-referrer" />
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{product.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-xs text-primary font-bold">RM</span>
                    <span className="text-2xl font-bold text-primary">{displayPrice}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">已选：{selectedSpec.label}</p>
                </div>
                <button onClick={() => setShowSpecModal(false)} className="self-start text-slate-400"><Plus size={22} className="rotate-45" /></button>
              </div>
              <div className="p-5">
                <h4 className="text-sm font-bold text-slate-900 mb-3">选择规格</h4>
                <div className="flex flex-wrap gap-2">
                  {specs.map((spec, i) => (
                    <button key={i} onClick={() => setSelectedSpecIndex(i)} className={`px-4 py-2.5 rounded-lg border-2 text-sm transition-all ${selectedSpecIndex === i ? 'border-primary bg-primary/5 text-primary font-bold' : 'border-slate-200 text-slate-600 hover:border-primary/30'}`}>
                      <span className="block">{spec.label}</span>
                      <span className={`text-xs mt-0.5 block ${selectedSpecIndex === i ? 'text-primary' : 'text-slate-400'}`}>RM{spec.price}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="px-5 pb-3 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">购买数量</span>
                <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center text-slate-400"><Minus size={14} /></button>
                  <span className="w-8 text-center text-sm font-bold text-slate-900">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="w-8 h-8 flex items-center justify-center text-slate-400"><Plus size={14} /></button>
                </div>
              </div>
              <div className="p-5 pt-2 flex gap-3 pb-8">
                <button onClick={() => { handleAddToCart(); setShowSpecModal(false); }} className="flex-1 py-3 rounded-full border-2 border-primary text-primary font-bold text-sm active:scale-95 transition-transform">加入购物车</button>
                <button onClick={() => { handleBuyNow(); setShowSpecModal(false); }} className="flex-1 py-3 rounded-full bg-gradient-to-r from-[#B8860B] to-[#D4A017] text-white font-bold text-sm shadow-lg shadow-primary/30 active:scale-95 transition-transform">立即购买</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <nav className="fixed bottom-0 left-0 right-0 bg-background-light/90 backdrop-blur-xl border-t border-primary/10 px-4 py-2 pb-8 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-between h-14">
          <div className="flex gap-6 mr-6 pl-2">
            <button onClick={onCustomerService} className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-primary transition-colors">
              <Headset size={22} />
              <span className="text-[10px] font-medium">客服</span>
            </button>
            <button onClick={onGoToCart} className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-primary transition-colors relative">
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 min-w-[16px] h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center px-1 font-bold">{cartCount > 99 ? '99+' : cartCount}</span>
              )}
              <ShoppingBag size={22} />
              <span className="text-[10px] font-medium">购物车</span>
            </button>
          </div>
          <div className="flex flex-1 gap-3 h-10">
            <button
              onClick={handleAddToCart}
              className="flex-1 rounded-full border border-primary text-primary font-bold text-sm active:scale-95 transition-transform"
            >
              加入购物车
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 rounded-full bg-gradient-to-r from-[#B8860B] to-[#D4A017] text-white font-bold text-sm shadow-lg shadow-primary/30 active:scale-95 transition-transform"
            >
              立即购买
            </button>
          </div>
        </div>
      </nav>

    </motion.div>
  );
};

const SearchScreen = ({ onProductClick, onBack, products }: { onProductClick: (p: Product) => void, onBack: () => void, products: Product[], key?: string }) => {
  const [query, setQuery] = useState('');
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-background-light rice-paper">
      <header className="sticky top-0 z-50 flex items-center bg-background-light/95 backdrop-blur-sm px-4 py-3 border-b border-primary/10">
        <button onClick={onBack} className="mr-3 text-slate-800"><ArrowLeft size={24} /></button>
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50" />
          <input
            autoFocus
            className="w-full bg-white/50 border border-primary/10 rounded-full py-1.5 pl-9 pr-4 text-sm text-slate-700 focus:outline-none focus:border-primary/50"
            placeholder="搜索艾烟产品"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </header>
      <main className="p-4">
        {query && (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map(product => (
              <div key={product.id} onClick={() => onProductClick(product)} className="bg-white border border-primary/10 rounded-xl overflow-hidden shadow-sm active:scale-95 transition-transform">
                <img className="w-full aspect-square object-cover" src={product.image} alt={product.name} referrerPolicy="no-referrer" />
                <div className="p-3">
                  <h3 className="text-slate-800 text-sm font-bold truncate">{product.name}</h3>
                  <p className="text-primary font-bold mt-1">RM{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {!query && <div className="text-center text-slate-400 mt-20">输入关键词开始搜索</div>}
        {query && filteredProducts.length === 0 && <div className="text-center text-slate-400 mt-20">未找到相关产品</div>}
      </main>
    </motion.div>
  );
};

const CheckoutScreen = ({ items, onConfirm, onBack }: {
  items: any[],
  onConfirm: (total: number, paymentMethod: string, address: any) => void,
  onBack: () => void,
  key?: string
}) => {
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [selectedCoupon, setSelectedCoupon] = useState<string | null>(null);
  const [deliveryTime, setDeliveryTime] = useState('不限时间');
  const [remark, setRemark] = useState('');
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showAddressPicker, setShowAddressPicker] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addrForm, setAddrForm] = useState({ name: '', phone: '', state: '', city: '', postcode: '', detail: '', isDefault: false });

  // NOTE: 加载用户地址列表
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [addressLoading, setAddressLoading] = useState(true);
  useEffect(() => {
    addressApi.getAll().then(data => {
      const list = data || [];
      setAddresses(list);
      // 默认选中默认地址，如果没有则选第一个
      const defaultAddr = list.find((a: any) => a.is_default) || list[0] || null;
      setSelectedAddress(defaultAddr);
    }).catch(() => { }).finally(() => setAddressLoading(false));
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal > 199 ? 0 : 12;
  const discount = selectedCoupon === 'NEWUSER' ? 20 : (selectedCoupon === 'FREESHIP' ? 0 : 0);
  const total = subtotal + shippingFee - discount;

  const paymentMethods = [
    { id: 'cod', name: '货到付款（现金支付）', icon: Banknote, color: 'text-green-600', desc: '送货上门时现金支付' },
    { id: 'bank', name: '银行卡支付', icon: CreditCard, color: 'text-blue-500', desc: '在线银行卡直接付款' },
  ];

  // NOTE: 从后端加载用户实际持有的优惠券
  const [coupons, setCoupons] = useState<any[]>([]);
  useEffect(() => {
    couponApi.getMine().then(data => {
      const mapped = (data || []).map((item: any) => ({
        id: item.coupon?.id || item.id,
        name: item.coupon?.name || '',
        value: item.coupon?.value || 0,
        desc: item.coupon?.description || '',
        expiry: item.coupon?.expiry || '',
        used: item.used,
      })).filter((c: any) => !c.used);
      setCoupons(mapped);
    }).catch(() => { });
  }, []);

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[60] bg-background-light flex flex-col"
    >
      <header className="shrink-0 flex items-center bg-background-light/95 px-4 py-4 border-b border-primary/10">
        <button onClick={onBack} className="mr-3 text-slate-800"><ArrowLeft size={24} /></button>
        <h1 className="text-lg font-bold">确认订单</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-32 no-scrollbar">
        {/* Address Section */}
        <div onClick={() => setShowAddressPicker(true)} className="bg-white p-4 rounded-xl border border-primary/10 shadow-sm flex items-center gap-4 cursor-pointer active:bg-primary/5 transition-colors">
          <div className="bg-primary/10 p-2 rounded-full text-primary">
            <MapPin size={20} />
          </div>
          {addressLoading ? (
            <div className="flex-1 text-sm text-slate-400">加载地址中...</div>
          ) : selectedAddress ? (
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-slate-900">{selectedAddress.name}</span>
                <span className="text-slate-500 text-sm">{selectedAddress.phone}</span>
                {selectedAddress.is_default && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-bold">默认</span>}
              </div>
              <p className="text-xs text-slate-600">{selectedAddress.state}, {selectedAddress.city} {selectedAddress.postcode}</p>
              <p className="text-xs text-slate-500 mt-0.5">{selectedAddress.detail}</p>
            </div>
          ) : (
            <div className="flex-1">
              <p className="text-sm text-red-400 font-medium">请添加收货地址</p>
              <p className="text-[11px] text-slate-400 mt-0.5">点击添加您的收货地址</p>
            </div>
          )}
          <ChevronRight size={18} className="text-slate-300" />
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-xl border border-primary/10 shadow-sm overflow-hidden">
          <div className="p-3 border-b border-primary/5 bg-primary/5">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <ShoppingBag size={16} className="text-primary" />
              商品清单
            </h3>
          </div>
          <div className="divide-y divide-primary/5">
            {items.map(item => (
              <div key={item.id} className="p-4 flex gap-4">
                <img src={item.image} className="size-16 rounded-lg object-cover border border-primary/10" alt={item.name} referrerPolicy="no-referrer" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-slate-900 line-clamp-1">{item.name}</h4>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-primary font-bold">RM{item.price}</span>
                    <span className="text-xs text-slate-400">x{item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coupon Section */}
        <div className="bg-white p-4 rounded-xl border border-primary/10 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket size={18} className="text-primary" />
            <span className="text-sm font-medium text-slate-800">优惠券</span>
          </div>
          <button
            onClick={() => setShowCouponModal(true)}
            className="text-xs flex items-center gap-1 text-slate-400"
          >
            {selectedCoupon ? (
              <span className="text-primary font-bold">
                {coupons.find(c => c.id === selectedCoupon)?.name} -RM{discount.toFixed(2)}
              </span>
            ) : (
              <>选择优惠券 <ChevronRight size={14} /></>
            )}
          </button>
        </div>

        {/* Delivery & Remarks Section */}
        <div className="bg-white rounded-xl border border-primary/10 shadow-sm overflow-hidden divide-y divide-primary/5">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck size={18} className="text-primary" />
              <span className="text-sm font-medium text-slate-800">配送时间</span>
            </div>
            <select
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)}
              className="text-xs text-slate-600 bg-transparent border-none focus:ring-0 text-right pr-0"
            >
              <option value="不限时间">不限时间</option>
              <option value="仅工作日">仅工作日</option>
              <option value="仅周末">仅周末</option>
            </select>
          </div>
          <div className="p-4 flex items-center gap-3">
            <MessageSquare size={18} className="text-primary shrink-0" />
            <input
              type="text"
              placeholder="订单备注 (选填)"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="flex-1 text-sm bg-transparent border-none focus:ring-0 p-0 placeholder:text-slate-300"
            />
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="bg-white rounded-xl border border-primary/10 shadow-sm overflow-hidden">
          <div className="p-3 border-b border-primary/5 bg-primary/5">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <CreditCard size={16} className="text-primary" />
              支付方式
            </h3>
          </div>
          <div className="divide-y divide-primary/5">
            {paymentMethods.map(method => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className="w-full p-4 flex items-center justify-between active:bg-primary/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <method.icon size={20} className={method.color} />
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-slate-800">{method.name}</span>
                    <span className="text-[10px] text-slate-400">{method.desc}</span>
                  </div>
                </div>
                <div className={`size-5 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === method.id ? 'border-primary bg-primary' : 'border-slate-200'}`}>
                  {paymentMethod === method.id && <div className="size-2 bg-white rounded-full"></div>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-white p-4 rounded-xl border border-primary/10 shadow-sm space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">商品总额</span>
            <span className="text-slate-900 font-medium">RM{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">运费</span>
            <span className="text-slate-900 font-medium">
              {shippingFee === 0 ? <span className="text-green-500">免运费</span> : `RM${shippingFee.toFixed(2)}`}
            </span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">优惠减免</span>
              <span className="text-primary font-medium">-RM{discount.toFixed(2)}</span>
            </div>
          )}
          <div className="pt-3 border-t border-primary/5 flex justify-between items-center">
            <span className="font-bold text-slate-900">实付款</span>
            <span className="text-xl font-bold text-primary tracking-tight">RM{total.toFixed(2)}</span>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-primary/10 px-4 py-4 z-50 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">合计</span>
              <span className="text-xl font-bold text-primary tracking-tight">RM{total.toFixed(2)}</span>
            </div>
            <span className="text-[10px] text-slate-400">含运费 RM{shippingFee.toFixed(2)}</span>
          </div>
          <button
            onClick={() => {
              if (!selectedAddress) {
                alert('请先添加收货地址');
                return;
              }
              onConfirm(total, paymentMethod, selectedAddress);
            }}
            className="flex-1 bg-primary text-white py-3.5 rounded-full font-bold shadow-lg shadow-primary/30 active:scale-95 transition-transform tracking-wider flex items-center justify-center gap-2"
          >
            {paymentMethod === 'cod' ? (
              <><Banknote size={20} />确认下单（货到付款）</>
            ) : (
              <><CreditCard size={20} />立即支付</>
            )}
          </button>
        </div>
      </div>

      {/* Coupon Modal */}
      <AnimatePresence>
        {showCouponModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCouponModal(false)}
              className="fixed inset-0 bg-black/40 z-[70] backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[80] p-6 max-w-md mx-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">选择优惠券</h3>
                <button onClick={() => setShowCouponModal(false)} className="text-slate-400"><Plus size={24} className="rotate-45" /></button>
              </div>
              <div className="space-y-3 max-h-[40vh] overflow-y-auto no-scrollbar pb-4">
                {coupons.map(coupon => (
                  <button
                    key={coupon.id}
                    onClick={() => {
                      setSelectedCoupon(selectedCoupon === coupon.id ? null : coupon.id);
                      setShowCouponModal(false);
                    }}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${selectedCoupon === coupon.id ? 'border-primary bg-primary/5' : 'border-primary/10 hover:border-primary/30'}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-900">{coupon.name}</span>
                      <span className="text-primary font-bold">RM{coupon.value}</span>
                    </div>
                    <p className="text-xs text-slate-500">{coupon.desc} | 有效期至 {coupon.expiry}</p>
                  </button>
                ))}
                <button
                  onClick={() => {
                    setSelectedCoupon(null);
                    setShowCouponModal(false);
                  }}
                  className="w-full py-3 text-sm text-slate-500 font-medium"
                >
                  不使用优惠券
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 地址选择/新增弹窗 */}
      <AnimatePresence>
        {showAddressPicker && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setShowAddressPicker(false); setShowAddForm(false); }} className="fixed inset-0 bg-black/40 z-[80]" />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[80] max-w-md mx-auto max-h-[85vh] flex flex-col">
              <div className="p-5 border-b border-primary/10 flex justify-between items-center shrink-0">
                <h3 className="text-lg font-bold text-slate-900">{showAddForm ? '新增地址' : '选择收货地址'}</h3>
                <button onClick={() => { setShowAddressPicker(false); setShowAddForm(false); }} className="text-slate-400"><Plus size={22} className="rotate-45" /></button>
              </div>

              {!showAddForm ? (
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {addresses.length === 0 ? (
                    <div className="text-center py-10">
                      <MapPin size={40} className="text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-400 mb-3">暂无收货地址</p>
                    </div>
                  ) : addresses.map(addr => (
                    <button
                      key={addr.id}
                      onClick={() => { setSelectedAddress(addr); setShowAddressPicker(false); }}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selectedAddress?.id === addr.id ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-primary/30'}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900 text-sm">{addr.name}</span>
                        <span className="text-slate-500 text-xs">{addr.phone}</span>
                        {addr.is_default && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-bold">默认</span>}
                      </div>
                      <p className="text-xs text-slate-600">{addr.state}, {addr.city} {addr.postcode}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{addr.detail}</p>
                    </button>
                  ))}
                  <button onClick={() => setShowAddForm(true)} className="w-full py-3 border-2 border-dashed border-primary/30 rounded-xl text-primary font-bold text-sm hover:bg-primary/5 transition-colors flex items-center justify-center gap-2">
                    <Plus size={16} /> 添加新地址
                  </button>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">收件人姓名</label>
                    <input value={addrForm.name} onChange={e => setAddrForm(f => ({ ...f, name: e.target.value }))} placeholder="请输入姓名" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">手机号码</label>
                    <input value={addrForm.phone} onChange={e => setAddrForm(f => ({ ...f, phone: e.target.value }))} placeholder="请输入手机号码" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">州属 (State)</label>
                    <select value={addrForm.state} onChange={e => setAddrForm(f => ({ ...f, state: e.target.value }))} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary bg-white">
                      <option value="">请选择州属</option>
                      {MALAYSIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">城市 (City)</label>
                      <input value={addrForm.city} onChange={e => setAddrForm(f => ({ ...f, city: e.target.value }))} placeholder="如 Petaling Jaya" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">邮编 (Postcode)</label>
                      <input value={addrForm.postcode} onChange={e => setAddrForm(f => ({ ...f, postcode: e.target.value }))} placeholder="如 47301" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">详细地址</label>
                    <textarea value={addrForm.detail} onChange={e => setAddrForm(f => ({ ...f, detail: e.target.value }))} placeholder="街道、门牌号、小区、楼层等" rows={2} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary resize-none" />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={addrForm.isDefault} onChange={e => setAddrForm(f => ({ ...f, isDefault: e.target.checked }))} className="size-4 rounded border-slate-300 text-primary focus:ring-0" />
                    <span className="text-sm text-slate-700">设为默认地址</span>
                  </label>
                  <div className="flex gap-3 pt-2 pb-4">
                    <button onClick={() => setShowAddForm(false)} className="flex-1 py-3 rounded-full border border-slate-200 text-slate-600 font-bold text-sm">返回列表</button>
                    <button
                      onClick={async () => {
                        if (!addrForm.name || !addrForm.phone || !addrForm.state || !addrForm.city || !addrForm.postcode || !addrForm.detail) return;
                        try {
                          await addressApi.add(addrForm);
                          const data = await addressApi.getAll();
                          const list = data || [];
                          setAddresses(list);
                          const newDefault = list.find((a: any) => a.is_default) || list[list.length - 1];
                          setSelectedAddress(newDefault);
                          setAddrForm({ name: '', phone: '', state: '', city: '', postcode: '', detail: '', isDefault: false });
                          setShowAddForm(false);
                          setShowAddressPicker(false);
                        } catch (err) { console.error(err); }
                      }}
                      disabled={!addrForm.name || !addrForm.phone || !addrForm.state || !addrForm.city || !addrForm.postcode || !addrForm.detail}
                      className="flex-1 py-3 rounded-full bg-gradient-to-r from-[#B8860B] to-[#D4A017] text-white font-bold text-sm disabled:opacity-50 active:scale-95 transition-transform"
                    >
                      保存地址
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const NotificationsScreen = ({ notifications, onNotificationClick, onBack }: { notifications: Notification[], onNotificationClick: (n: Notification) => void, onBack: () => void, key?: string }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-background-light rice-paper">
      <header className="sticky top-0 z-50 flex items-center bg-background-light/95 backdrop-blur-sm px-4 py-3 border-b border-primary/10">
        <button onClick={onBack} className="mr-3 text-slate-800"><ArrowLeft size={24} /></button>
        <h1 className="text-lg font-bold">消息通知</h1>
      </header>
      <main className="p-4 space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center text-slate-400 mt-20">暂无消息</div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              onClick={() => onNotificationClick(n)}
              className={`bg-white p-4 rounded-xl border border-primary/10 shadow-sm active:bg-primary/5 transition-colors cursor-pointer relative ${!n.read ? 'border-primary/30' : ''}`}
            >
              {!n.read && (
                <span className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
              <div className="flex justify-between items-start mb-1">
                <h3 className={`font-bold ${!n.read ? 'text-primary' : 'text-slate-900'}`}>{n.title}</h3>
                <span className="text-[10px] text-slate-400">{n.time}</span>
              </div>
              <p className="text-sm text-slate-600">{n.content}</p>
            </div>
          ))
        )}
      </main>
    </motion.div>
  );
};

const CouponsScreen = ({ onBack }: { onBack: () => void, key?: string }) => {
  // NOTE: 从后端加载用户实际持有的优惠券
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    couponApi.getMine().then(data => {
      const mapped = (data || []).map((item: any) => ({
        id: item.coupon?.id || item.id,
        name: item.coupon?.name || '',
        value: item.coupon?.value || 0,
        desc: item.coupon?.description || '',
        expiry: item.coupon?.expiry || '',
        used: item.used,
      }));
      setCoupons(mapped);
    }).catch(() => { }).finally(() => setLoading(false));
  }, []);

  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed inset-0 z-[60] bg-background-light rice-paper flex flex-col">
      <header className="shrink-0 flex items-center bg-background-light/95 px-4 py-4 border-b border-primary/10">
        <button onClick={onBack} className="mr-3 text-slate-800"><ArrowLeft size={24} /></button>
        <h1 className="text-lg font-bold">我的优惠券</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {loading ? (
          <div className="text-center py-12 text-slate-400 text-sm">加载中...</div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">暂无优惠券</div>
        ) : coupons.map(coupon => (
          <div key={coupon.id} className="bg-white rounded-xl border border-primary/10 shadow-sm flex overflow-hidden">
            <div className="w-24 bg-primary flex flex-col items-center justify-center text-white p-2">
              <span className="text-xs">RM</span>
              <span className="text-2xl font-bold">{coupon.value}</span>
            </div>
            <div className="flex-1 p-4">
              <h3 className="font-bold text-slate-900">{coupon.name}</h3>
              <p className="text-xs text-slate-500 mt-1">{coupon.desc}</p>
              <p className="text-[10px] text-slate-400 mt-2">有效期至: {coupon.expiry}</p>
            </div>
          </div>
        ))}
      </main>
    </motion.div>
  );
};

const FootprintsScreen = ({ onBack, onProductClick, products }: { onBack: () => void, onProductClick: (p: Product) => void, products: Product[], key?: string }) => {
  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed inset-0 z-[60] bg-background-light rice-paper flex flex-col">
      <header className="shrink-0 flex items-center bg-background-light/95 px-4 py-4 border-b border-primary/10">
        <button onClick={onBack} className="mr-3 text-slate-800"><ArrowLeft size={24} /></button>
        <h1 className="text-lg font-bold">我的足迹</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-4 no-scrollbar">
        <div className="grid grid-cols-2 gap-4">
          {products.map(product => (
            <div key={product.id} onClick={() => onProductClick(product)} className="bg-white rounded-xl border border-primary/10 shadow-sm overflow-hidden active:scale-95 transition-transform">
              <img src={product.image} className="w-full aspect-square object-cover" alt={product.name} referrerPolicy="no-referrer" />
              <div className="p-3">
                <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{product.name}</h3>
                <p className="text-primary font-bold text-sm mt-1">RM{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </motion.div>
  );
};

const FavoritesScreen = ({ onBack, onProductClick, favoriteProducts, onRemoveFavorite }: { onBack: () => void, onProductClick: (p: Product) => void, favoriteProducts: Product[], onRemoveFavorite: (p: Product) => void, key?: string }) => {
  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed inset-0 z-[60] bg-background-light rice-paper flex flex-col">
      <header className="shrink-0 flex items-center justify-between bg-white px-4 py-4 border-b border-primary/10">
        <div className="flex items-center">
          <button onClick={onBack} className="mr-3 text-slate-800"><ArrowLeft size={24} /></button>
          <h1 className="text-lg font-bold">我的收藏</h1>
        </div>
        <span className="text-xs text-slate-400">{favoriteProducts.length} 件商品</span>
      </header>
      <main className="flex-1 overflow-y-auto p-4 no-scrollbar">
        {favoriteProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Heart size={48} className="text-slate-200 mb-4" />
            <p className="text-slate-400 text-sm">还没有收藏商品</p>
            <p className="text-slate-300 text-xs mt-1">浏览商品时点击❤️即可收藏</p>
          </div>
        ) : (
          <div className="space-y-4">
            {favoriteProducts.map(product => (
              <div key={product.id} className="bg-white rounded-xl border border-primary/10 shadow-sm p-3 flex gap-4 active:bg-primary/5 transition-colors">
                <img
                  src={product.image}
                  className="size-20 rounded-lg object-cover cursor-pointer"
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  onClick={() => onProductClick(product)}
                />
                <div className="flex-1 flex flex-col justify-between" onClick={() => onProductClick(product)}>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{product.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{product.description}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-bold">RM{product.price}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); onRemoveFavorite(product); }}
                      className="text-xs text-red-400 border border-red-200 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                    >
                      取消收藏
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </motion.div>
  );
};

const SettingsScreen = ({
  onBack,
  onProfile,
  onSecurity,
  onLogout
}: {
  onBack: () => void,
  onProfile: () => void,
  onSecurity: () => void,
  onLogout: () => void,
  key?: string
}) => {
  const items = [
    { label: '个人资料', onClick: onProfile },
    { label: '账号安全', onClick: onSecurity },
  ];
  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed inset-0 z-[60] bg-background-light rice-paper flex flex-col">
      <header className="shrink-0 flex items-center bg-white px-4 py-4 border-b border-primary/10">
        <button onClick={onBack} className="mr-3 text-slate-800"><ArrowLeft size={24} /></button>
        <h1 className="text-lg font-bold">设置</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        <div className="bg-white rounded-xl border border-primary/10 shadow-sm overflow-hidden divide-y divide-primary/5">
          {items.map((item, i) => (
            <button key={i} onClick={item.onClick} className="w-full flex items-center justify-between p-4 hover:bg-primary/5 transition-colors">
              <span className="text-sm text-slate-800">{item.label}</span>
              <ChevronRight size={18} className="text-slate-300" />
            </button>
          ))}
        </div>
        <button
          onClick={onLogout}
          className="w-full bg-white text-red-500 font-bold py-4 rounded-xl border border-red-100 shadow-sm active:bg-red-50 transition-colors"
        >
          退出登录
        </button>
      </main>
    </motion.div>
  );
};

const SettingsProfileScreen = ({ onBack, userProfile, onSave }: { onBack: () => void, userProfile: any, onSave: (data: any) => Promise<void>, key?: string }) => {
  const [nickname, setNickname] = useState(userProfile?.nickname || '');
  const [gender, setGender] = useState(userProfile?.gender || '');
  const [birthday, setBirthday] = useState(userProfile?.birthday || '');
  const [signature, setSignature] = useState(userProfile?.signature || '');
  const [avatarUrl, setAvatarUrl] = useState(userProfile?.avatar_url || '');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setLocalToast] = useState('');

  const avatarDisplay = avatarUrl || 'https://res.cloudinary.com/dmdjliyio/image/upload/v1772517580/%E8%81%9A%E7%A5%9E%E7%81%B8logo-Photoroom_hzgbyt.png';

  /**
   * 处理头像 URL 输入
   * NOTE: 简化方案，后续可替换为文件上传到 Supabase Storage
   */
  const handleAvatarChange = () => {
    const url = prompt('请输入头像图片 URL：', avatarUrl);
    if (url !== null) {
      setAvatarUrl(url);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        nickname: nickname || '新用户',
        gender,
        birthday: birthday || null,
        signature,
        avatar_url: avatarUrl || null,
      });
      setLocalToast('保存成功');
      setTimeout(() => { setLocalToast(''); onBack(); }, 1000);
    } catch (err: any) {
      setLocalToast(err.message || '保存失败');
      setTimeout(() => setLocalToast(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed inset-0 z-[70] bg-background-light rice-paper flex flex-col">
      <header className="shrink-0 flex items-center justify-between bg-white px-4 py-4 border-b border-primary/10">
        <div className="flex items-center">
          <button onClick={onBack} className="mr-3 text-slate-800"><ArrowLeft size={24} /></button>
          <h1 className="text-lg font-bold">个人资料</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${isSaving ? 'bg-slate-200 text-slate-400' : 'bg-primary text-white active:scale-95'}`}
        >
          {isSaving ? '保存中...' : '保存'}
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {/* Toast */}
        {toast && (
          <div className={`px-4 py-3 rounded-xl text-sm text-center font-medium ${toast.includes('成功') ? 'bg-green-50 border border-green-200 text-green-600' : 'bg-red-50 border border-red-200 text-red-600'}`}>
            {toast}
          </div>
        )}

        {/* 头像 */}
        <div className="bg-white rounded-xl border border-primary/10 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500 font-medium">头像</span>
            <button onClick={handleAvatarChange} className="flex items-center gap-3 group">
              <div className="relative">
                <img
                  src={avatarDisplay}
                  className="size-16 rounded-full object-cover border-2 border-primary/20"
                  alt="头像"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={16} className="text-white" />
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </button>
          </div>
        </div>

        {/* 昵称 */}
        <div className="bg-white rounded-xl border border-primary/10 shadow-sm overflow-hidden">
          <div className="p-4">
            <label className="text-sm text-slate-500 font-medium block mb-2">昵称</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="请输入昵称"
              maxLength={20}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors"
            />
            <p className="text-[10px] text-slate-300 mt-1 text-right">{nickname.length}/20</p>
          </div>
        </div>

        {/* 性别 */}
        <div className="bg-white rounded-xl border border-primary/10 shadow-sm overflow-hidden">
          <div className="p-4">
            <label className="text-sm text-slate-500 font-medium block mb-3">性别</label>
            <div className="flex gap-3">
              {['男', '女', '保密'].map(g => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${gender === g
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-primary/30'
                    }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 生日 */}
        <div className="bg-white rounded-xl border border-primary/10 shadow-sm overflow-hidden">
          <div className="p-4">
            <label className="text-sm text-slate-500 font-medium block mb-2">生日</label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors"
            />
          </div>
        </div>

        {/* 个性签名 */}
        <div className="bg-white rounded-xl border border-primary/10 shadow-sm overflow-hidden">
          <div className="p-4">
            <label className="text-sm text-slate-500 font-medium block mb-2">个性签名</label>
            <textarea
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="写一句话介绍自己吧~"
              maxLength={100}
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors resize-none"
            />
            <p className="text-[10px] text-slate-300 mt-1 text-right">{signature.length}/100</p>
          </div>
        </div>
      </main>
    </motion.div>
  );
};

const SettingsSecurityScreen = ({ onBack, userEmail, onLogout }: { onBack: () => void, userEmail: string, onLogout: () => void, key?: string }) => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setLocalToast] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword) { setLocalToast('请输入当前密码'); return; }
    if (!newPassword || newPassword.length < 6) { setLocalToast('新密码长度不能少于 6 位'); return; }
    if (newPassword !== confirmPassword) { setLocalToast('两次输入的新密码不一致'); return; }

    setIsLoading(true);
    try {
      await authApi.changePassword(currentPassword, newPassword);
      setLocalToast('密码修改成功');
      setShowPasswordForm(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setLocalToast(err.message || '密码修改失败');
    } finally {
      setIsLoading(false);
      setTimeout(() => setLocalToast(''), 3000);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) { setLocalToast('请输入密码确认注销'); return; }

    setIsLoading(true);
    try {
      await authApi.deleteAccount(deletePassword);
      setLocalToast('账号已注销');
      setTimeout(() => onLogout(), 1000);
    } catch (err: any) {
      setLocalToast(err.message || '注销失败');
      setTimeout(() => setLocalToast(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed inset-0 z-[70] bg-background-light rice-paper flex flex-col">
      <header className="shrink-0 flex items-center bg-white px-4 py-4 border-b border-primary/10">
        <button onClick={onBack} className="mr-3 text-slate-800"><ArrowLeft size={24} /></button>
        <h1 className="text-lg font-bold">账号安全</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {/* Toast */}
        {toast && (
          <div className={`px-4 py-3 rounded-xl text-sm text-center font-medium ${toast.includes('成功') || toast.includes('已注销') ? 'bg-green-50 border border-green-200 text-green-600' : 'bg-red-50 border border-red-200 text-red-600'}`}>
            {toast}
          </div>
        )}

        {/* 邮箱 */}
        <div className="bg-white rounded-xl border border-primary/10 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-4">
            <span className="text-sm text-slate-500 font-medium">绑定邮箱</span>
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-primary/60" />
              <span className="text-sm text-slate-800 font-medium">{userEmail || '未绑定'}</span>
            </div>
          </div>
        </div>

        {/* 修改密码 */}
        <div className="bg-white rounded-xl border border-primary/10 shadow-sm overflow-hidden">
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="w-full flex items-center justify-between p-4 hover:bg-primary/5 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Lock size={16} className="text-primary" />
              <span className="text-sm text-slate-800 font-medium">修改密码</span>
            </div>
            <ChevronRight size={16} className={`text-slate-300 transition-transform ${showPasswordForm ? 'rotate-90' : ''}`} />
          </button>

          {showPasswordForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="px-4 pb-4 space-y-3 border-t border-primary/5"
            >
              <div className="pt-3">
                <label className="text-xs text-slate-400 block mb-1">当前密码</label>
                <div className="relative">
                  <input
                    type={showCurrentPw ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="请输入当前密码"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 pr-10 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  />
                  <button onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">新密码</label>
                <div className="relative">
                  <input
                    type={showNewPw ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="请输入新密码（至少 6 位）"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 pr-10 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  />
                  <button onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">确认新密码</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="请再次输入新密码"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                />
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-[10px] text-red-400 mt-1">两次输入的密码不一致</p>
                )}
              </div>
              <button
                onClick={handleChangePassword}
                disabled={isLoading}
                className={`w-full py-2.5 rounded-lg text-sm font-bold transition-colors ${isLoading ? 'bg-slate-200 text-slate-400' : 'bg-primary text-white active:scale-[0.98]'}`}
              >
                {isLoading ? '修改中...' : '确认修改'}
              </button>
            </motion.div>
          )}
        </div>

        {/* 注销账号 */}
        <div className="bg-white rounded-xl border border-red-100 shadow-sm overflow-hidden">
          <button
            onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
            className="w-full flex items-center justify-between p-4 hover:bg-red-50/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <X size={16} className="text-red-400" />
              <span className="text-sm text-red-500 font-medium">注销账号</span>
            </div>
            <ChevronRight size={16} className={`text-slate-300 transition-transform ${showDeleteConfirm ? 'rotate-90' : ''}`} />
          </button>

          {showDeleteConfirm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="px-4 pb-4 space-y-3 border-t border-red-100"
            >
              <div className="pt-3 bg-red-50 p-3 rounded-lg">
                <p className="text-xs text-red-500 font-medium mb-1">⚠️ 注意：此操作不可撤销！</p>
                <p className="text-[11px] text-red-400 leading-relaxed">注销后将永久删除您的账号及所有相关数据，包括订单记录、收藏、购物车等。</p>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">请输入密码确认注销</label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="请输入账号密码"
                  className="w-full bg-slate-50 border border-red-200 rounded-lg px-3 py-2.5 text-sm focus:ring-1 focus:ring-red-300 focus:border-red-300 outline-none"
                />
              </div>
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading || !deletePassword}
                className={`w-full py-2.5 rounded-lg text-sm font-bold transition-colors ${isLoading || !deletePassword ? 'bg-slate-200 text-slate-400' : 'bg-red-500 text-white active:scale-[0.98]'}`}
              >
                {isLoading ? '处理中...' : '确认注销账号'}
              </button>
            </motion.div>
          )}
        </div>
      </main>
    </motion.div>
  );
};


// NOTE: 马来西亚州属列表
const MALAYSIA_STATES = [
  'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan',
  'Pahang', 'Perak', 'Perlis', 'Pulau Pinang', 'Sabah',
  'Sarawak', 'Selangor', 'Terengganu',
  'W.P. Kuala Lumpur', 'W.P. Putrajaya', 'W.P. Labuan',
];

const AddressScreen = ({ onBack }: { onBack: () => void, key?: string }) => {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', state: '', city: '', postcode: '', detail: '', isDefault: false });
  const [saving, setSaving] = useState(false);

  const loadAddresses = () => {
    addressApi.getAll().then(data => setAddresses(data || [])).catch(() => { }).finally(() => setLoading(false));
  };
  useEffect(() => { loadAddresses(); }, []);

  const resetForm = () => {
    setForm({ name: '', phone: '', state: '', city: '', postcode: '', detail: '', isDefault: false });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (addr: any) => {
    setForm({ name: addr.name, phone: addr.phone, state: addr.state, city: addr.city, postcode: addr.postcode, detail: addr.detail, isDefault: addr.is_default });
    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.phone || !form.state || !form.city || !form.postcode || !form.detail) return;
    setSaving(true);
    try {
      if (editingId) {
        await addressApi.update(editingId, form);
      } else {
        await addressApi.add(form);
      }
      resetForm();
      loadAddresses();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除该地址？')) return;
    await addressApi.remove(id);
    loadAddresses();
  };

  const handleSetDefault = async (id: string) => {
    await addressApi.update(id, { isDefault: true });
    loadAddresses();
  };

  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed inset-0 z-[60] bg-background-light rice-paper flex flex-col">
      <header className="shrink-0 flex items-center justify-between bg-white px-4 py-4 border-b border-primary/10">
        <div className="flex items-center">
          <button onClick={onBack} className="mr-3 text-slate-800"><ArrowLeft size={24} /></button>
          <h1 className="text-lg font-bold">收货地址</h1>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="text-primary text-sm font-bold">新增地址</button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
        {loading ? (
          <div className="text-center py-12 text-slate-400 text-sm">加载中...</div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-16">
            <MapPin size={48} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">暂无收货地址</p>
            <button onClick={() => setShowForm(true)} className="mt-4 px-6 py-2 bg-primary text-white rounded-full text-sm font-bold">添加地址</button>
          </div>
        ) : addresses.map(addr => (
          <div key={addr.id} className={`bg-white rounded-xl border-2 p-4 shadow-sm ${addr.is_default ? 'border-primary' : 'border-primary/10'}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-slate-900">{addr.name}</span>
                  <span className="text-slate-500 text-sm">{addr.phone}</span>
                  {addr.is_default && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">默认</span>}
                </div>
                <p className="text-xs text-slate-600">{addr.state}, {addr.city} {addr.postcode}</p>
                <p className="text-xs text-slate-500 mt-0.5">{addr.detail}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-primary/5">
              {!addr.is_default ? (
                <button onClick={() => handleSetDefault(addr.id)} className="text-xs text-slate-500 hover:text-primary">设为默认</button>
              ) : <span className="text-xs text-primary font-medium">默认地址</span>}
              <div className="flex gap-4">
                <button onClick={() => handleEdit(addr)} className="text-xs text-slate-500 hover:text-primary">编辑</button>
                <button onClick={() => handleDelete(addr.id)} className="text-xs text-red-400 hover:text-red-600">删除</button>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* 新增/编辑地址表单弹窗 */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={resetForm} className="fixed inset-0 bg-black/40 z-[80]" />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[80] max-w-md mx-auto max-h-[85vh] overflow-y-auto">
              <div className="p-5 border-b border-primary/10 flex justify-between items-center sticky top-0 bg-white rounded-t-3xl">
                <h3 className="text-lg font-bold text-slate-900">{editingId ? '编辑地址' : '新增地址'}</h3>
                <button onClick={resetForm} className="text-slate-400"><Plus size={22} className="rotate-45" /></button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">收件人姓名</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="请输入姓名" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">手机号码</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="请输入手机号码" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">州属 (State)</label>
                  <select value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary bg-white">
                    <option value="">请选择州属</option>
                    {MALAYSIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">城市 (City)</label>
                    <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="如 Petaling Jaya" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">邮编 (Postcode)</label>
                    <input value={form.postcode} onChange={e => setForm(f => ({ ...f, postcode: e.target.value }))} placeholder="如 47301" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">详细地址</label>
                  <textarea value={form.detail} onChange={e => setForm(f => ({ ...f, detail: e.target.value }))} placeholder="街道、门牌号、小区、楼层等" rows={2} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary resize-none" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isDefault} onChange={e => setForm(f => ({ ...f, isDefault: e.target.checked }))} className="size-4 rounded border-slate-300 text-primary focus:ring-0" />
                  <span className="text-sm text-slate-700">设为默认地址</span>
                </label>
              </div>
              <div className="p-5 pt-0 pb-8">
                <button onClick={handleSave} disabled={saving || !form.name || !form.phone || !form.state || !form.city || !form.postcode || !form.detail} className="w-full py-3 bg-gradient-to-r from-[#B8860B] to-[#D4A017] text-white font-bold rounded-full text-sm disabled:opacity-50 active:scale-95 transition-transform">
                  {saving ? '保存中...' : '保存地址'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const CustomerServiceScreen = ({ onBack }: { onBack: () => void, key?: string }) => {
  const [msg, setMsg] = useState('');
  const [chat, setChat] = useState([
    { type: 'bot', text: '您好，聚神灸官方客服为您服务。请问有什么可以帮您的？' }
  ]);

  const send = () => {
    if (!msg.trim()) return;
    setChat([...chat, { type: 'user', text: msg }]);
    setMsg('');
    setTimeout(() => {
      setChat(prev => [...prev, { type: 'bot', text: '收到您的咨询，我们正在为您转接人工客服，请稍候...' }]);
    }, 1000);
  };

  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed inset-0 z-[60] bg-background-light rice-paper flex flex-col">
      <header className="shrink-0 flex items-center bg-white px-4 py-4 border-b border-primary/10">
        <button onClick={onBack} className="mr-3 text-slate-800"><ArrowLeft size={24} /></button>
        <h1 className="text-lg font-bold">官方客服</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {chat.map((c, i) => (
          <div key={i} className={`flex ${c.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${c.type === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-slate-800 border border-primary/10 rounded-tl-none shadow-sm'}`}>
              {c.text}
            </div>
          </div>
        ))}
      </main>
      <div className="p-4 bg-white border-t border-primary/10 flex gap-2">
        <input
          type="text"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="输入您的问题..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
        />
        <button onClick={send} className="bg-primary text-white p-2 rounded-full active:scale-95 transition-transform">
          <ChevronRight size={20} />
        </button>
      </div>
    </motion.div>
  );
};

const OrdersScreen = ({ onBack, initialTab = 'all', orders }: { onBack: () => void, initialTab?: string, orders: any[], key?: string }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const tabs = [
    { id: 'all', label: '全部' },
    { id: 'pending_payment', label: '待付款' },
    { id: 'pending_shipment', label: '待发货' },
    { id: 'pending_receipt', label: '待收货' },
    { id: 'after_sale', label: '售后' },
  ];

  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed inset-0 z-[60] bg-background-light rice-paper flex flex-col">
      <header className="shrink-0 flex items-center bg-white px-4 py-4 border-b border-primary/10">
        <button onClick={onBack} className="mr-3 text-slate-800"><ArrowLeft size={24} /></button>
        <h1 className="text-lg font-bold">我的订单</h1>
      </header>
      <div className="shrink-0 bg-white border-b border-primary/5 flex overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors relative ${activeTab === tab.id ? 'text-primary' : 'text-slate-500'}`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="orderTab" className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>
      <main className="flex-1 overflow-y-auto p-4 no-scrollbar">
        {(activeTab === 'all' || activeTab === 'pending_shipment') && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.filter(o => activeTab === 'all' || o.status === activeTab).map((order: any) => (
              <div key={order.id} className="bg-white p-4 rounded-xl border border-primary/10 shadow-sm">
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-primary/5">
                  <span className="text-xs text-slate-500">订单号: {order.order_no}</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                    {order.status === 'pending_payment' ? '待付款' : order.status === 'pending_shipment' ? '待发货' : order.status === 'pending_receipt' ? '待收货' : order.status === 'completed' ? '已完成' : order.status}
                  </span>
                </div>
                {order.order_items?.map((item: any) => (
                  <div key={item.id} className="flex gap-4 mb-2">
                    <div className="size-16 bg-slate-100 rounded-lg overflow-hidden">
                      <img src={item.product?.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm">{item.product?.name}</h3>
                      <div className="mt-1 flex justify-between items-center">
                        <span className="text-primary font-bold">RM{item.price}</span>
                        <span className="text-xs text-slate-400">x{item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end mt-2 pt-2 border-t border-primary/5">
                  <span className="text-sm font-bold text-slate-900">合计: <span className="text-primary">RM{order.total}</span></span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-slate-400 mt-20">暂无相关订单</div>
        )}
      </main>
    </motion.div>
  );
};

const CultureScreen = ({ onBack }: { onBack: () => void, key?: string }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-background-light rice-paper pb-12">
      <header className="sticky top-0 z-50 flex items-center bg-background-light/95 backdrop-blur-sm px-4 py-3 border-b border-primary/10">
        <button onClick={onBack} className="mr-3 text-slate-800"><ArrowLeft size={24} /></button>
        <h1 className="text-lg font-bold">艾烟文化</h1>
      </header>
      <main className="p-6 space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4 serif">自然之馈赠</h2>
          <div className="aspect-video rounded-2xl overflow-hidden mb-4 shadow-lg">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQx_h4cvX28l0lVqHYK0GRTXPjAhruN3VH7KfSFryhufdJdILE6og_0zQy31gLUypzcmUEu7ROPAmscgOnlkFsLE8_1ZcsMSFq8fJYmrdseg3Xsbzhk_lGEu9O0DpkxzRH0cfx20RFe_EeEB10zAYmWC4uyPA7p-Qd6jY4W9baF_05eNvf1DwGgRKwA1_8aKmKJMFve5oioSxKNeuq4Zc1mnWeIE7UcxALXBTFNSd-z65xu59I8kWw1BWs1IftgoHhMSf-xLBhUeGZ" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <p className="text-slate-700 leading-relaxed indent-8">
            聚神药艾烟，源自深山纯净艾草，历经三载陈放，辅以十余种名贵中草药，经古法炮制而成。它不仅是一种吸食体验，更是一种身心的洗礼。
          </p>
        </section>

        <section className="bg-white/60 p-6 rounded-2xl border border-primary/10">
          <h3 className="text-xl font-bold text-slate-900 mb-3">亦烟亦药</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            不同于传统烟草，药艾烟不含尼古丁，其烟雾中富含挥发性精油成分，通过呼吸道进入人体，具有清热解毒、宣肺利咽、提神醒脑之功效。
          </p>
        </section>

        <section>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="aspect-square rounded-xl overflow-hidden">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBq0IY7tCs0n3xJ1Ic95natg9CjhjADuUGoLSeop-3H9zrERozHcM-ye_qmSQR_CD-xJtj6NuhUFi9vXNsk15Nfzu8VHQYaFimPTI_P5XkulcWMYMChWnf1KbOB4dZr5HWX8WgQ-1RPQalAWrVTIePDKd8eQWSdKWkx0TEvNoZvrVgXTJelXQRcrOKLWR2ujZNLAniKzAt8RY9xV17yr1CkE1u2moO1vu19PRYM5OkPFkUp1aTxPeFIEClOyGPHhfEe6cRdlM6w776l" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <p className="text-xs text-center text-slate-500 italic">传统手工卷制</p>
            </div>
            <div className="space-y-2">
              <div className="aspect-square rounded-xl overflow-hidden">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCf_v1_GAzOPBJLJCjXErMm6JoI9cgNWIFhyFMOuByLEKbWVqXF34eky6kOC50bb089KUBlc-Ib1XOvnKjZFpjY9ZQRUZeSsoq-0-FXdRb6WVcavKx4lJbKA4yipXeZREhGyCSuvU9F4XTXO4-Uoz2HcmxRK9IKT0QtadHFg8yxGboQO59El7u4bLPOfBEcaHM1N1a780UeAOeWPWBO7gIalgiQIDKFz3BOgz4wBwiV3MmOSjO9PgjNSByfdcw4jZUdDZ9GPbL4_6iP" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <p className="text-xs text-center text-slate-500 italic">严选陈年艾草</p>
            </div>
          </div>
        </section>
      </main>
    </motion.div>
  );
};

const LoginScreen = ({ onLogin, onRegister, onBack }: { onLogin: (email: string, password: string) => void, onRegister: () => void, onBack: () => void, key?: string }) => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background-light rice-paper flex flex-col relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/5 to-background-light pointer-events-none"></div>

      <header className="relative z-10 flex items-center p-4 justify-between">
        <button onClick={onBack} className="text-slate-800 hover:text-primary transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-slate-900 text-lg font-bold tracking-widest flex-1 text-center pr-6">登录</h2>
      </header>

      <div className="relative z-10 flex flex-col items-center justify-center pt-10 pb-8">
        <div className="w-24 h-24 mb-4 rounded-full border-2 border-primary/30 p-1 bg-white/50 backdrop-blur-sm shadow-md flex items-center justify-center">
          <img
            alt="Logo"
            className="w-20 h-20 object-contain"
            src="https://res.cloudinary.com/dmdjliyio/image/upload/v1772517580/%E8%81%9A%E7%A5%9E%E7%81%B8logo-Photoroom_hzgbyt.png"
            referrerPolicy="no-referrer"
          />
        </div>
        <h1 className="text-2xl font-bold tracking-[0.2em] text-primary">聚神灸</h1>
        <p className="text-slate-800 text-sm mt-2 tracking-widest font-medium">传承本草精华 · 守护身心安康</p>
      </div>

      <div className="relative z-10 px-6 w-full max-w-md mx-auto">
        <div className="flex flex-col gap-5">
          <label className="flex flex-col bg-white/70 backdrop-blur-md border border-primary/20 rounded-xl p-3 shadow-sm">
            <p className="text-slate-800 text-xs tracking-widest font-bold mb-1 ml-1">手机号 / 邮箱</p>
            <input
              className="w-full border-none bg-transparent focus:ring-0 h-10 px-1 text-base placeholder:text-slate-400 text-slate-900"
              placeholder="请输入您的邮箱"
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
          </label>

          <label className="flex flex-col bg-white/70 backdrop-blur-md border border-primary/20 rounded-xl p-3 shadow-sm">
            <p className="text-slate-800 text-xs tracking-widest font-bold mb-1 ml-1">密码</p>
            <div className="relative flex items-center">
              <input
                className="w-full border-none bg-transparent focus:ring-0 h-10 px-1 text-base placeholder:text-slate-400 text-slate-900"
                placeholder="请输入您的密码"
                type={showPassword ? "text" : "password"}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 text-slate-400 hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </label>

          <div className="flex justify-end">
            <button className="text-slate-900 text-sm font-bold hover:underline tracking-wide">忘记密码？</button>
          </div>

          <button
            onClick={() => onLogin(loginEmail, loginPassword)}
            className="w-full bg-primary hover:bg-primary/90 font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] mt-6 tracking-[0.5em] flex items-center justify-center text-white"
          >
            立即登录
          </button>

          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-slate-700 text-sm">还没有账号？</span>
            <button onClick={onRegister} className="text-slate-900 text-sm font-bold hover:underline tracking-wide">立即注册</button>
          </div>
        </div>
      </div>

      <div className="mt-auto px-6 pb-12 w-full max-w-md mx-auto bg-black/5 rounded-t-3xl backdrop-blur-sm relative z-10">
        <div className="relative flex items-center py-8">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-4 text-xs tracking-widest uppercase font-bold text-slate-500">第三方登录</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <div className="flex justify-center gap-12">
          <button className="flex flex-col items-center gap-2 group">
            <div className="size-14 rounded-full border border-slate-200 flex items-center justify-center hover:bg-white transition-colors shadow-sm bg-white/50">
              <svg className="size-7" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.11c-.22-.67-.35-1.39-.35-2.11s.13-1.44.35-2.11V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.83z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.83c.87-2.6 3.3-4.51 6.16-4.51z" fill="#EA4335"></path>
              </svg>
            </div>
            <span className="text-[10px] tracking-widest uppercase font-bold text-slate-800">Google 登录</span>
          </button>

          <button className="flex flex-col items-center gap-2 group">
            <div className="size-14 rounded-full border border-slate-200 flex items-center justify-center hover:bg-white transition-colors shadow-sm bg-white/50">
              <svg className="size-7 text-black" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.05 20.28c-.96.95-2.21 1.72-3.73 1.72-1.22 0-2.07-.38-2.92-.38-.86 0-1.87.38-2.92.38-1.55 0-2.95-.81-4.01-2.11-2.01-2.47-1.57-7.23 1.12-10.15 1.13-1.23 2.51-1.95 3.91-1.95.83 0 1.61.27 2.45.27.76 0 1.6-.27 2.4-.27 1.34 0 2.58.62 3.43 1.6-2.58 1.44-2.14 5.35.53 6.64-.61 1.83-1.58 3.51-2.31 4.25zM12.03 7.25c-.02-2.13 1.58-4.01 3.53-4.25.13 2.21-1.74 4.31-3.53 4.25z"></path>
              </svg>
            </div>
            <span className="text-[10px] tracking-widest uppercase font-bold text-slate-800">Apple 登录</span>
          </button>
        </div>

        <div className="mt-10 text-center">
          <p className="text-[10px] text-slate-600 leading-relaxed px-4 font-medium">
            登录即代表您已阅读并同意 <button className="text-primary font-bold hover:underline tracking-wide">《服务协议》</button> 与 <button className="text-primary font-bold hover:underline tracking-wide">《隐私政策》</button>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const RegisterScreen = ({ onRegister, onLogin, onBack }: { onRegister: (email: string, password: string, nickname?: string) => Promise<void>, onLogin: () => void, onBack: () => void, key?: string }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [regEmail, setRegEmail] = useState('');
  const [regOtp, setRegOtp] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP 倒计时
  useEffect(() => {
    if (otpCountdown <= 0) return;
    const timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [otpCountdown]);

  /**
   * 发送验证码
   * NOTE: 调用后端 /api/auth/send-otp 接口
   */
  const handleSendOtp = async () => {
    if (!regEmail) {
      setErrorMsg('请输入邮箱地址');
      return;
    }
    // 简单邮箱格式校验
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail)) {
      setErrorMsg('请输入有效的邮箱地址');
      return;
    }
    setErrorMsg('');
    try {
      await authApi.sendOtp(regEmail);
      setOtpSent(true);
      setOtpCountdown(60);
    } catch (err: any) {
      setErrorMsg(err.message || '发送验证码失败');
    }
  };

  /**
   * 提交注册
   * NOTE: 先验证 OTP，再调用注册接口设置密码
   */
  const handleRegister = async () => {
    setErrorMsg('');
    if (!regEmail) { setErrorMsg('请输入邮箱地址'); return; }
    if (!regOtp || regOtp.length !== 6) { setErrorMsg('请输入 6 位验证码'); return; }
    if (!regPassword) { setErrorMsg('请设置密码'); return; }
    if (regPassword.length < 6) { setErrorMsg('密码长度不能少于 6 位'); return; }
    if (regPassword !== regConfirmPassword) { setErrorMsg('两次输入的密码不一致'); return; }
    if (!agreedTerms) { setErrorMsg('请阅读并同意用户协议'); return; }

    setIsSubmitting(true);
    try {
      // 第一步：验证 OTP
      await authApi.verifyOtp(regEmail, regOtp);
      // 第二步：注册（设置密码）
      await onRegister(regEmail, regPassword);
    } catch (err: any) {
      setErrorMsg(err.message || '注册失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background-light rice-paper flex flex-col relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-transparent pointer-events-none"></div>

      <header className="relative z-10 flex items-center p-4 justify-between">
        <button onClick={onBack} className="text-slate-800 hover:text-primary transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-slate-900 text-lg font-bold tracking-wide flex-1 text-center pr-6">注册账号</h2>
      </header>

      <div className="relative z-10 flex flex-col items-center px-8 pt-6 pb-2">
        <div className="mb-6">
          <img
            alt="Logo"
            className="h-16 w-auto object-contain"
            src="https://res.cloudinary.com/dmdjliyio/image/upload/v1772517580/%E8%81%9A%E7%A5%9E%E7%81%B8logo-Photoroom_hzgbyt.png"
            referrerPolicy="no-referrer"
          />
        </div>
        <h1 className="text-2xl font-bold text-primary tracking-widest mb-1">加入 聚神灸</h1>
        <p className="text-slate-800 text-sm mb-6 font-medium">开启您的中医养生之旅</p>
      </div>

      {/* 错误提示 */}
      {errorMsg && (
        <div className="relative z-10 mx-6 mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center font-medium">
          {errorMsg}
        </div>
      )}

      <div className="relative z-10 flex flex-col w-full max-w-md mx-auto px-6 space-y-4">
        {/* 邮箱 */}
        <div className="flex flex-col">
          <label className="text-slate-900 text-sm font-bold pb-2 ml-1">邮箱地址</label>
          <div className="relative">
            <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60" />
            <input
              className="w-full pl-12 pr-4 h-14 bg-white/80 backdrop-blur-sm border border-primary/10 rounded-xl focus:ring-1 focus:ring-primary/30 focus:border-primary/20 outline-none transition-all text-sm placeholder:text-slate-400"
              placeholder="请输入您的邮箱"
              type="email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
            />
          </div>
        </div>

        {/* 验证码 */}
        <div className="flex flex-col">
          <label className="text-slate-900 text-sm font-bold pb-2 ml-1">邮箱验证码</label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <ShieldCheck size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60" />
              <input
                className="w-full pl-12 pr-4 h-14 bg-white/80 backdrop-blur-sm border border-primary/10 rounded-xl focus:ring-1 focus:ring-primary/30 focus:border-primary/20 outline-none transition-all text-sm placeholder:text-slate-400"
                placeholder="输入 6 位验证码"
                type="text"
                maxLength={6}
                value={regOtp}
                onChange={(e) => setRegOtp(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            <button
              onClick={handleSendOtp}
              disabled={otpCountdown > 0 || !regEmail}
              className={`px-4 h-14 rounded-xl font-medium text-sm whitespace-nowrap shadow-sm transition-colors ${otpCountdown > 0 || !regEmail
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-white/80 backdrop-blur-sm text-primary border border-primary/10 hover:bg-primary/5'
                }`}
            >
              {otpCountdown > 0 ? `${otpCountdown}s 重发` : (otpSent ? '重新发送' : '获取验证码')}
            </button>
          </div>
        </div>

        {/* 设置密码 */}
        <div className="flex flex-col">
          <label className="text-slate-900 text-sm font-bold pb-2 ml-1">设置密码</label>
          <div className="relative">
            <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60" />
            <input
              className="w-full pl-12 pr-12 h-14 bg-white/80 backdrop-blur-sm border border-primary/10 rounded-xl focus:ring-1 focus:ring-primary/30 focus:border-primary/20 outline-none transition-all text-sm placeholder:text-slate-400"
              placeholder="请设置密码（至少 6 位）"
              type={showPassword ? "text" : "password"}
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* 确认密码 */}
        <div className="flex flex-col">
          <label className="text-slate-900 text-sm font-bold pb-2 ml-1">确认密码</label>
          <div className="relative">
            <RefreshCw size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60" />
            <input
              className="w-full pl-12 pr-4 h-14 bg-white/80 backdrop-blur-sm border border-primary/10 rounded-xl focus:ring-1 focus:ring-primary/30 focus:border-primary/20 outline-none transition-all text-sm placeholder:text-slate-400"
              placeholder="请再次输入密码"
              type="password"
              value={regConfirmPassword}
              onChange={(e) => setRegConfirmPassword(e.target.value)}
            />
            {/* 密码匹配提示 */}
            {regConfirmPassword && (
              <div className={`absolute right-4 top-1/2 -translate-y-1/2 ${regPassword === regConfirmPassword ? 'text-green-500' : 'text-red-400'}`}>
                {regPassword === regConfirmPassword ? <CheckCircle2 size={20} /> : <X size={20} />}
              </div>
            )}
          </div>
        </div>

        {/* 用户协议 */}
        <div className="flex items-start gap-3 py-1">
          <input
            className="mt-1 w-5 h-5 rounded border-primary/30 text-primary focus:ring-primary cursor-pointer"
            id="terms"
            type="checkbox"
            checked={agreedTerms}
            onChange={(e) => setAgreedTerms(e.target.checked)}
          />
          <label className="text-xs text-slate-600 leading-relaxed font-medium cursor-pointer" htmlFor="terms">
            我已阅读并同意 <button className="text-primary font-bold underline decoration-primary/30">《用户服务协议》</button> 与 <button className="text-primary font-bold underline decoration-primary/30">《隐私政策》</button>
          </label>
        </div>

        {/* 注册按钮 */}
        <div className="pt-2">
          <button
            onClick={handleRegister}
            disabled={isSubmitting || !regEmail || !regPassword || !regConfirmPassword || !agreedTerms}
            className={`w-full h-14 rounded-xl font-bold text-base shadow-md transition-all active:scale-[0.98] ${isSubmitting || !regEmail || !regPassword || !regConfirmPassword || !agreedTerms
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
              : 'bg-primary text-white shadow-primary/20 hover:brightness-110'
              }`}
          >
            {isSubmitting ? '注册中...' : '立即注册'}
          </button>
        </div>

        <div className="text-center py-4">
          <p className="text-slate-900 text-sm font-medium">
            已有账号？ <button onClick={onLogin} className="text-primary font-bold">返回登录</button>
          </p>
        </div>
      </div>

      <div className="mt-auto flex justify-center pb-8 pointer-events-none relative z-10">
        <div className="h-px w-20 bg-slate-300 self-center"></div>
        <div className="mx-4 text-[10px] tracking-[0.5em] text-slate-400 font-medium">匠心传世</div>
        <div className="h-px w-20 bg-slate-300 self-center"></div>
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  // NOTE: 未登录时初始界面为登录页，已登录则进入首页
  const [screen, setScreen] = useState<Screen>(isAuthenticated() ? 'home' : 'login');
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('标准烟支');
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [activeOrderTab, setActiveOrderTab] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [couponCount, setCouponCount] = useState(0);
  const [footprintCount, setFootprintCount] = useState(0);

  // 加载产品列表
  const loadProducts = useCallback(async () => {
    try {
      const data = await productApi.getAll();
      setProducts(data.map(normalizeProduct));
    } catch (err) {
      console.error('加载产品失败:', err);
    }
  }, []);

  // 加载购物车（需要登录）
  const loadCart = useCallback(async () => {
    if (!isAuthenticated()) return;
    try {
      const data = await cartApi.getAll();
      setCartItems(data);
    } catch (err) {
      console.error('加载购物车失败:', err);
    }
  }, []);

  // 加载通知（需要登录）
  const loadNotifications = useCallback(async () => {
    if (!isAuthenticated()) return;
    try {
      const data = await notificationApi.getAll();
      setNotifications(data.map((n: any) => ({
        ...n,
        time: n.created_at ? new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      })));
    } catch (err) {
      console.error('加载通知失败:', err);
    }
  }, []);

  // 加载订单（需要登录）
  const loadOrders = useCallback(async () => {
    if (!isAuthenticated()) return;
    try {
      const data = await orderApi.getAll();
      setOrders(data);
    } catch (err) {
      console.error('加载订单失败:', err);
    }
  }, []);

  // 加载用户信息
  const loadProfile = useCallback(async () => {
    if (!isAuthenticated()) return;
    try {
      const data = await authApi.getProfile();
      setUserProfile(data);
      // NOTE: 保存邮箱供账号安全页面显示
      if (data?.email) {
        localStorage.setItem('user_email', data.email);
      }
    } catch (err) {
      console.error('加载用户信息失败:', err);
    }
  }, []);

  // 初始化数据加载
  useEffect(() => {
    loadProducts();
    if (isAuthenticated()) {
      loadCart();
      loadNotifications();
      loadOrders();
      loadProfile();
      // 加载优惠券和足迹数量
      couponApi.getMine().then(data => setCouponCount(data?.length || 0)).catch(() => { });
      footprintApi.getAll().then(data => setFootprintCount(data?.length || 0)).catch(() => { });
    }
  }, [isLoggedIn]);

  const unreadCount = notifications.filter(n => !n.read).length;

  /**
   * 切换商品收藏状态
   * NOTE: 先更新本地 Set 确保即时 UI 反馈，再尝试同步后端
   */
  const toggleFavorite = (product: Product) => {
    setFavoriteIds(prev => {
      const next = new Set(prev);
      if (next.has(product.id)) {
        next.delete(product.id);
        setToast(`已取消收藏 ${product.name}`);
        if (isAuthenticated()) {
          favoriteApi.remove(product.id).catch(() => { });
        }
      } else {
        next.add(product.id);
        setToast(`已收藏 ${product.name}`);
        if (isAuthenticated()) {
          favoriteApi.add(product.id).catch(() => { });
        }
      }
      return next;
    });
    setTimeout(() => setToast(null), 2000);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setScreen('detail');
    // 记录浏览足迹
    if (isAuthenticated()) {
      footprintApi.add(product.id).catch(() => { });
    }
  };

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    setScreen('category');
  };

  const handleOrders = (tab?: string) => {
    setActiveOrderTab(tab || 'all');
    loadOrders();
    setScreen('orders');
  };

  /**
   * 添加商品到购物车
   * NOTE: 已登录时同步到后端，API 调用失败时降级为本地模式
   */
  const addToCartLocal = (product: Product) => {
    setCartItems(prev => {
      // NOTE: 相同产品+相同价格（规格）才视为同一购物车项
      const existing = prev.find(item =>
        (item.productId === product.id || item.id === product.id) && item.price === product.price
      );
      if (existing) {
        return prev.map(item =>
          (item.productId === product.id || item.id === product.id) && item.price === product.price
            ? { ...item, quantity: item.quantity + ((product as any).selectedQty || 1) }
            : item
        );
      }
      return [...prev, {
        id: `local_${Date.now()}_${product.id}_${product.price}`,
        productId: product.id,
        name: product.name,
        englishName: product.englishName || product.english_name,
        price: product.price,
        specLabel: (product as any).specLabel || '',
        image: product.image,
        category: product.category,
        quantity: (product as any).selectedQty || 1,
        checked: true,
      }];
    });
  };

  const addToCart = async (product: Product) => {
    const unitPrice = product.price;
    const specLabel = (product as any).specLabel || '';
    const qty = (product as any).selectedQty || 1;
    if (isAuthenticated()) {
      try {
        await cartApi.add(product.id, qty, unitPrice, specLabel);
        await loadCart();
      } catch (err) {
        // HACK: 后端不可用时降级为本地购物车
        console.error('API 添加购物车失败，使用本地模式:', err);
        addToCartLocal(product);
      }
    } else {
      addToCartLocal(product);
    }
    setToast(`已添加 ${product.name} 到购物车`);
    setTimeout(() => setToast(null), 2000);
  };

  const updateCartQty = async (id: string, delta: number) => {
    const item = cartItems.find(i => i.id === id);
    if (!item) return;
    const newQty = Math.max(1, item.quantity + delta);

    // NOTE: 始终先更新本地状态确保 UI 即时响应
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: newQty } : i));

    if (isAuthenticated()) {
      try {
        await cartApi.update(id, { quantity: newQty });
      } catch (err) {
        console.error('API 更新购物车失败，已使用本地模式:', err);
      }
    }
  };

  const toggleCartCheck = async (id: string) => {
    const item = cartItems.find(i => i.id === id);
    if (!item) return;

    // NOTE: 始终先更新本地状态确保 UI 即时响应
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i));

    if (isAuthenticated()) {
      try {
        await cartApi.update(id, { checked: !item.checked });
      } catch (err) {
        console.error('API 更新选中状态失败，已使用本地模式:', err);
      }
    }
  };

  const removeFromCart = async (id: string) => {
    // NOTE: 始终先更新本地状态确保 UI 即时响应
    setCartItems(prev => prev.filter(i => i.id !== id));

    if (isAuthenticated()) {
      try {
        await cartApi.remove(id);
      } catch (err) {
        console.error('API 删除购物车项失败，已使用本地模式:', err);
      }
    }
  };

  const handlePurchase = (total: number) => {
    setScreen('checkout');
  };

  /**
   * 确认下单
   * 调用后端创建订单 API，清除已选购物车商品
   */
  const confirmPurchase = async (total: number, paymentMethod: string = 'cod', address?: any) => {
    const checkedItems = cartItems.filter(i => i.checked);
    const orderNo = `${Date.now()}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    const payLabel = paymentMethod === 'cod' ? '货到付款' : '银行卡支付';

    /**
     * 创建本地通知
     * NOTE: 无论后端是否可用，都确保用户能在通知列表看到下单记录
     */
    const addLocalNotification = () => {
      const newNotification: Notification = {
        id: `local_notif_${Date.now()}`,
        title: '下单成功',
        content: `您已成功下单，订单号 ${orderNo}，总金额 ¥${total.toFixed(2)}，支付方式：${payLabel}。`,
        type: 'order_success',
        read: false,
        created_at: new Date().toISOString(),
      };
      setNotifications(prev => [newNotification, ...prev]);
    };

    if (isAuthenticated()) {
      try {
        const orderItems = checkedItems.map(item => ({
          productId: item.productId || item.product_id || item.id,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
        }));

        await orderApi.create({
          items: orderItems,
          paymentMethod,
          address: address ? { name: address.name, phone: address.phone, detail: `${address.state}, ${address.city} ${address.postcode} - ${address.detail}` } : { name: '用户', phone: '', detail: '' },
          deliveryTime: '不限时间',
          remark: '',
          total,
        });
        await loadCart();
        await loadNotifications();
        await loadOrders();
        setScreen('notifications');
        setToast(paymentMethod === 'cod' ? '下单成功！货到付款' : '支付成功！');
      } catch (err: any) {
        console.error('API 下单失败，使用本地模式:', err);
        setCartItems(prev => prev.filter(item => !item.checked));
        addLocalNotification();
        setScreen('notifications');
        setToast(paymentMethod === 'cod' ? '下单成功！货到付款' : '支付成功！');
      }
    } else {
      // 未登录：本地模拟
      setCartItems(prev => prev.filter(item => !item.checked));
      addLocalNotification();
      setScreen('notifications');
      setToast(paymentMethod === 'cod' ? '下单成功！货到付款' : '支付成功！');
    }
    setTimeout(() => setToast(null), 3000);
  };

  const handleNotificationClick = async (n: Notification) => {
    if (isAuthenticated()) {
      try {
        await notificationApi.markRead(n.id);
        await loadNotifications();
      } catch (err) {
        console.error('标记已读失败:', err);
      }
    } else {
      setNotifications(prev => prev.map(notif => notif.id === n.id ? { ...notif, read: true } : notif));
    }
    if (n.type === 'order_success') {
      handleOrders('pending_shipment');
    }
  };

  return (
    <div className="min-h-screen max-w-md mx-auto relative bg-background-light shadow-2xl overflow-x-hidden">
      <AnimatePresence mode="wait">
        {screen === 'home' && (
          <HomeScreen
            key="home"
            onProductClick={handleProductClick}
            onSearch={() => setScreen('search')}
            onNotifications={() => setScreen('notifications')}
            onCategoryClick={handleCategoryClick}
            onCultureClick={() => setScreen('culture')}
            onAddToCart={addToCart}
            unreadCount={unreadCount}
            products={products}
          />
        )}
        {screen === 'category' && (
          <CategoryScreen
            key="category"
            onProductClick={handleProductClick}
            onSearch={() => setScreen('search')}
            initialCategory={activeCategory}
            onAddToCart={addToCart}
            onNotifications={() => setScreen('notifications')}
            unreadCount={unreadCount}
            products={products}
          />
        )}
        {screen === 'cart' && (
          <CartScreen
            key="cart"
            cartItems={cartItems}
            onUpdateQty={updateCartQty}
            onToggleCheck={toggleCartCheck}
            onRemove={removeFromCart}
            onPurchase={handlePurchase}
            onProductClick={handleProductClick}
            onAddToCart={addToCart}
            products={products}
          />
        )}
        {screen === 'profile' && (
          <ProfileScreen
            key="profile"
            onNotifications={() => setScreen('notifications')}
            unreadCount={unreadCount}
            onCoupons={() => setScreen('coupons')}
            onFootprints={() => setScreen('footprints')}
            onFavorites={() => setScreen('favorites')}
            onSettings={() => setScreen('settings')}
            onCustomerService={() => setScreen('customer_service')}
            onAddress={() => setScreen('addresses')}
            onOrders={handleOrders}
            isLoggedIn={isLoggedIn}
            onLogin={() => setScreen('login')}
            orders={orders}
            userProfile={userProfile}
            couponCount={couponCount}
            footprintCount={footprintCount}
          />
        )}
        {screen === 'checkout' && (
          <CheckoutScreen
            key="checkout"
            items={cartItems.filter(i => i.checked)}
            onConfirm={confirmPurchase}
            onBack={() => setScreen('cart')}
          />
        )}
        {screen === 'coupons' && <CouponsScreen key="coupons" onBack={() => setScreen('profile')} />}
        {screen === 'footprints' && <FootprintsScreen key="footprints" onBack={() => setScreen('profile')} onProductClick={handleProductClick} products={products} />}
        {screen === 'favorites' && <FavoritesScreen key="favorites" onBack={() => setScreen('profile')} onProductClick={handleProductClick} favoriteProducts={products.filter(p => favoriteIds.has(p.id))} onRemoveFavorite={toggleFavorite} />}
        {screen === 'settings' && (
          <SettingsScreen
            key="settings"
            onBack={() => setScreen('profile')}
            onProfile={() => setScreen('settings_profile')}
            onSecurity={() => setScreen('settings_security')}

            onLogout={() => {
              clearToken();
              setIsLoggedIn(false);
              setCartItems([]);
              setNotifications([]);
              setOrders([]);
              setUserProfile(null);
              setScreen('login');
              setToast('已退出登录');
              setTimeout(() => setToast(null), 2000);
            }}
          />
        )}
        {screen === 'settings_profile' && (
          <SettingsProfileScreen
            key="settings_profile"
            onBack={() => setScreen('settings')}
            userProfile={userProfile}
            onSave={async (data) => {
              try {
                await authApi.updateProfile(data);
                await loadProfile();
              } catch (err: any) {
                throw err;
              }
            }}
          />
        )}
        {screen === 'settings_security' && (
          <SettingsSecurityScreen
            key="settings_security"
            onBack={() => setScreen('settings')}
            userEmail={localStorage.getItem('user_email') || ''}
            onLogout={() => {
              clearToken();
              localStorage.removeItem('user_email');
              setIsLoggedIn(false);
              setCartItems([]);
              setNotifications([]);
              setOrders([]);
              setUserProfile(null);
              setScreen('login');
              setToast('账号已注销');
              setTimeout(() => setToast(null), 2000);
            }}
          />
        )}

        {screen === 'customer_service' && <CustomerServiceScreen key="customer_service" onBack={() => setScreen('profile')} />}
        {screen === 'addresses' && <AddressScreen key="addresses" onBack={() => setScreen('profile')} />}
        {screen === 'orders' && <OrdersScreen key="orders" onBack={() => setScreen('profile')} initialTab={activeOrderTab} orders={orders} />}
        {screen === 'search' && <SearchScreen key="search" onProductClick={handleProductClick} onBack={() => setScreen('home')} products={products} />}
        {screen === 'notifications' && (
          <NotificationsScreen
            key="notifications"
            notifications={notifications}
            onNotificationClick={handleNotificationClick}
            onBack={() => setScreen('home')}
          />
        )}
        {screen === 'culture' && <CultureScreen key="culture" onBack={() => setScreen('home')} />}
        {screen === 'login' && (
          <LoginScreen
            key="login"
            onLogin={async (email: string, password: string) => {
              try {
                await authApi.login(email, password);
                localStorage.setItem('user_email', email);
                setIsLoggedIn(true);
                await loadCart();
                await loadNotifications();
                await loadOrders();
                await loadProfile();
                setScreen('profile');
                setToast('登录成功');
                setTimeout(() => setToast(null), 2000);
              } catch (err: any) {
                setToast(err.message || '登录失败');
                setTimeout(() => setToast(null), 3000);
              }
            }}
            onRegister={() => setScreen('register')}
            onBack={() => setScreen('profile')}
          />
        )}
        {screen === 'register' && (
          <RegisterScreen
            key="register"
            onRegister={async (email: string, password: string, nickname?: string) => {
              await authApi.register(email, password, nickname);
              setScreen('login');
              setToast('注册成功！请使用邮箱和密码登录');
              setTimeout(() => setToast(null), 3000);
            }}
            onLogin={() => setScreen('login')}
            onBack={() => setScreen('login')}
          />
        )}
        {screen === 'detail' && selectedProduct && (
          <ProductDetailScreen
            key="detail"
            product={selectedProduct}
            onBack={() => setScreen('home')}
            onAddToCart={addToCart}
            onBuyNow={(p: Product) => {
              // NOTE: 立即购买使用传入的规格价格，不匹配已有不同规格项
              const qty = (p as any).selectedQty || 1;
              const buyItem = { id: `buy_${p.id}_${p.price}`, productId: p.id, name: p.name, price: p.price, specLabel: (p as any).specLabel || '', image: p.image, quantity: qty, checked: true };
              setCartItems(prev => {
                const uncheckedAll = prev.map(i => ({ ...i, checked: false }));
                // 找同产品同价格（同规格）的项
                const existing = uncheckedAll.find(i => (i.productId === p.id || i.id === p.id) && i.price === p.price);
                if (existing) {
                  return uncheckedAll.map(i => (i.productId === p.id || i.id === p.id) && i.price === p.price ? { ...i, checked: true, quantity: 1 } : i);
                }
                return [...uncheckedAll, buyItem];
              });
              setScreen('checkout');
            }}
            onGoToCart={() => setScreen('cart')}
            onCustomerService={() => setScreen('customer_service')}
            cartCount={cartItems.reduce((sum, i) => sum + i.quantity, 0)}
            isFavorited={favoriteIds.has(selectedProduct.id)}
            onToggleFavorite={toggleFavorite}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-slate-900/90 text-white px-6 py-3 rounded-full text-sm font-medium shadow-xl backdrop-blur-sm whitespace-nowrap"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {!['detail', 'search', 'notifications', 'culture', 'checkout', 'coupons', 'footprints', 'favorites', 'settings', 'customer_service', 'orders', 'settings_profile', 'settings_security', 'addresses', 'login', 'register'].includes(screen) && (
        <Navbar activeScreen={screen as any} setScreen={setScreen} />
      )}
    </div>
  );
}
