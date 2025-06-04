import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from "../fragment/Navbar.jsx";
import Sidebar from "../fragment/Sidebar.jsx";

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [previewImg, setPreviewImg] = useState('');
    const [previewDetailImgs, setPreviewDetailImgs] = useState([]);
    const [product, setProduct] = useState({
        prodName: '',
        prodPrice: '',
        prodDescription: '',
        prodNsx: '',
        categoryDao: { id: '' },
        prodImg: '',
        prodDetailImageList: [],
    });

    const [categories, setCategories] = useState([]);
    const [pictureFile, setPictureFile] = useState(null);
    const [detailFiles, setDetailFiles] = useState([]);

    useEffect(() => {
        axios.get(`/api/admin/product/${id}`).then(res => {
            const prod = res.data;
            setProduct(prod);
            setPreviewImg(prod.prodImg);
            setPreviewDetailImgs(prod.prodDetailImageList || []);
        });

        axios.get('/api/admin/category')
            .then(res => setCategories(res.data))
            .catch(err => console.error(err));
    }, [id]);

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
    const handleRemoveDetailImage = (index) => {
        setPreviewDetailImgs(prev => prev.filter((_, i) => i !== index));
    };

    // const handleInputChange = (e) => {
    //     const { name, value } = e.target;
    //     if (name === 'category_id') {
    //         setProduct({ ...product, categoryDao: { category_id: value } });
    //     } else {
    //         setProduct({ ...product, [name]: value });
    //     }
    // };
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setPictureFile(file);
        setPreviewImg(URL.createObjectURL(file));
    };

    const handleDetailFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        const urls = [];

        for (let file of files) {
            const url = await handleUploadToCloudinary(file);
            if (url) urls.push(url);
        }

        // Gộp ảnh cũ và mới
        setPreviewDetailImgs(prev => [...prev, ...urls]);
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //
    //     const formData = new FormData();
    //     formData.append('prodName', product.prodName);
    //     formData.append('prodPrice', product.prodPrice);
    //     formData.append('prodDescription', product.prodDescription);
    //     formData.append('prodNsx', product.prodNsx);
    //     formData.append('categoryDao.id', product.categoryDao.category_id);
    //     if (pictureFile) {
    //         formData.append('pictureFile', pictureFile);
    //     }
    //
    //     try {
    //         await axios.put(`/api/products/${id}`, formData);
    //         alert('Product updated successfully');
    //         navigate('/admin/products');
    //     } catch (error) {
    //         alert('Error updating product: ' + error.response?.data || error.message);
    //     }
    // };
    const handleSubmit = async (e) => {
        e.preventDefault();

        const prodImg = pictureFile
            ? await handleUploadToCloudinary(pictureFile)
            : product.prodImg;

        const formData = new FormData();
        formData.append('prodName', product.prodName);
        formData.append('prodDescription', product.prodDescription);
        formData.append('prodPrice', product.prodPrice);
        formData.append('prodNsx', product.prodNsx);
        formData.append('categoryDao.id', product.categoryDao.id);
        formData.append('prodImg', prodImg);
        // Gửi prodDetailImageList dưới dạng chuỗi JSON
        formData.append('prodDetailImageList', JSON.stringify(previewDetailImgs));

        // Kiểm tra nội dung formData
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        axios.put(`/api/admin/product/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(() => {
                alert("Product updated successfully");
                navigate("/product");
            })
            .catch(err => {
                setError(err.response?.data || "Something went wrong");
                console.error(err);
            });
    };


    return (
        <div className="wrapper">
            <Navbar/>
            <Sidebar/>
            <div className="content-wrapper p-4">
                <div className="content-header mb-4">
                    <h1>Update product</h1>
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

                            {/*<div className="form-group">*/}
                            {/*    <label>Picture</label>*/}
                            {/*    <input type="file" name="pictureFile" className="form-control-file"*/}
                            {/*           onChange={handleFileChange} required/>*/}
                            {/*</div>*/}

                            {/*<div className="form-group">*/}
                            {/*    <label>Detail Images</label>*/}
                            {/*    <input*/}
                            {/*        type="file"*/}
                            {/*        name="prodDetailImageList"*/}
                            {/*        className="form-control-file"*/}
                            {/*        multiple*/}
                            {/*        onChange={(e) => {*/}
                            {/*            setDetailFiles(prev => [...prev, ...Array.from(e.target.files)]);*/}
                            {/*        }}*/}
                            {/*    />*/}
                            {/*</div>*/}

                            <div className="form-group">
                                <label>Preview Image</label>
                                {previewImg && <img src={previewImg} alt="Preview" width="150"/>}
                            </div>

                            <div className="form-group">
                                <label>Preview Detail Images</label>
                                <div className="d-flex gap-2 flex-wrap">
                                    {previewDetailImgs.map((img, idx) => (
                                        <div key={idx} className={"preview-wrapper mr-2 mb-2 text-center d-flex flex-column"} style={{position: 'relative'}}>
                                            <img src={img} alt={`Detail ${idx}`} width="100"/>
                                            {/*<button*/}
                                            {/*    type="button"*/}
                                            {/*    style={{*/}
                                            {/*        position: 'absolute',*/}
                                            {/*        top: 0,*/}
                                            {/*        right: 0,*/}
                                            {/*        background: 'red',*/}
                                            {/*        color: 'white',*/}
                                            {/*        border: 'none',*/}
                                            {/*        cursor: 'pointer',*/}
                                            {/*    }}*/}
                                            {/*    onClick={() => handleRemoveDetailImage(idx)}*/}
                                            {/*>*/}
                                            {/*    ✖*/}
                                            {/*</button>*/}
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-danger mt-1"
                                                onClick={() => handleRemoveDetailImage(idx)}
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Upload thêm ảnh chi tiết</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="form-control-file"
                                    onChange={handleDetailFileUpload}
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

export default EditProduct;
