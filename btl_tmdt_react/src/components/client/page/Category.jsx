import React, { useEffect, useState } from 'react';
import {useParams,  Link} from 'react-router-dom';
import Header from '../fragment/Header.jsx';
import { Footer } from '../fragment/Footer.jsx';
import { SearchBox } from '../fragment/SearchBox.jsx';
import {FavouriteProduct} from "../fragment/FavouriteProduct.jsx";

const Category = () => {
    const {name } = useParams();
    // const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [pageNumbers, setPageNumbers] = useState(1);
    const [userName] = localStorage.getItem('userName');
    const [categoryDaos, setCategoryDaos] = useState([]);
    const [error, setError] = useState('');
    const [sortOption, setSortOption] = useState('name-asc');

    const getSortedProducts = () => {
        const sorted = [...products];
        switch (sortOption) {
            case 'name-asc':
                return sorted.sort((a, b) => a.prodName.localeCompare(b.prodName));
            case 'name-desc':
                return sorted.sort((a, b) => b.prodName.localeCompare(a.prodName));
            case 'price-asc':
                return sorted.sort((a, b) => a.prodPrice - b.prodPrice);
            case 'price-desc':
                return sorted.sort((a, b) => b.prodPrice - a.prodPrice);
            default:
                return products;
        }
    };


    useEffect(() => {
        const fetchSlideData = async () => {
            try {
                const res = await fetch(`/api/v1/category/${name}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (!res.ok) throw new Error('Lỗi khi lấy dữ liệu !');
                const data = await res.json();
                setProducts(data.productDaos || []);
                setPageNumbers(data.pageNumbers || 1);
                // setUserName(data.userName || null);
                setCategoryDaos(data.categoryDaos || []);
            }
            catch (err) {
                setError('Lỗi khi lấy dữ liệu: ' + err.message);
            }
        };
        fetchSlideData();

    }, [name]);
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
                <section className="popular-items">
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="hero-cap text-center">
                        <h2 style={{margin: '40px auto'}}>
                            {name ? `All Products From ${name}` : 'All Products'}
                        </h2>
                        <div className="d-flex justify-content-end mb-3">
                            <label className="mr-2 mt-1">Sort by:</label>
                            <select
                                className="form-control w-auto"
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                            >
                                <option value="name-asc">Name A → Z</option>
                                <option value="name-desc">Name Z → A</option>
                                <option value="price-asc">Price Low → High</option>
                                <option value="price-desc">Price High → Low</option>
                            </select>
                        </div>

                    </div>
                    <div className="container">
                        <div className="row">
                            {getSortedProducts().map((product) => (
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
                                            <FavouriteProduct product={product}/>
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
                        <div className={"row justify-content-center mt-4"}>
                            <nav className="blog-pagination justify-content-center d-flex mb-40">
                                <ul className="pagination">
                                    {Array.from({length: pageNumbers}, (_, i) => (
                                        <li className="page-item" key={i}>
                                            <button
                                                // onClick={() => navigate(`/slide/${i + 1}`, { replace: true })}
                                                className="page-link"
                                            >
                                                {i + 1}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    </div>
                </section>
            </main>
            <Footer/>
            {/*<SearchBox />*/}
        </>
    );
};

export default Category;