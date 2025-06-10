import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Header from "../fragment/Header.jsx";
import {Footer} from "../fragment/Footer.jsx";
import {SearchBox} from "../fragment/SearchBox.jsx";
import ProductReview from "../fragment/ProductReview.jsx";
import {FavouriteProduct} from "../fragment/FavouriteProduct.jsx";
import Slider from "react-slick";

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [productDao, setProductDao] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [userName] = useState(localStorage.getItem("userName"));

    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState("");
    const [images, setImages] = useState([]);

    const [suggestedProducts, setSuggestedProducts] = useState([]);

    useEffect(() => {
        fetch(`/api/v1/products/suggest?prodId=${id}`)
            .then(res => res.json())
            .then(data => setSuggestedProducts(data))
            .catch(err => console.error("Lỗi khi lấy gợi ý sản phẩm", err));
    }, [id]);



    // Dữ liệu mẫu
    useEffect(() => {
        const mockReviews = [
            {
                id: 1,
                user: "anhtuan123",
                product: { prodId: id },
                createdDate: "2025-05-20T10:30:00",
                content: "Sản phẩm rất tốt, đáng mua!",
                starpoint: 5,
            },
            {
                id: 2,
                user: "nguyenhoang",
                product: { prodId: id },
                createdDate: "2025-05-18T09:00:00",
                content: "Chất lượng ổn, giao hàng nhanh.",
                starpoint: 4,
            },
        ];
        setReviews(mockReviews);
    }, [id]);

    const renderSuggestedProducts = () => {
        if (!suggestedProducts || !suggestedProducts.suggested?.length) return null;

        return (
            <div className="container my-5">
                <h4 className="mb-4 text-center">Related Products</h4>
                <div className="row">
                    {suggestedProducts.suggested.map(product => (
                        <div key={product.prodId} className="col-6 col-md-4 col-lg-3 mb-4">
                            <div className="card h-100 text-center p-2">
                                <img
                                    src={product.prodImg}
                                    alt={product.prodName}
                                    className="card-img-top"
                                    style={{ height: "150px", objectFit: "contain" }}
                                />
                                <div className="card-body">
                                    <h6>{product.prodName}</h6>
                                    <p className="text-danger">{product.prodPrice.toLocaleString()} VNĐ</p>
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => navigate(`/product-detail/${product.prodId}`)}
                                    >
                                        Xem chi tiết
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };



    const handleAddReview = () => {
        if (!newReview.trim()) return;

        const newItem = {
            id: reviews.length + 1,
            user: userName || "Ẩn danh",
            product: { prodId: id },
            createdDate: new Date().toISOString(),
            content: newReview.trim(),
            starpoint: 5, // tạm cho cố định, sau này bạn thêm dropdown chọn sao
        };

        setReviews([newItem, ...reviews]);
        setNewReview("");
    };

    useEffect(() => {
        fetch(`/api/v1/products/product-detail/${id}`, {
            method: "GET",
            credentials: "include"
        })
            .then(res => {
                if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu sản phẩm");
                return res.json();
            })
            .then(data => {
                setProductDao(data.productDao);
                setImages([data.productDao.prodImg, ...(data.productDao?.prodDetailImageList || [])]);

            })
            .catch(err => {
                console.error(err);
                alert("Không thể tải chi tiết sản phẩm.");
                navigate("/", { replace: true });
            });
    }, [id, navigate]);

    const handleAddToCart = () => {
        fetch(`/api/v1/cart/add-to-cart?id=${productDao.prodId}&quantity=${quantity}`, {
            method: "POST",
            credentials: "include"
        })
            .then(res => {
                if (!res.ok) throw new Error("Thêm vào giỏ hàng thất bại");
                return res.json();
            })
            .then(() => {
                alert("Đã thêm vào giỏ hàng!");
            })
            .catch(err => {
                console.error(err);
                alert("Không thể thêm vào giỏ hàng.");
            });
    };

    const handleQuantityChange = (type) => {
        setQuantity(prev => {
            if (type === "increment") return prev + 1;
            if (type === "decrement") return prev > 1 ? prev - 1 : 1;
            return prev;
        });
    };

    const settingSlider = {
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1000,
    };

    if (!productDao) return <p>Loading...</p>;

    return (
        <>
            <Header userName={userName} categoryDaos={JSON.parse(localStorage.getItem("categoryDaos") || "[]")}/>
            <main>
                {/*<div className="hero-cap text-center">*/}
                {/*    <h2 style={{margin: "40px auto"}}>*/}
                {/*        {userName ? `WELCOME BACK ${userName}` : "WELCOME TO OUR SHOP"}*/}
                {/*    </h2>*/}
                {/*</div>*/}

                <div className="product_image_area" style={{margin: " auto"}}>
                    <div className="container">
                        <div className="row align-items-center">

                            <div className="col-md-12">
                                {/*<div className="single_product_img my-2 my-md-4">*/}
                                {/*    <img src={productDao.prodImg} alt={productDao.prodName} className="img-fluid"/>*/}

                                {/*</div>*/}
                                <Slider {...settingSlider}>
                                    {images.map((img, index) => (
                                        <div key={index}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    height: "450px", // khung ảnh
                                                    width: "auto",
                                                    background: "#ffffff", // màu nền tùy ý
                                                    borderRadius: "10px",
                                                }}
                                            >
                                                <img
                                                    src={img}
                                                    alt={`Slide ${index + 1}`}
                                                    style={{
                                                        maxHeight: "100%",
                                                        maxWidth: "100%",
                                                        objectFit: "contain",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                            <div className="col-12 col-md-12">
                                <div className="single_product_text text-center my-2 my-md-3 py-5">
                                    <h3>{productDao.prodName}</h3>
                                    <p>{productDao.prodDescription}</p>
                                    <div className="card_area my-2 my-md-4">
                                        <div className={"d-inline-block mb-4"}
                                             style={{width: "60px"}}><FavouriteProduct product={productDao}/></div>
                                        <div className="product_count_area">
                                            <p>Quantity</p>
                                            <div className="product_count d-inline-block">
                                                <span onClick={() => handleQuantityChange("decrement")}
                                                      className="product_count_item inumber-decrement"><i
                                                    className="ti-minus"></i></span>
                                                <input
                                                    className="product_count_item input-number"
                                                    style={{height: "55px", "background-color": "#000", "padding": "0"}}
                                                    type="text"
                                                    value={quantity}
                                                    min="1"
                                                    readOnly
                                                />
                                                <span onClick={() => handleQuantityChange("increment")}
                                                      className="product_count_item number-increment"><i
                                                    className="ti-plus"></i></span>
                                            </div>
                                            <p>{productDao.prodPrice.toLocaleString()} VNĐ</p>
                                        </div>
                                        {
                                            userName ? (
                                                <div className="add_to_cart my-2 my-md-4">
                                                    <button onClick={handleAddToCart} className="btn_3">Add to Cart
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="add_to_cart">
                                                    <button className="btn_3" onClick={() => navigate("/login")}>Add to
                                                        Cart
                                                    </button>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {renderSuggestedProducts()}
                    <ProductReview productId={id} userName={userName} />

                </div>
            </main>

            <Footer/>
            {/*<SearchBox/>*/}
        </>

    );
};

export default ProductDetail;
