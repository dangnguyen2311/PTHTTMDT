import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from "./Header.jsx";
import {Footer} from "./Footer.jsx";
import {SearchBox} from "./SearchBox.jsx";

const MyOrder = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetch('/api/v1/checkout/my-order')
            .then((res) => {
                if (!res.ok) throw new Error('Không thể lấy danh sách đơn hàng');
                return res.json();
            })
            .then((data) => {
                setOrders(data.orderDaos || []);
            })
            .catch((err) => {
                console.error(err);
                alert('Lỗi khi tải danh sách đơn hàng');
            });
    }, []);

    const formatCurrency = (number) => {
        return Number(number).toLocaleString('vi-VN') + ' VNĐ';
    };

    return (
        <>
            <Header userName={localStorage.getItem("userName")} categoryDaos={[]}/>
            <main>
                <div className="hero-cap text-center">
                    <h2 style={{margin: '40px auto'}}>LIST ORDER OF YOU</h2>
                </div>

                <section className="cart_area" style={{margin: '40px auto'}}>
                    <div className="container">
                        <div className="cart_inner">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th scope="col"><p>Full Name</p></th>
                                        <th scope="col"><p>Address</p></th>
                                        <th scope="col"><p>Time Order</p></th>
                                        <th scope="col"><p>Phone Number</p></th>
                                        <th scope="col"><p>Total Price</p></th>
                                        <th scope="col"><p>Action</p></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {orders.map((order, index) => (
                                        <tr key={index}>
                                            <td><p>{order.fullName}</p></td>
                                            <td><p>{order.address}</p></td>
                                            <td><p>{order.order_time}</p></td>
                                            <td><p>{order.phone}</p></td>
                                            <td><p>{formatCurrency(order.total)}</p></td>
                                            <td>
                                                <Link
                                                    className="genric-btn circle medium info"
                                                    to={`/my-order/detail/${order.orderId}`}
                                                >
                                                    List Product
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {orders.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="text-center">Chưa có đơn hàng nào.</td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="shop-method-area">
                    <div className="container">
                        <div className="method-wrapper"/>
                    </div>
                </div>
            </main>
            <Footer/>
            <SearchBox/>
        </>

    );
};

export default MyOrder;
