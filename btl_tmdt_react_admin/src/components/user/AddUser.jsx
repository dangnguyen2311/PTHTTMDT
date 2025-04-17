import React, { useState } from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import Navbar from "../fragment/Navbar.jsx";
import Sidebar from "../fragment/Sidebar.jsx";

const AddUser = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        userName: "",
        userFullName: "",
        userPass: "",
        userEmail: "",
        userAddress: "",
        userPhone: "",
        userRole: "1", // default là USER
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axios.post("/api/admin/user", formData);
            console.log(res.data);
            navigate("/user"); // quay lại trang danh sách user
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data);
            } else {
                setError("Đã xảy ra lỗi khi thêm user");
            }
        }
    };

    return (
        <div className="wrapper">
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
                                    <li className="breadcrumb-item">
                                        <Link to="/"/>
                                    </li>
                                    <li className="breadcrumb-item active">Add User</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="content">
                    <div className="card card-success">
                        <div className="card-header">
                            <h3 className="card-title">User Information</h3>
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
                                        value={formData.userName}
                                        onChange={handleChange}
                                        placeholder="Enter username"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Fullname</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="userFullName"
                                        value={formData.userFullName}
                                        onChange={handleChange}
                                        placeholder="Enter fullname"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="userPass"
                                        value={formData.userPass}
                                        onChange={handleChange}
                                        placeholder="Enter password"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="userEmail"
                                        value={formData.userEmail}
                                        onChange={handleChange}
                                        placeholder="Enter email"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Address</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="userAddress"
                                        value={formData.userAddress}
                                        onChange={handleChange}
                                        placeholder="Enter address"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="userPhone"
                                        value={formData.userPhone}
                                        onChange={handleChange}
                                        placeholder="Enter phone number"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Role</label>
                                    <select
                                        className="form-control"
                                        name="userRole"
                                        value={formData.userRole}
                                        onChange={handleChange}
                                    >
                                        <option value="2">ADMIN</option>
                                        <option value="1">USER</option>
                                    </select>
                                </div>
                            </div>

                            <div className="card-footer">
                                <button type="submit" className="btn btn-primary">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </div>

    );
};

export default AddUser;
