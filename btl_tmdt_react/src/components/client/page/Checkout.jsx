import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../fragment/Header.jsx";
import {Footer} from "../fragment/Footer.jsx";
import {SearchBox} from "../fragment/SearchBox.jsx";

const Checkout = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        orderNotes: '',
    });

    // Lấy dữ liệu giỏ hàng
    useEffect(() => {
        fetch('/api/v1/checkout/get-checkout', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        })
            .then(res => {
                if (!res.ok) throw new Error('Lỗi khi lấy giỏ hàng');
                return res.json();
            })
            .then(data => {
                if (data.error) {
                    setError(data.error);
                    setCartItems([]);
                    setTotalPrice(0);
                } else {
                    setCartItems(data.cartItemDaos || []);
                    setTotalPrice(data.totalPrice || 0);
                }
            })
            .catch(err => {
                setError(err.message);
                setCartItems([]);
            });
    }, []);

    // Xử lý thay đổi input form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleInfo = () => {
        const { fullName, phone, email, address } = formData;

        if (!fullName.trim() || !phone.trim() || !email.trim() || !address.trim()) {
            console.log(error);
            setError("Vui lòng điền đầy đủ thông tin: Họ tên, Số điện thoại, Email và Địa chỉ.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!handleInfo()) return;

        try {
            const resOrder = await fetch('/api/v1/checkout/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            if (!resOrder.ok) {
                const errorData = await resOrder.json();
                throw new Error(errorData.error || 'Lỗi khi đặt hàng');
            }

            const orderData = await resOrder.json();
            console.log('Đặt hàng thành công:', orderData.message);

            // Call API VNPay
            const resPayment = await fetch('/api/v1/payment/vn-pay', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    amount: totalPrice + 50000,
                    bankCode: 'NCB',
                    note: formData.orderNotes,
                })
            });

            if (!resPayment.ok) {
                const errData = await resPayment.json();
                throw new Error(errData.message || 'Lỗi khi khởi tạo thanh toán');
            }

            const paymentData = await resPayment.json();
            const paymentUrl = paymentData.data?.paymentUrl;
            console.log(paymentUrl);
            if (paymentUrl) {
                window.open(paymentUrl, '_blank');
                navigate(paymentUrl);
            } else {
                throw new Error('Không nhận được link thanh toán từ VNPay');
            }
        }
        catch (err) {
            console.error('Lỗi khi xử lý thanh toán:', err.message);
            setError(err.message);
        }
    };


    return (
        <>
            <Header userName={localStorage.getItem("userName")} categoryDaos={JSON.parse(localStorage.getItem("categoryDaos") || "[]")}/>
            <main>
                {/*<div className="hero-cap text-center">*/}
                {/*    <h2 style={{margin: '40px auto'}}>*/}
                {/*        {localStorage.getItem('userName')*/}
                {/*            ? `WELCOME BACK ${localStorage.getItem('userName')}`*/}
                {/*            : 'WELCOME TO OUR SHOP'}*/}
                {/*    </h2>*/}
                {/*</div>*/}

                <section className="cart_area" style={{margin: '90px 0'}}>
                    <div className="container-fluid">
                        {error && <div className="alert alert-danger">{error}</div>}
                        {/*<div className="billing_details">*/}
                            <div className="row">
                                <div className="col-lg-12">
                                    <form className="row contact_form" onSubmit={handleSubmit}>
                                        <div className="col-lg-6">
                                            <h3>Billing Details</h3>
                                            <div className="col-md-12 form-group mb-3 text-left">
                                                <label htmlFor="fullName">Full name:</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="fullName"
                                                    name="fullName"
                                                    placeholder="Full name"
                                                    value={formData.fullName}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-12 form-group mb-3 text-left">
                                                <label htmlFor="phone">Phone number:</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="phone"
                                                    name="phone"
                                                    placeholder="Phone number"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-12 form-group mb-3 text-left">
                                                <label htmlFor="email">Email address:</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    id="email"
                                                    name="email"
                                                    placeholder="Email Address"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-12 form-group mb-3 text-left">
                                                <label htmlFor="address">Address:</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="address"
                                                    name="address"
                                                    placeholder="Address line"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-12 form-group mb-3 py-2 py-md-3 text-left">
                                                <div className="creat_account">
                                                    <h3>Shipping Details</h3>
                                                </div>
                                                <textarea
                                                    className="form-control"
                                                    id="orderNotes"
                                                    name="orderNotes"
                                                    rows="2"
                                                    placeholder="Order Notes"
                                                    value={formData.orderNotes}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="order_box" style={{fontSize: '12px'}}>
                                                <h2>Your Order</h2>
                                                <ul className="list-group list-group-flush">
                                                    <li className="list-group-item d-flex justify-content-between">
                                                        <span>Product</span>
                                                        <span>Total</span>
                                                    </li>
                                                    {cartItems.map(item => (
                                                        <li key={item.id}
                                                            className="list-group-item d-flex justify-content-between">
                                                            <span>
                                                                {item.productDao.prodName.length > 25
                                                                    ? `${item.productDao.prodName.substring(0, 25)}...`
                                                                    : item.productDao.prodName}
                                                                <span className="ms-2">x {item.quantity}</span>
                                                            </span>
                                                                    <span>
                                                                {(item.quantity * item.productDao.prodPrice).toLocaleString()} VNĐ
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <ul className="list-group list-group-flush mt-3">
                                                    <li className="list-group-item d-flex justify-content-between">
                                                        <span>Subtotal</span>
                                                        <span>{totalPrice.toLocaleString()} VNĐ</span>
                                                    </li>
                                                    <li className="list-group-item d-flex justify-content-between">
                                                        <span>Shipping</span>
                                                        <span>50,000 VNĐ</span>
                                                    </li>
                                                    <li className="list-group-item d-flex justify-content-between">
                                                        <span>Total</span>
                                                        <span>{(totalPrice + 50000).toLocaleString()} VNĐ</span>
                                                    </li>
                                                </ul>
                                                <button type="submit" className="btn btn-primary mt-3">
                                                    Payment and Order
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>

                            </div>
                        {/*</div>*/}
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

export default Checkout;