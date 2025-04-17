import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {Navbar, Sidebar} from '/src/components/admin/fragment/AdminSidebar.jsx'; // Import Navbar và Sidebar từ fragment


// Danh sách tài nguyên CSS của admin



const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        numberOfProduct: 0,
        numberOfCart: 0,
        numberOfUser: 0,
        numberOfOrder: 0,
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await axios.get('/api/admin/dashboard', {
                    withCredentials: true, // Gửi session nếu cần
                });
                setDashboardData(res.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load dashboard data');
            }
        };
        fetchDashboardData();
    }, []);

    return (
        <main>
            <div className="container p-0 g-0">
                <div className="row">
                    <div className="col-2">
                        <Sidebar/>
                    </div>
                    <div className="col-10">
                        <div className="row">
                            <Navbar/>
                        </div>
                        <div className="row">
                            <div className="content-wrapper">
                                {/* Content Header */}
                                <div className="content-header">
                                    <div className="container-fluid">
                                        <div className="row mb-2">
                                            <div className="col-sm-6">
                                                <h1 className="m-0">Dashboard</h1>
                                            </div>
                                            <div className="col-sm-6">
                                                <ol className="breadcrumb float-sm-right">
                                                    <li className="breadcrumb-item">
                                                        <Link to="/admin">Home</Link>
                                                    </li>
                                                    <li className="breadcrumb-item active">Dashboard</li>
                                                </ol>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <section className="content">
                                    <div className="container-fluid">
                                        {error && <div className="alert alert-danger">{error}</div>}
                                        <div className="row">
                                            {/* Small Box: Products */}
                                            <div className="col-lg-3 col-6">
                                                <div className="small-box bg-info">
                                                    <div className="inner">
                                                        <h3>{dashboardData.numberOfProduct}</h3>
                                                        <p>Products</p>
                                                    </div>
                                                    <div className="icon">
                                                        <i className="ion ion-bag"></i>
                                                    </div>
                                                    <Link to="/admin/product" className="small-box-footer">
                                                        More info <i className="fas fa-arrow-circle-right"></i>
                                                    </Link>
                                                </div>
                                            </div>

                                            {/* Small Box: Carts */}
                                            <div className="col-lg-3 col-6">
                                                <div className="small-box bg-success">
                                                    <div className="inner">
                                                        <h3>{dashboardData.numberOfCart}</h3>
                                                        <p>Carts</p>
                                                    </div>
                                                    <div className="icon">
                                                        <i className="ion ion-stats-bars"></i>
                                                    </div>
                                                    <Link to="/admin/cart" className="small-box-footer">
                                                        More info <i className="fas fa-arrow-circle-right"></i>
                                                    </Link>
                                                </div>
                                            </div>

                                            {/* Small Box: Users */}
                                            <div className="col-lg-3 col-6">
                                                <div className="small-box bg-warning">
                                                    <div className="inner">
                                                        <h3>{dashboardData.numberOfUser}</h3>
                                                        <p>Users</p>
                                                    </div>
                                                    <div className="icon">
                                                        <i className="ion ion-person-add"></i>
                                                    </div>
                                                    <Link to="/admin/users" className="small-box-footer">
                                                        More info <i className="fas fa-arrow-circle-right"></i>
                                                    </Link>
                                                </div>
                                            </div>

                                            {/* Small Box: Orders */}
                                            <div className="col-lg-3 col-6">
                                                <div className="small-box bg-danger">
                                                    <div className="inner">
                                                        <h3>{dashboardData.numberOfOrder}</h3>
                                                        <p>Orders</p>
                                                    </div>
                                                    <div className="icon">
                                                        <i className="ion ion-pie-graph"></i>
                                                    </div>
                                                    <Link to="/admin/order" className="small-box-footer">
                                                        More info <i className="fas fa-arrow-circle-right"></i>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>

                    </div>
                </div>


            </div>
        </main>

    );
};

export default Dashboard;