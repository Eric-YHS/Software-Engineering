import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import Skeleton from '../components/Skeleton';

function LeaderDashboard() {
  const { user, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== 'leader') {
      navigate('/login'); // Redirect if not logged in or not a leader
      return;
    }

    const fetchLeaderStations = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/leader/my-stations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStations(response.data);
      } catch (err) {
        const errorMsg = err.response?.data?.error || err.message || 'Failed to fetch stations.';
        setError(errorMsg);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderStations();
  }, [user, token, authLoading, navigate]);

  if (loading || authLoading) {
    return (
        <div className="container mx-auto px-6 pt-28 pb-12 max-w-5xl">
            <div className="mb-12 space-y-3">
                <Skeleton className="w-64 h-10" />
                <Skeleton className="w-48 h-4" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white rounded-2xl p-8 border border-stone-100 shadow-sm">
                        <div className="flex justify-between mb-6">
                            <Skeleton className="w-12 h-12 rounded-full" />
                            <Skeleton className="w-16 h-4" />
                        </div>
                        <Skeleton className="w-3/4 h-8 mb-4" />
                        <Skeleton className="w-full h-12 mb-8" />
                        <Skeleton className="w-full h-12 rounded-xl" />
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
    <div className="container mx-auto px-6 pt-28 pb-12 max-w-5xl">
      <div className="mb-12">
        <h1 className="text-4xl font-serif font-bold mb-2 text-stone-900">自提点概览</h1>
        <p className="text-stone-500">管理您负责的社区站点。</p>
      </div>

      {stations.length === 0 ? (
        <div className="text-center py-24 bg-stone-50 rounded-3xl">
            <p className="text-xl text-stone-400 font-serif">您暂未绑定任何站点。</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stations.map((station) => (
            <div key={station.id} className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100 hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-2xl">
                      🏠
                  </div>
                  <span className="text-xs font-bold text-stone-300 uppercase tracking-wider">站点 #{station.id}</span>
              </div>
              <h2 className="text-2xl font-serif font-bold mb-2 text-stone-800 group-hover:text-[#2f5e41] transition-colors">{station.name}</h2>
              <p className="text-stone-500 mb-8 h-12 line-clamp-2 text-sm leading-relaxed">{station.address}</p>
              <Link 
                to={`/leader/station/${station.id}/deliveries`} 
                className="block w-full text-center bg-stone-900 hover:bg-[#2f5e41] text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-stone-200"
              >
                管理订单与核销 &rarr;
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LeaderDashboard;
