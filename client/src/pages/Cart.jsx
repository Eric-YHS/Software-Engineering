import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

function Cart() {
  const { cartItems, updateCartQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user) {
      alert('Please login to checkout.');
      navigate('/login');
      return;
    }
    if (cartItems.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    // Group items by group_buy_id
    const ordersByGroup = cartItems.reduce((acc, item) => {
      const groupId = item.group_buy_id || 1; // Default to 1 if missing (fallback)
      if (!acc[groupId]) {
        acc[groupId] = {
          station_id: 1, // Hardcoded station
          group_buy_id: groupId,
          product_ids: [],
          quantities: []
        };
      }
      acc[groupId].product_ids.push(item.id);
      acc[groupId].quantities.push(item.quantity);
      return acc;
    }, {});

    try {
      const orderPromises = Object.values(ordersByGroup).map(orderPayload => 
        axios.post(
          `${API_BASE_URL}/orders`,
          orderPayload,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );

      await Promise.all(orderPromises);

      alert('Orders placed successfully!');
      clearCart();
      navigate('/orders');
    } catch (error) {
      console.error('Checkout failed:', error);
      const msg = error.response?.data?.error || error.message;
      alert(`Checkout failed: ${msg}. Please try again.`);
    }
  };

  return (
    <div className="container mx-auto px-6 pt-28 pb-12 max-w-5xl">
      <h1 className="text-4xl font-serif font-bold mb-10 text-stone-900">购物车</h1>
      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-stone-100 rounded-3xl">
            <div className="text-6xl mb-6 text-stone-300 font-serif italic">空</div>
            <p className="text-xl text-stone-500 mb-8 font-sans">您的购物车还是空的。</p>
            <Link to="/" className="btn-primary inline-block">
                去逛逛
            </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-grow space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center bg-white rounded-2xl p-6 shadow-sm border border-stone-100 hover:shadow-md transition-all duration-300">
                <img src={item.image_url || 'https://via.placeholder.com/100'} alt={item.name} className="w-24 h-24 object-cover rounded-xl border border-stone-100 mr-6" />
                <div className="flex-grow">
                  <h2 className="text-lg font-bold text-stone-800 font-serif mb-1">{item.name}</h2>
                  <p className="text-stone-500 text-sm mb-4">单价: <span className="font-medium text-stone-900">¥{Number(item.price).toFixed(2)}</span></p>
                  
                  <div className="flex items-center justify-between sm:justify-start">
                    <div className="flex items-center bg-stone-100 rounded-full p-1">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-stone-600 hover:text-[#2f5e41] transition-colors"
                        >
                          -
                        </button>
                        <span className="w-10 text-center text-stone-800 font-bold text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-stone-600 hover:text-[#2f5e41] transition-colors"
                        >
                          +
                        </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-6 text-stone-400 hover:text-red-500 text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </div>
                <div className="text-right pl-4">
                    <p className="text-xl font-bold text-stone-900 font-serif">¥{(Number(item.price) * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:w-96 shrink-0">
            <div className="bg-white rounded-3xl shadow-lg shadow-stone-200/50 p-8 sticky top-32 border border-stone-100">
                <h3 className="text-xl font-serif font-bold text-stone-900 mb-6">订单摘要</h3>
                <div className="flex justify-between items-center mb-8 pb-8 border-b border-stone-100">
                    <span className="text-stone-500 font-medium">商品总额</span>
                    <span className="text-3xl font-serif font-bold text-[#2f5e41]">¥{getTotalPrice()}</span>
                </div>
                <div className="space-y-4">
                    <button
                        onClick={handleCheckout}
                        className="w-full bg-[#2f5e41] hover:bg-[#244a33] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#2f5e41]/20 transition-all transform hover:-translate-y-1"
                    >
                        立即结算
                    </button>
                    <button
                        onClick={clearCart}
                        className="w-full bg-transparent text-stone-400 font-bold text-xs uppercase tracking-widest py-3 hover:text-stone-600 transition-colors"
                    >
                        清空购物车
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
