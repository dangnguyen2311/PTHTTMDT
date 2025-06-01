import Header from "../fragment/Header.jsx";
import { useLocation, useNavigate} from "react-router-dom";
import {Footer} from "../fragment/Footer.jsx";
import {SearchBox} from "../fragment/SearchBox.jsx";
import React, {useEffect} from "react";

export const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);

        fetch('/api/v1/payment/vn-pay-callback?' + queryParams.toString(), {
            method: 'GET',
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                console.log('Kết quả callback:', data);
                alert("Thanh toán thành công!");
                // navigate('/payment');
            })
            .catch(err => {
                console.error('Lỗi xử lý thanh toán:', err);
                alert("Thanh toán thất bại");
            });
    }, []);


    return (
        <>
            <Header userName={localStorage.getItem("userName")} categoryDaos={JSON.parse(localStorage.getItem("categoryDaos") || "[]")} />
            <main>
                <section className="popular-items">
                    {/*{error && <div className="alert alert-danger">{error}</div>}*/}
                    <div className="hero-cap text-center">
                        <h2 style={{ margin: '40px auto' }}>
                            {/*{userName ? `WELCOME BACK ${userName}` : 'WELCOME TO OUR SHOP'}*/}
                            Checkout Successfully
                        </h2>
                    </div>
                    {/*<div className="container">*/}
                    {/*    <nav className="blog-pagination justify-content-center d-flex mb-40">*/}
                    {/*        <ul className="pagination">*/}
                    {/*            {Array.from({ length: pageNumbers }, (_, i) => (*/}
                    {/*                <li className="page-item" key={i}>*/}
                    {/*                    <button*/}
                    {/*                        onClick={() => navigate(`/slide/${i + 1}`, { replace: true })}*/}
                    {/*                        className="page-link"*/}
                    {/*                    >*/}
                    {/*                        {i + 1}*/}
                    {/*                    </button>*/}
                    {/*                </li>*/}
                    {/*            ))}*/}
                    {/*        </ul>*/}
                    {/*    </nav>*/}
                    {/*    <div className="row">*/}
                    {/*        {products.map((product) => (*/}
                    {/*            <div key={product.prodId} className="col-xl-4 col-lg-4 col-md-6 col-sm-6">*/}
                    {/*                <div className="single-popular-items mb-50 text-center">*/}
                    {/*                    <div className="popular-img">*/}
                    {/*                        <img*/}
                    {/*                            src={product.prodImg}*/}
                    {/*                            alt={product.prodName}*/}
                    {/*                            onError={(e) => (e.target.src = '/default-image.jpg')}*/}
                    {/*                        />*/}
                    {/*                        /!*<a href={`/add-to-cart?id=${product.prodId}&quantity=1`}>*!/*/}
                    {/*                        <div className="img-cap" onClick={() => handleAddToCart(product.prodId)}>*/}
                    {/*                            <span>Add to cart</span>*/}
                    {/*                        </div>*/}
                    {/*                        /!*</a>*!/*/}
                    {/*                        <div className="favorit-items">*/}
                    {/*                            <span className="flaticon-heart"></span>*/}
                    {/*                        </div>*/}
                    {/*                    </div>*/}
                    {/*                    <div className="popular-caption">*/}
                    {/*                        <h3>*/}
                    {/*                            <Link to={`/product-detail/${product.prodId}`} className="product-link">*/}
                    {/*                                {product.prodName}*/}
                    {/*                            </Link>*/}
                    {/*                            /!*<a href={`/api/v1/products/product-detail/${product.prodId}`}>*!/*/}
                    {/*                            /!*    {product.prodName}*!/*/}
                    {/*                            /!*</a>*!/*/}
                    {/*                        </h3>*/}
                    {/*                        <span>{product.prodPrice.toLocaleString()} VNĐ</span>*/}
                    {/*                    </div>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*        ))}*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </section>
            </main>
            <Footer />
            {/*<SearchBox />*/}
        </>
    )
}
