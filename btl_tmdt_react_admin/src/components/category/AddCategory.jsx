import React, { useState } from 'react';
import axios from 'axios';
import Navbar from "../fragment/Navbar.jsx";
import Sidebar from "../fragment/Sidebar.jsx";
import {Link, useNavigate} from "react-router-dom";

const AddCategory = () => {
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleCategoryNameChange = (e) => {
        setCategoryName(e.target.value);
    };

    const handleCategoryDescriptionChange = (e) => {
        setCategoryDescription(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/admin/category/add-category', {
                categoryName: categoryName,
                categoryDescription: categoryDescription,
            });
            // Handle success (e.g., redirect or clear form)
            navigate("/category");
            console.log(response.data);
        } catch (err) {
            setError(err.response?.data || 'Something went wrong');
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
                                <h1 className="m-0">Add new category</h1>
                            </div>
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item">
                                        {/*<a href="/admin">Home</a>*/}
                                        <Link to="/">Home</Link>
                                    </li>
                                    <li className="breadcrumb-item active">Add new category</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="content">
                    <div className="card card-info">
                        <div className="card-header">
                            <h3 className="card-title">Category information</h3>
                        </div>
                        <div className="card-body">
                            {error && <div className="alert alert-danger mt-3">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="category_name">Category name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="category_name"
                                        placeholder="Enter category name"
                                        value={categoryName}
                                        onChange={handleCategoryNameChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="category_description">Description</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="category_description"
                                        placeholder="Enter category description"
                                        value={categoryDescription}
                                        onChange={handleCategoryDescriptionChange}
                                    />
                                </div>
                                <div className="card-footer">
                                    <button type="submit" className="btn btn-primary">
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </div>

    );
};

export default AddCategory;
