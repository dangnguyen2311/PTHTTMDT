import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../fragment/Navbar.jsx";
import Sidebar from "../fragment/Sidebar.jsx";

const ReviewList = () => {
    const [reviews, setReviews] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await axios.get("/api/admin/review/list");
            let data = response.data.reviews || [];

            // Nếu có search, lọc client-side
            if (searchTerm.trim() !== "") {
                data = data.filter((review) =>
                    review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    review.productId.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            setReviews(data);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchReviews();
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa đánh giá này không?")) {
            try {
                await axios.delete(`/api/admin/review/${id}`);
                fetchReviews();
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
                                <h1 className="m-0">Reviews</h1>
                            </div>
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                    <li className="breadcrumb-item active">Reviews</li>
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
                                    <h3 className="card-title">List All Reviews</h3>

                                    <form onSubmit={handleSearch} className="input-group input-group-sm" style={{ width: 350, height: 40 }}>
                                        <input
                                            type="text"
                                            className="form-control float-right"
                                            placeholder="Search by User or Product ID"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
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
                                            <th>User</th>
                                            <th>Product ID</th>
                                            <th>Date</th>
                                            <th>Rating</th>
                                            <th>Content</th>
                                            {/*<th>Status</th>*/}
                                            <th>Action</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {reviews.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="text-center">Không có đánh giá nào.</td>
                                            </tr>
                                        ) : (
                                            reviews.filter(review => review.status !== "deleted").map((review) => (
                                                <tr key={review.id}>
                                                    <td>{review.userName}</td>
                                                    <td>{review.productId}</td>
                                                    <td>{review.createdDate}</td>
                                                    <td><strong>{review.rating}</strong> ⭐</td>
                                                    <td>{review.content}</td>
                                                    {/*<td>{review.status}</td>*/}
                                                    <td>
                                                        {/* Optional: Edit */}
                                                        {/* <Link to={`/review/edit/${review.id}`} className="btn btn-info">Edit</Link>&nbsp; */}
                                                        <button className="btn btn-danger" onClick={() => handleDelete(review.id)}>
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
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

export default ReviewList;
