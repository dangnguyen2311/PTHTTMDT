import {Link} from "react-router-dom";
import React, {useState} from "react";
import {toast} from "react-toastify";
import axios from "axios";

export const RevenueStat = () => {
    const [startDateRevenue, setStartDateRevenue] = useState('');
    const [endDateRevenue, setEndDateRevenue] = useState('');
    const [revenueStats, setRevenueStats] = useState(null);
    const [orders, setOrders] = useState([]);
    const handleRevenueSearch = () => {
        if (!startDateRevenue || !endDateRevenue) {
            alert("Vui lòng chọn đầy đủ ngày bắt đầu và kết thúc.");
            return;
        }
        const start = new Date(startDateRevenue);
        const end = new Date(endDateRevenue);
        toast.success('gdfsfgsbdvf');
        if (start > end) {
            alert("Ngày bắt đầu không được lớn hơn ngày kết thúc.");
            return;
        }

        axios.get('/api/admin/statistic/revenue', {
            params: {
                start: startDateRevenue,
                end: endDateRevenue
            }
        })
            .then(res => {
                setRevenueStats({
                    totalOrders: res.data.totalOrders,
                    totalRevenue: res.data.totalRevenue
                });
                setOrders(res.data.orders);
            })
            .catch(err => {
                console.error('Lỗi khi tìm kiếm doanh thu:', err);
                alert('Không thể lấy dữ liệu thống kê' + err);
            });
    };

    return (
        <section className="content mt-4">
            <div className="container-fluid">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Revenue Statistic</h3>
                    </div>
                    <div className="card-body">
                        <div className="form-inline mb-3">
                            <label className="mr-2">From:</label>
                            <input type="date" className="form-control mr-3" value={startDateRevenue}
                                   onChange={(e) => setStartDateRevenue(e.target.value)}/>
                            <label className="mr-2">To:</label>
                            <input type="date" className="form-control mr-3" value={endDateRevenue}
                                   onChange={(e) => setEndDateRevenue(e.target.value)}/>
                            <button className="btn btn-primary" onClick={handleRevenueSearch}>Search
                            </button>
                        </div>

                        {revenueStats && (
                            <div className="mb-3" style={{fontSize: '25px'}}>
                                <p><strong>Total Orders:</strong> {revenueStats.totalOrders}</p>
                                <p><strong>Total Revenue:</strong> {revenueStats.totalRevenue} VNĐ</p>
                            </div>
                        )}

                        {orders.length > 0 && (
                            <table className="table table-bordered">
                                <thead>
                                <tr>
                                    <th>Order Date</th>
                                    <th>Customer</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {orders.map(order => (
                                    <tr key={order.orderId}>
                                        <td>{order.order_time}</td>
                                        <td>{order.userDao.userName}</td>
                                        <td>{order.total} VNĐ</td>
                                        <td>{order.status}</td>
                                        <td>
                                            <Link to={`/order/order-item/${order.orderId}`}
                                                  className="btn btn-success btn-sm mr-2">
                                                List product
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
