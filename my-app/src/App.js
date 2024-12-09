import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import Products from './views/Products';
import Login from './views/Login';
import Register from './views/Register';
import ProductDetail from './views/Product';
import Cart from './views/Cart';
import Home from './views/Home';
import Account from './views/Account';
import Favorite from './views/Favorite';
import Order from './views/Order';
import ForgotPassword from './views/ForgotPassword';
import ResetPassword from './views/ResetPassword';
import PaymentSuccess from './views/PaymentSuccess';
import ProtectedRoute from './features/auth/ProtectedRoute';
import { useDispatch, useSelector } from 'react-redux';
import { getBrands } from './features/brand/brandSlice';
import { useEffect } from 'react';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBrands());
  },[dispatch]);

  const brandState = useSelector((state) => state.brand.brands);

  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path='/' element={<Layout/>}>
            <Route index element={<Home/>}/>
            {brandState.map((item) => (
              <>
              <Route
                key={item._id}
                path={`/${item.title}`}
                element={<Products props={item.title} />}
              />
              <Route key={item._id}
                path={`/${item.title}/:id`}
                 element={<ProductDetail props={item.title} />} />
              </>
            ))}
            <Route path='/cart' element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
              }/>
            <Route path='/account' element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
              }/>
            <Route path='/favorite' element={
              <ProtectedRoute>
                <Favorite />
              </ProtectedRoute>
              }/>
            <Route path='/order' element={
              <ProtectedRoute>
                <Order />
              </ProtectedRoute>
              }/>
          </Route>
          
          <Route path='/payment-status' element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
            }/>
          <Route path='/login' element={<Login />}/>
          <Route path='/register' element={<Register />}/>
          <Route path='/forgot-password' element={<ForgotPassword />}/>
          <Route path='/reset-password/:token' element={<ResetPassword />}/>
        
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
