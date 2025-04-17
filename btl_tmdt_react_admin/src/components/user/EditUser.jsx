import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../fragment/Navbar.jsx";
import Sidebar from "../fragment/Sidebar.jsx";

function EditUser() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState({
        userName: "",
        userFullName: "",
        userPass: "",
        userEmail: "",
        userPhone: "",
        userAddress: "",
        userRole: "1"
    });

    const [error, setError] = useState("");

    useEffect(() => {
        axios.get(`/api/admin/user/${id}`)
            .then(res => setUser(res.data))
            .catch(err => {
                setError("Không thể tải thông tin người dùng, link l thng tin nguoi dung");
                console.error(err);
            });
    }, [id]);

    const handleChange = e => {
        const { name, value } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/admin/user/${id}`, user);
            alert("Cập nhật thành công!");
            navigate("/user"); // Chuyển hướng về danh sách user
        } catch (err) {
            setError("Cập nhật thất bại!");
            console.error(err);
        }
    };

    return (
        <div className="wrapper">
            {/* Navbar và Sidebar có thể dùng component riêng */}
             <Navbar />
             <Sidebar />

            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Edit user</h1>
                            </div>
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item"><a href="/">Home</a></li>
                                    <li className="breadcrumb-item active">Edit user</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="content">
                    <div className="card card-success">
                        <div className="card-header">
                            <h3 className="card-title">User information</h3>
                        </div>

                        {error && <div className="mt-3 alert alert-danger">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="card-body">
                                <div className="form-group">
                                    <label>Username</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="userName"
                                        value={user.userName}
                                        readOnly
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Fullname</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="userFullName"
                                        value={user.userFullName}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="userPass"
                                        value={user.userPass}
                                        readOnly
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="userEmail"
                                        value={user.userEmail}
                                        readOnly
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Phone</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="userPhone"
                                        value={user.userPhone}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Address</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="userAddress"
                                        value={user.userAddress}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Role</label>
                                    <select
                                        className="form-control"
                                        name="userRole"
                                        value={user.userRole}
                                        onChange={handleChange}
                                    >
                                        <option value="2">ADMIN</option>
                                        <option value="1">USER</option>
                                    </select>
                                </div>
                            </div>

                            <div className="card-footer">
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </div>
                        </form>
                    </div>
                </section>
            </div>

            <aside className="control-sidebar control-sidebar-dark">
                {/* Control sidebar content goes here */}
            </aside>
        </div>
    );
}

export default EditUser;
