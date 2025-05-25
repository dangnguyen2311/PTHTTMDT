import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/client/page/Login.jsx';
import Home from './components/client/page/Home.jsx';
import RegisterForm from './components/client/page/RegisterForm.jsx';
import Cart from './components/client/page/Cart.jsx';
import Logout from './components/client/page/Logout.jsx';
import './App.css';
import Checkout from "./components/client/page/Checkout.jsx";
import MyOrder from "./components/client/page/MyOrder.jsx";
import OrderDetail from "./components/client/page/OrderDetail.jsx";
import ProductDetail from "./components/client/page/ProductDetail.jsx";
import CartManagement from "./components/admin/cart/CartManagement.jsx";
import Dashboard from "./components/admin/dashboard/Dashboard.jsx";
import CartItems from "./components/admin/cart/CartItems.jsx";
import {Payment} from "./components/client/page/Payment.jsx";
import Return from "./components/client/page/Return.jsx";
import Category from "./components/client/page/Category.jsx";
import {SearchBox} from "./components/client/fragment/SearchBox.jsx";
import SearchResults from "./components/client/page/SearchResults.jsx";
import UserDetail from "./components/client/page/UserDetail.jsx";
// import {useState} from "react";
// import AppWrapper from "./AppWrapper.jsx";

function App() {
    const isLoggedIn = !!localStorage.getItem("userName");


    return (
        <Routes>
            {/*<AppWrapper>/!* Trang gốc: Chuyển hướng dựa trên trạng thái đăng nhập *!/*/}
                <Route
                    path="/"
                    element={isLoggedIn ? <Navigate to="/slide/1" replace /> : <Navigate to="/login" replace />}
                />
                <Route path="/login" element={<Login />} />
                <Route path="/slide/:id" element={<Home />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/my-cart" element={<Cart />} />
                <Route path="/logout" element={<Logout />} />

                <Route path="/category/:name" element={<Category/>}></Route>
                <Route path={"/product-detail/:id"} element={<ProductDetail/>}></Route>

                <Route path="/checkout" element={<Checkout/>}/>
                <Route path="/my-order" element={<MyOrder />} />
                <Route path="/my-order/detail/:orderId" element={<OrderDetail />} />
                <Route path="/my-order/return/:orderId" element={<Return/>}></Route>
                <Route path="/payment" element={<Payment/>}/>
                <Route path="/user-detail" element={<UserDetail/>}></Route>
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/admin/cart" element={<CartManagement/>} />
                <Route path="/admin/cart/cart-item/:id" element={<CartItems/>} />
        {/*</AppWrapper>*/}

        </Routes>
    );
}

export default App;