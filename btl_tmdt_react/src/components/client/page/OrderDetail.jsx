import React, { useEffect, useState } from 'react';
import {Link, useParams} from 'react-router-dom';
import Header from "../fragment/Header.jsx";
import {Footer} from "../fragment/Footer.jsx";
import {SearchBox} from "../fragment/SearchBox.jsx";

const OrderDetail = () => {
    const { orderId } = useParams(); // get orderorderId from URL
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [status, setStatus] = useState('');
    // const navigate = useNavigate();

    useEffect(() => {
        fetch(`/api/v1/order/detail/${orderId}`)
            .then((res) => {
                if (!res.ok) throw new Error('Không thể lấy chi tiết đơn hàng');
                return res.json();
            })
            .then((data) => {
                console.log("Soos luong: " + data.productInOrderDaos.length);
                setStatus(data.orderDao?.status || '');
                setProducts(data.productInOrderDaos || []);
                setTotal(data.orderDao?.total || 0);
            })
            .catch((err) => {
                console.error(err);
                alert('Lỗi khi tải chi tiết đơn hàng');
            });
    }, [orderId]);

    const formatCurrency = (number) => {
        return Number(number).toLocaleString('vi-VN') + ' VNĐ';
    };

    return (
        <>
            <Header userName={localStorage.getItem("userName")} categoryDaos={JSON.parse(localStorage.getItem("categoryDaos") || "[]")}/>
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
                                                                worderIdth: '80px',
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
                                <div className="checkout_btn_inner float-right">
                                    {/*<button className="btn_3 checkout_btn_1 mx-3" onClick={() => navigate('/my-order/return/' + orderId)}>*/}
                                        {/*Return*/}
                                        <Link to={"/my-order/return/" + orderId}
                                              className={status === 'returned' ? `d-none genric-btn circle medium danger py-2` :`genric-btn circle medium danger py-2`}>
                                            Return
                                        </Link>
                                    {/*</button>*/}
                                </div>
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
            {/*<SearchBox/>*/}
        </>

    );
};

export default OrderDetail;
