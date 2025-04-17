// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';
import CartManagement from "./components/cart/CartManagement.jsx";
import CartItems from "./components/cart/CartItems.jsx";
import AddProduct from "./components/product/AddProduct.jsx";
import OrderItemsPage from "./components/order/OrderItemsPage.jsx";
import EditUser from "./components/user/EditUser.jsx";
import AddUser from "./components/user/AddUser.jsx";
import ListProduct from "./components/product/ListProduct.jsx";
import ListUser from "./components/user/ListUser.jsx";
import OrderListPage from "./components/order/OrderListPage.jsx";
import Categories from "./components/category/Categories.jsx";
// import Login from "./components/login/Login.jsx";

const App = () => {
    return (
        <Routes>
            {/*<Route path="/login" element={<Login/>}></Route>*/}
            <Route path="/" element={<Dashboard />} />

            <Route path="/category" element={<Categories/>}/>
            

            <Route path="/cart" element={<CartManagement />} />
            <Route path="/cart/cart-item/:id" element={<CartItems/>} />

            <Route path="/product" element={<ListProduct/>} />

            <Route path="/order" element={<OrderListPage/>}/>

            <Route path="/user" element={<ListUser/>}/>
            <Route path="/user/add-user" element={<AddUser/>}/>
            <Route path="/user/edit-user/:id" element={<EditUser/>}/>
            {/* các route admin khác... */}
        </Routes>
    );
};

export default App;
