import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from "../fragment/Header.jsx";
import {Footer} from "../fragment/Footer.jsx";
import {SearchBox} from "../fragment/SearchBox.jsx";

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
            <Header userName={localStorage.getItem("userName")} categoryDaos={JSON.parse(localStorage.getItem("categoryDaos") || "[]")}/>
            <main>
                <div className="hero-cap text-center">
                    <h2 style={{margin: '40px auto'}}>YOUR LIST ORDERS</h2>
                </div>

                <section className="cart_area" style={{margin: '40px auto'}}>
                    <div className="container">
                        <div className="cart_inner">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th scope="col"><h5>Full Name</h5></th>
                                        {/*<th scope="col"><h5>Address</h5></th>*/}
                                        <th scope="col"><h5>Time Order</h5></th>
                                        <th scope="col"><h5>Phone Number</h5></th>
                                        <th scope="col"><h5>Total Price</h5></th>
                                        <th scope="col"><h5>Status</h5></th>
                                        <th scope="col"><h5>Action</h5></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {orders.map((order, index) => (
                                        <tr key={index}>
                                            <td><p className={"m-0"}>{order.fullName}</p></td>
                                            {/*<td><p>{order.address}</p></td>*/}
                                            <td><p
                                                className={"m-0"}> {new Date(order.order_time).toLocaleDateString('vi-VN')}</p>
                                            </td>
                                            <td><p className={"m-0"}>{order.phone}</p></td>
                                            <td><p className={"m-0"}>{formatCurrency(order.total)}</p></td>
                                            <td>
                                                <p
                                                    className={`genric-btn circle medium px-2 py-1 m-0 ${
                                                        order.status === 'returned'
                                                            ? 'primary'
                                                            : order.status === 'wait'
                                                                ? 'warning'
                                                                : order.status === 'paid'
                                                                    ? 'success'
                                                                    : 'secondary' // fallback nếu không khớp gì
                                                    }`}
                                                    style={{minWidth: '80px', textAlign: 'center'}}
                                                >
                                                    {order.status}
                                                </p>

                                            </td>

                                            <td>
                                                <Link
                                                    className="genric-btn medium info px-2 py-1 m-2 text-center d-inline-block"
                                                    to={`/my-order/detail/${order.orderId}`}
                                                    style={{minWidth: '100px'}}
                                                >
                                                    List Product
                                                </Link>
                                                <Link
                                                    className={order.status === 'returned' || order.status === 'wait' ? `d-none genric-btn medium danger px-2 py-1 m-2 text-center`: `genric-btn medium danger px-2 py-1 m-2 text-center d-inline-block`}
                                                    to={`/my-order/return/${order.orderId}`}
                                                    style={{minWidth: '100px'}}
                                                >
                                                    Return
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
            {/*<SearchBox/>*/}
        </>

    );
};

export default MyOrder;
