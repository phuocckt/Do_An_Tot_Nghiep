import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import Products from './pages/Products';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProductDetail from './pages/Product';
import Cart from './pages/Cart';
import Home from './pages/Home';
import Account from './pages/Account';
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
            <Route path='/login' element={<Login />}/>
            <Route path='/register' element={<Signup />}/>
            <Route path='/forgot-password' element={<ForgotPassword />}/>
            <Route path='/reset-password/:token' element={<ResetPassword />}/>
            <Route path='/account' element={<Account />}/>
          </Route>
          
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
