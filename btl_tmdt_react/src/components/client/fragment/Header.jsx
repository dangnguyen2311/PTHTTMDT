import {Link, useNavigate} from 'react-router-dom';
import {SearchBox} from "./SearchBox.jsx";
import {useState} from "react";

const Header = ({ userName, categoryDaos }) => {
    const [showSearch, setShowSearch] = useState(false);

    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/search?query=${encodeURIComponent(keyword)}`);
            setShowSearch(false); // Ẩn search box sau khi tìm
            setKeyword('');       // Xoá input nếu bạn muốn

        }
    };
    return (
        <>
            <header>
                <div className="header-area">
                    <div className="main-header header-sticky">
                        <div className="container-fluid">
                            <div className="menu-wrapper">
                                <div className="logo">
                                    <Link to="/"><img src="/assets/img/logo/logo.png" alt=""/></Link>
                                </div>
                                <div className="main-menu d-none d-lg-block">
                                    <nav>
                                        <ul id="navigation">
                                            <li><Link to="/">Home</Link></li>
                                            <li>
                                                <span>Category</span>
                                                <ul className="submenu">
                                                    {categoryDaos.map(category => (
                                                        <li key={category.categoryName}>
                                                            <Link to={`/category/${category.categoryName}`}>
                                                                {category.categoryName}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                            <li>
                                                <Link to={userName ? "/my-cart" : "/login"}>My cart</Link>
                                            </li>
                                            <li>
                                                <Link to={userName ? "/my-order" : "/login"}>My order</Link>
                                            </li>
                                            {/*<li><Link to="/contact">Contact</Link></li>*/}
                                            <li>
                                                <Link to={userName ? "/logout" : "/login"}>
                                                    {userName ? "Logout" : "Login"}
                                                </Link>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                                <div className="header-right">
                                    <ul>
                                        <li>
                                            <div className="nav-search search-switch"
                                                 onClick={() => setShowSearch(true)}>
                                                <span className="flaticon-search" style={{cursor: "pointer"}}></span>
                                            </div>
                                        </li>
                                        <li>
                                            <Link to={userName ? "/user-detail" : "/login"}>
                                                <span className="flaticon-user"></span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={userName ? "/my-cart" : "/login"}>
                                                <span className="flaticon-shopping-cart"></span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="mobile_menu d-block d-lg-none"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*<SearchBox/>*/}
            </header>
            {showSearch && (
                <div className="search-model-box d-block">
                    <div className="h-100 d-flex align-items-center justify-content-center">
                        <div className="search-close-btn" onClick={() => setShowSearch(false)}>+</div>
                        <form className="search-model-form" onSubmit={handleSearchSubmit}>
                            <input
                                type="text"
                                id="search-input"
                                placeholder="Searching key....."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </form>
                    </div>
                </div>
            )}

            {!showSearch && (
                <div className="search-model-box d-none">
                    <div className="h-100 d-flex align-items-center justify-content-center">
                        <div className="search-close-btn" onClick={() => setShowSearch(false)}>+</div>
                        <form className="search-model-form" onSubmit={handleSearchSubmit}>
                            <input
                                type="text"
                                id="search-input"
                                placeholder="Searching key....."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </form>
                    </div>
                </div>
            )}

        </>

    );
};

export default Header;
