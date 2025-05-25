// src/components/DashboardCard.jsx
import { Link } from 'react-router-dom';

function DashboardCard({ count, title, icon, bgColor, link }) {
    return (
        <div className="col-lg-3 col-6">
            <div className={`small-box ${bgColor}`}>
                <div className="inner">
                    <h3>{count}</h3>
                    <p>{title}</p>
                </div>
                <div className="icon">
                    <i className={`ion ${icon}`}></i>
                </div>
                <Link to={link} className="small-box-footer">
                    More info <i className="fas fa-arrow-circle-right"></i>
                </Link>
            </div>
        </div>
    );
}

export default DashboardCard;
