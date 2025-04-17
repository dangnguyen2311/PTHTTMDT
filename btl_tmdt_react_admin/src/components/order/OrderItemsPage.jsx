import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from "../fragment/Navbar.jsx";
import Sidebar from "../fragment/Sidebar.jsx";
import {Link} from "react-router-dom";

const OrderItemsPage = ({ orderId }) => {
    const [productInOrderDaos, setProductInOrderDaos] = useState([]);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        // Gọi API để lấy thông tin sản phẩm trong đơn hàng
        axios.get(`/admin/order/${orderId}`)
            .then(res => {
                setProductInOrderDaos(res.data.items); // danh sách sản phẩm
                setUserName(res.data.userName); // tên người đặt hàng
            })
            .catch(err => {
                console.error("Error fetching order details:", err);
            });
    }, [orderId]);

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
                                    <h1 className="m-0">Items of order</h1>
                                </div>
                                <div className="col-sm-6">
                                    <ol className="breadcrumb float-sm-right">
                                        <li className="breadcrumb-item">
                                            <Link to="/">Home</Link>
                                        </li>
                                        <li className="breadcrumb-item active">Items of order</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12">
                            <div className="card card-info">
                                <div className="card-header">
                                    <h3 className="card-title">
                                        List all product in {userName}'s order
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
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {productInOrderDaos.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.productDao.prodName}</td>
                                                <td>
                                                    <img
                                                        src={item.productDao.prodImg}
                                                        alt="product"
                                                        style={{ width: "140px", height: "140px" }}
                                                    />
                                                </td>
                                                <td>{item.productDao.categoryDao.category_name}</td>
                                                <td>{item.quantity}</td>
                                                <td>
                                                    {(
                                                        item.productDao.prodPrice * item.quantity
                                                    ).toLocaleString('vi-VN')}{" "}
                                                    VNĐ
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                </section>
            </div>

            <aside className="control-sidebar control-sidebar-dark"></aside>
        </div>
    );
};

export default OrderItemsPage;
