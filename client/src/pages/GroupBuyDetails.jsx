import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { API_BASE_URL } from '../config';
import Skeleton from '../components/Skeleton';

function GroupBuyDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [groupBuy, setGroupBuy] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [gbRes, itemsRes] = await Promise.all([
            axios.get(`${API_BASE_URL}/group-buys`),
            axios.get(`${API_BASE_URL}/group-buys/${id}/items`)
        ]);
        const foundGb = gbRes.data.find(gb => gb.id === parseInt(id));
        if (foundGb) setGroupBuy(foundGb);
        else setError('Event not found');
        setItems(itemsRes.data);
      } catch (err) {
        setError('Error loading data');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen pt-32 pb-20 px-6 md:px-12 max-w-[1600px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          {/* Left Skeleton */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 lg:h-fit">
             <Skeleton className="w-24 h-4 mb-8" />
             <Skeleton className="w-3/4 h-12 mb-6" />
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 space-y-4">
                <div className="flex justify-between pb-4 border-b border-stone-100">
                   <Skeleton className="w-16 h-4" />
                   <Skeleton className="w-20 h-6 rounded-full" />
                </div>
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-2/3 h-4" />
             </div>
          </div>

          {/* Right Grid Skeleton */}
          <div className="lg:col-span-8">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-16">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="flex flex-col">
                        <Skeleton className="aspect-[4/5] rounded-2xl mb-6" />
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Skeleton className="w-1/2 h-6" />
                                <Skeleton className="w-16 h-6" />
                            </div>
                            <Skeleton className="w-full h-4" />
                            <Skeleton className="w-20 h-3" />
                        </div>
                    </div>
                ))}
             </div>
          </div>
      </div>
    </div>
  );

  if (!groupBuy) return <div className="min-h-screen pt-32 text-center">Not Found</div>;

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 md:px-12 max-w-[1600px] mx-auto">
        
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          {/* Left: Sticky Header / Context */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 lg:h-fit">
             <Link to="/" className="text-xs font-bold tracking-widest text-stone-400 hover:text-stone-800 uppercase mb-8 block transition-colors">
                &larr; 返回首页
             </Link>
             
             <h1 className="text-5xl md:text-6xl font-serif text-stone-900 mb-6 leading-tight">
               {groupBuy.title}
             </h1>
             
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
                <div className="flex justify-between items-center border-b border-stone-100 pb-4 mb-4">
                   <span className="text-xs font-bold uppercase text-stone-400 tracking-wider">状态</span>
                   <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${groupBuy.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-500'}`}>
                      {groupBuy.status === 'active' ? '进行中' : groupBuy.status}
                   </span>
                </div>
                <div className="space-y-4 text-sm text-stone-600">
                    <div className="flex justify-between">
                        <span>结束时间</span>
                        <span className="font-medium text-stone-900">{new Date(groupBuy.end_time).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>可选商品</span>
                        <span className="font-medium text-stone-900">{items.length} 件</span>
                    </div>
                </div>
             </div>
          </div>

          {/* Right: Product Grid */}
          <div className="lg:col-span-8">
             {items.length === 0 ? (
                 <div className="py-20 text-center text-stone-400 italic font-serif text-2xl">已售罄</div>
             ) : (
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-16">
                    {items.map(item => {
                        const isOutOfStock = (item.stock - item.sold_count) <= 0;
                        return (
                            <div key={item.product_id} className="group flex flex-col">
                                {/* Image Area */}
                                <div className="relative aspect-[4/5] bg-stone-100 rounded-2xl overflow-hidden mb-6">
                                    <img 
                                        src={item.image_url || 'https://via.placeholder.com/400'} 
                                        alt={item.name}
                                        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isOutOfStock ? 'grayscale opacity-50' : ''}`}
                                    />
                                    {isOutOfStock && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="bg-white/90 backdrop-blur px-4 py-2 text-xs font-bold uppercase tracking-widest border border-stone-200">已售罄</span>
                                        </div>
                                    )}
                                    {!isOutOfStock && (
                                        <button 
                                            onClick={() => addToCart({
                                                id: item.product_id,
                                                name: item.name,
                                                price: item.price,
                                                image_url: item.image_url,
                                                group_buy_id: item.group_buy_id
                                            })}
                                            className="absolute bottom-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#2f5e41] hover:text-white"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                                
                                {/* Text Area */}
                                <div>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="text-xl font-serif text-stone-900">{item.name}</h3>
                                        <span className="text-lg font-bold text-[#2f5e41] font-sans">¥{Number(item.price).toFixed(2)}</span>
                                    </div>
                                    <p className="text-sm text-stone-500 line-clamp-2 mb-3 leading-relaxed">{item.description}</p>
                                    
                                    {!isOutOfStock && (
                                        <div className="text-xs font-bold text-stone-400 tracking-wider uppercase">
                                            仅剩 {item.stock - item.sold_count} 件
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                 </div>
             )}
          </div>
      </div>
    </div>
  );
}

export default GroupBuyDetails;