import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from "../fragment/Navbar.jsx";
import Sidebar from "../fragment/Sidebar.jsx";

const EditProduct = () => {
    const { id } = useParams(); // lấy id từ URL
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        prodName: '',
        prodPrice: '',
        prodDescription: '',
        prodNsx: '',
        categoryDao: { category_id: '' }
    });

    const [categories, setCategories] = useState([]);
    const [pictureFile, setPictureFile] = useState(null);

    // load dữ liệu sản phẩm và category
    useEffect(() => {
        axios.get(`/admin/product/${id}`).then(res => {
            setProduct(res.data);
        });

        axios.get('/admin/categories').then(res => {
            setCategories(res.data);
        });
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'category_id') {
            setProduct({ ...product, categoryDao: { category_id: value } });
        } else {
            setProduct({ ...product, [name]: value });
        }
    };

    const handleFileChange = (e) => {
        setPictureFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('prodName', product.prodName);
        formData.append('prodPrice', product.prodPrice);
        formData.append('prodDescription', product.prodDescription);
        formData.append('prodNsx', product.prodNsx);
        formData.append('categoryDao.category_id', product.categoryDao.category_id);
        if (pictureFile) {
            formData.append('pictureFile', pictureFile);
        }

        try {
            await axios.put(`/api/products/${id}`, formData);
            alert('Product updated successfully');
            navigate('/admin/products');
        } catch (error) {
            alert('Error updating product: ' + error.response?.data || error.message);
        }
    };

    return (
        <div className="wrapper">
            <Navbar/>
            <Sidebar/>
            <div className="container mt-4">
                <h1>Edit Product</h1>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="form-group">
                        <label>Product name</label>
                        <input type="text" className="form-control" name="prodName" value={product.prodName}
                               onChange={handleInputChange} required/>
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select className="form-control" name="category_id" value={product.categoryDao.category_id}
                                onChange={handleInputChange}>
                            <option value="">-- Select --</option>
                            {categories.map(c => (
                                <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Price</label>
                        <input type="number" className="form-control" name="prodPrice" value={product.prodPrice}
                               onChange={handleInputChange} required/>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <input type="text" className="form-control" name="prodDescription"
                               value={product.prodDescription} onChange={handleInputChange}/>
                    </div>

                    <div className="form-group">
                        <label>Company</label>
                        <input type="text" className="form-control" name="prodNsx" value={product.prodNsx}
                               onChange={handleInputChange}/>
                    </div>

                    <div className="form-group">
                        <label>Picture</label>
                        <input type="file" className="form-control-file" onChange={handleFileChange}/>
                    </div>

                    <button type="submit" className="btn btn-primary mt-3">Submit</button>
                </form>
            </div>
        </div>

    );
};

export default EditProduct;
