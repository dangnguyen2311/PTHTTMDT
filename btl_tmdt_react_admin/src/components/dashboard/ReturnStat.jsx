import {Link} from "react-router-dom";
import React, {useState} from "react";
import {toast} from "react-toastify";
import axios from "axios";

export const ReturnStat = () => {
    const [startDateReturn, setStartDateReturn] = useState('');
    const [endDateReturn, setEndDateReturn] = useState('');
    const [returnStats, setReturnStats] = useState(null);
    const [returnOrders, setReturnOrders] = useState([]);

    const handleReturnOrderSearch = () => {
        if (!startDateReturn || !endDateReturn) {
            alert("Vui lòng chọn đầy đủ ngày bắt đầu và kết thúc.");
            return;
        }
        const start = new Date(startDateReturn);
        const end = new Date(endDateReturn);
        toast.success('gdfsfgsbdvf');
        if (start > end) {
            alert("Ngày bắt đầu không được lớn hơn ngày kết thúc.");
            return;
        }

        axios.get('/api/admin/statistic/return', {
            params: {
                start: startDateReturn,
                end: endDateReturn
            }
        }).then(res => {
            setReturnStats({
                totalReturnOrders: res.data.totalReturnOrders,
            });
            setReturnOrders(res.data.returnOrders);
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
                        <h3 className="card-title">Return order Statistic</h3>
                    </div>
                    <div className="card-body">
                        <div className="form-inline mb-3">
                            <label className="mr-2">From:</label>
                            <input type="date" className="form-control mr-3" value={startDateReturn}
                                   onChange={(e) => setStartDateReturn(e.target.value)}/>
                            <label className="mr-2">To:</label>
                            <input type="date" className="form-control mr-3" value={endDateReturn}
                                   onChange={(e) => setEndDateReturn(e.target.value)}/>
                            <button className="btn btn-primary" onClick={handleReturnOrderSearch}>Search
                            </button>
                        </div>

                        {returnStats && (
                            <div className="mb-3" style={{fontSize: '25px'}}>
                                <p><strong>Total Return Order:</strong> {returnStats.totalReturnOrders}</p>
                            </div>
                        )}

                        {returnOrders.length > 0 && (
                            <table className="table table-bordered">
                                <thead>
                                <tr>
                                    <th>Return Date</th>
                                    <th>Customer</th>
                                    <th>Reason</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {returnOrders.map(returnOrder => (
                                    <tr key={returnOrder.orderId}>
                                        <td>{returnOrder.returnDate}</td>
                                        <td>{returnOrder.userName}</td>
                                        <td>{returnOrder.reason} VNĐ</td>
                                        <td>{returnOrder.status}</td>
                                        <td>
                                            <Link to={`/order/order-item/${returnOrder.orderId}`}
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
