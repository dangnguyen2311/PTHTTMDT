// App.jsx
import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';
import CartManagement from "./components/cart/CartManagement.jsx";
import CartItems from "./components/cart/CartItems.jsx";
import OrderItemsPage from "./components/order/OrderItemsPage.jsx";
import EditUser from "./components/user/EditUser.jsx";
import AddUser from "./components/user/AddUser.jsx";
import ListProduct from "./components/product/ListProduct.jsx";
import ListUser from "./components/user/ListUser.jsx";
import OrderListPage from "./components/order/OrderListPage.jsx";
import Categories from "./components/category/Categories.jsx";
import AddCategory from "./components/category/AddCategory.jsx";
import EditCategory from "./components/category/EditCategory.jsx";
import AddProduct from "./components/product/AddProduct.jsx";
import EditProduct from "./components/product/EditProduct.jsx";
import ReviewList from "./components/review/ReviewList.jsx";
import ReturnOrder from "./components/return/ReturnOrder.jsx";
import Login from "./components/fragment/Login.jsx";
import Logout from "./components/fragment/Logout.jsx";
// import Login from "./components/login/Login.jsx";

const isAdminAuthenticated = () => {
        return !!localStorage.getItem("adminName");
};

const PrivateRoute = ({ children }) => {
        return isAdminAuthenticated() ? children : <Navigate to="/login" />;
};

const RedirectIfLoggedIn = ({ children }) => {
        return isAdminAuthenticated() ? <Navigate to="/dashboard" /> : children;
};

const App = () => {
    return (
        <Routes>
                <Route
                    path="/login"
                    element={
                        <RedirectIfLoggedIn>
                            <Login />
                        </RedirectIfLoggedIn>
                    }
                />
            <Route path="" element={
                <PrivateRoute>
                    <Dashboard />
                </PrivateRoute>
            } />
            <Route path={"/logout"} element={
                <PrivateRoute>
                    <Logout/>
                </PrivateRoute>
            }/>

            <Route path="/category" element={
                <PrivateRoute>
                    <Categories />
                </PrivateRoute>
            } />
            <Route path="/category/add-category" element={
                <PrivateRoute>
                    <AddCategory />
                </PrivateRoute>
            } />
            <Route path="/category/edit-category/:id" element={
                <PrivateRoute>
                    <EditCategory />
                </PrivateRoute>
            } />
            <Route path="/category/delete-category/:id" element={
                <PrivateRoute>
                    <Categories />
                </PrivateRoute>
            } />

            <Route path="/cart" element={
                <PrivateRoute>
                    <CartManagement />
                </PrivateRoute>
            } />
            <Route path="/cart/cart-item/:id" element={
                <PrivateRoute>
                    <CartItems />
                </PrivateRoute>
            } />

            <Route path="/product" element={
                <PrivateRoute>
                    <ListProduct />
                </PrivateRoute>
            } />
            <Route path="/product/add-product" element={
                <PrivateRoute>
                    <AddProduct />
                </PrivateRoute>
            } />
            <Route path="/product/edit-product/:id" element={
                <PrivateRoute>
                    <EditProduct />
                </PrivateRoute>
            } />

            <Route path="/order" element={
                <PrivateRoute>
                    <OrderListPage />
                </PrivateRoute>
            } />
            <Route path="/order/order-item/:id" element={
                <PrivateRoute>
                    <OrderItemsPage />
                </PrivateRoute>
            } />

            <Route path="/user" element={
                <PrivateRoute>
                    <ListUser />
                </PrivateRoute>
            } />
            <Route path="/user/add-user" element={
                <PrivateRoute>
                    <AddUser />
                </PrivateRoute>
            } />
            <Route path="/user/edit-user/:id" element={
                <PrivateRoute>
                    <EditUser />
                </PrivateRoute>
            } />

            <Route path="/review" element={
                <PrivateRoute>
                    <ReviewList />
                </PrivateRoute>
            } />

            <Route path="/return" element={
                <PrivateRoute>
                    <ReturnOrder />
                </PrivateRoute>
            } />

        </Routes>
    );
};

export default App;
