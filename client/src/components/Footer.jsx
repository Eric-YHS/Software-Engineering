import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-[#1c1917] text-stone-400 pt-24 pb-12 mt-auto">
      <div className="container mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-6">
            <Link to="/" className="block">
              <span className="text-3xl font-serif font-bold text-stone-100 tracking-tight">
                刘海<span className="text-[#2f5e41]">买菜</span>.
              </span>
            </Link>
            <p className="text-stone-500 leading-relaxed max-w-sm font-sans">
              重新定义社区生鲜体验。我们将田间地头的纯粹风味，以最优雅的方式呈献给热爱生活的你。
            </p>
            <div className="flex gap-4 pt-4">
               {/* Social Placeholders */}
               <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-[#2f5e41] hover:text-white transition-colors cursor-pointer">
                 <span className="font-serif italic">i</span>
               </div>
               <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-[#2f5e41] hover:text-white transition-colors cursor-pointer">
                 <span className="font-serif italic">f</span>
               </div>
               <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-[#2f5e41] hover:text-white transition-colors cursor-pointer">
                 <span className="font-serif italic">w</span>
               </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="text-stone-100 font-serif text-lg">探索</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-[#2f5e41] transition-colors">当季新品</a></li>
              <li><a href="#" className="hover:text-[#2f5e41] transition-colors">人气热销</a></li>
              <li><a href="#" className="hover:text-[#2f5e41] transition-colors">产地直采</a></li>
              <li><a href="#" className="hover:text-[#2f5e41] transition-colors">节日礼盒</a></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-6">
            <h4 className="text-stone-100 font-serif text-lg">关于</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-[#2f5e41] transition-colors">品牌故事</a></li>
              <li><a href="#" className="hover:text-[#2f5e41] transition-colors">可持续发展</a></li>
              <li><a href="#" className="hover:text-[#2f5e41] transition-colors">加入我们</a></li>
              <li><a href="#" className="hover:text-[#2f5e41] transition-colors">联系客服</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-4 space-y-6">
            <h4 className="text-stone-100 font-serif text-lg">订阅生活</h4>
            <p className="text-xs text-stone-500">获取每周精选食谱与独家优惠。</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="您的邮箱地址" 
                className="bg-stone-800 border-none text-stone-300 text-sm px-4 py-3 w-full rounded-lg focus:ring-1 focus:ring-[#2f5e41] outline-none"
              />
              <button className="bg-[#2f5e41] text-white px-6 py-3 rounded-lg text-sm hover:bg-[#244a33] transition-colors font-medium">
                订阅
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-stone-600 gap-4">
          <div>&copy; {new Date().getFullYear()} LiuHai Fresh. All rights reserved.</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-stone-400">隐私政策</a>
            <a href="#" className="hover:text-stone-400">服务条款</a>
            <a href="#" className="hover:text-stone-400">Cookie 设置</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
