import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import Skeleton from '../components/Skeleton';

function OrderDetails() {
  const { user, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(response.data);
      } catch (err) {
        setError('Failed to fetch order details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [user, token, authLoading, navigate, orderId]);

  if (loading || authLoading) {
    return (
        <div className="container mx-auto px-6 pt-28 pb-12 max-w-4xl">
            <div className="flex justify-center mb-8">
                <Skeleton className="w-64 h-10" />
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-stone-200">
                <div className="flex justify-between items-center mb-6">
                    <Skeleton className="w-40 h-8" />
                    <Skeleton className="w-24 h-6 rounded-full" />
                </div>
                <div className="space-y-4 mb-8">
                    <Skeleton className="w-3/4 h-4" />
                    <Skeleton className="w-1/2 h-4" />
                    <Skeleton className="w-1/3 h-4" />
                    <Skeleton className="w-1/4 h-4" />
                </div>
                
                <Skeleton className="w-24 h-6 mb-4" />
                <div className="space-y-3">
                    {[1, 2].map(i => (
                        <div key={i} className="flex items-center p-3">
                            <Skeleton className="w-12 h-12 rounded mr-3" />
                            <div className="flex-grow space-y-2">
                                <Skeleton className="w-48 h-4" />
                                <Skeleton className="w-24 h-3" />
                            </div>
                            <Skeleton className="w-16 h-4" />
                        </div>
                    ))}
                </div>
                <Skeleton className="w-40 h-10 mt-6 rounded" />
            </div>
        </div>
    );
  }

  if (error) {
    return <div className="text-center text-xl mt-8 text-red-500">{error}</div>;
  }

  if (!order) {
    return <div className="text-center text-xl mt-8">Order not found.</div>;
  }

  return (
    <div className="container mx-auto px-6 pt-28 pb-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Order #{order.id} Details</h1>
      <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-semibold text-gray-800">Order Information</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            order.status === 'completed' ? 'bg-green-100 text-green-800' :
            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {order.status}
          </span>
        </div>
        <p className="text-gray-600"><strong>Group Buy:</strong> {order.group_buy_title}</p>
        <p className="text-gray-600"><strong>Station:</strong> {order.station_name}</p>
        <p className="text-gray-600"><strong>Total Amount:</strong> ${order.total_amount}</p>
        <p className="text-gray-600"><strong>Ordered On:</strong> {new Date(order.created_at).toLocaleString()}</p>
        {order.pickup_code && order.status !== 'completed' && (
          <p className="text-blue-700 font-bold mt-2">Pickup Code: {order.pickup_code}</p>
        )}

        <h3 className="text-xl font-bold mt-6 mb-4 text-gray-800">Items:</h3>
        <div className="space-y-3">
          {order.items && order.items.map((item, index) => (
            <div key={index} className="flex items-center bg-gray-50 rounded-lg p-3">
              <img src={item.image_url || 'https://via.placeholder.com/50'} alt={item.product_name} className="w-12 h-12 object-cover rounded mr-3" />
              <div className="flex-grow">
                <p className="font-medium text-gray-700">{item.product_name}</p>
                <p className="text-sm text-gray-600">${Number(item.price).toFixed(2)} x {item.quantity}</p>
              </div>
              <p className="font-bold text-gray-800">${(Number(item.price) * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <button onClick={() => navigate('/orders')} className="mt-6 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
          Back to My Orders
        </button>
      </div>
    </div>
  );
}

export default OrderDetails;
