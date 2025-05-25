import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Categories = () => {
    const [categories, setCategories] = useState([]);

    // Fetch categories from the backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/admin/category');
                setCategories(response.data);
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            }
        };
        fetchCategories();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/admin/category/delete-category/${id}`);
            setCategories(categories.filter(category => category.id !== id)); // Remove category from list
        } catch (err) {
            console.error('Failed to delete category:', err);
        }
    };

    return (
        <div className="content-wrapper">
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1 className="m-0">Categories</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item">
                                    <Link to="/admin">Home</Link>
                                </li>
                                <li className="breadcrumb-item active">Categories</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>

            <section className="content">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">List All Category</h3>
                                <Link to="/admin/category/add-category" className="btn btn-info ml-3">
                                    Add
                                </Link>
                            </div>
                            <div className="card-body table-responsive p-0">
                                <table className="table table-bordered table-hover text-nowrap">
                                    <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Description</th>
                                        <th>Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {categories.map((category) => (
                                        <tr key={category.id}>
                                            <td>{category.categoryName}</td>
                                            <td>{category.categoryDescription}</td>
                                            <td>
                                                <Link
                                                    to={`/admin/category/edit-category/${category.id}`}
                                                    className="btn btn-info"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    className="btn btn-danger ml-2"
                                                    onClick={() => handleDelete(category.id)}
                                                >
                                                    Delete
                                                </button>
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
    );
};

export default Categories;
