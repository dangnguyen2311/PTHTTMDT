import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../fragment/Header.jsx';
import { Footer } from '../fragment/Footer.jsx';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [categoryDaos, setCategoryDaos] = useState([]);

    useEffect(() => {
        fetch('/api/v1/cart/my-cart')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Lỗi khi lấy giỏ hàng');
                }
                return res.json();
            })
            .then(data => {
                if (data.error) {

                    setError(data.error);
                    setCartItems([]);
                    setTotalPrice(0);
                } else {
                    setCategoryDaos(data.categories);
                    setCartItems(data.productInCartDaos || []);
                    setTotalPrice(data.totalPrice || 0);
                }
            })
            .catch(err => {
                setError(err.message);
                setCartItems([]);
            });
    }, []);

    const handleQuantityChange = async (id, quantity) => {
        try {
            const res = await fetch(`/api/v1/cart/update-cart/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ quantity })
            });

            if (!res.ok) throw new Error('Lỗi khi cập nhật số lượng');

            setCartItems(prev =>
                prev
                    .map(item =>
                        item.id === id ? { ...item, quantity: parseInt(quantity) } : item
                    )
                    .filter(item => item.quantity > 0)
            );

            setTotalPrice(
                cartItems.reduce((sum, item) => {
                    const newQty = item.id === id ? parseInt(quantity) : item.quantity;
                    return sum + newQty * item.productDao.prodPrice;
                }, 0)
            );

        } catch (err) {
            setError(err.message);
        }
    };


    const handleRemoveItem = async (id) => {
        try {
            const res = await fetch(`/api/v1/cart/remove-cart/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!res.ok) throw new Error('Lỗi khi xóa sản phẩm');

            // Lấy item cần xóa trước khi setCartItems
            const removedItem = cartItems.find(item => item.id === id);
            if (!removedItem) throw new Error('Không tìm thấy sản phẩm');

            // Cập nhật state
            setCartItems(prev => prev.filter(item => item.id !== id));
            setTotalPrice(prev => prev - removedItem.quantity * removedItem.productDao.prodPrice);
        } catch (err) {
            setError(err.message);
        }
    };


    return (
        <>
            <Header userName={localStorage.getItem("userName")} categoryDaos={categoryDaos}/>
            <main>
                <div className="hero-cap text-center">
                    <h2 style={{ margin: '40px auto' }}>LIST PRODUCT IN YOUR CART</h2>
                </div>
                <section className="cart_area" style={{ margin: '40px auto' }}>
                    <div className="container">
                        {error && <div className="alert alert-danger">{error}</div>}
                        {cartItems.length === 0 && !error && (
                            <p className="text-center">Giỏ hàng của bạn đang trống.</p>
                        )}
                        {cartItems.length > 0 && (
                            <div className="cart_inner">
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                        <tr>
                                            <th><span>Product</span></th>
                                            <th><span>Price</span></th>
                                            <th><span>Quantity</span></th>
                                            <th><span>Total</span></th>
                                            <th><span>Remove</span></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {cartItems.map(item => (
                                            <tr key={item.id}>
                                                <td className="align-middle">
                                                    <div className="media">
                                                        <div className="d-flex">
                                                            <img
                                                                src={item.productDao.prodImg}
                                                                alt={item.productDao.prodName}
                                                                style={{ width: '100px' }}
                                                            />
                                                        </div>
                                                        <div className="media-body">
                                                            <span>{item.productDao.prodName}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="align-middle">
                                                    <span>{item.productDao.prodPrice.toLocaleString()} VNĐ</span>
                                                </td>
                                                <td className="align-middle">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        value={item.quantity}
                                                        onChange={e => handleQuantityChange(item.id, e.target.value)}
                                                        className="form-control w-80 d-inline"
                                                    />
                                                </td>
                                                <td className="align-middle">
                                                    <span>{(item.quantity * item.productDao.prodPrice).toLocaleString()} VNĐ</span>
                                                </td>
                                                <td className="align-middle">
                                                    <button onClick={() => handleRemoveItem(item.id)}>
                                                        <span className="flaticon-delete">Remove</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td className="align-middle"></td>
                                            <td className="align-middle"></td>
                                            <td className="align-middle"><strong>Subtotal</strong></td>
                                            <td className="align-middle"><strong>{totalPrice.toLocaleString()} VNĐ</strong></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    <div className="checkout_btn_inner float-right">
                                        <button className="btn_3 checkout_btn_1 mx-3" onClick={() => navigate('/checkout')}>
                                            Checkout
                                        </button>
                                        <button className="btn_3" onClick={() => navigate('/slide/1')}>
                                            Shopping
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default Cart;