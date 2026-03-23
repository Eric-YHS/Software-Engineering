import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import Skeleton from '../components/Skeleton';

function AdminProducts() {
  const { user, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newProductName, setNewProductName] = useState('');
  const [newProductDescription, setNewProductDescription] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('');
  const [newProductBasePrice, setNewProductBasePrice] = useState('');
  const [newProductShelfLife, setNewProductShelfLife] = useState('');
  const [newProductImageUrl, setNewProductImageUrl] = useState('');

  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== 'admin') {
      navigate('/login'); // Redirect if not logged in or not an admin
      return;
    }

    fetchProducts();
  }, [user, token, authLoading, navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_BASE_URL}/admin/products`,
        {
          name: newProductName,
          description: newProductDescription,
          category: newProductCategory,
          base_price: parseFloat(newProductBasePrice),
          shelf_life_days: parseInt(newProductShelfLife),
          image_url: newProductImageUrl,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Product added successfully!');
      // Clear form
      setNewProductName('');
      setNewProductDescription('');
      setNewProductCategory('');
      setNewProductBasePrice('');
      setNewProductShelfLife('');
      setNewProductImageUrl('');
      fetchProducts(); // Refresh product list
    } catch (err) {
      console.error('Error adding product:', err.response?.data?.error || err.message);
      alert(`Error adding product: ${err.response?.data?.error || 'An unexpected error occurred.'}`);
    }
  };


  if (loading || authLoading) {
    return (
        <div className="container mx-auto px-6 pt-28 pb-12">
            <div className="mb-10 border-b border-stone-200 pb-6">
                <Skeleton className="w-64 h-10 mb-2" />
                <Skeleton className="w-48 h-4" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Form Skeleton */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl p-8 border border-stone-100 shadow-sm space-y-6">
                        <Skeleton className="w-32 h-6 mb-6" />
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="w-20 h-3" />
                                <Skeleton className="w-full h-10" />
                            </div>
                        ))}
                        <Skeleton className="w-full h-12 rounded-xl mt-4" />
                    </div>
                </div>

                {/* List Skeleton */}
                <div className="lg:col-span-2">
                    <Skeleton className="w-48 h-8 mb-8" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
                                <Skeleton className="h-48 w-full rounded-xl mb-4" />
                                <Skeleton className="w-3/4 h-6 mb-2" />
                                <Skeleton className="w-full h-4 mb-2" />
                                <Skeleton className="w-1/2 h-4" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
  }

  if (error) {
    return <div className="text-center text-xl mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-6 pt-28 pb-12">
      <div className="flex justify-between items-end mb-10 border-b border-stone-200 pb-6">
        <div>
            <h1 className="text-4xl font-serif font-bold text-stone-900 mb-2">商品管理后台</h1>
            <p className="text-stone-500">管理商品库存与详细信息。</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form Section */}
        <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg shadow-stone-200/50 p-8 sticky top-32 border border-stone-100">
                <h2 className="text-xl font-serif font-bold mb-6 text-stone-800">添加新商品</h2>
                <form onSubmit={handleAddProduct} className="space-y-5">
                <div>
                    <label className="block text-stone-500 text-xs font-bold uppercase tracking-wider mb-2" htmlFor="name">商品名称</label>
                    <input type="text" id="name" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2f5e41] transition-all" value={newProductName} onChange={(e) => setNewProductName(e.target.value)} required />
                </div>
                <div>
                    <label className="block text-stone-500 text-xs font-bold uppercase tracking-wider mb-2" htmlFor="description">商品描述</label>
                    <textarea id="description" rows="3" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2f5e41] transition-all" value={newProductDescription} onChange={(e) => setNewProductDescription(e.target.value)}></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-stone-500 text-xs font-bold uppercase tracking-wider mb-2" htmlFor="category">分类</label>
                        <input type="text" id="category" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2f5e41] transition-all" value={newProductCategory} onChange={(e) => setNewProductCategory(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-stone-500 text-xs font-bold uppercase tracking-wider mb-2" htmlFor="price">价格 (¥)</label>
                        <input type="number" id="price" step="0.01" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2f5e41] transition-all" value={newProductBasePrice} onChange={(e) => setNewProductBasePrice(e.target.value)} required />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-stone-500 text-xs font-bold uppercase tracking-wider mb-2" htmlFor="shelfLife">保质期 (天)</label>
                        <input type="number" id="shelfLife" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2f5e41] transition-all" value={newProductShelfLife} onChange={(e) => setNewProductShelfLife(e.target.value)} />
                    </div>
                </div>
                <div>
                    <label className="block text-stone-500 text-xs font-bold uppercase tracking-wider mb-2" htmlFor="imageUrl">图片链接 URL</label>
                    <input type="text" id="imageUrl" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2f5e41] transition-all" value={newProductImageUrl} onChange={(e) => setNewProductImageUrl(e.target.value)} />
                </div>
                <div className="pt-4">
                    <button type="submit" className="w-full bg-stone-900 hover:bg-[#2f5e41] text-white font-bold py-4 rounded-xl transition-colors shadow-lg">
                    创建商品
                    </button>
                </div>
                </form>
            </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2">
            <h2 className="text-2xl font-serif font-bold mb-8 text-stone-800">商品库存列表</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {products.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-md transition-all group">
                    <div className="relative h-48 overflow-hidden">
                        <img src={product.image_url || 'https://via.placeholder.com/150'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                            {product.category}
                        </div>
                    </div>
                    <div className="p-5">
                        <h3 className="text-lg font-bold text-stone-800 mb-2 font-serif">{product.name}</h3>
                        <p className="text-stone-500 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">{product.description}</p>
                        <div className="flex justify-between items-center pt-4 border-t border-stone-50">
                            <span className="text-xl font-bold text-[#2f5e41] font-serif">¥{Number(product.base_price).toFixed(2)}</span>
                            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">保质期 {product.shelf_life_days} 天</span>
                        </div>
                    </div>
                </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProducts;
