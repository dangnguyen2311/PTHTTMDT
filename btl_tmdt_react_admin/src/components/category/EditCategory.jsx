import React, { useEffect, useState } from 'react';
import {useParams, Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import Navbar from "../fragment/Navbar.jsx";
import Sidebar from "../fragment/Sidebar.jsx";

const EditCategory = () => {
    const [category, setCategory] = useState({ categoryName: '', categoryDescription: '' });
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    // Fetch category to edit
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axios.get(`/api/admin/category/edit-category/${id}`);
                setCategory({
                    categoryName: response.data.categoryName,
                    categoryDescription: response.data.categoryDescription,
                });
                console.log(id);
                console.log("RESPONSE DATA:", response.data);
            } catch (err) {
                setError('Category not found');
                console.error(err);
            }
        };

        fetchCategory();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCategory({ ...category, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/api/admin/category/edit-category/${id}`, category);
            // history.push('/category'); // Redirect after submit
            navigate("/category");
        } catch (err) {
            setError('Failed to update category');
            console.error(err);
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
                                <h1 className="m-0">Edit Category</h1>
                            </div>
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item">
                                        {/*<a href="/admin">Home</a>*/}
                                        <Link to="/">Home</Link>
                                    </li>
                                    <li className="breadcrumb-item active">Edit Category</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="content">
                    <div className="card card-info">
                        <div className="card-header">
                            <h3 className="card-title">Category Information</h3>
                        </div>
                        <div className="card-body">
                            {error && <div className="mt-3 alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Category name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="category_name"
                                        name="categoryName"
                                        placeholder="Enter category name"
                                        value={category.categoryName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="category_description"
                                        name="categoryDescription"
                                        placeholder="Enter category description"
                                        value={category.categoryDescription}
                                        onChange={handleInputChange}
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

export default EditCategory;
