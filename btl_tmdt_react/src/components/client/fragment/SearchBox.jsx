import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const SearchBox = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/api/v1/products/search?query=${encodeURIComponent(searchTerm)}`, {replace: true});
        }
    };

    return (
        <div className="search-model-box d-block">
            <div className="h-100 d-flex align-items-center justify-content-center">
                <div className="search-close-btn">+</div>
                <form onSubmit={handleSubmit} className="search-model-form">
                    <input
                        type="text"
                        id="search-input"
                        placeholder="Searching key....."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </form>
            </div>
        </div>
    );
};
