import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from "./Header.jsx";
import {Footer} from "./Footer.jsx";
import {SearchBox} from "./SearchBox.jsx";

const OrderDetail = () => {
    const { id } = useParams(); // lấy orderId từ URL
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetch(`/api/v1/checkout/my-order/detail/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error('Không thể lấy chi tiết đơn hàng');
                return res.json();
            })
            .then((data) => {
                setProducts(data.productInOrderDaos || []);
                setTotal(data.orderDao?.total || 0);
            })
            .catch((err) => {
                console.error(err);
                alert('Lỗi khi tải chi tiết đơn hàng');
            });
    }, [id]);

    const formatCurrency = (number) => {
        return Number(number).toLocaleString('vi-VN') + ' VNĐ';
    };

    return (
        <>
            <Header userName={localStorage.getItem("userName")} categoryDaos={[]}/>
            <main>
                <div className="hero-cap text-center">
                    <h2 style={{margin: '40px auto'}}>LIST PRODUCT IN YOUR ORDER</h2>
                </div>

                <section className="cart_area" style={{margin: '40px auto'}}>
                    <div className="container">
                        <div className="cart_inner">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th><span>Product</span></th>
                                        <th><span>Price</span></th>
                                        <th><span>Quantity</span></th>
                                        <th><span>Total</span></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {products.map((item, index) => {
                                        const prod = item.productDao;
                                        const quantity = item.quantity;
                                        const totalPrice = quantity * prod.prodPrice;
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <div className="media">
                                                        <div className="d-flex">
                                                            <img src={prod.prodImg} alt={prod.prodName} style={{
                                                                width: '80px',
                                                                height: '80px',
                                                                objectFit: 'cover'
                                                            }}/>
                                                        </div>
                                                        <div className="media-body" style={{paddingLeft: '10px'}}>
                                                            <p>{prod.prodName}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td><span>{formatCurrency(prod.prodPrice)}</span></td>
                                                <td><span>{quantity}</span></td>
                                                <td><span>{formatCurrency(totalPrice)}</span></td>
                                            </tr>
                                        );
                                    })}

                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <span>Subtotal</span>
                                        </td>
                                        <td><span>{formatCurrency(total)}</span></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="shop-method-area">
                    <div className="container">
                        <div className="method-wrapper"></div>
                    </div>
                </div>
            </main>
            <Footer/>
            <SearchBox/>
        </>

    );
};

export default OrderDetail;
