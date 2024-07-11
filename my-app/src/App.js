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

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path='/' element={<Layout/>}>
            <Route index element={<Home/>}/>
            <Route path='/products' element={<Products />}/>
            <Route path='/cart' element={<Cart />}/>
            <Route path='/product/:id' element={<ProductDetail />} />
            <Route path='/account' element={<Account />}/>
            <Route path='/favorite' element={<Favorite />}/>
            <Route path='/order' element={<Order />}/>
          </Route>
          
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
