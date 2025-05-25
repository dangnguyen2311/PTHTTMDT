import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../fragment/Navbar.jsx";
import Sidebar from "../fragment/Sidebar.jsx";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        axios.get("/api/admin/user")
            .then((response) => {
                setUsers(response.data);
            })
            .catch((error) => {
                if (error.response?.status === 401) {
                    setError("Bạn không có quyền truy cập");
                } else {
                    setError("Đã xảy ra lỗi khi tải danh sách người dùng");
                }
            });
    }, []);

    return (
        <div className="wrapper">
            <Sidebar/>
            <Navbar/>
            <div className="content-wrapper">
                <section className="content">
                    <div className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <h1 className="m-0">Users</h1>
                                </div>
                                <div className="col-sm-6">
                                    <ol className="breadcrumb float-sm-right">
                                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                        <li className="breadcrumb-item active">Users</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h3 className="card-title">List All Users</h3>
                                    <Link to="/user/add-user" className="btn btn-info">Add</Link>
                                </div>

                                <div className="card-body table-responsive p-0">
                                    <table className="table table-hover text-nowrap table-bordered">
                                        <thead>
                                        <tr>
                                            <th>Username</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Action</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {users.map((user) => (
                                            <tr key={user.userId}>
                                                <td>{user.userName}</td>
                                                <td>{user.userEmail}</td>
                                                <td>{user.userRole === "2" ? "Admin" : "Client"}</td>
                                                <td>
                                                    <Link to={`/user/edit-user/${user.userId}`} className="btn btn-success mr-2">Edit</Link>
                                                    <Link to={`/user/delete-user/${user.userId}`} className="btn btn-danger">Delete</Link>
                                                </td>
                                            </tr>
                                        ))}
                                        {users.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="text-center">No users found</td>
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

            <aside className="control-sidebar control-sidebar-dark">
                {/* Control sidebar content goes here */}
            </aside>
        </div>
    );
};

export default UserList;
