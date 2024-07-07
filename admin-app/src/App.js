import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import MainLayout from './Components/MainLayout';
import Dashboard from './pages/Dashboard';
import './App.css'
import CategoryList from './pages/CategoryList';
import Products from './pages/Products';
import SizeList from './pages/SizeList';
import Forgotpassword from './pages/Forgotpassword';
import Resetpassword from './pages/Resetpassword';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import AddSize from './pages/AddSize';
import Brand from './pages/Brand';
import AddProduct from './pages/AddProduct';
import AddBrand from './pages/AddBrand';
import AddCategory from './pages/AddCategory';
import ViewProfile from './pages/ViewProfile';
import ProtectedRoute from './features/auth/ProtectedRoute';
import AddCoupon from './pages/AddCoupon';
import Coupons from './pages/CouponList';
import Employee from './pages/Employee';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/reset-password" element={<Resetpassword />} />
          <Route path="/forgot-password" element={<Forgotpassword />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="add-brand" element={<AddBrand />} />
            <Route path="brand-list" element={<Brand />} />
            <Route path="add-category" element={<AddCategory />} />
            <Route path="category-list" element={<CategoryList />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="product" element={<Products />} />
            <Route path="add-size" element={<AddSize />} />
            <Route path="size-list" element={<SizeList />} />
            <Route path="add-coupon" element={<AddCoupon />} />
            <Route path="coupon-list" element={<Coupons />} />
            <Route path="orders" element={<Orders />} />
            <Route path="customers" element={<Customers />} />
            <Route path="employee" element={<Employee />} />
            <Route path="profile" element={<ViewProfile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
