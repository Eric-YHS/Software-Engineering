import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import Skeleton from '../components/Skeleton';

function AdminLogistics() {
  const { user, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    fetchOrders();
  }, [user, token, authLoading, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/orders/to-ship`, {
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

  const handleShipOrder = async (orderId) => {
    try {
      await axios.post(
        `${API_BASE_URL}/admin/orders/${orderId}/ship`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Optimistic update or refresh
      setOrders(orders.filter(o => o.id !== orderId));
      alert(`Order #${orderId} has been shipped!`);
    } catch (err) {
      console.error('Error shipping order:', err);
      alert('Failed to ship order.');
    }
  };

  if (loading || authLoading) {
    return (
        <div className="container mx-auto px-6 pt-28 pb-12 max-w-6xl">
            <div className="flex justify-between items-end mb-10 border-b border-stone-200 pb-6">
                <div className="space-y-2">
                    <Skeleton className="w-64 h-10" />
                    <Skeleton className="w-48 h-4" />
                </div>
                <Skeleton className="w-32 h-8 rounded-full" />
            </div>
            <div className="bg-white rounded-3xl border border-stone-100 overflow-hidden">
                <div className="bg-stone-50 px-8 py-5 border-b border-stone-100">
                    <div className="flex justify-between">
                        {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="w-24 h-4" />)}
                    </div>
                </div>
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="px-8 py-5 border-b border-stone-50 flex justify-between items-center">
                        <Skeleton className="w-20 h-4" />
                        <Skeleton className="w-32 h-4" />
                        <Skeleton className="w-40 h-6 rounded-full" />
                        <Skeleton className="w-32 h-4" />
                        <Skeleton className="w-24 h-8 rounded-lg" />
                    </div>
                ))}
            </div>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-6 pt-28 pb-12 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-stone-200 pb-6">
          <div>
            <h1 className="text-4xl font-serif font-bold text-stone-900 mb-2">物流调度中心</h1>
            <p className="text-stone-500">管理总仓到站点的发货流程。</p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="bg-purple-50 text-purple-700 px-5 py-2 rounded-full font-bold text-sm border border-purple-100 shadow-sm">
                待发货: {orders.length}
            </span>
          </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-24 bg-stone-50 rounded-3xl border border-stone-100">
            <div className="text-6xl mb-6 opacity-20">🚚</div>
            <h3 className="text-xl font-bold text-stone-400 mb-2">暂无任务</h3>
            <p className="text-stone-400">所有订单均已发货完毕。</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-lg shadow-stone-200/50 overflow-hidden border border-stone-100">
            <table className="min-w-full divide-y divide-stone-100">
                <thead className="bg-stone-50">
                    <tr>
                        <th className="px-8 py-5 text-left text-xs font-bold text-stone-400 uppercase tracking-wider">订单编号</th>
                        <th className="px-8 py-5 text-left text-xs font-bold text-stone-400 uppercase tracking-wider">客户</th>
                        <th className="px-8 py-5 text-left text-xs font-bold text-stone-400 uppercase tracking-wider">自提点</th>
                        <th className="px-8 py-5 text-left text-xs font-bold text-stone-400 uppercase tracking-wider">下单时间</th>
                        <th className="px-8 py-5 text-right text-xs font-bold text-stone-400 uppercase tracking-wider">操作</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-stone-100">
                    {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-stone-50/50 transition-colors group">
                            <td className="px-8 py-5 whitespace-nowrap font-mono font-bold text-stone-500">#{order.id}</td>
                            <td className="px-8 py-5 whitespace-nowrap font-medium text-stone-800">{order.customer}</td>
                            <td className="px-8 py-5 whitespace-nowrap">
                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                                    {order.station_name}
                                </span>
                            </td>
                            <td className="px-8 py-5 whitespace-nowrap text-stone-500 text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
                            <td className="px-8 py-5 whitespace-nowrap text-right">
                                <button
                                    onClick={() => handleShipOrder(order.id)}
                                    className="text-white bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg shadow-md shadow-blue-200 text-xs font-bold uppercase tracking-wider transition-all transform hover:-translate-y-0.5"
                                >
                                    立即发货
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      )}
    </div>
  );
}

export default AdminLogistics;
