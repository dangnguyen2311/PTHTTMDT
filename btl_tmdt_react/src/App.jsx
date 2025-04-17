import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/client/Login.jsx';
import Home from './components/client/Home.jsx';
import RegisterForm from './components/client/RegisterForm.jsx';
import Cart from './components/client/Cart.jsx';
import Logout from './components/client/Logout.jsx';
import './App.css';
import Checkout from "./components/client/Checkout.jsx";
import MyOrder from "./components/client/MyOrder.jsx";
import OrderDetail from "./components/client/OrderDetail.jsx";
import ProductDetail from "./components/client/ProductDetail.jsx";
import CartManagement from "./components/admin/cart/CartManagement.jsx";
import Dashboard from "./components/admin/dashboard/Dashboard.jsx";
import CartItems from "./components/admin/cart/CartItems.jsx";
// import AppWrapper from "./AppWrapper.jsx";

function App() {
    const isLoggedIn = !!localStorage.getItem('userName');

    return (
        <Routes>
            {/*<AppWrapper>/!* Trang gốc: Chuyển hướng dựa trên trạng thái đăng nhập *!/*/}
                <Route
                    path="/"
                    element={isLoggedIn ? <Navigate to="/slide/1" replace /> : <Navigate to="/login" replace />}
                />

                {/* Route đăng nhập */}
                <Route path="/login" element={<Login />} />

                {/* Route trang chủ (sản phẩm) */}
                <Route path="/slide/:id" element={<Home />} />

                {/* Route đăng ký */}
                <Route path="/register" element={<RegisterForm />} />

                {/* Route giỏ hàng */}
                <Route path="/my-cart" element={<Cart />} />

                {/* Route đăng xuất */}
                <Route path="/logout" element={<Logout />} />

                <Route path="/category/:categoryName" element={<Cart/>}></Route>

                <Route path="/checkout" element={<Checkout/>}/>
                <Route path="/my-order" element={<MyOrder />} />
                <Route path="/my-order/detail/:id" element={<OrderDetail />} />
                <Route path="/product-detail/:id" element={<ProductDetail /> }/>



                <Route path="/admin" element={<Dashboard />} />
                <Route path="/admin/cart" element={<CartManagement/>} />
                <Route path="/admin/cart/cart-item/:id" element={<CartItems/>} />
        {/*</AppWrapper>*/}

        </Routes>
    );
}

export default App;