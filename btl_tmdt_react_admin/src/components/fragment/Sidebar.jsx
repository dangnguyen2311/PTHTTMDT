// src/components/Sidebar.jsx
import { Link } from 'react-router-dom';

function Sidebar() {
    const menuItems = [
        { label: 'Users', base: 'user' },
        { label: 'Categories', base: 'category' },
        { label: 'Products', base: 'product' },
        { label: 'Carts', base: 'cart' },
        { label: 'Orders', base: 'order' },
    ];
    return (
        <aside className="main-sidebar sidebar-light-green elevation-4">
            <a href="/" className="brand-link">
                <span className="brand-text font-weight-normal">Admin</span>
            </a>

            <div className="sidebar">
                <nav className="mt-2">
                    <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview">
                        {menuItems.map(item => (
                            <li className="nav-item" key={item.base}>
                                <div className="nav-link">
                                    <p>{item.label} <i className="fas fa-angle-left right"></i></p>
                                </div>
                                <ul className="nav nav-treeview">
                                    <li className="nav-item">
                                        <Link to={`/${item.base}`} className="nav-link">
                                            <i className="far fa-circle nav-icon"></i>
                                            <p>List</p>
                                        </Link>
                                    </li>
                                    {item.base !== 'cart' && item.base !== 'order' && (
                                        <li className="nav-item">
                                            <Link to={`/${item.base}/add-${item.base}`} className="nav-link">
                                                <i className="far fa-circle nav-icon"></i>
                                                <p>Add</p>
                                            </Link>
                                        </li>
                                    )}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </aside>
    );
}

export default Sidebar;
