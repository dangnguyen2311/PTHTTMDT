import { Link } from "react-router-dom";
import React, { useState } from "react";
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from 'recharts';

export const BestSellingStat = () => {
    const [startDateBest, setStartDateBest] = useState('');
    const [endDateBest, setEndDateBest] = useState('');
    const [bestSelling, setBestSelling] = useState([]);

    const handleBestSellingSearch = async () => {
        if (!startDateBest || !endDateBest) {
            alert("Please select both start and end date");
            return;
        }

        try {
            const response = await axios.get('/api/admin/statistic/best-selling', {
                params: {
                    start: startDateBest,
                    end: endDateBest
                }
            });
            setBestSelling(response.data);
        } catch (error) {
            console.error("Failed to fetch best selling products:", error);
            alert("No data found or an error occurred.");
        }
    };

    return (
        <section className="content mt-4">
            <div className="container-fluid">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Best Selling Product Statistic</h3>
                    </div>
                    <div className="card-body">
                        <div className="form-inline mb-3">
                            <label className="mr-2">From:</label>
                            <input type="date" className="form-control mr-3" value={startDateBest}
                                   onChange={(e) => setStartDateBest(e.target.value)} />
                            <label className="mr-2">To:</label>
                            <input type="date" className="form-control mr-3" value={endDateBest}
                                   onChange={(e) => setEndDateBest(e.target.value)} />
                            <button className="btn btn-primary" onClick={handleBestSellingSearch}>Search</button>
                        </div>

                        {bestSelling.length > 0 && (
                            <>
                                <div style={{width: '100%', height: 450}}> {/* tăng height để đủ chỗ hiển thị */}
                                    <ResponsiveContainer>
                                        <BarChart
                                            data={bestSelling}
                                            margin={{
                                                top: 20,
                                                right: 30,
                                                left: 20,
                                                bottom: 80
                                            }} // tăng bottom để đủ chỗ tên sản phẩm
                                        >
                                            <CartesianGrid strokeDasharray="3 3"/>
                                            <XAxis
                                                dataKey="prodName"
                                                tick={{fontSize: 10}}
                                                interval={0}
                                                angle={-45}
                                                textAnchor="end"
                                            />
                                            <YAxis/>
                                            <Tooltip/>
                                            <Legend/>
                                            <Bar dataKey="soldQuantity" fill="#8884d8" name="Quantity Sold"/>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                <table className="table table-bordered py-5">
                                    <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Quantity Sold</th>
                                        <th>Price</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {bestSelling.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.prodName}</td>
                                            <td>{item.soldQuantity}</td>
                                            <td>{item.prodPrice} VNĐ</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>

                                {/* Bar Chart Section */}

                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
