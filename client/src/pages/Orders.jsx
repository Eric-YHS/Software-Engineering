import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import Skeleton from '../components/Skeleton';

function Orders() {
  const { user, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return; // Wait for auth to load

    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/orders/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (err) {
        setError('Failed to fetch orders.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, token, authLoading, navigate]);

  if (loading || authLoading) {
    return (
        <div className="container mx-auto px-6 pt-28 pb-12 max-w-4xl">
            <div className="border-b border-stone-200 pb-4 mb-10">
                <Skeleton className="w-48 h-10" />
            </div>
            <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-stone-100">
                        <div className="flex justify-between items-start mb-6">
                            <div className="space-y-2">
                                <Skeleton className="w-32 h-6" />
                                <Skeleton className="w-48 h-4" />
                            </div>
                            <Skeleton className="w-24 h-8" />
                        </div>
                        <Skeleton className="w-full h-24 rounded-lg mb-4" />
                        <div className="flex justify-end">
                            <Skeleton className="w-24 h-4" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
  }

  if (error) {
    return <div className="text-center text-xl mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-6 pt-28 pb-12 max-w-4xl">
      <h1 className="text-4xl font-serif font-bold mb-10 text-stone-900 border-b border-stone-200 pb-4">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-20 bg-stone-100 rounded-2xl">
            <div className="text-5xl mb-4 text-stone-300 font-serif italic">Empty</div>
            <p className="text-lg text-stone-500 mb-8">You haven't placed any orders yet.</p>
            <button 
                onClick={() => navigate('/')} 
                className="btn-primary"
            >
                Start Shopping
            </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl p-6 shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-lg font-bold text-stone-800">Order #{order.id}</h2>
                        <span className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        order.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                        order.status === 'paid' ? 'bg-blue-50 text-blue-700' :
                        'bg-stone-100 text-stone-600'
                        }`}>
                        {order.status}
                        </span>
                    </div>
                    <p className="text-sm text-stone-400">{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-stone-400 uppercase tracking-wider">Total Amount</p>
                    <p className="text-xl font-serif font-bold text-[#2f5e41]">${Number(order.total_amount).toFixed(2)}</p>
                </div>
              </div>
              
              <div className="bg-stone-50 rounded-lg p-4 mb-4 text-sm text-stone-600 space-y-2">
                  <div className="flex justify-between">
                      <span>Event</span>
                      <span className="font-medium text-stone-800">{order.group_buy_title}</span>
                  </div>
                  <div className="flex justify-between">
                      <span>Station</span>
                      <span className="font-medium text-stone-800">{order.station_name}</span>
                  </div>
                  {order.pickup_code && order.status !== 'completed' && (
                    <div className="flex justify-between items-center pt-2 mt-2 border-t border-stone-200">
                        <span className="text-[#d97706] font-bold">Pickup Code</span>
                        <span className="font-mono text-lg font-bold tracking-widest bg-white px-3 py-1 rounded border border-stone-200 text-[#d97706]">{order.pickup_code}</span>
                    </div>
                  )}
              </div>

              <div className="text-right">
                  <button 
                    onClick={() => navigate(`/orders/${order.id}`)} 
                    className="text-sm font-bold text-stone-500 hover:text-[#2f5e41] transition-colors uppercase tracking-wider"
                  >
                    View Details &rarr;
                  </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
