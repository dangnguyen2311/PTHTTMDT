import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "./Header.jsx";
import {Footer} from "./Footer.jsx";
import {SearchBox} from "./SearchBox.jsx";

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [productDao, setProductDao] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [userName] = useState(localStorage.getItem("userName"));

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

    if (!productDao) return <p>Loading...</p>;

    return (
        <>
            <Header userName={userName} categoryDaos={[]}/>
            <main>
                <div className="hero-cap text-center">
                    <h2 style={{margin: "40px auto"}}>
                        {userName ? `WELCOME BACK ${userName}` : "WELCOME TO OUR SHOP"}
                    </h2>
                </div>

                <div className="product_image_area" style={{margin: "40px auto"}}>
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6 col-md-6">
                                <div className="single_product_img">
                                    <img src={productDao.prodImg} alt={productDao.prodName} className="img-fluid"/>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                                <div className="single_product_text text-center">
                                    <h3>{productDao.prodName}</h3>
                                    <p>{productDao.prodDescription}</p>
                                    <div className="card_area">
                                        <div className="product_count_area">
                                            <p>Quantity</p>
                                            <div className="product_count d-inline-block">
                                                <span onClick={() => handleQuantityChange("decrement")}
                                                      className="product_count_item inumber-decrement"><i
                                                    className="ti-minus"></i></span>
                                                <input
                                                    className="product_count_item input-number"
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
                                                <div className="add_to_cart">
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
                </div>
            </main>
            <Footer/>
            <SearchBox/>
        </>

    );
};

export default ProductDetail;
