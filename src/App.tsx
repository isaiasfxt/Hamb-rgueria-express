/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, 
  Menu as MenuIcon, 
  Home as HomeIcon, 
  Settings, 
  ArrowLeft, 
  Plus, 
  Minus, 
  Trash2, 
  PhoneCall,
  ChevronRight,
  Info
} from 'lucide-react';
import { Product, CartItem, OrderDetails, CategoryType } from './types';
import { INITIAL_PRODUCTS, WHATSAPP_NUMBER } from './constants';

export default function App() {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('burger_master_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('burger_master_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentScreen, setCurrentScreen] = useState<'Home' | 'Menu' | 'Product' | 'Cart' | 'Checkout' | 'Admin'>('Home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem('burger_master_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('burger_master_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const addToCart = (item: CartItem) => {
    setCart(prev => [...prev, item]);
    setCurrentScreen('Menu');
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart(prev => prev.map((item, i) => {
      if (i === index) {
        const newQty = Math.max(1, item.quantity + delta);
        const unitPrice = item.totalPrice / item.quantity;
        return { ...item, quantity: newQty, totalPrice: unitPrice * newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleSendOrder = (details: OrderDetails) => {
    const orderList = cart.map(item => {
      const extras = item.selectedExtras.length > 0 
        ? ` (${item.selectedExtras.map(e => e.name).join(', ')})`
        : '';
      const sizeStr = item.selectedSize ? ` [${item.selectedSize}]` : '';
      return `- ${item.quantity}x ${item.product.name}${sizeStr}${extras}`;
    }).join('\n');

    const message = `Novo Pedido 🍔\nNome: ${details.customerName}\nTelefone: ${details.phone}\nEndereço: ${details.address}\n\nPedido:\n${orderList}\n\nTotal: ${formatCurrency(cartTotal)}\n\nForma de pagamento: ${details.paymentMethod}`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
    
    // Clear cart after sending
    setCart([]);
    setCurrentScreen('Home');
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-brand-red text-white">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="mb-8"
        >
          <img src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png" alt="Burger" className="w-24 h-24 brightness-0 invert" referrerPolicy="no-referrer" />
        </motion.div>
        <h1 className="text-3xl font-extrabold tracking-tighter italic">BURGER MASTER</h1>
        <div className="mt-4 flex gap-1">
          <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-2 h-2 bg-white rounded-full" />
          <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-white rounded-full" />
          <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-white rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 relative max-w-lg mx-auto bg-white shadow-2xl">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-neutral-100 p-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {currentScreen !== 'Home' && currentScreen !== 'Admin' && (
            <button 
              onClick={() => {
                if (currentScreen === 'Product') setCurrentScreen('Menu');
                else if (currentScreen === 'Menu') setCurrentScreen('Home');
                else if (currentScreen === 'Cart') setCurrentScreen('Menu');
                else if (currentScreen === 'Checkout') setCurrentScreen('Cart');
              }}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-brand-red"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 
            className="text-2xl font-black italic tracking-tighter cursor-pointer flex items-center gap-0.5"
            onClick={() => setCurrentScreen('Home')}
          >
            <span className="text-brand-red">BURGER</span>
            <span className="text-brand-yellow">EXPRESS</span>
          </h1>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setCurrentScreen('Admin')} className="p-2 text-neutral-300 hover:text-neutral-600 transition-colors">
            <Settings size={18} />
          </button>
          <button 
            onClick={() => setCurrentScreen('Cart')} 
            className="p-2 relative bg-neutral-100 rounded-xl text-text-dark transition-colors"
          >
            <ShoppingCart size={20} />
            {cart.length > 0 && (
              <motion.span 
                key={cart.length}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-brand-red text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white"
              >
                {cart.length}
              </motion.span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <AnimatePresence mode="wait">
          {currentScreen === 'Home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-5 flex flex-col gap-6"
            >
              <div className="bg-brand-red h-32 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg shadow-red-600/20">
                <div className="z-10 relative">
                  <p className="text-[10px] uppercase font-black tracking-widest opacity-80 mb-1">Oferta do dia</p>
                  <h2 className="text-2xl font-bold leading-tight">Combo Smash<br />por R$ 24,90</h2>
                </div>
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-brand-yellow rounded-full opacity-20" />
                <motion.div 
                  initial={{ rotate: 10, y: 0 }}
                  animate={{ rotate: 0, y: -10 }}
                  transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2 }}
                  className="absolute right-4 top-4 text-6xl opacity-40 select-none grayscale"
                >
                  🍔
                </motion.div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setCurrentScreen('Menu')}
                  className="bg-neutral-900 text-white p-6 rounded-[2rem] flex flex-col items-center justify-center gap-3 shadow-xl active:scale-95 transition-all"
                >
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                    <MenuIcon size={24} />
                  </div>
                  <span className="font-bold">Cardápio</span>
                </button>
                <button 
                  onClick={() => setCurrentScreen('Cart')}
                  className="bg-brand-yellow text-text-dark p-6 rounded-[2rem] flex flex-col items-center justify-center gap-3 shadow-xl active:scale-95 transition-all"
                >
                  <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center">
                    <ShoppingCart size={24} />
                  </div>
                  <span className="font-bold">Carrinho</span>
                </button>
              </div>

              <div className="mt-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-black uppercase tracking-tight">🔥 Destaques</h3>
                  <button onClick={() => setCurrentScreen('Menu')} className="text-brand-red text-xs font-bold uppercase tracking-widest">Ver todos</button>
                </div>
                <div className="flex flex-col gap-3">
                  {products.slice(0, 2).map(product => (
                    <div 
                      key={product.id}
                      onClick={() => { setSelectedProduct(product); setCurrentScreen('Product'); }}
                      className="bg-white border border-neutral-100 rounded-2xl p-3 flex gap-4 card-shadow active:scale-[0.98] transition-transform"
                    >
                      <img src={product.image} alt={product.name} className="w-20 h-20 rounded-xl object-cover" referrerPolicy="no-referrer" />
                      <div className="flex flex-col justify-center flex-1">
                        <h4 className="font-bold text-sm">{product.name}</h4>
                        <p className="text-neutral-400 text-[10px] line-clamp-1">{product.description}</p>
                        <span className="text-brand-red font-black mt-1">{formatCurrency(product.price)}</span>
                      </div>
                      <div className="flex items-center pr-2">
                        <div className="w-8 h-8 bg-brand-yellow rounded-lg flex items-center justify-center text-text-dark shadow-sm">
                          <Plus size={16} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-4">
                <Info className="text-blue-500 shrink-0 mt-1" size={20} />
                <p className="text-sm text-blue-700">
                  Faça seu pedido agora e receba em até 40 minutos na sua casa!
                </p>
              </div>
            </motion.div>
          )}

          {currentScreen === 'Menu' && (
            <MenuScreen 
              products={products} 
              onSelectProduct={(p) => { setSelectedProduct(p); setCurrentScreen('Product'); }} 
              formatCurrency={formatCurrency}
            />
          )}

          {currentScreen === 'Product' && selectedProduct && (
            <ProductScreen 
              product={selectedProduct} 
              onBack={() => setCurrentScreen('Menu')} 
              onAddToCart={addToCart}
              formatCurrency={formatCurrency}
            />
          )}

          {currentScreen === 'Cart' && (
            <CartScreen 
              cart={cart} 
              onUpdateQty={updateQuantity}
              onRemove={removeFromCart}
              onCheckout={() => setCurrentScreen('Checkout')}
              formatCurrency={formatCurrency}
              total={cartTotal}
            />
          )}

          {currentScreen === 'Checkout' && (
            <CheckoutScreen 
              onSend={handleSendOrder}
              total={cartTotal}
              formatCurrency={formatCurrency}
            />
          )}

          {currentScreen === 'Admin' && (
            <AdminScreen 
              products={products}
              setProducts={setProducts}
              formatCurrency={formatCurrency}
              onBack={() => setCurrentScreen('Home')}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Footer Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white border-t border-gray-100 p-3 pb-6 flex justify-around items-center z-50">
        <NavButton active={currentScreen === 'Home'} onClick={() => setCurrentScreen('Home')} icon={<HomeIcon size={24} />} label="Início" />
        <NavButton active={currentScreen === 'Menu' || currentScreen === 'Product'} onClick={() => setCurrentScreen('Menu')} icon={<MenuIcon size={24} />} label="Cardápio" />
        <NavButton active={currentScreen === 'Cart' || currentScreen === 'Checkout'} onClick={() => setCurrentScreen('Cart')} icon={<ShoppingCart size={24} />} label="Carrinho" count={cart.length} />
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon, label, count }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, count?: number }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-colors relative ${active ? 'text-brand-red font-bold' : 'text-gray-400'}`}>
      {icon}
      <span className="text-[10px] uppercase font-bold tracking-wider">{label}</span>
      {count !== undefined && count > 0 && (
        <span className="absolute -top-1 -right-2 bg-brand-red text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full">
          {count}
        </span>
      )}
    </button>
  );
}

const CATEGORIES: CategoryType[] = ['Tradicional', 'Especial', 'Combo', 'Bebida'];

function MenuScreen({ products, onSelectProduct, formatCurrency }: { products: Product[], onSelectProduct: (p: Product) => void, formatCurrency: (v: number) => string }) {
  const [activeCategory, setActiveCategory] = useState<CategoryType | 'Todos'>('Todos');

  const filtered = activeCategory === 'Todos' ? products : products.filter(p => p.category === activeCategory);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-5 flex flex-col gap-6"
    >
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button 
          onClick={() => setActiveCategory('Todos')}
          className={`px-5 py-2 rounded-full whitespace-nowrap text-xs font-bold transition-all ${activeCategory === 'Todos' ? 'bg-brand-red text-white shadow-lg shadow-red-600/20' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'}`}
        >
          🍔 Todos
        </button>
        {CATEGORIES.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full whitespace-nowrap text-xs font-bold transition-all ${activeCategory === cat ? 'bg-brand-red text-white shadow-lg shadow-red-600/20' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'}`}
          >
            {cat}s
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map(product => (
          <div 
            key={product.id}
            onClick={() => onSelectProduct(product)}
            className="group bg-white border border-neutral-100 rounded-[2rem] overflow-hidden card-shadow flex flex-col active:scale-[0.98] transition-all"
          >
            <div className="relative h-56 w-full">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-brand-red px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                {product.category}
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-xl tracking-tight">{product.name}</h3>
                <span className="text-brand-red font-black text-xl italic">{formatCurrency(product.price)}</span>
              </div>
              <p className="text-neutral-500 text-xs mb-6 leading-relaxed opacity-80">{product.description}</p>
              <button 
                className="w-full bg-brand-yellow text-text-dark py-4 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-yellow-500/10"
              >
                <Plus size={18} /> Adicionar
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ProductScreen({ product, onAddToCart, formatCurrency, onBack }: { product: Product, onBack: () => void, onAddToCart: (item: CartItem) => void, formatCurrency: (v: number) => string }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [selectedExtras, setSelectedExtras] = useState<{ name: string; price: number }[]>([]);
  const [observations, setObservations] = useState('');

  const toggleExtra = (extra: { name: string; price: number }) => {
    if (selectedExtras.find(e => e.name === extra.name)) {
      setSelectedExtras(prev => prev.filter(e => e.name !== extra.name));
    } else {
      setSelectedExtras(prev => [...prev, extra]);
    }
  };

  const currentTotal = (product.price + selectedExtras.reduce((acc, e) => acc + e.price, 0)) * quantity;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="pb-24"
    >
      <div className="h-80 w-full relative">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/40 to-transparent" />
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-text-dark shadow-xl active:scale-90 transition-transform"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="p-8 -mt-10 bg-white rounded-t-[3rem] relative z-10 shadow-2xl">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-brand-red font-black text-[10px] uppercase tracking-[0.2em] mb-1 block">Receita Exclusiva</span>
            <h2 className="text-3xl font-black tracking-tight">{product.name}</h2>
          </div>
          <span className="text-brand-red font-black text-3xl italic">{formatCurrency(product.price)}</span>
        </div>
        
        <p className="text-neutral-400 text-xs leading-relaxed mb-8 font-medium">{product.description}</p>

        {product.sizes && product.sizes.length > 0 && (
          <div className="mb-8">
            <p className="text-[10px] uppercase font-black text-neutral-400 tracking-widest mb-3">Escolha o Tamanho</p>
            <div className="flex gap-2">
              {product.sizes.map(size => (
                <button 
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all border-2 ${selectedSize === size ? 'bg-white border-brand-red text-brand-red shadow-lg shadow-red-600/5' : 'bg-neutral-50 text-neutral-400 border-neutral-50'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {product.extras && product.extras.length > 0 && (
          <div className="mb-8">
            <p className="text-[10px] uppercase font-black text-neutral-400 tracking-widest mb-3">Customizar Pedido</p>
            <div className="flex flex-col gap-2">
              {product.extras.map(extra => {
                const isSelected = selectedExtras.find(e => e.name === extra.name);
                return (
                  <button 
                    key={extra.name}
                    onClick={() => toggleExtra(extra)}
                    className={`flex items-center justify-between p-4 rounded-xl transition-all border ${isSelected ? 'border-brand-red/20 bg-brand-red/5' : 'border-neutral-100 bg-neutral-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${isSelected ? 'bg-brand-red text-white scale-110' : 'bg-white border border-neutral-200'}`}>
                        {isSelected && <Plus size={12} />}
                      </div>
                      <span className={`text-sm font-bold ${isSelected ? 'text-text-dark' : 'text-neutral-500'}`}>{extra.name}</span>
                    </div>
                    <span className="text-brand-red font-black text-[10px]">+ {formatCurrency(extra.price)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mb-10">
          <p className="text-[10px] uppercase font-black text-neutral-400 tracking-widest mb-3">Observações</p>
          <textarea 
            placeholder="Alguma restrição ou pedido especial?"
            className="w-full p-4 bg-neutral-50 border border-neutral-100 rounded-xl text-xs h-24 focus:border-brand-red/50 focus:bg-white outline-none transition-all resize-none font-medium"
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center bg-neutral-100 rounded-xl p-1.5 px-3">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-neutral-400 hover:text-text-dark p-1 transition-colors"><Minus size={16} /></button>
            <span className="w-8 text-center font-black text-lg">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="text-neutral-400 hover:text-text-dark p-1 transition-colors"><Plus size={16} /></button>
          </div>
          <button 
            onClick={() => onAddToCart({
              id: `${product.id}-${selectedSize}-${selectedExtras.map(e => e.name).join('-')}-${Date.now()}`,
              product,
              quantity,
              selectedSize,
              selectedExtras,
              observations,
              totalPrice: currentTotal
            })}
            className="flex-1 bg-brand-yellow text-text-dark py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-yellow-500/20 active:scale-95 transition-all"
          >
            Adicionar • {formatCurrency(currentTotal)}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function CartScreen({ cart, onUpdateQty, onRemove, onCheckout, formatCurrency, total }: { cart: CartItem[], onUpdateQty: (idx: number, delta: number) => void, onRemove: (idx: number) => void, onCheckout: () => void, formatCurrency: (v: number) => string, total: number }) {
  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[70vh]">
        <div className="w-24 h-24 bg-neutral-100 rounded-[2rem] flex items-center justify-center text-neutral-300 mb-6">
          <ShoppingCart size={40} />
        </div>
        <h2 className="text-2xl font-black mb-2">Sacola vazia</h2>
        <p className="text-neutral-400 text-sm font-medium mb-8">Você ainda não adicionou nenhum item delicioso ao seu pedido.</p>
        <button onClick={() => window.location.reload()} className="bg-brand-red text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-red-600/20 active:scale-95 transition-all">Explorar Cardápio</button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 pb-40">
      <h2 className="text-3xl font-black mb-6 tracking-tight">Sua Sacola</h2>
      
      <div className="flex flex-col gap-4 mb-10">
        {cart.map((item, idx) => (
          <div key={item.id} className="bg-white border border-neutral-100 p-3 rounded-[2rem] card-shadow flex gap-4">
            <img src={item.product.image} alt={item.product.name} className="w-24 h-24 rounded-2xl object-cover" referrerPolicy="no-referrer" />
            <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-sm truncate">{item.product.name}</h4>
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                    {item.selectedSize} {item.selectedExtras.length > 0 && `+ ${item.selectedExtras.length} extras`}
                  </p>
                </div>
                <button onClick={() => onRemove(idx)} className="text-neutral-300 hover:text-red-500 transition-colors p-1"><Trash2 size={16} /></button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-red font-black text-lg italic">{formatCurrency(item.totalPrice)}</span>
                <div className="flex items-center gap-3 bg-neutral-100 rounded-xl p-1 px-2">
                  <button onClick={() => onUpdateQty(idx, -1)} className="text-neutral-400 hover:text-text-dark transition-colors"><Minus size={14} /></button>
                  <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                  <button onClick={() => onUpdateQty(idx, 1)} className="text-neutral-400 hover:text-text-dark transition-colors"><Plus size={14} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-neutral-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red rounded-full blur-[60px] opacity-20 -mr-10 -mt-10" />
        <div className="flex justify-between items-center text-xs opacity-60 mb-2">
          <span>Subtotal</span>
          <span>{formatCurrency(total)}</span>
        </div>
        <div className="flex justify-between items-center text-xs opacity-60 mb-6">
          <span>Entrega</span>
          <span className="text-green-400 font-bold">GRÁTIS</span>
        </div>
        <div className="border-t border-white/10 pt-6 flex justify-between items-end">
          <div>
            <p className="text-[10px] uppercase font-bold opacity-40 mb-1">Valor Total</p>
            <span className="text-3xl font-black italic">{formatCurrency(total)}</span>
          </div>
          <button 
            onClick={onCheckout}
            className="bg-brand-red text-white h-14 px-8 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-red-600/40 active:scale-95 transition-all"
          >
            Checkout <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function CheckoutScreen({ onSend, total, formatCurrency }: { onSend: (d: OrderDetails) => void, total: number, formatCurrency: (v: number) => string }) {
  const [details, setDetails] = useState<OrderDetails>({
    customerName: '',
    phone: '',
    address: '',
    paymentMethod: 'Pix'
  });

  const isFormValid = details.customerName && details.phone && details.address;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 pb-40">
      <h2 className="text-3xl font-black mb-1">Checkout</h2>
      <p className="text-neutral-400 text-xs font-medium mb-10">Confirme seus dados para a entrega</p>

      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.15em] ml-1">Seu Nome</label>
          <input 
            type="text" 
            placeholder="Como quer ser chamado?"
            className="w-full p-4 bg-neutral-50 border border-neutral-100 rounded-xl focus:border-brand-red/50 focus:bg-white outline-none transition-all text-sm font-medium"
            value={details.customerName}
            onChange={(e) => setDetails({ ...details, customerName: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.15em] ml-1">WhatsApp / Telefone</label>
          <input 
            type="tel" 
            placeholder="(00) 00000-0000"
            className="w-full p-4 bg-neutral-50 border border-neutral-100 rounded-xl focus:border-brand-red/50 focus:bg-white outline-none transition-all text-sm font-medium"
            value={details.phone}
            onChange={(e) => setDetails({ ...details, phone: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.15em] ml-1">Endereço de Entrega</label>
          <textarea 
            placeholder="Rua, número, complemento..."
            className="w-full p-4 bg-neutral-50 border border-neutral-100 rounded-xl focus:border-brand-red/50 focus:bg-white outline-none transition-all text-sm font-medium h-24 resize-none"
            value={details.address}
            onChange={(e) => setDetails({ ...details, address: e.target.value })}
          />
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.15em] ml-1">Forma de Pagamento</label>
          <div className="grid grid-cols-3 gap-2">
            {(['Pix', 'Dinheiro', 'Cartão'] as const).map(method => (
              <button 
                key={method}
                onClick={() => setDetails({ ...details, paymentMethod: method })}
                className={`py-3 rounded-xl font-bold border-2 transition-all text-xs ${details.paymentMethod === method ? 'bg-white border-brand-red text-brand-red shadow-lg shadow-red-600/5' : 'bg-neutral-50 text-neutral-400 border-neutral-50'}`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 bg-neutral-50 p-6 rounded-3xl border-2 border-dashed border-neutral-200">
        <div className="flex justify-between items-center text-xs text-neutral-500 mb-1">
          <span>Subtotal</span>
          <span>{formatCurrency(total)}</span>
        </div>
        <div className="flex justify-between items-center text-xs text-neutral-500 mb-4">
          <span>Taxa de Entrega</span>
          <span className="font-bold text-green-600">GRÁTIS</span>
        </div>
        <div className="border-t border-neutral-200 pt-4 flex justify-between items-center">
          <span className="font-black text-lg">Total</span>
          <span className="font-black text-xl text-brand-red">{formatCurrency(total)}</span>
        </div>
      </div>

      <div className="fixed bottom-24 left-0 right-0 p-5 px-8 max-w-lg mx-auto bg-white/80 backdrop-blur-md">
        <button 
          disabled={!isFormValid}
          onClick={() => onSend(details)}
          className={`w-full py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-xl transition-all ${isFormValid ? 'bg-green-500 text-white shadow-green-500/20 active:scale-95' : 'bg-neutral-100 text-neutral-300 cursor-not-allowed'}`}
        >
          Finalizar via WhatsApp <PhoneCall size={18} />
        </button>
      </div>
    </motion.div>
  );
}

function AdminScreen({ products, setProducts, formatCurrency, onBack }: { products: Product[], setProducts: React.Dispatch<React.SetStateAction<Product[]>>, formatCurrency: (v: number) => string, onBack: () => void }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSave = () => {
    if (editingId) {
      setProducts(prev => prev.map(p => p.id === editingId ? { ...p, ...editForm } : p));
      setEditingId(null);
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: editForm.name || 'Novo Burger',
        description: editForm.description || '',
        price: editForm.price || 0,
        category: editForm.category || 'Tradicional',
        image: editForm.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
        sizes: ['Simples', 'Duplo'],
        extras: [{ name: 'Bacon', price: 4.50 }, { name: 'Queijo', price: 3.50 }]
      };
      setProducts(prev => [...prev, newProduct]);
      setEditingId(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 pb-32">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black">Painel Admin (Simulado)</h2>
        <button onClick={onBack} className="text-gray-400"><ArrowLeft /></button>
      </div>

      <button 
        onClick={() => { setEditingId('new'); setEditForm({ category: 'Tradicional', price: 0 }); }}
        className="w-full bg-black text-white py-4 rounded-2xl font-bold mb-8 flex items-center justify-center gap-2"
      >
        <Plus size={20} /> Novo Produto
      </button>

      {editingId && (
        <div className="fixed inset-0 z-[60] bg-black/50 p-6 flex items-center justify-center">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-6 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">{editingId === 'new' ? 'Novo Produto' : 'Editar Produto'}</h3>
            <div className="flex flex-col gap-4">
              <input 
                type="text" placeholder="Nome" className="p-3 bg-gray-100 rounded-xl"
                value={editForm.name || ''} onChange={e => setEditForm({ ...editForm, name: e.target.value })}
              />
              <textarea 
                placeholder="Descrição" className="p-3 bg-gray-100 rounded-xl h-24"
                value={editForm.description || ''} onChange={e => setEditForm({ ...editForm, description: e.target.value })}
              />
              <input 
                type="number" placeholder="Preço" className="p-3 bg-gray-100 rounded-xl"
                value={editForm.price || ''} onChange={e => setEditForm({ ...editForm, price: parseFloat(e.target.value) })}
              />
              <select 
                className="p-3 bg-gray-100 rounded-xl"
                value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value as CategoryType })}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input 
                type="text" placeholder="URL da Imagem" className="p-3 bg-gray-100 rounded-xl"
                value={editForm.image || ''} onChange={e => setEditForm({ ...editForm, image: e.target.value })}
              />
              <div className="flex gap-2 pt-4">
                <button onClick={() => setEditingId(null)} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold">Cancelar</button>
                <button onClick={handleSave} className="flex-1 py-3 bg-brand-red text-white rounded-xl font-bold">Salvar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {products.map(p => (
          <div key={p.id} className="bg-white border border-gray-100 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
              <div>
                <h4 className="font-bold">{p.name}</h4>
                <span className="text-xs text-brand-red font-bold">{formatCurrency(p.price)}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => { setEditingId(p.id); setEditForm(p); }}
                className="p-2 bg-gray-100 rounded-lg text-gray-500"
              ><ArrowLeft size={16} className="rotate-180" /></button>
              <button 
                onClick={() => handleDelete(p.id)}
                className="p-2 bg-red-50 rounded-lg text-red-500"
              ><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
