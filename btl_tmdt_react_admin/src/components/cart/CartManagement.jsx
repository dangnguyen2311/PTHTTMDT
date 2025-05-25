import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../fragment/Navbar.jsx";
import Sidebar from "../fragment/Sidebar.jsx";

const CartManagement = () => {
    const [cartDaos, setCartDaos] = useState([]);

    useEffect(() => {
        const fetchCarts = async () => {
            try {
                const response = await fetch('/api/admin/cart'); // Endpoint to get all carts
                if (response.ok) {
                    const data = await response.json();
                    setCartDaos(data); // Assuming the data is an array of cart objects
                } else {
                    console.error("Failed to fetch carts");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchCarts();
    }, []);

    return (
        <div className="wrapper">
            <Navbar/>
            <Sidebar/>
            <div className="content-wrapper">
                {/*lỗi lỗi do cái này đẩy sang phải một khoảng trống*/}
                <section className="content">
                    <div className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <h1 className="m-0">Carts</h1>
                                </div>
                                <div className="col-sm-6">
                                    <ol className="breadcrumb float-sm-right">
                                        <li className="breadcrumb-item">
                                            <Link to="/admin">Home</Link>
                                        </li>
                                        <li className="breadcrumb-item active">Carts</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">List All Carts</h3>
                                </div>
                                <div className="card-body table-responsive p-0">
                                    <table className="table table-hover text-nowrap table-bordered">
                                        <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Action</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {cartDaos.map((cartDao) => (
                                            <tr key={cartDao.id}>
                                                <td>{cartDao.userDao.userName}</td>
                                                <td>
                                                    <Link
                                                        to={`/admin/cart/cart-item/${cartDao.id}`}
                                                        className="btn btn-success"
                                                    >
                                                        List product
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>

    );
};

export default CartManagement;
