import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
    return (
        <nav className="main-header navbar navbar-expand navbar-white navbar-light">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <a className="nav-link" data-widget="pushmenu" href="#" role="button">
                        <i className="fas fa-bars"></i>
                    </a>
                </li>
                <li className="nav-item d-none d-sm-inline-block">
                    <Link to="/admin" className="nav-link">Home</Link>
                </li>
                <li className="nav-item d-none d-sm-inline-block">
                    <Link to="https://www.facebook.com/" className="nav-link">Contact</Link>
                </li>
                <li className="nav-item d-none d-sm-inline-block">
                    <Link to="/admin/logout" className="nav-link">Logout</Link>
                </li>
            </ul>
        </nav>
    );
};

export const Sidebar = () => {
    return (
        <aside className="main-sidebar sidebar-dark-primary elevation-4">
            <Link to="/admin" className="brand-link">
                <span className="brand-text font-weight-light">Admin Dashboard</span>
            </Link>

            <div className="sidebar">
                <nav className="mt-2">
                    <ul
                        className="nav nav-pills nav-sidebar flex-column"
                        data-widget="treeview"
                        role="menu"
                        data-accordion="false"
                    >
                        <li className="nav-item">
                            <a href="#" className="nav-link">
                                <p>
                                    Users <i className="fas fa-angle-left right"></i>
                                </p>
                            </a>
                            <ul className="nav nav-treeview">
                                <li className="nav-item">
                                    <Link to="/admin/users" className="nav-link">
                                        <i className="far fa-circle nav-icon"></i>
                                        <p>List</p>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/admin/users/add-user" className="nav-link">
                                        <i className="far fa-circle nav-icon"></i>
                                        <p>Add</p>
                                    </Link>
                                </li>
                            </ul>
                        </li>

                        <li className="nav-item">
                            <a href="#" className="nav-link">
                                <p>
                                    Categories <i className="fas fa-angle-left right"></i>
                                </p>
                            </a>
                            <ul className="nav nav-treeview">
                                <li className="nav-item">
                                    <Link to="/admin/category" className="nav-link">
                                        <i className="far fa-circle nav-icon"></i>
                                        <p>List</p>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/admin/category/add-category" className="nav-link">
                                        <i className="far fa-circle nav-icon"></i>
                                        <p>Add</p>
                                    </Link>
                                </li>
                            </ul>
                        </li>

                        <li className="nav-item">
                            <a href="#" className="nav-link">
                                <p>
                                    Products <i className="fas fa-angle-left right"></i>
                                </p>
                            </a>
                            <ul className="nav nav-treeview">
                                <li className="nav-item">
                                    <Link to="/admin/product" className="nav-link">
                                        <i className="far fa-circle nav-icon"></i>
                                        <p>List</p>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/admin/product/add-product" className="nav-link">
                                        <i className="far fa-circle nav-icon"></i>
                                        <p>Add</p>
                                    </Link>
                                </li>
                            </ul>
                        </li>

                        <li className="nav-item">
                            <a href="#" className="nav-link">
                                <p>
                                    Carts <i className="fas fa-angle-left right"></i>
                                </p>
                            </a>
                            <ul className="nav nav-treeview">
                                <li className="nav-item">
                                    <Link to="/admin/cart" className="nav-link">
                                        <i className="far fa-circle nav-icon"></i>
                                        <p>List</p>
                                    </Link>
                                </li>
                            </ul>
                        </li>

                        <li className="nav-item">
                            <a href="#" className="nav-link">
                                <p>
                                    Orders <i className="fas fa-angle-left right"></i>
                                </p>
                            </a>
                            <ul className="nav nav-treeview">
                                <li className="nav-item">
                                    <Link to="/admin/order" className="nav-link">
                                        <i className="far fa-circle nav-icon"></i>
                                        <p>List</p>
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>
    );
};

const AdminLayout = () => {
    return (
        <div>
            <Navbar />
            <Sidebar />
            {/* Other content can go here */}
        </div>
    );
};

export default AdminLayout;
