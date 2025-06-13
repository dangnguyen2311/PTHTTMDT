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
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
// import {useState} from "react";
// import AppWrapper from "./AppWrapper.jsx";

function App() {
    const isLoggedIn = !!localStorage.getItem("userName");
    console.log("User is logged in:", isLoggedIn + ", UserName:", localStorage.getItem("userName"));

    const isUserAuthenticated = () => {
        return !!localStorage.getItem("userName");
    };

    const PrivateRoute = ({ children }) => {
        return isUserAuthenticated() ? children : <Navigate to="/login" />;
    };

    const RedirectIfLoggedIn = ({ children }) => {
        return isUserAuthenticated() ? <Navigate to="/" /> : children;
    };

    return (
        <>
            <Routes>
                {/*<AppWrapper>/!* Trang gốc: Chuyển hướng dựa trên trạng thái đăng nhập *!/*/}
                {/*<Route*/}
                {/*    path="/"*/}
                {/*    element={isLoggedIn ? <Navigate to="/slide/1" replace /> : <Navigate to="/login" replace />}*/}
                {/*/>*/}
                <Route path="/" element={<Navigate to="/slide/1" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/slide/:id" element={<PrivateRoute><Home /></PrivateRoute>} />
                <Route path="/search" element={<PrivateRoute><SearchResults /></PrivateRoute>} />
                <Route path="/category/:name" element={
                    <PrivateRoute>
                        <Category />
                    </PrivateRoute>
                } />
                <Route path="/product-detail/:id" element={
                    <PrivateRoute>
                        <ProductDetail />
                    </PrivateRoute>

                } />

                <Route path="/my-cart" element={
                    <PrivateRoute>
                        <Cart />
                    </PrivateRoute>
                } />
                <Route path="/logout" element={
                    <Logout />
                } />

                <Route path="/checkout" element={
                    <PrivateRoute>
                        <Checkout />
                    </PrivateRoute>
                } />
                <Route path="/my-order" element={
                    <PrivateRoute>
                        <MyOrder />
                    </PrivateRoute>
                } />
                <Route path="/my-order/detail/:orderId" element={
                    <PrivateRoute>
                        <OrderDetail />
                    </PrivateRoute>
                } />
                <Route path="/my-order/return/:orderId" element={
                    <PrivateRoute>
                        <Return />
                    </PrivateRoute>
                } />
                <Route path="/payment" element={
                    <PrivateRoute>
                        <Payment />
                    </PrivateRoute>
                } />
                <Route path="/user-detail" element={
                    <PrivateRoute>
                        <UserDetail />
                    </PrivateRoute>
                } />

                <Route path="/admin" element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                } />
                <Route path="/admin/cart" element={
                    <PrivateRoute>
                        <CartManagement />
                    </PrivateRoute>
                } />
                <Route path="/admin/cart/cart-item/:id" element={
                    <PrivateRoute>
                        <CartItems />
                    </PrivateRoute>
                } />

                {/*</AppWrapper>*/}

            </Routes>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop />
        </>

    );
}

export default App;