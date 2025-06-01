import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../fragment/Navbar.jsx";
import Sidebar from "../fragment/Sidebar.jsx";

const ReturnOrder = () => {
    const [returnOrders, setReturnOrders] = useState([]);

    useEffect(() => {
        fetchReturnOrders();
    }, []);

    const fetchReturnOrders = async () => {
        try {
            const response = await axios.get("/api/admin/return/list");
            setReturnOrders(response.data.returnOrders); // Khớp với key trong Map backend trả về
        } catch (err) {
            console.error("Lỗi khi lấy danh sách Return Orders:", err);
        }
    };


    const handleAcceptReturn = async (returnId) => {
        try {
            const response = await fetch(`/api/admin/return/accept/${returnId}`, {
                method: 'POST',
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message || "Yêu cầu trả hàng đã được chấp nhận!");
                window.location.reload();
            } else {
                const error = await response.json();
                alert(error.error || "Có lỗi xảy ra khi xác nhận trả hàng.");
            }
        } catch (error) {
            console.error("Lỗi kết nối:", error);
            alert("Không thể kết nối đến server.");
        }
    };



    return (
        <div className="wrapper">
            <Navbar />
            <Sidebar />

            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Return Orders</h1>
                            </div>
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                    <li className="breadcrumb-item active">Return Orders</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="content">
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h3 className="card-title">Danh sách yêu cầu trả hàng</h3>
                                </div>

                                <div className="card-body table-responsive p-0">
                                    <table className="table table-bordered table-hover text-nowrap">
                                        <thead>
                                        <tr>
                                            {/*<th>ID</th>*/}
                                            <th>User</th>
                                            <th>Order ID</th>
                                            <th>Reason</th>
                                            <th>Status</th>
                                            <th>Created Date</th>
                                            <th>Action</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {returnOrders.map((returnOrder) => (
                                            <tr key={returnOrder.id}>
                                                {/*<td>{order.id}</td>*/}
                                                <td>{returnOrder.userName}</td>
                                                <td>{returnOrder.orderId}</td>
                                                <td>{returnOrder.reason}</td>
                                                <td><strong className={returnOrder.status === 'accepted' ? 'text-success' : 'text-warning'}>{returnOrder.status}</strong></td>
                                                <td>{returnOrder.returnDate ? new Date(returnOrder.returnDate).toLocaleDateString("vi-VN") : "N/A"}</td>
                                                <td>
                                                    <Link to={`/order/order-item/${returnOrder.id}`} className="btn btn-info">
                                                        List Products
                                                    </Link>
                                                    <button
                                                        className={returnOrder.status === 'wait'? "btn btn-warning": "btn btn-primary d-none"}
                                                        onClick={() => handleAcceptReturn(returnOrder.id)}
                                                    >
                                                        Accept Return
                                                    </button>

                                                </td>
                                            </tr>
                                        ))}
                                        {returnOrders.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="text-center">
                                                    Không có dữ liệu trả hàng.
                                                </td>
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

            <aside className="control-sidebar control-sidebar-dark" />
        </div>
    );
};

export default ReturnOrder;
