import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../fragment/Navbar.jsx";
import Sidebar from "../fragment/Sidebar.jsx";
import {Link} from "react-router-dom";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [productName, setProductName] = useState("");

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            let response;
            if (productName.trim() === "") {
                response = await axios.get("/api/admin/product");
            } else {
                response = await axios.get(`/api/admin/product/search?name=${productName}`);
            }
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProducts();
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) {
            try {
                await axios.delete(`/api/admin/product/${id}`);
                fetchProducts();
            } catch (err) {
                console.error("Delete error:", err);
            }
        }
    };

    return (
        <div className="wrapper">
            <Navbar />
            <Sidebar />

            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Products</h1>
                            </div>
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                    <li className="breadcrumb-item active">Products</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="content">
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h3 className="card-title">List All Product</h3>
                                    <Link to="/product/add-product" className="btn btn-info">
                                        Add
                                    </Link>
                                    <form onSubmit={handleSearch} className="input-group input-group-sm" style={{ width: 350, height: 40 }}>
                                        <input
                                            type="text"
                                            name="productName"
                                            className="form-control float-right"
                                            placeholder="Search"
                                            value={productName}
                                            onChange={(e) => setProductName(e.target.value)}
                                            style={{ height: 40 }}
                                        />
                                        <div className="input-group-append">
                                            <button type="submit" className="btn btn-default">
                                                <i className="fas fa-search" />
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                <div className="card-body table-responsive p-0">
                                    <table className="table table-bordered table-hover text-nowrap">
                                        <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Category</th>
                                            <th>Price</th>
                                            <th>Description</th>
                                            <th>Picture</th>
                                            <th>Action</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {products.map((product) => (
                                            <tr key={product.prodId}>
                                                <td>{product.prodName}</td>
                                                <td>{product.categoryDao.categoryName}</td>
                                                <td>{product.prodPrice.toLocaleString("vi-VN")} VNĐ</td>
                                                <td>{product.prodDescription}</td>
                                                <td>
                                                    <img src={product.prodImg} alt="product" style={{ height: 130, width: "auto" }} />
                                                </td>
                                                <td>
                                                    <Link to={`/product/edit-product/${product.prodId}`} className="btn btn-info">
                                                        Edit
                                                    </Link>
                                                    &nbsp;
                                                    <button className="btn btn-danger" onClick={() => handleDelete(product.prodId)}>Delete</button>
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

            <aside className="control-sidebar control-sidebar-dark" />
        </div>
    );
};

export default ProductList;
