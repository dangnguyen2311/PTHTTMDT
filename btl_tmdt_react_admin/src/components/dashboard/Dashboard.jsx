// src/pages/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import Navbar from '/src/components/fragment/Navbar.jsx';
import Sidebar from '/src/components/fragment/Sidebar';
import DashboardCard from '/src/components/dashboard/DashboardCard';
import axios from 'axios';
import {Link} from "react-router-dom";

function Dashboard() {
    const [stats, setStats] = useState({
        numberOfProduct: 0,
        numberOfCart: 0,
        numberOfUser: 0,
        numberOfOrder: 0,
    });

    useEffect(() => {
        axios.get('/api/admin/dashboard') // Đổi endpoint này cho đúng backend của bạn
            .then(res => setStats(res.data))
            .catch(err => console.error('Failed to load stats:', err));
    }, []);

    return (
        // <div className="wrapper" style={{
        //     width: '100vw',
        //     height: '100vh',
        //     overflow: 'hidden' // nếu không muốn scroll
        // }}>
        <div className="wrapper " >
            <Navbar/>
            <Sidebar/>
            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Dashboard</h1>
                            </div>
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                    <li className="breadcrumb-item active">Dashboard</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="content">
                    <div className="row">
                        <DashboardCard count={stats.numberOfProduct} title="Products" icon="ion-bag" bgColor="bg-info"
                                       link="/product"/>
                        <DashboardCard count={stats.numberOfCart} title="Carts" icon="ion-stats-bars"
                                       bgColor="bg-success" link="/cart"/>
                        <DashboardCard count={stats.numberOfUser} title="Users" icon="ion-person-add"
                                       bgColor="bg-warning" link="/user"/>
                        <DashboardCard count={stats.numberOfOrder} title="Orders" icon="ion-pie-graph"
                                       bgColor="bg-danger" link="/order"/>
                    </div>
                </section>
            </div>
            <aside className="control-sidebar control-sidebar-dark">
            </aside>
        </div>
    );
}

export default Dashboard;
