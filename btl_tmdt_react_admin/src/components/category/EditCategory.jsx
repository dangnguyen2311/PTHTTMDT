import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

const EditCategory = () => {
    const [category, setCategory] = useState({ categoryName: '', categoryDescription: '' });
    const [error, setError] = useState(null);
    const { id } = useParams();
    const history = useHistory();

    // Fetch category to edit
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axios.get(`/admin/category/edit-category/${id}`);
                setCategory(response.data);
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
            await axios.post(`/admin/category/edit-category/${id}`, category);
            history.push('/admin/category'); // Redirect after submit
        } catch (err) {
            setError('Failed to update category');
            console.error(err);
        }
    };

    return (
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
                                    <a href="/admin">Home</a>
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
    );
};

export default EditCategory;
