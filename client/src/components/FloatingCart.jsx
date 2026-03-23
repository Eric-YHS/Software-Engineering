import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function FloatingCart() {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems, getTotalItems, getTotalPrice, updateCartQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const totalItems = getTotalItems();

  // Don't render if cart is empty
  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end pointer-events-none">
      {/* Expanded Cart Panel */}
      <div 
        className={`pointer-events-auto bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl w-80 mb-4 overflow-hidden transition-all duration-300 origin-bottom-right border border-white/50 ${
          isOpen 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-10 pointer-events-none h-0'
        }`}
      >
        <div className="p-4 bg-[#2f5e41] text-white flex justify-between items-center">
          <h3 className="font-serif font-bold text-lg">您的菜篮子</h3>
          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{totalItems} 件商品</span>
        </div>
        
        <div className="max-h-64 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-stone-200">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-2 hover:bg-stone-100/50 rounded-lg transition-colors border-b border-stone-100 last:border-0">
              <img 
                src={item.image_url || '/images/prod-default.jpg'} 
                alt={item.name} 
                className="w-12 h-12 object-cover rounded-md shadow-sm"
              />
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <p className="text-sm font-medium text-stone-800 truncate">{item.name}</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-stone-200 rounded-full h-6">
                    <button 
                      onClick={() => item.quantity > 1 ? updateCartQuantity(item.id, item.quantity - 1) : removeFromCart(item.id)}
                      className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-stone-300 rounded-full transition-colors"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-stone-300 rounded-full transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-xs text-stone-400">
                    ¥{item.price}/份
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="text-sm font-bold text-[#2f5e41]">
                  ¥{(item.price * item.quantity).toFixed(2)}
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-stone-400 hover:text-red-500 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-stone-50 border-t border-stone-100">
          <div className="flex justify-between items-center mb-4">
            <span className="text-stone-500 text-sm">合计</span>
            <span className="text-xl font-bold text-stone-900">¥{getTotalPrice()}</span>
          </div>
          <button 
            onClick={() => navigate('/cart')}
            className="w-full bg-[#2f5e41] hover:bg-[#244a33] text-white py-3 rounded-xl font-bold shadow-lg shadow-[#2f5e41]/20 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span>去结算</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`pointer-events-auto relative group flex items-center justify-center w-16 h-16 rounded-full shadow-xl shadow-[#2f5e41]/30 transition-all duration-300 hover:-translate-y-1 ${isOpen ? 'bg-stone-800 rotate-90' : 'bg-[#2f5e41]'}`}
      >
        {isOpen ? (
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-white">
             <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
           </svg>
        ) : (
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-white">
             <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
           </svg>
        )}
        
        {/* Badge (Only show when collapsed) */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 bg-[#d97706] text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-stone-50 animate-bounce-slight">
            {totalItems}
          </span>
        )}
      </button>
    </div>
  );
}

export default FloatingCart;
