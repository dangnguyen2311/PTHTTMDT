import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userName: username,
                    userPass: password
                }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('adminName', data.adminName);
                navigate('/');
            } else {
                const err = await response.json();
                setError(err.message || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Something went wrong: '+ err);
        }
    };

    return (
        <div className="wrapper">
            <nav className="main-header navbar navbar-expand navbar-white navbar-light">
                <ul className="navbar-nav">
                    <li className="nav-item"><a className="nav-link" data-widget="pushmenu" href="#"><i
                        className="fas fa-bars"></i></a></li>
                    <li className="nav-item d-none d-sm-inline-block"><a href="/public" className="nav-link">Home</a></li>
                    <li className="nav-item d-none d-sm-inline-block"><a href="https://www.facebook.com/"
                                                                         className="nav-link">Contact</a></li>
                    <li className="nav-item d-none d-sm-inline-block"><a href="/logout" className="nav-link">Logout</a>
                    </li>
                </ul>
            </nav>
            <aside className="main-sidebar  sidebar-light-green elevation-4">
                <a href="/" className="brand-link">
                    <span className="brand-text font-weight-normal">Admin</span>
                </a>

                <div className="sidebar sidebar-collapse">
                    <nav className="mt-2">
                        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview">

                        </ul>
                    </nav>
                </div>
            </aside>


            <div className="content-wrapper">
                <section className="content">
                    <div className="content-header">
                        <div className="container-fluid">
                            <div className="container-fluid">
                                <div className="hold-transition login-page">
                                    <div className="login-box">
                                        <div className="login-logo">
                                            <b>Admin</b>Login
                                        </div>
                                        <div className="card">
                                            <div className="card-body login-card-body">
                                                <p className="login-box-msg">Sign in to start your session</p>

                                                {error && (
                                                    <div className="alert alert-danger" role="alert">
                                                        {error}
                                                    </div>
                                                )}

                                                <form onSubmit={handleLogin}>
                                                    <div className="input-group mb-3">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Username"
                                                            value={username}
                                                            onChange={(e) => setUsername(e.target.value)}
                                                            required
                                                        />
                                                        <div className="input-group-append">
                                                            <div className="input-group-text">
                                                                <span className="fas fa-user"/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="input-group mb-3">
                                                        <input
                                                            type="password"
                                                            className="form-control"
                                                            placeholder="Password"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            required
                                                        />
                                                        <div className="input-group-append">
                                                            <div className="input-group-text">
                                                                <span className="fas fa-lock"/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-8"/>
                                                        <div className="col-4">
                                                            <button type="submit" className="btn btn-primary btn-block">
                                                                Login
                                                            </button>
                                                        </div>
                                                    </div>
                                                </form>

                                                {/* Bạn có thể thêm link "Forgot password?" ở đây nếu muốn */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Login;
