import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import Skeleton from '../components/Skeleton';

function Home() {
  const [groupBuys, setGroupBuys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroupBuys = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/group-buys`);
        setGroupBuys(response.data);
      } catch (err) {
        setError('Failed to fetch group buys.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupBuys();
  }, []);

  if (loading) return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero Skeleton */}
      <section className="container mx-auto px-6 mb-32">
        <div className="apple-card h-[600px] w-full relative p-12 flex flex-col justify-center gap-6">
           <Skeleton className="w-32 h-4" />
           <Skeleton className="w-2/3 h-16" />
           <Skeleton className="w-1/2 h-6" />
           <Skeleton className="w-40 h-12 rounded-full mt-4" />
        </div>
      </section>

      {/* Grid Skeleton */}
      <section className="container mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
           <div className="space-y-2">
             <Skeleton className="w-48 h-8" />
             <Skeleton className="w-32 h-4" />
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="apple-card h-[500px] p-4">
              <Skeleton className="h-[300px] w-full mb-6" />
              <Skeleton className="w-3/4 h-6 mb-3" />
              <Skeleton className="w-1/2 h-4" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  if (error) return <div className="h-screen flex items-center justify-center text-[#FF3B30] font-medium">{error}</div>;

  return (
    <div className="min-h-screen pt-24 pb-20">
      
      {/* Hero Section */}
      <section className="container mx-auto px-6 mb-24 fade-in-up">
        <div className="apple-card relative overflow-hidden min-h-[600px] flex items-center">
            {/* Background Image */}
            <div className="absolute inset-0">
                 <img 
                    src="/images/hero-bg.jpg" 
                    alt="Hero Background" 
                    className="w-full h-full object-cover opacity-90"
                 />
                 <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent" />
            </div>
            
            <div className="relative z-10 pl-12 md:pl-24 max-w-2xl">
                <span className="text-[#2f5e41] font-bold tracking-widest uppercase text-xs mb-4 block">
                  Nature's Finest
                </span>
                <h1 className="text-5xl md:text-7xl font-bold text-[#1D1D1F] leading-tight mb-6 tracking-tight">
                  寻味自然, <br/>
                  <span className="text-[#2f5e41]">鲜活</span> 每一天。
                </h1>
                <p className="text-xl text-[#86868b] mb-10 leading-relaxed font-medium max-w-md">
                  刘海买菜为您甄选当季最优质的生鲜食材，从田间到餐桌，只需一步。
                </p>
                <button onClick={() => window.scrollTo({top: 800, behavior: 'smooth'})} className="btn-primary text-lg px-8 py-3 shadow-lg shadow-[#2f5e41]/20">
                  立即探索
                </button>
            </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="container mx-auto px-6">
        <div className="flex items-end justify-between mb-12 px-2 fade-in-up" style={{animationDelay: '0.1s'}}>
           <div>
             <h2 className="text-3xl font-bold text-[#1D1D1F] mb-2">热门专场</h2>
             <p className="text-[#86868b] font-medium">限时特惠，源头直采</p>
           </div>
           <div className="text-[#86868b] text-sm font-medium hidden md:block bg-white px-4 py-1 rounded-full shadow-sm border border-[rgba(0,0,0,0.05)]">
             {groupBuys.length} 个正在进行
           </div>
        </div>

        {groupBuys.length === 0 ? (
          <div className="text-center py-32 fade-in-up">
             <div className="text-4xl text-[#86868b] mb-4 font-bold">暂无活动</div>
             <p className="text-[#86868b]">敬请期待下一轮团购。</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 fade-in-up" style={{animationDelay: '0.2s'}}>
            {groupBuys.map((gb, index) => {
               let bgImage = '/images/collection-default.jpg'; 
               const titleLower = gb.title.toLowerCase();
               
               if (titleLower.includes('火锅') || titleLower.includes('hotpot')) bgImage = '/images/collection-hotpot-cover.jpg'; 
               else if (titleLower.includes('水果') || titleLower.includes('车厘子')) bgImage = '/images/collection-fruit-cover.jpg'; 
               else if (titleLower.includes('早餐') || titleLower.includes('egg')) bgImage = '/images/collection-daily-cover.jpg'; 
               else if (titleLower.includes('海鲜') || titleLower.includes('seafood')) bgImage = '/images/collection-seafood.jpg';
               else if (titleLower.includes('蔬菜') || titleLower.includes('veg')) bgImage = '/images/collection-veg.jpg';
               else if (titleLower.includes('零食') || titleLower.includes('snack')) bgImage = '/images/collection-weekend.jpg';

               return (
              <Link to={`/group-buy/${gb.id}`} key={gb.id} className="group block h-full">
                <div className="apple-card h-full flex flex-col overflow-hidden">
                   {/* Image Area */}
                   <div className="relative h-[320px] w-full overflow-hidden border-b border-[rgba(0,0,0,0.05)]">
                      <img 
                        src={bgImage} 
                        alt="Collection"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      
                      {/* Status Badge - Glassmorphism */}
                      <div className="absolute top-4 left-4">
                         <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase backdrop-blur-xl shadow-sm ${
                           gb.status === 'active' 
                             ? 'bg-white/90 text-[#2f5e41]' 
                             : 'bg-black/60 text-white'
                         }`}>
                           {gb.status === 'active' ? '进行中' : gb.status}
                         </span>
                      </div>
                   </div>

                   {/* Content Area */}
                   <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                         <h3 className="text-xl font-bold text-[#1D1D1F] mb-2 group-hover:text-[#2f5e41] transition-colors">
                           {gb.title}
                         </h3>
                         <p className="text-sm text-[#86868b] font-medium mb-4">
                           精选优质食材，限时限量供应。
                         </p>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-[rgba(0,0,0,0.05)]">
                        <div className="text-xs font-semibold text-[#86868b] uppercase tracking-wide">
                          {new Date(gb.end_time).toLocaleDateString()} 截单
                        </div>
                        <span className="w-8 h-8 rounded-full bg-[#F5F5F7] flex items-center justify-center text-[#1D1D1F] group-hover:bg-[#2f5e41] group-hover:text-white transition-colors">
                          &rarr;
                        </span>
                      </div>
                   </div>
                </div>
              </Link>
            );})}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
