import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../fragment/Header.jsx';
import { Footer } from '../fragment/Footer.jsx';
import { SearchBox } from '../fragment/SearchBox.jsx';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query') || '';
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [userName] = useState(localStorage.getItem('userName'));
    const [categoryDaos, setCategoryDaos] = useState([]);

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const res = await fetch(`/api/v1/products/search?productName=${encodeURIComponent(query)}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });
                if (!res.ok) throw new Error('Lỗi khi tìm kiếm sản phẩm!!');
                const data = await res.json();
                // data.productDaos = undefined;
                setProducts(data.productDaos || []);
                console.log(data.productDaos);
            } catch (err) {
                setError(err.message);
            }
        };
        if (query) fetchSearchResults();
    }, [query]);

    return (
        <>
            <Header userName={userName} categoryDaos={categoryDaos}/>
            <main>
                <section className="popular-items">
                    <div className="hero-cap text-center">
                        <h2 style={{ margin: '40px auto' }}>
                            Kết quả tìm kiếm cho "{query}"
                        </h2>
                    </div>
                    <div className="container">
                        {error && <div className="alert alert-danger">{error}</div>}
                        {products.length === 0 && !error && (
                            <p className="text-center">Không tìm thấy sản phẩm nào.</p>
                        )}
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
                                            <div className="img-cap">
                                                <span>Add to cart</span>
                                            </div>
                                        </div>
                                        <div className="popular-caption">
                                            <h3>
                                                <a href={`/product-detail/${product.prodId}`}>
                                                    {product.prodName}
                                                </a>
                                            </h3>
                                            <span>{product.prodPrice.toLocaleString()} VNĐ</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
            {/*<SearchBox />*/}
        </>
    );
};

export default SearchResults;