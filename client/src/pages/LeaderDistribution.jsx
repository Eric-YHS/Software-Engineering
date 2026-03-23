import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import Skeleton from '../components/Skeleton';

function LeaderDistribution() {
  const { stationId } = useParams();
  const { user, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState([]);
  const [stats, setStats] = useState(null); // New State for Stats
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pickupCode, setPickupCode] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== 'leader') {
      navigate('/login');
      return;
    }

    fetchData();
  }, [user, token, authLoading, navigate, stationId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Parallel fetch
      const [deliveriesRes, statsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/leader/station/${stationId}/pending-deliveries`, {
            headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE_URL}/leader/station/${stationId}/stats`, {
            headers: { Authorization: `Bearer ${token}` },
        })
      ]);
      
      setDeliveries(deliveriesRes.data);
      setStats(statsRes.data);
    } catch (err) {
      setError('Failed to fetch data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteOrder = async (orderId, code) => {
     // If code not provided in args, use state (for the manual input box)
    const codeToUse = code || pickupCode;
    const idToUse = orderId || selectedOrderId;

    if (!idToUse || !codeToUse) {
      alert('Please enter a pickup code.');
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/leader/order/${idToUse}/complete`,
        { pickupCode: codeToUse },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Order ${idToUse} marked as completed!`);
      setPickupCode('');
      setSelectedOrderId(null);
      fetchData(); // Refresh all data
    } catch (err) {
      console.error('Error completing order:', err.response?.data?.error || err.message);
      alert(`Error completing order: ${err.response?.data?.error || 'An unexpected error occurred.'}`);
    }
  };

  if (loading || authLoading) {
    return (
        <div className="container mx-auto px-6 pt-28 pb-12 max-w-6xl">
            <div className="mb-10 pb-6 border-b border-stone-200">
                <Skeleton className="w-64 h-10 mb-2" />
                <Skeleton className="w-48 h-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm">
                        <Skeleton className="w-24 h-4 mb-2" />
                        <Skeleton className="w-32 h-8" />
                    </div>
                ))}
            </div>

            <Skeleton className="w-48 h-8 mb-6" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2].map(i => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm">
                        <div className="flex justify-between mb-6">
                            <div className="space-y-2">
                                <Skeleton className="w-32 h-6" />
                                <Skeleton className="w-24 h-4" />
                            </div>
                            <Skeleton className="w-20 h-6 rounded-full" />
                        </div>
                        <div className="space-y-3 mb-6">
                            <Skeleton className="w-full h-4" />
                            <Skeleton className="w-3/4 h-4" />
                            <Skeleton className="w-1/2 h-4" />
                            <Skeleton className="w-full h-10 rounded bg-stone-50" />
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="flex-1 h-10 rounded-lg" />
                            <Skeleton className="w-24 h-10 rounded-lg" />
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
    <div className="container mx-auto px-6 pt-28 pb-12 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 pb-6 border-b border-stone-200">
          <div>
            <h1 className="text-4xl font-serif font-bold text-stone-900 mb-2">站点运营数据</h1>
            <p className="text-stone-500">追踪销售业绩与处理用户自提。</p>
          </div>
          <span className="bg-stone-100 text-stone-600 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider border border-stone-200">站点 ID: {stationId}</span>
      </div>

      {/* Stats Dashboard */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
                <p className="text-stone-500 text-sm uppercase tracking-wide">累计销售额</p>
                <p className="text-2xl font-bold text-stone-900">¥{Number(stats.total_sales).toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
                <p className="text-stone-500 text-sm uppercase tracking-wide">我的佣金 (5%)</p>
                <p className="text-2xl font-bold text-green-600">¥{Number(stats.commission).toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
                <p className="text-stone-500 text-sm uppercase tracking-wide">已完成订单</p>
                <p className="text-2xl font-bold text-blue-600">{stats.completed_orders}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
                <p className="text-stone-500 text-sm uppercase tracking-wide">待核销取货</p>
                <p className="text-2xl font-bold text-orange-500">{stats.pending_pickup}</p>
            </div>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6 text-stone-800">待处理订单</h2>

      {deliveries.length === 0 ? (
        <div className="text-center py-12 bg-stone-50 rounded-xl">
            <p className="text-lg text-stone-500">暂无待处理订单。工作辛苦了！</p>
        </div>
      ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {deliveries.map((order) => (
              <div key={order.order_id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-stone-100 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                      <h3 className="text-lg font-bold text-stone-800">订单 #{order.order_id}</h3>
                      <p className="text-sm text-stone-500">{new Date().toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    order.status === 'arrived' ? 'bg-green-100 text-green-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status === 'paid' ? '已付款' : 
                     order.status === 'shipped' ? '运输中' : 
                     order.status === 'arrived' ? '待取货' : order.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-6 flex-grow">
                    <div className="flex justify-between">
                        <span className="text-stone-600">客户:</span>
                        <span className="font-medium">{order.customer_name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-stone-600">电话:</span>
                        <span className="font-medium">{order.customer_phone}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-stone-600">总金额:</span>
                        <span className="font-bold text-stone-900">¥{order.total_amount}</span>
                    </div>
                    <div className="flex justify-between bg-stone-50 p-2 rounded">
                        <span className="text-stone-600">取件码:</span>
                        <span className="font-mono font-bold text-[#2f5e41]">{order.pickup_code}</span>
                    </div>
                </div>

                <div className="pt-4 border-t border-stone-100">
                    <div className="flex space-x-2">
                        <input 
                            type="text" 
                            placeholder="输入取件码核销" 
                            className="flex-1 border border-stone-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2f5e41] outline-none"
                            id={`code-${order.order_id}`}
                        />
                        <button 
                            onClick={() => {
                                const input = document.getElementById(`code-${order.order_id}`);
                                handleCompleteOrder(order.order_id, input.value);
                            }}
                            className="bg-[#2f5e41] hover:bg-[#244a33] text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                            核销完成
                        </button>
                    </div>
                </div>
              </div>
            ))}
          </div>
      )}
    </div>
  );
}

export default LeaderDistribution;
