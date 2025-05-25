import React, { useEffect, useState } from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom';
import Header from '../fragment/Header.jsx';
import { Footer } from '../fragment/Footer.jsx';
import { SearchBox } from '../fragment/SearchBox.jsx';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";



const Home = () => {
    // const [searchOpen, setSearchOpen] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [pageNumbers, setPageNumbers] = useState(1);
    const [userName, setUserName] = useState(null);
    const [categoryDaos, setCategoryDaos] = useState([]);
    const [error, setError] = useState('');
    const images = [
        "https://res.cloudinary.com/dhwkxxjmz/image/upload/v1747970813/computer-mouse-paper-bags-blue-background-top-view_l3heax.jpg",
        "https://res.cloudinary.com/dhwkxxjmz/image/upload/v1747970807/2148667047_voszhb.jpg",
        "https://res.cloudinary.com/dhwkxxjmz/image/upload/v1747970805/14623_qv0d9m.jpg",
        "https://res.cloudinary.com/dhwkxxjmz/image/upload/v1747971468/10631434_sniz2h.jpg",
        "https://res.cloudinary.com/dhwkxxjmz/image/upload/v1747971488/2149074076_qkaxrq.jpg",
        "https://res.cloudinary.com/dhwkxxjmz/image/upload/v1747971539/2148288187_vaajns.jpg",
        "https://res.cloudinary.com/dhwkxxjmz/image/upload/v1747971546/2149055981_a80rn3.jpg",
        "https://res.cloudinary.com/dhwkxxjmz/image/upload/v1747971711/2147696833_ebmswx.jpg",
        "https://res.cloudinary.com/dhwkxxjmz/image/upload/v1747971713/2148288274_tmqedf.jpg",
        "https://res.cloudinary.com/dhwkxxjmz/image/upload/v1747971713/9440518_695_rkyx1y.jpg"
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1000,
    };

    useEffect(() => {
        const fetchSlideData = async () => {
            try {
                const res = await fetch(`/api/v1/home/slide/${id}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    // body: JSON.stringify({
                    //     userName: localStorage.getItem('userName'),
                    // }),
                });
                if (!res.ok){

                    throw new Error('Lỗi khi lấy dữ liệu');
                }
                const data = await res.json();
                setProducts(data.productDaos || []);
                setPageNumbers(data.pageNumbers || 1);
                setUserName(data.userName || null);
                setCategoryDaos(data.categoryDaos || []);
            } catch (err) {
                setError('Lỗi khi lấy dữ liệu: ' + err.message);
            }
        };
        fetchSlideData();

    }, [id]);
    const handleAddToCart = async (prodId) => {
        try {
            const res = await fetch(`/api/v1/cart/add-to-cart?id=${prodId}&quantity=1`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!res.ok) throw new Error((await res.json()).error || 'Lỗi khi thêm vào giỏ');
            const data = await res.json();
            alert(data.message);
        } catch (err) {
            alert(err.message);
        }
    };



    return (
        <>
            <Header userName={userName} categoryDaos={categoryDaos} />
            <main>
                {/*<div className="slider-area ">*/}
                {/*    <div className="single-slider slider-height2 d-flex align-items-center">*/}
                {/*        <div className="container-fluid">*/}
                {/*            <div className="row">*/}
                {/*                /!*<div className="col-xl-12">*!/*/}
                {/*                /!*    <div className="hero-cap text-center">*!/*/}
                {/*                /!*        <h2>Watch Shop</h2>*!/*/}
                {/*                /!*    </div>*!/*/}

                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            {id == 1 ? <Slider {...settings}>
                                {images.map((img, index) => (
                                    <div key={index}>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                height: "550px", // khung ảnh
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
                            </Slider>: ''}

                        </div>
                    </div>
                </div>
                <section className="popular-items">
                    {error && <div className="alert alert-danger">{error}</div>}
                    {/*<div className="hero-cap text-center">*/}
                    {/*    <h2 style={{margin: '40px auto'}}>*/}
                    {/*        {userName ? `WELCOME BACK ${userName}` : 'WELCOME TO OUR SHOP'}*/}
                    {/*    </h2>*/}
                    {/*</div>*/}
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-12 text-left">
                                <div className="section-tittle my-5">
                                    <h2>New Arrivals</h2>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            {products.map((product) => (
                                <div key={product.prodId} className="col-xl-4 col-lg-4 col-md-6 col-sm-6">
                                    <div className="single-popular-items mb-50 text-center">
                                        <div className="popular-img">
                                            <img
                                                src={product.prodImg}
                                                alt={product.prodName}
                                                onError={(e) => (e.target.src = '/default-image.jpg')}
                                            />
                                            {/*<a href={`/add-to-cart?id=${product.prodId}&quantity=1`}>*/}
                                            <div className="img-cap" onClick={() => handleAddToCart(product.prodId)}>
                                                <span>Add to cart</span>
                                            </div>
                                            {/*</a>*/}
                                            <div className="favorit-items">
                                                <span className="flaticon-heart"></span>
                                            </div>
                                        </div>
                                        <div className="popular-caption">
                                            <h3>
                                                <Link to={`/product-detail/${product.prodId}`} className="product-link">
                                                    {product.prodName}
                                                </Link>
                                                {/*<a href={`/api/v1/products/product-detail/${product.prodId}`}>*/}
                                                {/*    {product.prodName}*/}
                                                {/*</a>*/}
                                            </h3>
                                            <span>{product.prodPrice.toLocaleString()} VNĐ</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <nav className="blog-pagination justify-content-center d-flex mb-40 mt-0">
                            <ul className="pagination">
                                {Array.from({length: pageNumbers}, (_, i) => (
                                    <li className="page-item" key={i}>
                                        <button
                                            onClick={() => navigate(`/slide/${i + 1}`, {replace: true})}
                                            className="page-link"
                                        >
                                            {i + 1}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>


                    </div>
                </section>
            </main>
            <Footer/>
            {/*<SearchBox />*/}
        </>
    );
};

export default Home;