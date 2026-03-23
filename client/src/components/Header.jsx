import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import logo from '../assets/logo.png';

function Header() {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Helper function to get display name for user role
  const getUserRoleName = (role) => {
    switch (role) {
      case 'admin':
        return '管理员';
      case 'leader':
        return '团长';
      case 'customer':
        return '顾客';
      default:
        return role;
    }
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinkClass = (path) => {
    const base = "nav-pill cursor-pointer";
    return location.pathname === path ? `${base} nav-pill-active` : base;
  };

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'apple-header py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo Area */}
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src={logo} 
            alt="LiuHai Logo" 
            className="w-10 h-10 object-cover rounded-xl shadow-sm group-hover:scale-105 transition-transform duration-300" 
          />
          <span className="text-xl font-sans font-semibold text-[#1D1D1F] tracking-tight">
            刘海<span className="text-[#2f5e41]">买菜</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-2">
          <Link to="/" className={getNavLinkClass('/')}>首页</Link>
          
          {user && user.role === 'customer' && (
            <Link to="/orders" className={getNavLinkClass('/orders')}>我的订单</Link>
          )}
          
          {user && user.role === 'leader' && (
             <Link to="/leader/dashboard" className={getNavLinkClass('/leader/dashboard')}>团长中心</Link>
          )}
          
          {user && user.role === 'admin' && (
            <>
                <Link to="/admin/products" className={getNavLinkClass('/admin/products')}>商品管理</Link>
                <Link to="/admin/logistics" className={getNavLinkClass('/admin/logistics')}>物流发货</Link>
            </>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-6">
          <Link to="/cart" className="relative group p-2 rounded-full hover:bg-[rgba(0,0,0,0.05)] transition-colors">
            <span className="text-[#1D1D1F]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
            </span>
            {getTotalItems() > 0 && (
              <span className="absolute top-0 right-0 bg-[#FF3B30] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {getTotalItems()}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="text-right hidden lg:block">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
                  {getUserRoleName(user.role)}
                </p>
                <p className="text-sm font-medium text-[#1D1D1F] leading-none">{user.username}</p>
              </div>
              <button 
                onClick={handleLogout} 
                className="text-sm font-medium text-[#007AFF] hover:opacity-70 transition-opacity"
              >
                退出
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="bg-[#007AFF] text-white px-5 py-2 rounded-full text-sm font-medium transition-all active:scale-95 hover:bg-[#0071e3]"
            >
              登录
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
