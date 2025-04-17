import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from "../fragment/Navbar.jsx";
import Sidebar from "../fragment/Sidebar.jsx";
import {Link} from "react-router-dom";

const OrderListPage = () => {
    const [orderDaos, setOrderDaos] = useState([]);

    useEffect(() => {
        axios.get('/api/admin/order')
            .then(res => {
                setOrderDaos(res.data);
            })
            .catch(err => {
                console.error("Error fetching orders:", err);
            });
    }, []);

    const handleDelete = (orderId) => {
        if (window.confirm("Are you sure you want to delete this order?")) {
            axios.delete(`/api/admin/order/${orderId}`)
                .then(() => {
                    setOrderDaos(prev => prev.filter(order => order.orderId !== orderId));
                })
                .catch(err => {
                    console.error("Failed to delete order:", err);
                });
        }
    };

    return (
        <div className="wrapper">
            <Navbar/>
            <Sidebar/>
            {/* BỎ QUA navbar và sidebar */}

            <div className="content-wrapper">
                <section className="content">
                    <div className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <h1 className="m-0">Orders</h1>
                                </div>
                                <div className="col-sm-6">
                                    <ol className="breadcrumb float-sm-right">
                                        <li className="breadcrumb-item">
                                            <Link to="/">Home</Link>
                                        </li>
                                        <li className="breadcrumb-item active">Orders</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">List All Order</h3>
                                </div>

                                <div className="card-body table-responsive p-0">
                                    <table className="table table-hover text-nowrap table-bordered">
                                        <thead>
                                        <tr>
                                            <th>User's</th>
                                            <th>User name</th>
                                            <th>Address</th>
                                            <th>Phone</th>
                                            <th>Time order</th>
                                            <th>Total Price</th>
                                            <th>Action</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {orderDaos.map((order, index) => (
                                            <tr key={index}>
                                                <td>{order.userDao?.userName}</td>
                                                <td>{order.fullName}</td>
                                                <td>{order.address}</td>
                                                <td>{order.phone}</td>
                                                <td>{order.order_time}</td>
                                                <td>{order.total.toLocaleString('vi-VN')} VNĐ</td>
                                                <td>
                                                    <a
                                                        href={`/admin/order/order-item/${order.orderId}`}
                                                        className="btn btn-success btn-sm mr-2"
                                                    >
                                                        List product
                                                    </a>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleDelete(order.orderId)}
                                                    >
                                                        Delete order
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {orderDaos.length === 0 && (
                                            <tr>
                                                <td colSpan="7" className="text-center">No orders found. kjhoong có </td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <aside className="control-sidebar control-sidebar-dark">
                {/* Bỏ trống như yêu cầu */}
            </aside>
        </div>
    );
};

export default OrderListPage;
