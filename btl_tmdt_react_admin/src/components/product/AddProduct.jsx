import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "../fragment/Navbar.jsx";
import Sidebar from "../fragment/Sidebar.jsx";
import {Link} from "react-router-dom";

const AddProduct = () => {
    const [product, setProduct] = useState({
        prodName: '',
        prodPrice: '',
        prodDescription: '',
        prodNsx: '',
        categoryDao: { category_id: '' }
    });

    const [categories, setCategories] = useState([]);
    const [pictureFile, setPictureFile] = useState(null);

    useEffect(() => {
        // Gọi API lấy danh sách category
        axios.put('/admin/product') // <-- đổi đường dẫn nếu khác
            .then(res => setCategories(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("categoryDao.")) {
            setProduct(prev => ({
                ...prev,
                categoryDao: {
                    ...prev.categoryDao,
                    [name.split(".")[1]]: value
                }
            }));
        } else {
            setProduct(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleFileChange = (e) => {
        setPictureFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!pictureFile) {
            alert("Please select an image.");
            return;
        }

        const formData = new FormData();
        formData.append('prodName', product.prodName);
        formData.append('prodPrice', product.prodPrice);
        formData.append('prodDescription', product.prodDescription);
        formData.append('prodNsx', product.prodNsx);
        formData.append('categoryDao.category_id', product.categoryDao.category_id);
        formData.append('pictureFile', pictureFile);

        axios.post('/admin/product', formData)
            .then(() => {
                alert("Product created successfully");
                setProduct({
                    prodName: '',
                    prodPrice: '',
                    prodDescription: '',
                    prodNsx: '',
                    categoryDao: { category_id: '' }
                });
                setPictureFile(null);
            })
            .catch(err => {
                console.error(err);
                alert("Error creating product");
            });
    };

    return (
        <div className="wrapper">
            <Navbar/>
            <Sidebar/>
            <div className="content-wrapper p-4">
                <div className="content-header mb-4">
                    <h1>Add new product</h1>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item active">Add new product</li>
                    </ol>
                </div>

                <div className="card card-info">
                    <div className="card-header">
                        <h3 className="card-title">Product Information</h3>
                    </div>

                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="card-body">
                            <div className="form-group">
                                <label>Product name</label>
                                <input type="text" name="prodName" className="form-control"
                                       placeholder="Enter product name" value={product.prodName} onChange={handleChange}
                                       required/>
                            </div>

                            <div className="form-group">
                                <label>Category</label>
                                <select name="categoryDao.category_id" className="form-control"
                                        value={product.categoryDao.category_id} onChange={handleChange} required>
                                    <option value="">-- Select Category --</option>
                                    {categories.map(cat => (
                                        <option key={cat.category_id} value={cat.category_id}>
                                            {cat.category_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Price</label>
                                <input type="number" name="prodPrice" className="form-control"
                                       placeholder="Enter product price" value={product.prodPrice}
                                       onChange={handleChange} required/>
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <input type="text" name="prodDescription" className="form-control"
                                       placeholder="Enter description" value={product.prodDescription}
                                       onChange={handleChange}/>
                            </div>

                            <div className="form-group">
                                <label>Company</label>
                                <input type="text" name="prodNsx" className="form-control"
                                       placeholder="Enter company" value={product.prodNsx} onChange={handleChange}/>
                            </div>

                            <div className="form-group">
                                <label>Picture</label>
                                <input type="file" name="pictureFile" className="form-control-file"
                                       onChange={handleFileChange} required/>
                            </div>
                        </div>

                        <div className="card-footer">
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    );
};

export default AddProduct;
