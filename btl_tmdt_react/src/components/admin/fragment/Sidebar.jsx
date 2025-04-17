import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div
            className="offcanvas offcanvas-start"
            tabIndex="-1"
            id="sidebar"
            aria-labelledby="sidebarLabel"
        >
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="sidebarLabel">
                    Menu
                </h5>
                <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                ></button>
            </div>
            <div className="offcanvas-body">
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <a
                            className="nav-link dropdown-toggle"
                            href="#"
                            data-bs-toggle="collapse"
                            data-bs-target="#usersMenu"
                            aria-expanded="false"
                            aria-controls="usersMenu"
                        >
                            Users
                        </a>
                        <div className="collapse" id="usersMenu">
                            <ul className="nav flex-column ps-3">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/admin/users">
                                        List
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/admin/users/add-user">
                                        Add
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </li>

                    <li className="nav-item">
                        <a
                            className="nav-link dropdown-toggle"
                            href="#"
                            data-bs-toggle="collapse"
                            data-bs-target="#categoriesMenu"
                            aria-expanded="false"
                            aria-controls="categoriesMenu"
                        >
                            Categories
                        </a>
                        <div className="collapse" id="categoriesMenu">
                            <ul className="nav flex-column ps-3">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/admin/category">
                                        List
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/admin/category/add-category">
                                        Add
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </li>

                    <li className="nav-item">
                        <a
                            className="nav-link dropdown-toggle"
                            href="#"
                            data-bs-toggle="collapse"
                            data-bs-target="#productsMenu"
                            aria-expanded="false"
                            aria-controls="productsMenu"
                        >
                            Products
                        </a>
                        <div className="collapse" id="productsMenu">
                            <ul className="nav flex-column ps-3">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/admin/product">
                                        List
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/admin/product/add-product">
                                        Add
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </li>

                    <li className="nav-item">
                        <a
                            className="nav-link dropdown-toggle"
                            href="#"
                            data-bs-toggle="collapse"
                            data-bs-target="#cartsMenu"
                            aria-expanded="false"
                            aria-controls="cartsMenu"
                        >
                            Carts
                        </a>
                        <div className="collapse" id="cartsMenu">
                            <ul className="nav flex-column ps-3">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/admin/cart">
                                        List
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </li>

                    <li className="nav-item">
                        <a
                            className="nav-link dropdown-toggle"
                            href="#"
                            data-bs-toggle="collapse"
                            data-bs-target="#ordersMenu"
                            aria-expanded="false"
                            aria-controls="ordersMenu"
                        >
                            Orders
                        </a>
                        <div className="collapse" id="ordersMenu">
                            <ul className="nav flex-column ps-3">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/admin/order">
                                        List
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;