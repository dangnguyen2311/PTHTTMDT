import { Link } from 'react-router-dom';

const Header = ({ userName, categoryDaos }) => {
    return (
        <header>
            <div className="header-area">
                <div className="main-header header-sticky">
                    <div className="container-fluid">
                        <div className="menu-wrapper">
                            <div className="logo">
                                <Link to="/"><img src="/assets/img/logo/logo.png" alt="" /></Link>
                            </div>
                            <div className="main-menu d-none d-lg-block">
                                <nav>
                                    <ul id="navigation">
                                        <li><Link to="/">Home</Link></li>
                                        <li>
                                            <span>Category</span>
                                            <ul className="submenu">
                                                {categoryDaos.map(category => (
                                                    <li key={category.category_name}>
                                                        <Link to={`/category/${category.category_name}`}>
                                                            {category.category_name}
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
                                        <div className="nav-search search-switch">
                                            <span className="flaticon-search"></span>
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
        </header>
    );
};

export default Header;
