import Header from "../fragment/Header.jsx";
import {Footer} from "../fragment/Footer.jsx";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

const Return = () => {
    const [error, setError] = useState('');
    const [res, setRes] = useState('');
    const [status, setStatus] = useState('');
    const [note, setNote] = useState('');
    const [reason, setReason] = useState('');
    const [address, setAddress] = useState('');
    const [productInOrders, setProductInOrders] = useState([]);
    // const userId = localStorage.getItem("userId");
    const {orderId} = useParams();
    const navigate = useNavigate();



    useEffect(()=>{
        const fetchOrderDetails = async () => {
            try{
                const response = await fetch(`/api/v1/order/detail/${orderId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Không thể lấy chi tiết đơn hàng');
                }
                const data = await response.json();
                setProductInOrders(data.productInOrderDaos || []);
            }
            catch (err){
                setError('Lỗi khi lấy dữ liệu: ' + err.message);
            }
        };
        fetchOrderDetails();
    }, [orderId])

    const onSubmitReturn = async (e) => {
        e.preventDefault(); // Ngăn reload form

        try {
            const response = await fetch(`/api/v1/return/${orderId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    orderId: orderId,
                    userName: localStorage.getItem("userName"),
                    status: 'wait',
                    reason: reason,
                    returnDate: new Date(),
                    address: address,
                    note: note,
                }),
            });

            if (!response.ok) {
                throw new Error('Lỗi khi trả hàng');
            }
            else{
                setRes(response.message);
                navigate(`/my-order`, {replace: true});
            }

        } catch (e) {
            setError(e.message);
        }
    };

    return (
        <>
            <Header userName={localStorage.getItem("userName")} categoryDaos={JSON.parse(localStorage.getItem("categoryDaos") || "[]")} />
            <main>
                <div className="whole-wrap">
                    <div className="container box_1170">
                        <div className="hero-cap text-center">
                            <h2 style={{ margin: '40px auto' }}>Return Product</h2>
                        </div>

                        <div className="section-top-border px-0">
                            <div className="row">
                                {/* Form Trả hàng */}
                                <div className="col-lg-6">
                                    {error && <div className="alert alert-danger">{error}</div>}
                                    {res && <div className="alert alert-success">{res}</div>}
                                    <h3 className="mb-30">Please give us reason for return</h3>
                                    <div className="d-flex justify-content-center align-items-center">
                                        <form className="w-100" onSubmit={onSubmitReturn}>
                                            <label className="form-label fs-5">Choose (Reason)</label>
                                            <select
                                                className="form-select"
                                                aria-label="Default select example"
                                                onChange={(e) => setReason(e.target.value)}
                                                required
                                            >
                                                <option value="">Select reason</option>
                                                <option value="Don't like this product so much">Don't like this product so much</option>
                                                <option value="Change the model: color, storage, ...">Change the model: color, storage, ...</option>
                                                <option value="Change the address">Change the address</option>
                                                <option value="Incorrect Order Details">Incorrect Order Details</option>
                                            </select>

                                            <div className="mb-3 py-2">
                                                <label className="form-label fs-5">Reason (Note) for Returning</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={note}
                                                    onChange={(e) => setNote(e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <div className="mb-3 py-2">
                                                <label className="form-label fs-5">Address</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={address}
                                                    onChange={(e) => setAddress(e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <button type="submit" className="btn btn-primary">
                                                Submit
                                            </button>
                                        </form>
                                    </div>
                                </div>

                                <div className="col-lg-6">
                                    <div className="order_box" style={{ fontSize: '12px' }}>
                                        <h2>Product List</h2>
                                        <ul className="list-group list-group-flush">
                                            <li className="list-group-item fs-6 d-flex justify-content-between">
                                                <span>Product</span>
                                                <span>Total</span>
                                            </li>
                                            {productInOrders.map(item => (
                                                <li key={item.id} className="list-group-item d-flex fs-8 justify-content-between">
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
                                        {/*<ul className="list-group list-group-flush mt-3">*/}
                                        {/*    <li className="list-group-item d-flex justify-content-between">*/}
                                        {/*        <span>Subtotal</span>*/}
                                        {/*        <span>{totalPrice.toLocaleString()} VNĐ</span>*/}
                                        {/*    </li>*/}
                                        {/*    <li className="list-group-item d-flex justify-content-between">*/}
                                        {/*        <span>Shipping</span>*/}
                                        {/*        <span>50,000 VNĐ</span>*/}
                                        {/*    </li>*/}
                                        {/*    <li className="list-group-item d-flex justify-content-between">*/}
                                        {/*        <span>Total</span>*/}
                                        {/*        <span>{(totalPrice + 50000).toLocaleString()} VNĐ</span>*/}
                                        {/*    </li>*/}
                                        {/*</ul>*/}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );

};

export default Return;
