import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import GroupBuyDetails from './pages/GroupBuyDetails';
import LeaderDashboard from './pages/LeaderDashboard';
import LeaderDistribution from './pages/LeaderDistribution';
import AdminProducts from './pages/AdminProducts'; // New import
import AdminLogistics from './pages/AdminLogistics'; // New import

function App() {
  return (
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:orderId" element={<OrderDetails />} />
          <Route path="/group-buy/:id" element={<GroupBuyDetails />} />
          <Route path="/leader/dashboard" element={<LeaderDashboard />} />
          <Route path="/leader/station/:stationId/deliveries" element={<LeaderDistribution />} />
          <Route path="/admin/products" element={<AdminProducts />} /> {/* Admin Products Route */}
          <Route path="/admin/logistics" element={<AdminLogistics />} /> {/* Admin Logistics Route */}
          {/* Add other routes here */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Route>
      </Routes>
  );
}

export default App;