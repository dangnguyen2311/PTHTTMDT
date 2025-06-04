import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "../fragment/Navbar.jsx";
import Sidebar from "../fragment/Sidebar.jsx";
import {useNavigate} from "react-router-dom";

const AddProduct = () => {
    const [product, setProduct] = useState({
        prodName: '',
        prodPrice: '',
        prodDescription: '',
        prodNsx: '',
        categoryDao: { id: '' }
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [pictureFile, setPictureFile] = useState(null);
    const [detailFiles, setDetailFiles] = useState([]);

    useEffect(() => {
        axios.get('/api/admin/category') // <-- đổi đường dẫn nếu khác
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
    const handleUploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "upload_without_key"); // từ Cloudinary
        formData.append("cloud_name", "dhwkxxjmz"); // tài khoản Cloudinary

        try {
            const response = await fetch("https://api.cloudinary.com/v1_1/dhwkxxjmz/image/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            return data.secure_url; // link ảnh đã upload
        } catch (err) {
            console.error("Upload error:", err);
            return null;
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const prodImg = await handleUploadToCloudinary(pictureFile);

        const formData = new FormData();
        formData.append('prodName', product.prodName);
        formData.append('prodDescription', product.prodDescription);
        formData.append('prodPrice', product.prodPrice);
        formData.append('prodNsx', product.prodNsx);
        formData.append('categoryDao.id', product.categoryDao.id);
        formData.append('prodImg', prodImg);

        for (let i = 0; i < detailFiles.length; i++) {
            const url = await handleUploadToCloudinary(detailFiles[i]);
            formData.append('prodDetailImageList', url);
        }

        axios.post('/api/admin/product', formData)
            .then(() => {
                alert("Product created successfully");

                setProduct({
                    prodName: '',
                    prodPrice: '',
                    prodDescription: '',
                    prodNsx: '',
                    categoryDao: {id: ''}
                });
                setPictureFile(null);
                setDetailFiles([]);
                navigate("/product")
            })
            .catch(err => {
                setError(err.response.data);
                console.error(err.response.data);
                // alert("Error creating product");
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
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item active">Add new product</li>
                    </ol>
                </div>

                <div className="card card-info">
                    {
                        error &&
                        <div className="card-header bg-red">
                            <h3 className="card-title">{error}</h3>
                        </div>
                    }
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
                                <select name="categoryDao.id" className="form-control"
                                        value={product.categoryDao.id} onChange={handleChange} required>
                                    <option value="">-- Select Category --</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.categoryName}
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

                            <div className="form-group">
                                <label>Detail Images</label>
                                <input
                                    type="file"
                                    name="prodDetailImageList"
                                    className="form-control-file"
                                    multiple
                                    onChange={(e) => {
                                        setDetailFiles(prev => [...prev, ...Array.from(e.target.files)]);
                                    }}
                                />
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
