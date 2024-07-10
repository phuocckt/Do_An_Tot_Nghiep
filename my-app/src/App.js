import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import Products from './pages/Products';
import Login from './views/Login';
import Register from './views/Register';
import ProductDetail from './pages/Product';
import Cart from './pages/Cart';
import Home from './pages/Home';
import Account from './pages/Account';
import Favorite from './pages/Favorite';
import Order from './pages/Order';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

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
            {/* <Route path='/login' element={<Login />}/> */}
            {/* <Route path='/register' element={<Signup />}/> */}
            <Route path='/forgot-password' element={<ForgotPassword />}/>
            <Route path='/reset-password/:token' element={<ResetPassword />}/>
            <Route path='/account' element={<Account />}/>
            <Route path='/favorite' element={<Favorite />}/>
            <Route path='/order' element={<Order />}/>
          </Route>
          <Route path='/login' element={<Login />}/>
          <Route path='/register' element={<Register />}/>
          
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
