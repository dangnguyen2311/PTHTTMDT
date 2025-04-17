import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from "../fragment/Navbar.jsx";
import Sidebar from "../fragment/Sidebar.jsx";

const CartItems = () => {
    const { id } = useParams(); // Lấy id của cart từ URL
    const [cartDetails, setCartDetails] = useState({
        cart: {},
        itemsInCart: [],
        availableProducts: [],
    });

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await fetch(`/api/admin/cart/cart-item/${id}`); // API lấy thông tin giỏ hàng
                if (response.ok) {
                    const data = await response.json();
                    setCartDetails(data); // Lưu thông tin giỏ hàng vào state
                } else {
                    console.error("Failed to fetch cart items");
                }
            } catch (error) {
                console.error("Error fetching cart items:", error);
            }
        };

        fetchCartItems();
    }, [id]); // Fetch lại khi id thay đổi

    const handleDelete = async (productInCartId) => {
        try {
            const response = await fetch(`/api/admin/cart/cart-item/${productInCartId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setCartDetails((prevState) => ({
                    ...prevState,
                    itemsInCart: prevState.itemsInCart.filter(
                        (item) => item.id !== productInCartId
                    ),
                }));
                alert("Item deleted successfully");
            } else {
                console.error("Failed to delete item");
            }
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    return (
        // <div className="content-wrapper" style={{
        //     width: '100vw',
        //     height: '100vh',
        //     overflow: 'hidden' // nếu không muốn scroll
        // }}>
        <div className="wrapper">
            <Navbar/>
            <Sidebar/>
            <div className="content-wrapper">
                <section className="content">
                    <div className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <h1 className="m-0">Items of cart</h1>
                                </div>
                                <div className="col-sm-6">
                                    <ol className="breadcrumb float-sm-right">
                                        <li className="breadcrumb-item">
                                            <Link to="/admin">Home</Link>
                                        </li>
                                        <li className="breadcrumb-item active">Items of cart</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card card-info">
                                    <div className="card-header">
                                        <h3 className="card-title">
                                            {`List all product in ${cartDetails.cart.userDao?.userName}'s cart`}
                                        </h3>
                                    </div>
                                    <div className="card-body table-responsive p-0">
                                        <table className="table table-bordered table-hover text-nowrap">
                                            <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Picture</th>
                                                <th>Category</th>
                                                <th>Quantity</th>
                                                <th>Total Price</th>
                                                <th>Action</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {cartDetails.itemsInCart.map((item) => (
                                                <tr key={item.id}>
                                                    <td>{item.productDao.prodName}</td>
                                                    <td>
                                                        <img
                                                            src={item.productDao.prodImg}
                                                            alt={item.productDao.prodName}
                                                            style={{width: '140px', height: '140px'}}
                                                        />
                                                    </td>
                                                    <td>{item.productDao.categoryDao.category_name}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>
                                                        {(
                                                            item.productDao.prodPrice * item.quantity
                                                        ).toLocaleString()} VNĐ
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn btn-danger"
                                                            onClick={() => handleDelete(item.id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>

    );
};

export default CartItems;
